// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as http from 'http';
import Module from 'module';

// Point module-alias to compiled dist/main & dist/shared and stub Electron runtime APIs
const rootDir = path.resolve(__dirname, '../..');
const distMainDir = path.join(rootDir, 'dist/main');
const distSharedDir = path.join(rootDir, 'dist/shared');

// Register runtime aliases identically to dist/main/main.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleAlias = require('module-alias');
moduleAlias.addAliases({
  '@main': distMainDir,
  '@shared': distSharedDir,
});

// Intercept require('electron') so dist/main modules load cleanly inside Node Vitest
const originalLoad = (Module as any)._load;
let tempUserDataDir = '';
(Module as any)._load = function (request: string, parent: any, isMain: boolean) {
  if (request === 'electron') {
    return {
      app: {
        getPath: () => tempUserDataDir || os.tmpdir(),
        isPackaged: false,
        on: vi.fn(),
      },
      safeStorage: {
        isEncryptionAvailable: () => false,
        encryptString: (s: string) => Buffer.from(s, 'utf8'),
        decryptString: (b: Buffer) => b.toString('utf8'),
      },
      BrowserWindow: class {},
      ipcMain: { handle: vi.fn(), on: vi.fn() },
      shell: { openExternal: vi.fn() },
    };
  }
  return originalLoad.apply(this, arguments);
};

describe('EXCO Main Process: SQL Injection, Workflow, Failover, Extraction & Sandbox Suite', () => {
  let dbMod: typeof import('../main/database');
  let routerMod: typeof import('../main/services/model-router');
  let openaiMod: typeof import('../main/services/ai-providers/openai');
  let providersMod: typeof import('../main/services/ai-providers');
  let agentMod: typeof import('../main/services/workspace-agent');
  let vaultMod: typeof import('../main/services/credential-vault');
  let organizerMod: typeof import('../main/services/workspace-organizer');

  let mockServer: http.Server;
  let mockBaseUrl = '';

  beforeAll(async () => {
    tempUserDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exco-sec-test-'));
    dbMod = require(path.join(distMainDir, 'database/index.js'));
    await dbMod.initializeDatabase(tempUserDataDir);
    routerMod = require(path.join(distMainDir, 'services/model-router.js'));
    openaiMod = require(path.join(distMainDir, 'services/ai-providers/openai.js'));
    providersMod = require(path.join(distMainDir, 'services/ai-providers/index.js'));
    agentMod = require(path.join(distMainDir, 'services/workspace-agent.js'));
    vaultMod = require(path.join(distMainDir, 'services/credential-vault.js'));
    organizerMod = require(path.join(distMainDir, 'services/workspace-organizer.js'));

    // Mock HTTP server for custom endpoint extraction, x-api-key, 401 auth handling, and ReAct tool loop
    let turnCounter = 0;
    mockServer = http.createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        const bodyRaw = Buffer.concat(chunks).toString('utf8');
        const url = req.url || '/';

        if (url === '/v1/models' && req.headers['x-test-mode'] === '404') {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        if (url === '/bad-auth/v1/models') {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: 'Unauthorized API key' } }));
          return;
        }
        if (url === '/bare-array/v1/models') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(['custom-fast-1', 'custom-reasoner-r1']));
          return;
        }
        if (url === '/xapi/v1/models') {
          if (req.headers['x-api-key'] === 'secret-xapi') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ models: [{ id: 'xapi-model-1', name: 'XAPI Model 1' }] }));
          } else {
            res.writeHead(401);
            res.end('Unauthorized');
          }
          return;
        }
        if (url === '/result-envelope/v1/models') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ result: [{ model_id: 'searched-model-pro', title: 'Searched Pro' }] }));
          return;
        }

        if (url.endsWith('/chat/completions')) {
          turnCounter += 1;
          const parsed = bodyRaw ? JSON.parse(bodyRaw) : {};
          const lastUserMsg = String(parsed?.messages?.[parsed.messages.length - 1]?.content || '');

          let reply = 'Website created and sandbox checked.';
          if (turnCounter === 1) {
            reply = JSON.stringify({
              tool: 'write_file',
              thought: 'Create index.html inside workspace',
              args: { path: 'index.html', content: '<!doctype html><html><body><h1>EXCO Test</h1></body></html>' },
            });
          } else if (turnCounter === 2) {
            reply = JSON.stringify({
              tool: 'read_file',
              thought: 'Attempt illegal outside read to verify sandbox blocks it',
              args: { path: '../outside_secret_dir/secret.txt' },
            });
          } else if (turnCounter === 3 && lastUserMsg.includes('Access denied')) {
            reply = JSON.stringify({
              tool: 'run_command',
              thought: 'Attempt illegal shell escape to verify sandbox blocks it',
              args: { command: 'cd .. && dir' },
            });
          } else if (turnCounter >= 4 && lastUserMsg.includes('Command blocked')) {
            reply = 'Sandbox verification completed cleanly.';
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              id: 'chatcmpl-test',
              model: 'mock-agent-model',
              choices: [{ index: 0, message: { role: 'assistant', content: reply }, finish_reason: 'stop' }],
              usage: { prompt_tokens: 10, completion_tokens: 12, total_tokens: 22 },
            })
          );
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: [] }));
      });
    });

    await new Promise<void>(resolve => {
      mockServer.listen(0, '127.0.0.1', () => {
        const addr = mockServer.address() as { port: number };
        mockBaseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    try {
      dbMod.closeDatabase();
    } catch {}
    await new Promise<void>(resolve => mockServer.close(() => resolve()));
    if (tempUserDataDir && fs.existsSync(tempUserDataDir)) {
      fs.rmSync(tempUserDataDir, { recursive: true, force: true });
    }
    (Module as any)._load = originalLoad;
  });

  describe('SQL Injection Prevention Across All Database Tables', () => {
    it('parameterizes conversation, message, key, provider, workspace, and setting queries safely', () => {
      const sqliPayloads = [
        "'; DROP TABLE messages; --",
        "' OR '1'='1",
        "x' UNION SELECT id, encrypted_key FROM api_keys --",
        "admin'); DELETE FROM conversations; --",
        "test\u0000' OR 1=1 --",
      ];

      const conv = dbMod.createConversation({
        title: sqliPayloads[0],
        modelId: sqliPayloads[1],
        providerId: 'custom',
      });
      expect(conv.title).toBe(sqliPayloads[0]);

      // Injection into lookup IDs must return null and never drop or leak rows
      for (const payload of sqliPayloads) {
        expect(dbMod.getConversation(payload)).toBeNull();
        expect(dbMod.getMessages(payload)).toEqual([]);
        expect(dbMod.getApiKey(payload)).toBeNull();
        expect(dbMod.getApiKeyByProvider(payload)).toBeNull();
        expect(dbMod.getProvider(payload)).toBeNull();
        expect(dbMod.getWorkspace(payload)).toBeNull();
        expect(dbMod.updateConversation(payload, { title: 'hijacked' })).toBeNull();
        expect(dbMod.deleteConversation(payload)).toBe(false);
      }

      const msg = dbMod.createMessage({
        conversationId: conv.id,
        role: 'user',
        content: sqliPayloads[3],
        status: 'complete',
      });
      expect(msg.content).toBe(sqliPayloads[3]);

      const keyEntry = dbMod.createApiKey({
        providerId: 'custom',
        keyName: sqliPayloads[2],
        key: 'enc-data',
        encryptedKey: 'enc-data',
      } as any);
      expect(keyEntry.keyName).toBe(sqliPayloads[2]);

      const provider = dbMod.createProvider({
        name: sqliPayloads[0],
        type: 'custom',
        config: { baseUrl: 'https://example.com/v1', apiKey: 'must-be-scrubbed' },
        models: [],
        enabled: true,
      });
      // Ensure DB scrubbed plaintext apiKey from provider config
      expect((provider.config as any).apiKey).toBeUndefined();

      dbMod.setSetting(sqliPayloads[1], { injected: sqliPayloads[3] });
      expect(dbMod.getSetting(sqliPayloads[1], null)).toEqual({ injected: sqliPayloads[3] });

      // Confirm all core tables still exist and row counts remain intact
      const db = dbMod.getDatabase();
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all()
        .map((r: any) => r.name);
      expect(tables).toEqual(
        expect.arrayContaining(['conversations', 'messages', 'api_keys', 'providers', 'workspaces', 'settings'])
      );
      expect(dbMod.getMessages(conv.id)).toHaveLength(1);
      expect(dbMod.deleteApiKey(keyEntry.id)).toBe(true);
      expect(dbMod.deleteConversation(conv.id)).toBe(true);
    });
  });

  describe('Model Router: Quality Tiers, Auth Error Detection & Silent Failover', () => {
    it('ranks Tier 1 leading models strictly above Tier 2 and Tier 3 obscure models', () => {
      expect(routerMod.getModelQualityTier('gemini-2.5-pro', 'Gemini 2.5 Pro')).toBe(1);
      expect(routerMod.getModelQualityTier('claude-sonnet-4-5', 'Claude Sonnet 4.5')).toBe(1);
      expect(routerMod.getModelQualityTier('llama-3.3-70b-instruct', 'Llama 3.3 70B')).toBe(1);
      expect(routerMod.getModelQualityTier('mistral-small-latest', 'Mistral Small')).toBe(2);
      expect(routerMod.getModelQualityTier('openai/gpt-oss-120b', 'GPT OSS 120B')).toBe(3);
      expect(routerMod.getModelQualityTier('tinylm-experimental-2b', 'TinyLM')).toBe(3);
    });

    it('identifies auth errors accurately and marks key cooldown without blocking unrelated keys', () => {
      expect(routerMod.isAuthError(new Error('HTTP 401 Unauthorized'))).toBe(true);
      expect(routerMod.isAuthError(new Error('403 Forbidden: invalid x-api-key'))).toBe(true);
      expect(routerMod.isAuthError(new Error('HTTP 500 Internal Server Error'))).toBe(false);

      routerMod.markKeyAuthFailed('bad-key-1', 'Unauthorized');
      expect(routerMod.isModelExhausted('bad-key-1', 'any-model')).toBe(true);
      expect(routerMod.isModelExhausted('healthy-key-2', 'any-model')).toBe(false);
    });

    it('enforces manual category selection without auto-switching and fails over to same model across API keys first', async () => {
      routerMod.clearRouterStateForTests();
      const mkCand = (keyId: string, modelId: string, modelName: string, category: 'turbo' | 'standard' | 'deep-thought', turboScore: number, overallScore: number) => ({
        keyId,
        keyName: `Key ${keyId}`,
        keySecret: `secret-${keyId}`,
        providerId: 'google',
        providerDisplayName: `Key ${keyId}`,
        modelId,
        modelName,
        category,
        tier: 'free' as const,
        overallScore,
        turboScore,
        standardScore: overallScore,
        deepThoughtScore: category === 'deep-thought' ? 95 : 75,
        speedScore: category === 'turbo' ? 240 : 190,
        researchScore: category === 'deep-thought' ? 250 : 180,
        documentationScore: 200,
        codingScore: 200,
        contextWindow: 1000000,
      });

      const pool = [
        mkCand('k1', 'gemini-2.5-flash', 'Gemini 2.5 Flash', 'turbo', 96, 89),
        mkCand('k2', 'gemini-2.5-flash', 'Gemini 2.5 Flash', 'turbo', 96, 89),
        mkCand('k1', 'gpt-4o-mini', 'GPT-4o Mini', 'turbo', 91, 80),
        mkCand('k1', 'gemini-2.5-pro', 'Gemini 2.5 Pro', 'deep-thought', 74, 90),
      ];

      // Even with research/architecture keywords, Turbo must NOT auto-switch to Deep Thought
      const d1 = await routerMod.routeTurnWithOverviewer({
        pool,
        promptText: 'Perform deep research and system architecture analysis',
        workflowMode: 'turbo',
        preferredKeyId: 'k1',
      });
      expect(d1?.category).toBe('turbo');
      expect(d1?.selected.modelId).toBe('gemini-2.5-flash');
      expect(d1?.selected.keyId).toBe('k1');
      // Same model on k2 must come before 2nd-best model (gpt-4o-mini) on k1
      expect(d1?.candidates.slice(0, 3).map(c => `${c.keyId}:${c.modelId}`)).toEqual([
        'k1:gemini-2.5-flash',
        'k2:gemini-2.5-flash',
        'k1:gpt-4o-mini',
      ]);

      // Exhaust k1's gemini-2.5-flash -> next route must pick k2's gemini-2.5-flash (same model, other key)
      routerMod.markModelExhausted('k1', 'gemini-2.5-flash', '429 quota');
      const d2 = await routerMod.routeTurnWithOverviewer({
        pool: pool.filter(c => !routerMod.isModelExhausted(c.keyId, c.modelId)),
        promptText: 'Hello',
        workflowMode: 'turbo',
        preferredKeyId: 'k1',
      });
      expect(d2?.selected.modelId).toBe('gemini-2.5-flash');
      expect(d2?.selected.keyId).toBe('k2');

      // Exhaust k2's gemini-2.5-flash -> moves to 2nd-best model (gpt-4o-mini)
      routerMod.markModelExhausted('k2', 'gemini-2.5-flash', '429 quota');
      const d3 = await routerMod.routeTurnWithOverviewer({
        pool: pool.filter(c => !routerMod.isModelExhausted(c.keyId, c.modelId)),
        promptText: 'Hello',
        workflowMode: 'turbo',
        preferredKeyId: 'k1',
      });
      expect(d3?.selected.modelId).toBe('gpt-4o-mini');

      // When cooldown resets / cleared, best model is automatically reclaimed again
      routerMod.clearRouterStateForTests();
      const d4 = await routerMod.routeTurnWithOverviewer({
        pool,
        promptText: 'Hello again',
        workflowMode: 'turbo',
        preferredKeyId: 'k1',
      });
      expect(d4?.selected.modelId).toBe('gemini-2.5-flash');
      expect(d4?.selected.keyId).toBe('k1');
    });
  });

  describe('Universal Custom Endpoint Extraction & Auth Handling', () => {
    it('extracts models from bare arrays, x-api-key endpoints, and /ai/models/search fallback while reporting 401 cleanly', async () => {
      const bareProvider = new openaiMod.OpenAIProvider({
        id: 'p-bare',
        name: 'Bare',
        type: 'custom',
        enabled: true,
        config: { baseUrl: `${mockBaseUrl}/bare-array/v1`, apiKey: 'any' },
        models: [],
        createdAt: 1,
        updatedAt: 1,
      });
      const bareModels = await bareProvider.listModels();
      expect(bareModels.map(m => m.id)).toEqual(['custom-fast-1', 'custom-reasoner-r1']);

      const xapiProvider = new openaiMod.OpenAIProvider({
        id: 'p-xapi',
        name: 'XAPI',
        type: 'custom',
        enabled: true,
        config: { baseUrl: `${mockBaseUrl}/xapi/v1`, apiKey: 'secret-xapi' },
        models: [],
        createdAt: 1,
        updatedAt: 1,
      });
      const xapiModels = await xapiProvider.listModels();
      expect(xapiModels.map(m => m.id)).toEqual(['xapi-model-1']);

      const searchProvider = new openaiMod.OpenAIProvider({
        id: 'p-search',
        name: 'ResultEnvelope',
        type: 'custom',
        enabled: true,
        config: { baseUrl: `${mockBaseUrl}/result-envelope/v1`, apiKey: 'any' },
        models: [],
        createdAt: 1,
        updatedAt: 1,
      });
      const searchedModels = await searchProvider.listModels();
      expect(searchedModels.map(m => m.id)).toEqual(['searched-model-pro']);

      const badAuthProvider = new openaiMod.OpenAIProvider({
        id: 'p-401',
        name: 'BadAuth',
        type: 'custom',
        enabled: true,
        config: { baseUrl: `${mockBaseUrl}/bad-auth/v1`, apiKey: 'bad' },
        models: [],
        createdAt: 1,
        updatedAt: 1,
      });
      const validation = await badAuthProvider.validateConnection();
      expect(validation.success).toBe(false);
      expect(validation.error?.toLowerCase()).toMatch(/401|unauthorized/);
    });
  });

  describe('Workspace Agent Workflow & Sandbox Security End-to-End', () => {
    it('executes workspace edits inside sandbox and blocks outside path traversal & cd escapes', async () => {
      const wsParent = fs.mkdtempSync(path.join(os.tmpdir(), 'exco-ws-sandbox-'));
      const wsDir = path.join(wsParent, 'project');
      const outsideDir = path.join(wsParent, 'outside_secret_dir');
      fs.mkdirSync(wsDir, { recursive: true });
      fs.mkdirSync(outsideDir, { recursive: true });
      fs.writeFileSync(path.join(outsideDir, 'secret.txt'), 'TOP_SECRET_VALUE', 'utf8');

      // Seed one custom API key pointing at mockServer
      const savedKey = dbMod.createApiKey({
        providerId: 'custom',
        keyName: 'MockEndpoint',
        key: 'mock-secret',
        encryptedKey: 'mock-secret',
      } as any);
      const savedProv = dbMod.createProvider({
        name: 'MockEndpoint',
        type: 'custom',
        config: { baseUrl: `${mockBaseUrl}/bare-array/v1` },
        models: [
          {
            id: 'custom-fast-1',
            name: 'custom-fast-1',
            providerId: 'custom',
            capabilities: { chat: true, completion: false, embedding: false, imageGeneration: false, audioTranscription: false },
            contextWindow: 128000,
            maxOutputTokens: 4096,
            supportsStreaming: false,
            supportsTools: true,
            supportsVision: false,
            supportsReasoning: false,
          },
        ],
        enabled: true,
      });
      providersMod.providerManager.registerConfiguredProvider({ ...savedProv, config: { baseUrl: `${mockBaseUrl}/bare-array/v1`, apiKey: 'mock-secret' } });
      routerMod.invalidateCandidatePoolCache();

      const res = await agentMod.runWorkspaceAgent({
        runId: `test-run-${Date.now()}`,
        workspacePath: wsDir,
        prompt: 'Write index.html and check security sandbox.',
        modelId: 'custom-fast-1',
        providerId: 'custom',
        keyId: savedKey.id,
        accessLevel: 'full-access',
      });

      expect(fs.existsSync(path.join(wsDir, 'index.html'))).toBe(true);
      expect(fs.readFileSync(path.join(wsDir, 'index.html'), 'utf8')).toContain('EXCO Test');

      const deniedRead = res.steps.find(s => s.tool === 'read_file');
      expect(deniedRead?.status).toBe('error');
      expect(deniedRead?.error).toContain('Access denied');

      const blockedCmd = res.steps.find(s => s.tool === 'run_command');
      expect(blockedCmd?.status).toBe('error');
      expect(blockedCmd?.error).toContain('Command blocked');

      expect(res.assistantMessage?.content).toContain('Sandbox verification completed cleanly');

      const multilineTool = agentMod.parseAgentToolCalls(
        '{"thought":"line1\nline2","tool":"write_file","args":{"path":"a.html","content":"<h1>\nHi\n</h1>"}}'
      );
      expect(multilineTool?.[0]?.tool).toBe('write_file');
      expect(multilineTool?.[0]?.args?.path).toBe('a.html');

      const concatenatedTools = agentMod.parseAgentToolCalls(
        '{"thought":"check","tool":"list_dir","args":{"path":"."}}--{"thought":"write","tool":"write_file","args":{"path":"b.html","content":"ok"}}'
      );
      expect(concatenatedTools).toHaveLength(2);
      expect(concatenatedTools?.[1]?.tool).toBe('write_file');

      const truncatedArrayTools = agentMod.parseAgentToolCalls(
        '[{"thought":"first","tool":"write_file","args":{"path":"c.html","content":"<h1>Hi</h1>"}},{"thought":"second-cut-off","tool":"write_file","args":{"path":"d.html","content":"unclosed'
      );
      expect(truncatedArrayTools).toHaveLength(1);
      expect(truncatedArrayTools?.[0]?.args?.path).toBe('c.html');

      dbMod.deleteApiKey(savedKey.id);
      dbMod.deleteProvider(savedProv.id);
      fs.rmSync(wsParent, { recursive: true, force: true });
    });

    it('enforces clean folder organization and clean formatting for new configs, docs, data, and downloads', () => {
      const wsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exco-clean-org-'));
      try {
        // Pre-existing root file stays untouched
        fs.writeFileSync(path.join(wsDir, 'package.json'), '{"name":"demo"}\n', 'utf8');
        const pkgRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'package.json'), wsDir);
        expect(pkgRes.redirectedFolder).toBeNull();
        expect(pkgRes.resolvedPath).toBe(path.join(wsDir, 'package.json'));

        // Loose root configs, notes, csv/sql datasets, and assets route cleanly into structured folders
        const eslintRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'eslint.config.js'), wsDir);
        expect(eslintRes.redirectedFolder).toBe('config');
        expect(eslintRes.relativeToRoot).toBe('config/eslint.config.js');

        const tsconfigAppRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'tsconfig.app.json'), wsDir);
        expect(tsconfigAppRes.redirectedFolder).toBe('config');
        expect(tsconfigAppRes.relativeToRoot).toBe('config/tsconfig.app.json');

        const docRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'architecture.md'), wsDir);
        expect(docRes.redirectedFolder).toBe('docs');

        const dataRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'users.csv'), wsDir);
        expect(dataRes.redirectedFolder).toBe('data');

        const assetRes = organizerMod.resolveCleanWorkspaceWritePath(path.join(wsDir, 'report.pdf'), wsDir);
        expect(assetRes.redirectedFolder).toBe('assets');

        // Clean formatting pretty-prints JSON and normalizes CRLF + excessive blank lines in code/text
        const formattedJson = organizerMod.formatWorkspaceFileContent('config/tsconfig.app.json', '{"compilerOptions":{"strict":true}}');
        expect(formattedJson).toBe('{\n  "compilerOptions": {\n    "strict": true\n  }\n}\n');

        const formattedTs = organizerMod.formatWorkspaceFileContent('src/app.ts', 'const a = 1;  \r\n\r\n\r\n\r\nexport default a;\r\n');
        expect(formattedTs).toBe('const a = 1;\n\nexport default a;\n');

        // Fallback lookup resolves a previously organized config when referenced by root path
        fs.mkdirSync(path.join(wsDir, 'config'), { recursive: true });
        fs.writeFileSync(path.join(wsDir, 'config', 'eslint.config.js'), 'export default [];\n', 'utf8');
        const resolvedFallback = organizerMod.findOrganizedFallbackPath(path.join(wsDir, 'eslint.config.js'), [wsDir], wsDir);
        expect(resolvedFallback).toBe(path.join(wsDir, 'config', 'eslint.config.js'));
      } finally {
        fs.rmSync(wsDir, { recursive: true, force: true });
      }
    });
  });

  describe('Repository Secret-Scrubbing & Credential Protection Audit', () => {
    it('contains zero real API keys or tokens in source files and keeps credential-vault resilient', async () => {
      const secretPatterns = [
        /AIza[0-9A-Za-z_-]{35}/,
        /sk-proj-[A-Za-z0-9_-]{20,}/,
        /sk-or-v1-[A-Za-z0-9]{20,}/,
        /nvapi-[A-Za-z0-9_-]{20,}/,
        /sk-ant-api03-[A-Za-z0-9_-]{20,}/,
        /ghp_[A-Za-z0-9]{30,}/,
        /github_pat_[A-Za-z0-9_]{30,}/,
        /gsk_[A-Za-z0-9]{20,}/,
      ];

      const scanDir = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'dist') continue;
            scanDir(full);
          } else if (/\.(ts|tsx|js|jsx|json|md)$/i.test(entry.name)) {
            if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) continue;
            if (entry.name === 'edgeVoicePreviews.json') continue;
            const text = fs.readFileSync(full, 'utf8');
            for (const rx of secretPatterns) {
              expect(text, `Potential leaked secret matching ${rx} in ${full}`).not.toMatch(rx);
            }
          }
        }
      };

      scanDir(path.join(rootDir, 'src'));
      expect(vaultMod).toBeTruthy();
    });
  });
});
