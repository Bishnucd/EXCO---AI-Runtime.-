/**
 * EXCO Autonomous Workspace Agent Runtime
 * ReAct multi-step tool execution engine with 3-tier Access Limiter
 * Tiers:
 *   - 'ask': Ask user confirmation before EVERY workspace action
 *   - 'selected-folder' (Default): Auto-run normal workspace actions, ask on major actions (shell commands, deletes, outside workspace)
 *   - 'full-access' (Turbo): Full autonomous execution without confirmation prompts
 */

import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  getApiKeys,
  getConversation,
  createConversation,
  updateConversation,
  createMessage,
  getMessages,
} from '@main/database';
import { getApiKey as getStoredApiKey, decrypt } from '@main/services/credential-vault';
import { providerManager } from '@main/services/ai-providers';
import {
  buildUniversalSkillsPrompt,
  searchActiveSkills,
  loadActiveSkill,
} from '@main/services/skills-registry';
import { classifyModelCategory, inferProviderFromApiKey, resolveApiKeyProfile, isPathWithin } from '@shared/utils';
import type { ApiKeyEntry, PermissionLevel, ToolCall } from '@shared/types';

const execAsync = promisify(exec);

export type AgentToolName =
  | 'list_dir'
  | 'read_file'
  | 'search_files'
  | 'write_file'
  | 'edit_file'
  | 'delete_file'
  | 'run_command'
  | 'search_ai_skills'
  | 'load_ai_skill';

export type ApprovalDecision = 'allow-once' | 'allow-run' | 'deny';

export interface WorkspaceAgentStep {
  id: string;
  tool: AgentToolName;
  args: Record<string, any>;
  thought?: string;
  major: boolean;
  status: 'pending-approval' | 'running' | 'completed' | 'denied' | 'error';
  output?: string;
  error?: string;
}

export interface WorkspaceAgentEvent {
  runId: string;
  type: 'status' | 'step-update' | 'approval-required' | 'files-changed' | 'done' | 'error';
  message?: string;
  step?: WorkspaceAgentStep;
  finalContent?: string;
  modelId?: string;
  providerId?: string;
}

interface PendingApproval {
  resolve: (decision: ApprovalDecision) => void;
}

interface ActiveRun {
  conversationId?: string;
  aborted: boolean;
  allowAllInRun: boolean;
  abortController: AbortController;
  pendingApprovals: Map<string, PendingApproval>;
}

const activeRuns = new Map<string, ActiveRun>();

function emitAgentEvent(event: WorkspaceAgentEvent): void {
  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    global.mainWindow.webContents.send('work:agent-event', event);
  }
}

export function resolveWorkspaceApproval(runId: string, stepId: string, decision: ApprovalDecision): boolean {
  const run = activeRuns.get(runId);
  if (!run) return false;
  const pending = run.pendingApprovals.get(stepId);
  if (!pending) return false;
  if (decision === 'allow-run') {
    run.allowAllInRun = true;
  }
  run.pendingApprovals.delete(stepId);
  pending.resolve(decision);
  return true;
}

export function cancelWorkspaceAgent(runId: string): boolean {
  const run = activeRuns.get(runId);
  if (!run) return false;
  run.aborted = true;
  try {
    run.abortController.abort();
  } catch {}
  for (const [, pending] of run.pendingApprovals) {
    pending.resolve('deny');
  }
  run.pendingApprovals.clear();
  return true;
}

export function cancelWorkspaceAgentByConversation(conversationId: string): void {
  if (!conversationId) return;
  for (const [runId, run] of activeRuns.entries()) {
    if (run.conversationId === conversationId) {
      cancelWorkspaceAgent(runId);
    }
  }
}

function normalizeAllowedRoots(primaryPath: string, extraPaths?: string[]): string[] {
  const raw = [primaryPath, ...(Array.isArray(extraPaths) ? extraPaths : [])].filter(
    p => typeof p === 'string' && p.trim().length > 0
  );
  const resolved: string[] = [];
  for (const item of raw) {
    const abs = fsSync.existsSync(item) ? fsSync.realpathSync(item) : path.resolve(item);
    if (!resolved.some(existing => isPathWithin(existing, abs) && isPathWithin(abs, existing))) {
      resolved.push(abs);
    }
  }
  return resolved;
}

function isWithinAnyRoot(target: string, allowedRoots: string[]): boolean {
  return allowedRoots.some(root => isPathWithin(root, target));
}

function isMajorAction(tool: AgentToolName, args: Record<string, any>, allowedRoots: string[], primaryRoot: string): boolean {
  if (tool === 'delete_file' || tool === 'run_command') {
    return true;
  }
  const target = typeof args?.path === 'string' ? args.path : typeof args?.dir === 'string' ? args.dir : '';
  if (target) {
    const resolved = path.isAbsolute(target) ? path.resolve(target) : path.resolve(primaryRoot, target);
    if (!isWithinAnyRoot(resolved, allowedRoots)) {
      return true;
    }
  }
  return false;
}

function requiresApproval(
  accessLevel: PermissionLevel,
  run: ActiveRun,
  tool: AgentToolName,
  args: Record<string, any>,
  allowedRoots: string[],
  primaryRoot: string
): boolean {
  if (run.allowAllInRun) return false;
  if (accessLevel === 'full-access') return false;
  if (accessLevel === 'ask') return true;
  // Default ('selected-folder'): auto-run normal actions inside project folders, ask on major actions
  return isMajorAction(tool, args, allowedRoots, primaryRoot);
}

function resolveWorkspaceTarget(allowedRoots: string[], primaryRoot: string, inputPath: string): string {
  const cleaned = (inputPath || '.').trim();
  let resolved: string;

  if (path.isAbsolute(cleaned)) {
    resolved = path.resolve(cleaned);
  } else {
    // Allow prefixing with a synced folder's basename when multiple project folders are synced
    const normalizedRel = cleaned.replace(/\\/g, '/').replace(/^\.\//, '');
    const matchedRoot = allowedRoots.find(root => {
      const base = path.basename(root);
      return base && (normalizedRel === base || normalizedRel.startsWith(base + '/'));
    });
    if (matchedRoot && allowedRoots.length > 1) {
      const base = path.basename(matchedRoot);
      const sub = normalizedRel === base ? '.' : normalizedRel.slice(base.length + 1);
      resolved = path.resolve(matchedRoot, sub);
    } else {
      resolved = path.resolve(primaryRoot, cleaned);
    }
  }

  if (!isWithinAnyRoot(resolved, allowedRoots)) {
    throw new Error(`Access denied: "${inputPath}" is outside the active project and its synced folders. Even Turbo mode is strictly sandboxed to selected project folders.`);
  }
  if (fsSync.existsSync(resolved)) {
    const targetReal = fsSync.realpathSync(resolved);
    if (!isWithinAnyRoot(targetReal, allowedRoots)) {
      throw new Error(`Access denied: symlink target "${targetReal}" escapes the selected project folders.`);
    }
  }
  return resolved;
}

async function listDirTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const targetDir = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.path || '.'));
  const maxDepth = Math.min(3, Math.max(1, Number(args.depth) || 2));
  const lines: string[] = [];

  async function walk(dir: string, depth: number, prefix: string): Promise<void> {
    if (lines.length > 200) return;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const sorted = entries
      .filter(e => !['node_modules', '.git', 'dist', '.next', '.turbo'].includes(e.name))
      .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));

    for (const entry of sorted) {
      if (lines.length > 200) {
        lines.push(`${prefix}... (truncated)`);
        return;
      }
      const marker = entry.isDirectory() ? '[DIR]' : '[FILE]';
      lines.push(`${prefix}${marker} ${entry.name}`);
      if (entry.isDirectory() && depth < maxDepth) {
        await walk(path.join(dir, entry.name), depth + 1, `${prefix}  `);
      }
    }
  }

  await walk(targetDir, 1, '');
  return lines.length > 0 ? lines.join('\n') : '(empty directory)';
}

async function readFileTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const targetFile = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.path || ''));
  const raw = await fs.readFile(targetFile, 'utf8');
  const allLines = raw.split(/\r?\n/);
  const start = Math.max(1, Number(args.startLine) || 1);
  const end = Math.min(allLines.length, Number(args.endLine) || Math.min(allLines.length, start + 249));
  const slice = allLines.slice(start - 1, end).map((line, i) => `${start + i}: ${line}`);
  const header = `File: ${path.relative(primaryRoot, targetFile) || targetFile} (lines ${start}-${end} of ${allLines.length})`;
  const text = `${header}\n${slice.join('\n')}`;
  return text.length > 14000 ? `${text.slice(0, 14000)}\n... [truncated]` : text;
}

async function searchFilesTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const baseDir = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.dir || '.'));
  const query = String(args.pattern || '').trim();
  if (!query) throw new Error('pattern is required for search_files');

  let regex: RegExp;
  try {
    regex = new RegExp(query, 'i');
  } catch {
    regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  const hits: string[] = [];
  async function scan(dir: string): Promise<void> {
    if (hits.length >= 60) return;
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (hits.length >= 60) return;
      if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await scan(full);
      } else {
        const stat = await fs.stat(full).catch(() => null);
        if (!stat || stat.size > 512 * 1024) continue;
        const content = await fs.readFile(full, 'utf8').catch(() => '');
        if (!content || content.includes('\u0000')) continue;
        const lines = content.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (regex.test(lines[i])) {
            const rel = path.relative(primaryRoot, full) || full;
            hits.push(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 180)}`);
            if (hits.length >= 60) return;
          }
        }
      }
    }
  }

  await scan(baseDir);
  return hits.length > 0 ? hits.join('\n') : `No matches found for "${query}"`;
}

async function writeFileTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const targetFile = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.path || ''));
  const content = typeof args.content === 'string' ? args.content : '';
  await fs.mkdir(path.dirname(targetFile), { recursive: true });
  await fs.writeFile(targetFile, content, 'utf8');
  return `Wrote ${content.length} chars to ${path.relative(primaryRoot, targetFile) || targetFile}`;
}

async function editFileTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const targetFile = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.path || ''));
  const target = String(args.target ?? '');
  const replacement = String(args.replacement ?? '');
  if (!target) throw new Error('target snippet is required for edit_file');
  const existing = await fs.readFile(targetFile, 'utf8');
  if (!existing.includes(target)) {
    throw new Error(`Target text not found in ${args.path}. Re-read lines first to match exact whitespace.`);
  }
  const updated = existing.split(target).join(replacement);
  await fs.writeFile(targetFile, updated, 'utf8');
  return `Updated ${path.relative(primaryRoot, targetFile) || targetFile}`;
}

async function deleteFileTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const targetPath = resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.path || ''));
  if (!fsSync.existsSync(targetPath)) {
    throw new Error(`File does not exist: ${args.path}`);
  }
  const stat = await fs.stat(targetPath);
  if (stat.isDirectory()) {
    await fs.rm(targetPath, { recursive: true, force: true });
  } else {
    await fs.unlink(targetPath);
  }
  return `Deleted ${path.relative(primaryRoot, targetPath) || targetPath}`;
}

function validateShellCommandWithinWorkspace(command: string, allowedRoots: string[]): void {
  // Reject explicit parent directory traversal escapes and absolute path tokens outside synced project folders
  if (/(?:^|\s|["'])(\.\.[\\/]){2,}/.test(command) || /(?:^|\s)(?:cd|set-location|sl|pushd)\s+(?:\.\.|[a-z]:[\\/]|[\\/])/i.test(command)) {
    throw new Error(`Command blocked: directory change/traversal outside synced project folders is not allowed.`);
  }
  const driveMatches = command.match(/[A-Za-z]:[\\/][^\s"'`]+/g) || [];
  for (const abs of driveMatches) {
    const clean = abs.replace(/["'`;,)]+$/, '');
    if (!isWithinAnyRoot(path.resolve(clean), allowedRoots)) {
      throw new Error(`Command blocked: referenced path "${clean}" is outside the active project and its synced folders.`);
    }
  }
}

async function runCommandTool(allowedRoots: string[], primaryRoot: string, args: Record<string, any>): Promise<string> {
  const command = String(args.command || '').trim();
  if (!command) throw new Error('command is required for run_command');
  const cwd = args.cwd
    ? resolveWorkspaceTarget(allowedRoots, primaryRoot, String(args.cwd))
    : resolveWorkspaceTarget(allowedRoots, primaryRoot, '.');
  validateShellCommandWithinWorkspace(command, allowedRoots);

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      timeout: 45000,
      maxBuffer: 1024 * 1024,
    });
    const out = [stdout?.trim(), stderr?.trim() ? `[stderr]\n${stderr.trim()}` : ''].filter(Boolean).join('\n');
    const summary = out || '(command exited with code 0, no output)';
    return summary.length > 8000 ? `${summary.slice(0, 8000)}\n... [truncated]` : summary;
  } catch (err: any) {
    const out = [err?.stdout?.trim(), err?.stderr?.trim(), err?.message].filter(Boolean).join('\n');
    throw new Error(out.slice(0, 4000) || 'Command failed');
  }
}

function parseAgentToolCalls(rawText: string): Array<{ tool: AgentToolName; args: Record<string, any>; thought?: string }> | null {
  const trimmed = (rawText || '').trim();
  if (!trimmed) return null;

  const candidates: string[] = [trimmed];
  const fencedMatches = Array.from(trimmed.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi));
  for (const m of fencedMatches) {
    if (m[1]) candidates.push(m[1].trim());
  }

  const validTools = new Set<string>([
    'list_dir',
    'read_file',
    'search_files',
    'write_file',
    'edit_file',
    'delete_file',
    'run_command',
    'search_ai_skills',
    'load_ai_skill',
  ]);

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const normalized: Array<{ tool: AgentToolName; args: Record<string, any>; thought?: string }> = [];
      for (const item of list) {
        if (item && typeof item.tool === 'string' && validTools.has(item.tool)) {
          normalized.push({
            tool: item.tool as AgentToolName,
            args: item.args && typeof item.args === 'object' ? item.args : {},
            thought: typeof item.thought === 'string' ? item.thought : undefined,
          });
        }
      }
      if (normalized.length > 0) return normalized;
    } catch {
      // Not clean JSON; try next candidate
    }
  }

  // Fallback: extract embedded tool call JSON object if model wrote prose + JSON
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const sub = trimmed.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(sub);
      if (parsed && typeof parsed.tool === 'string' && validTools.has(parsed.tool)) {
        return [{
          tool: parsed.tool as AgentToolName,
          args: parsed.args && typeof parsed.args === 'object' ? parsed.args : {},
          thought: typeof parsed.thought === 'string' ? parsed.thought : undefined,
        }];
      }
    } catch {}
  }

  return null;
}

export interface RunWorkspaceAgentInput {
  runId: string;
  conversationId?: string;
  workspacePath: string;
  workspacePaths?: string[];
  prompt: string | any[];
  attachments?: any[];
  modelId?: string;
  providerId?: string;
  keyId?: string;
  preferredFailover?: boolean;
  workflowMode?: 'auto' | 'turbo' | 'standard' | 'deep-thought';
  accessLevel: PermissionLevel;
  skillContext?: string;
}

export async function runWorkspaceAgent(input: RunWorkspaceAgentInput): Promise<{
  conversationId: string;
  userMessage: any;
  assistantMessage: any;
  steps: WorkspaceAgentStep[];
}> {
  const {
    runId,
    workspacePath,
    workspacePaths,
    prompt,
    attachments,
    modelId: requestedModel,
    providerId: requestedProvider,
    keyId,
    preferredFailover = true,
    workflowMode = 'auto',
    accessLevel,
    skillContext,
  } = input;

  if (!workspacePath || !fsSync.existsSync(workspacePath)) {
    throw new Error('Please select at least one workspace folder first before running project agent tasks.');
  }
  const primaryRoot = fsSync.realpathSync(workspacePath);
  const allowedRoots = normalizeAllowedRoots(primaryRoot, workspacePaths);

  let convId = input.conversationId;
  if (!convId || !getConversation(convId)) {
    const promptPreview = typeof prompt === 'string' ? prompt.trim().slice(0, 48) : 'Workspace Task';
    const created = createConversation({
      title: `Work: ${promptPreview || path.basename(workspacePath)}`,
      modelId: requestedModel || 'auto',
      providerId: requestedProvider || 'default',
    });
    convId = created.id;
  }

  const normalizedContent =
    Array.isArray(attachments) && attachments.length > 0 && typeof prompt === 'string'
      ? [...(prompt.trim() ? [{ type: 'text', text: prompt }] : []), ...attachments]
      : prompt;

  const userMessage = createMessage({
    conversationId: convId,
    role: 'user',
    content: normalizedContent,
    status: 'complete',
  });

  // Resolve active API keys cleanly
  const allKeys = getApiKeys();
  const resolveKeySecret = async (match: ApiKeyEntry): Promise<string | null> => {
    const k = await getStoredApiKey(match.providerId, match.keyName);
    if (k) return k;
    if (match.encryptedKey && !match.encryptedKey.startsWith('encrypted:')) {
      try {
        return await decrypt(match.encryptedKey);
      } catch {}
    }
    return null;
  };

  const providerKeys: Record<string, string> = {};
  let providerId = requestedProvider || '';
  let modelId = requestedModel || '';

  if (modelId) {
    const lower = modelId.toLowerCase();
    if (lower.includes('claude')) providerId = 'anthropic';
    else if (lower.includes('gpt')) providerId = 'openai';
    else if (lower.includes('gemini')) providerId = 'google';
  }

  const selectedKeyEntry = keyId ? allKeys.find(k => k.id === keyId) : undefined;
  if (selectedKeyEntry) {
    const secret = await resolveKeySecret(selectedKeyEntry);
    if (secret) {
      providerId = inferProviderFromApiKey(secret, selectedKeyEntry.providerId);
      providerKeys[providerId] = secret;
    }
  }
  for (const kEntry of allKeys) {
    const secret = await resolveKeySecret(kEntry);
    if (secret) {
      const resolved = inferProviderFromApiKey(secret, kEntry.providerId);
      if (!providerKeys[resolved]) providerKeys[resolved] = secret;
    }
  }
  if (!providerKeys.google && process.env.GEMINI_API_KEY) {
    providerKeys.google = process.env.GEMINI_API_KEY;
  }

  if (Object.keys(providerKeys).length === 0) {
    const assistantMessage = createMessage({
      conversationId: convId,
      role: 'assistant',
      content: '⚠️ **API Key Required**: Click **API Keys** in the **Sidebar** to add your API key so the Workspace Agent can execute tasks.',
      modelId: 'No API Key',
      providerId: 'none',
      status: 'complete',
    });
    emitAgentEvent({ runId, type: 'done', finalContent: assistantMessage.content as string });
    return { conversationId: convId, userMessage, assistantMessage, steps: [] };
  }

  if (!providerId || !providerKeys[providerId]) {
    providerId = Object.keys(providerKeys)[0];
  }

  const turboChain = [
    { model: 'gemini-2.5-flash', provider: 'google' },
    { model: 'gpt-4o-mini', provider: 'openai' },
    { model: 'claude-3-5-haiku-20241022', provider: 'anthropic' },
  ];
  const reasoningChain = [
    { model: 'gemini-2.5-pro', provider: 'google' },
    { model: 'claude-sonnet-4-5', provider: 'anthropic' },
    { model: 'gpt-4o', provider: 'openai' },
  ];
  const standardChain = [
    { model: 'gemini-2.5-flash', provider: 'google' },
    { model: 'gpt-4o', provider: 'openai' },
    { model: 'claude-3-5-sonnet-20241022', provider: 'anthropic' },
  ];

  const isExplicitWorkflow = workflowMode === 'turbo' || workflowMode === 'standard' || workflowMode === 'deep-thought';
  const effectiveCategory = isExplicitWorkflow
    ? workflowMode
    : modelId && modelId !== 'auto' && modelId !== 'default'
    ? classifyModelCategory({ id: modelId })
    : 'standard';

  const chain = effectiveCategory === 'deep-thought' ? reasoningChain : effectiveCategory === 'turbo' ? turboChain : standardChain;
  const availableChain = chain.filter(c => !!providerKeys[c.provider]);
  let candidates = [
    ...availableChain.filter(c => c.provider === providerId),
    ...availableChain.filter(c => c.provider !== providerId),
  ];
  if (modelId && modelId !== 'auto' && modelId !== 'default') {
    const primary = { model: modelId, provider: providerId };
    const backups = candidates.filter(c => !(c.model === modelId && c.provider === providerId));
    candidates = preferredFailover ? [primary, ...backups] : [primary];
  } else if (providerId === 'custom' || providerId === 'openrouter' || providerId === 'ollama') {
    const keySecret = providerKeys[providerId] || '';
    const profile = resolveApiKeyProfile(keySecret, providerId);
    let defaultModel = keySecret.trim().startsWith('freellma') ? 'auto' : profile.defaultModel || 'default';
    if (!keySecret.trim().startsWith('freellma')) {
      try {
        const provInst = providerManager.getProviderForKeyProfile(providerId, keySecret);
        if (provInst) {
          provInst.updateConfig({
            apiKey: keySecret,
            ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
          });
          const catalog = await provInst.listModels();
          const picked =
            catalog.find(m => m.id !== 'auto' && classifyModelCategory(m) === effectiveCategory) ||
            catalog.find(m => m.id !== 'auto');
          if (picked?.id) defaultModel = picked.id;
        }
      } catch {}
    }
    candidates = [{ model: defaultModel, provider: providerId }];
  }

  const runState: ActiveRun = {
    conversationId: convId,
    aborted: false,
    allowAllInRun: accessLevel === 'full-access',
    abortController: new AbortController(),
    pendingApprovals: new Map(),
  };
  activeRuns.set(runId, runState);

  const systemPrompt = [
    `You are EXCO Work Agent operating strictly inside the active project's folder sandbox.`,
    `Primary Workspace Folder: "${primaryRoot}".`,
    allowedRoots.length > 1
      ? `Synced Project Folders (${allowedRoots.length} accessible folders):\n${allowedRoots.map((r, i) => `  ${i + 1}. "${r}"`).join('\n')}`
      : `Selected Workspace Folder: "${primaryRoot}".`,
    `Active Access Limiter Tier: "${accessLevel}" (${accessLevel === 'ask' ? 'Ask Every Time' : accessLevel === 'full-access' ? 'Turbo Autonomous (Strict Folder Sandbox)' : 'Default — auto normal workspace ops, ask major ops'}).`,
    'CRITICAL SECURITY BOUNDARY: You are strictly forbidden from accessing, reading, writing, deleting, or running commands outside the provided workspace/synced folders.',
    allowedRoots.length > 1
      ? 'Note: Use full paths or prefix relative paths with a synced folder name (e.g. "FolderB/file.ts") when working across different synced folders.'
      : '',
    '',
    'You have real tools to inspect files, search code, write/edit/delete files, and execute shell commands.',
    'When you want to run a tool step, reply ONLY with a valid JSON object (no surrounding prose) like:',
    '{"thought":"short explanation of why","tool":"read_file","args":{"path":"relative/path.ts"}}',
    'Or a JSON array of up to 3 read-only tool calls when inspecting multiple files in parallel.',
    '',
    'Available tools:',
    '- list_dir: {"path": ".", "depth": 2}',
    '- read_file: {"path": "file.ts", "startLine": 1, "endLine": 250}',
    '- search_files: {"pattern": "searchText", "dir": "."}',
    '- write_file: {"path": "file.ts", "content": "full contents"}',
    '- edit_file: {"path": "file.ts", "target": "exact existing text", "replacement": "new text"}',
    '- delete_file: {"path": "file.ts"}',
    '- run_command: {"command": "npm test", "cwd": "."}',
    '- search_ai_skills: {"query": "topic", "category": "optional-category"} — Search EXCO active SKILL.md workflows',
    '- load_ai_skill: {"id": "category/subcat/skill-name"} — Load full SKILL.md instructions for a task',
    '',
    'Rules:',
    '1. Always inspect existing files before claiming how code works or editing blindly.',
    '2. Prefer edit_file for targeted changes and verify builds/tests with run_command after code edits when appropriate.',
    '3. If a tool returns Permission denied by user, adapt and report clearly without retrying the denied call.',
    '4. When a task benefits from specialized engineering, API, security, frontend, or testing workflows, call search_ai_skills / load_ai_skill to use EXCO active AI Skills.',
    '5. When all needed actions are complete (or no workspace tools are needed), reply with a clear, concise final Markdown answer referencing exact files and observed command output.',
    buildUniversalSkillsPrompt(typeof prompt === 'string' ? prompt : '', skillContext) || '',
  ].filter(Boolean).join('\n');

  const scratchHistory: Array<{ role: 'user' | 'assistant'; content: any }> = getMessages(convId).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const executedSteps: WorkspaceAgentStep[] = [];
  let finalReply = '';
  let usedModel = modelId || 'auto';
  let usedProvider = providerId;
  let totalTokens: any = undefined;

  let activeTurnNumber = 1;
  const callModelOnce = async (msgs: Array<{ role: 'user' | 'assistant'; content: any }>) => {
    let lastErr: any;
    for (let i = 0; i < Math.min(candidates.length, 4); i++) {
      if (runState.aborted || runState.abortController.signal.aborted || !getConversation(convId!)) {
        throw new Error('Workspace agent run cancelled');
      }
      const cand = candidates[i];
      const keySecret = providerKeys[cand.provider];
      const prov = providerManager.getProviderForKeyProfile(cand.provider, keySecret);
      if (!prov) continue;
      if (keySecret) {
        const profile = resolveApiKeyProfile(keySecret, cand.provider);
        const patch: { apiKey: string; baseUrl?: string } = { apiKey: keySecret };
        if (profile.baseUrl) {
          patch.baseUrl = profile.baseUrl;
        }
        prov.updateConfig(patch);
      }
      const attemptStartedAt = Date.now();
      emitAgentEvent({
        runId,
        type: 'status',
        message: `Interfacing ${cand.provider.toUpperCase()} (${cand.model}) · Step ${activeTurnNumber}...`,
      });
      const heartbeat = setInterval(() => {
        if (runState.aborted || runState.abortController.signal.aborted) return;
        const sec = Math.max(1, Math.round((Date.now() - attemptStartedAt) / 1000));
        emitAgentEvent({
          runId,
          type: 'status',
          message: `Waiting on ${cand.provider.toUpperCase()} (${cand.model}) · Step ${activeTurnNumber} (${sec}s)...`,
        });
      }, 1000);
      try {
        const res = await providerManager.complete(prov.getId(), {
          model: cand.model,
          systemPrompt,
          messages: msgs.map((m, idx) => ({
            id: `agent-msg-${idx}`,
            conversationId: convId!,
            role: m.role,
            content: m.content,
            createdAt: Date.now(),
            status: 'complete',
          })) as any,
          signal: runState.abortController.signal,
        });
        usedModel = res.model || cand.model;
        usedProvider = cand.provider;
        if (res.usage) totalTokens = res.usage;
        return res.content || '';
      } catch (err) {
        if (runState.aborted || runState.abortController.signal.aborted) {
          throw err;
        }
        lastErr = err;
      } finally {
        clearInterval(heartbeat);
      }
    }
    throw lastErr || new Error('All configured AI providers failed');
  };

  try {
    const MAX_TURNS = 14;
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      activeTurnNumber = turn + 1;
      if (runState.aborted) {
        finalReply = '⏹️ **Workspace Agent stopped by user.**';
        break;
      }

      emitAgentEvent({
        runId,
        type: 'status',
        message: turn === 0 ? 'Preparing workspace context & tools...' : `Reasoning next action (Step ${turn + 1})...`,
      });

      const modelText = await callModelOnce(scratchHistory);
      const toolCalls = parseAgentToolCalls(modelText);

      if (!toolCalls || toolCalls.length === 0) {
        finalReply = modelText.trim() || 'Completed.';
        break;
      }

      const observations: string[] = [];
      let modifiedFiles = false;

      for (const call of toolCalls) {
        if (runState.aborted) break;

        const step: WorkspaceAgentStep = {
          id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          tool: call.tool,
          args: call.args,
          thought: call.thought,
          major: isMajorAction(call.tool, call.args, allowedRoots, primaryRoot),
          status: 'running',
        };

        if (requiresApproval(accessLevel, runState, call.tool, call.args, allowedRoots, primaryRoot)) {
          step.status = 'pending-approval';
          executedSteps.push(step);
          emitAgentEvent({ runId, type: 'approval-required', step: { ...step } });

          const decision = await new Promise<ApprovalDecision>(resolve => {
            runState.pendingApprovals.set(step.id, { resolve });
          });

          if (decision === 'deny' || runState.aborted) {
            step.status = 'denied';
            step.output = 'User denied permission for this action.';
            emitAgentEvent({ runId, type: 'step-update', step: { ...step } });
            observations.push(`[Tool ${call.tool}] DENIED by user.`);
            continue;
          }
          step.status = 'running';
          emitAgentEvent({ runId, type: 'step-update', step: { ...step } });
        } else {
          executedSteps.push(step);
          emitAgentEvent({ runId, type: 'step-update', step: { ...step } });
        }

        const describeToolAction = (toolName: string, args: Record<string, any> = {}): string => {
          const targetPath = String(args.path || args.filePath || args.dir || '').trim();
          switch (toolName) {
            case 'list_dir':
              return `Scanning directory ${targetPath || '.'}`;
            case 'read_file':
              return `Reading file ${targetPath || '(target)'}`;
            case 'search_files':
              return `Searching files for "${String(args.query || args.pattern || '').slice(0, 40)}"`;
            case 'write_file':
              return `Writing file ${targetPath || '(target)'}`;
            case 'edit_file':
              return `Editing file ${targetPath || '(target)'}`;
            case 'delete_file':
              return `Deleting file ${targetPath || '(target)'}`;
            case 'run_command':
              return `Running command: ${String(args.command || '').slice(0, 48)}`;
            case 'search_ai_skills':
              return `Searching AI Skills for "${String(args.query || args.category || 'all').slice(0, 40)}"`;
            case 'load_ai_skill':
              return `Loading AI Skill "${String(args.id || args.name || '').slice(0, 40)}"`;
            default:
              return `Running tool ${toolName}`;
          }
        };

        const toolActionLabel = describeToolAction(call.tool, call.args);
        emitAgentEvent({ runId, type: 'status', message: `${toolActionLabel}...` });
        const toolStartedAt = Date.now();
        const toolTicker = setInterval(() => {
          if (runState.aborted) return;
          const secs = Math.max(1, Math.floor((Date.now() - toolStartedAt) / 1000));
          emitAgentEvent({ runId, type: 'status', message: `${toolActionLabel} · ${secs}s...` });
        }, 1000);

        try {
          let result = '';
          switch (call.tool) {
            case 'list_dir':
              result = await listDirTool(allowedRoots, primaryRoot, call.args);
              break;
            case 'read_file':
              result = await readFileTool(allowedRoots, primaryRoot, call.args);
              break;
            case 'search_files':
              result = await searchFilesTool(allowedRoots, primaryRoot, call.args);
              break;
            case 'write_file':
              result = await writeFileTool(allowedRoots, primaryRoot, call.args);
              modifiedFiles = true;
              break;
            case 'edit_file':
              result = await editFileTool(allowedRoots, primaryRoot, call.args);
              modifiedFiles = true;
              break;
            case 'delete_file':
              result = await deleteFileTool(allowedRoots, primaryRoot, call.args);
              modifiedFiles = true;
              break;
            case 'run_command':
              result = await runCommandTool(allowedRoots, primaryRoot, call.args);
              modifiedFiles = true;
              break;
            case 'search_ai_skills': {
              const hits = searchActiveSkills(String(call.args?.query || ''), call.args?.category ? String(call.args.category) : undefined, 12);
              result = hits.length > 0
                ? hits.map(h => `- ${h.id} | ${h.name} (${h.category}): ${h.description}`).join('\n')
                : 'No matching AI skills found.';
              break;
            }
            case 'load_ai_skill': {
              const skill = loadActiveSkill(String(call.args?.id || call.args?.name || ''));
              result = skill
                ? `# ${skill.name} (${skill.category})\nID: ${skill.id}\n${skill.description}\n\n${skill.content}`
                : 'Requested AI skill not found or currently disabled.';
              break;
            }
          }
          step.status = 'completed';
          step.output = result;
          emitAgentEvent({ runId, type: 'step-update', step: { ...step } });
          observations.push(`[Tool ${call.tool} RESULT]\n${result}`);
        } catch (toolErr: any) {
          step.status = 'error';
          step.error = toolErr?.message || 'Tool execution error';
          emitAgentEvent({ runId, type: 'step-update', step: { ...step } });
          observations.push(`[Tool ${call.tool} ERROR]\n${step.error}`);
        } finally {
          clearInterval(toolTicker);
        }
      }

      if (modifiedFiles) {
        emitAgentEvent({ runId, type: 'files-changed' });
      }

      scratchHistory.push({ role: 'assistant', content: modelText });
      scratchHistory.push({
        role: 'user',
        content: `Tool execution observations:\n\n${observations.join('\n\n')}\n\nContinue with the next JSON tool call if needed, or write your final answer in Markdown.`,
      });
    }

    if (runState.aborted || runState.abortController.signal.aborted || !getConversation(convId!)) {
      return {
        conversationId: convId,
        userMessage,
        assistantMessage: null as any,
        steps: executedSteps,
        aborted: true,
      } as any;
    }

    if (!finalReply) {
      finalReply = 'Reached maximum autonomous steps cleanly. Review the step logs above for details.';
    }

    const toolCallsForDb: ToolCall[] = executedSteps.map(s => ({
      id: s.id,
      name: s.tool,
      arguments: {
        ...s.args,
        __thought: s.thought,
        __major: s.major,
      },
      result: s.output,
      error: s.error,
      status: s.status === 'completed' ? 'completed' : s.status === 'denied' || s.status === 'error' ? 'error' : 'pending',
    }));

    const assistantMessage = createMessage({
      conversationId: convId,
      role: 'assistant',
      content: finalReply,
      modelId: usedModel,
      providerId: usedProvider,
      toolCalls: toolCallsForDb.length > 0 ? toolCallsForDb : undefined,
      tokens: totalTokens,
      status: 'complete',
    });

    updateConversation(convId, { modelId: usedModel, providerId: usedProvider });
    emitAgentEvent({
      runId,
      type: 'done',
      finalContent: finalReply,
      modelId: usedModel,
      providerId: usedProvider,
    });

    return {
      conversationId: convId,
      userMessage,
      assistantMessage,
      steps: executedSteps,
    };
  } catch (err: any) {
    if (runState.aborted || runState.abortController.signal.aborted || !getConversation(convId!)) {
      return {
        conversationId: convId,
        userMessage,
        assistantMessage: null as any,
        steps: executedSteps,
        aborted: true,
      } as any;
    }
    const errText = `❌ **Workspace Agent Error**: ${err?.message || 'Execution failed'}`;
    const assistantMessage = createMessage({
      conversationId: convId,
      role: 'assistant',
      content: errText,
      modelId: usedModel,
      providerId: usedProvider,
      status: 'error',
    });
    emitAgentEvent({ runId, type: 'error', message: errText });
    return {
      conversationId: convId,
      userMessage,
      assistantMessage,
      steps: executedSteps,
    };
  } finally {
    activeRuns.delete(runId);
  }
}
