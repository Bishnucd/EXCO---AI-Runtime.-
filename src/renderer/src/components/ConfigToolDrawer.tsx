/**
 * EXCO Sidebar Configuration Tool Drawer
 * Dedicated slide-out panel for AI Providers, API Keys, MCP Servers, and Plugins
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Cpu,
  Key,
  Server,
  Plug,
  BarChart3,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Check,
  TestTube,
  Globe,
  Network,
  HardDrive,
  RefreshCw,
  Zap,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronRight,
  Wand2,
  ListPlus,
  Search,
  Upload,
  FileCode2,
  FolderPlus,
  RotateCcw,
  Edit2,
  Terminal,
  FileJson,
} from 'lucide-react';
import { cn, getProviderDisplayName, resolveApiKeyProfile } from '@shared/utils';
import { useThemeStore, resolveActiveWallpaper } from '../stores/themeStore';
import {
  loadPersistedSkillsState,
  savePersistedSkillsState,
  getResolvedSkills,
  parseSkillMarkdown,
  loadCustomLists,
  saveCustomLists,
  type SkillItem,
  type CustomListScope,
  type CustomList,
} from '../stores/skillsStore';
import type { AIProvider, ApiKeyEntry, MCPServerConfig } from '@shared/types';
import { VisualOverlay } from './VisualOverlay';
import { InfoTip } from './InfoTip';
import { CustomListsAccordion, CustomListModal, type ListCandidateItem } from './CustomListsBlock';
import { SkillsSection } from './SkillsSection';
import {
  CHECKLIST_COLUMNS,
  evaluateSystemModel,
  type EvaluatedSystemModel,
  type DailyBenchmarkSnapshot,
  type MajorUseCase,
} from '../utils/modelBenchmarks';

export type ConfigToolId = 'overview' | 'providers' | 'api-keys' | 'mcp' | 'plugins' | 'skills';

interface ConfigToolDrawerProps {
  activeTool: ConfigToolId;
  onClose: () => void;
}

const TOOL_META: Record<ConfigToolId, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  overview: { label: 'Overview', icon: BarChart3 },
  providers: { label: 'AI Providers', icon: Cpu },
  'api-keys': { label: 'API Keys', icon: Key },
  mcp: { label: 'MCP Servers', icon: Server },
  plugins: { label: 'Plugins', icon: Plug },
  skills: { label: 'AI Skills', icon: Wand2 },
};

const DEFAULT_PLUGINS: Array<{
  id: string;
  name: string;
  desc: string;
  source?: string;
  type?: 'local' | 'mcp' | 'workflow' | 'package' | 'gemini-extension' | 'claude-plugin' | 'openai-action';
  instructions?: string;
  enabled: boolean;
  builtIn?: boolean;
}> = [
  { id: 'chrome-devtools', name: 'Chrome DevTools Plugin', desc: 'Inspect, debug, and automate browser tasks via DevTools MCP', type: 'mcp', enabled: true, builtIn: true },
  { id: 'git-governance', name: 'Git Governance & VCS', desc: 'Track workspace repository branches, diffs, commits and rules', type: 'local', enabled: true, builtIn: true },
  { id: 'terminal-engine', name: 'Terminal & Execution Engine', desc: 'Node-pty sandboxed shell execution and output streaming', type: 'local', enabled: true, builtIn: true },
  { id: 'code-analyzer', name: 'Code Intelligence Linter', desc: 'Syntax validation, multi-language diagnostics and parsing', type: 'local', enabled: true, builtIn: true },
  { id: 'multimodal-tools', name: 'Multimodal Media Inspector', desc: 'Analyze images, documents, and media attachments', type: 'local', enabled: true, builtIn: true },
];

const MCP_PRESETS = [
  {
    id: 'filesystem',
    label: 'Filesystem',
    name: 'Filesystem',
    transport: 'stdio' as const,
    command: 'npx',
    args: '-y @modelcontextprotocol/server-filesystem "C:\\Users"',
    remoteUrl: '',
    envPairs: [] as Array<{ key: string; value: string }>,
    hint: 'Read/search/edit local directories (Claude / Gemini CLI standard)',
  },
  {
    id: 'github',
    label: 'GitHub',
    name: 'GitHub',
    transport: 'stdio' as const,
    command: 'npx',
    args: '-y @modelcontextprotocol/server-github',
    remoteUrl: '',
    envPairs: [{ key: 'GITHUB_PERSONAL_ACCESS_TOKEN', value: '' }],
    hint: 'Repos, issues, PRs, code search',
  },
  {
    id: 'playwright',
    label: 'Playwright',
    name: 'Playwright Browser',
    transport: 'stdio' as const,
    command: 'npx',
    args: '-y @playwright/mcp@latest',
    remoteUrl: '',
    envPairs: [],
    hint: 'Headless browser inspection & UI testing',
  },
  {
    id: 'fetch',
    label: 'Web Fetch',
    name: 'Web Fetch',
    transport: 'stdio' as const,
    command: 'uvx',
    args: 'mcp-server-fetch',
    remoteUrl: '',
    envPairs: [],
    hint: 'Fetch web pages cleanly as Markdown',
  },
  {
    id: 'memory',
    label: 'Memory Graph',
    name: 'Memory',
    transport: 'stdio' as const,
    command: 'npx',
    args: '-y @modelcontextprotocol/server-memory',
    remoteUrl: '',
    envPairs: [],
    hint: 'Persistent entity knowledge graph',
  },
  {
    id: 'remote',
    label: 'Remote URL (HTTP/SSE)',
    name: 'Remote MCP Server',
    transport: 'remote' as const,
    command: 'npx',
    args: '',
    remoteUrl: 'https://mcp.example.com/mcp',
    envPairs: [],
    hint: 'Connect OpenAI / Claude / Gemini hosted remote MCP URLs via mcp-remote',
  },
];

const PLUGIN_PRESETS = [
  {
    id: 'claude-plugin',
    label: 'Claude Plugin / Tool',
    type: 'claude-plugin' as const,
    name: 'Claude Code Plugin',
    source: 'https://github.com/anthropics/claude-code',
    desc: 'Anthropic plugin manifest (.claude-plugin/plugin.json) with commands, hooks, and agents',
    instructions: 'Follow plugin command schemas and invoke registered tools safely.',
  },
  {
    id: 'gemini-extension',
    label: 'Gemini Extension',
    type: 'gemini-extension' as const,
    name: 'Gemini CLI Extension',
    source: 'gemini-extension.json',
    desc: 'Google Gemini extension bundle combining context instructions and MCP tools',
    instructions: 'Inject extension context instructions before executing workspace tools.',
  },
  {
    id: 'openai-action',
    label: 'ChatGPT Action (OpenAPI)',
    type: 'openai-action' as const,
    name: 'Custom API Action',
    source: 'https://api.example.com/openapi.json',
    desc: 'OpenAI-style OpenAPI 3.1 REST connector / tool action schema',
    instructions: 'Validate parameters against OpenAPI operation schema before calling endpoint.',
  },
  {
    id: 'mcp-bundle',
    label: 'MCP Tool Plugin',
    type: 'mcp' as const,
    name: 'Custom MCP Bundle',
    source: 'npx -y @modelcontextprotocol/server-everything',
    desc: 'Wraps an MCP tool server or bridge inside EXCO Plugins',
    instructions: '',
  },
];

function parseCliArgs(input: string): string[] {
  const args: string[] = [];
  const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    args.push(match[1] ?? match[2] ?? match[3]);
  }
  return args;
}

function formatCliArgs(args: string[]): string {
  return (args || [])
    .map(a => (/\s/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a))
    .join(' ');
}

export function ConfigToolDrawer({ activeTool, onClose }: ConfigToolDrawerProps) {
  const { globalFilter, segments } = useThemeStore();

  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [mcpServers, setMcpServers] = useState<MCPServerConfig[]>([]);
  const [loading, setLoading] = useState(false);

  const [showApiKeyModal, setShowApiKeyModal] = useState<{ keyName: string } | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [newApiKey, setNewApiKey] = useState('');
  const [showKeyPassword, setShowKeyPassword] = useState(false);

  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const [testingProviderId, setTestingProviderId] = useState<string | null>(null);
  const [providerForm, setProviderForm] = useState({
    name: '',
    type: 'custom' as 'custom' | 'openrouter' | 'ollama',
    baseUrl: '',
    apiKey: '',
  });

  const [plugins, setPlugins] = useState<typeof DEFAULT_PLUGINS>(() => {
    try {
      const saved = localStorage.getItem('exco:plugins');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PLUGINS;
  });
  const [showAddPluginModal, setShowAddPluginModal] = useState(false);
  const [editingPluginId, setEditingPluginId] = useState<string | null>(null);
  const [pluginModalTab, setPluginModalTab] = useState<'guided' | 'manifest'>('guided');
  const [pluginManifestRaw, setPluginManifestRaw] = useState('');
  const [pluginFormError, setPluginFormError] = useState<string | null>(null);
  const [pluginForm, setPluginForm] = useState({
    name: '',
    type: 'local' as 'local' | 'mcp' | 'workflow' | 'package' | 'gemini-extension' | 'claude-plugin' | 'openai-action',
    source: '',
    desc: '',
    instructions: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem('exco:plugins', JSON.stringify(plugins));
    } catch {}
  }, [plugins]);

  const [customLists, setCustomLists] = useState<Record<CustomListScope, CustomList[]>>(() => loadCustomLists());
  const [listModal, setListModal] = useState<{ scope: CustomListScope; editingList: CustomList | null } | null>(null);

  const handleSaveCustomList = (name: string, itemIds: string[], editingListId?: string) => {
    if (!listModal) return;
    const scope = listModal.scope;
    setCustomLists(prev => {
      const current = prev[scope] || [];
      const nextScope = editingListId
        ? current.map(l => (l.id === editingListId ? { ...l, name, itemIds } : l))
        : [{ id: `list-${Date.now()}`, scope, name, itemIds, createdAt: Date.now() }, ...current];
      const next = { ...prev, [scope]: nextScope };
      saveCustomLists(next);
      return next;
    });
    setListModal(null);
    showNotice('success', editingListId ? `Updated list "${name}".` : `Created list "${name}".`);
  };

  const handleDeleteCustomList = (scope: CustomListScope, listId: string) => {
    setCustomLists(prev => {
      const next = { ...prev, [scope]: (prev[scope] || []).filter(l => l.id !== listId) };
      saveCustomLists(next);
      return next;
    });
    showNotice('success', 'Removed list.');
  };

  const getListCandidates = (scope: CustomListScope): ListCandidateItem[] => {
    if (scope === 'api-keys') {
      return apiKeys.map(k => ({ id: k.id, label: k.keyName, sublabel: getProviderDisplayName(k.providerId) }));
    }
    if (scope === 'plugins') {
      return plugins.map(p => ({ id: p.id, label: p.name, sublabel: p.desc }));
    }
    return getResolvedSkills(loadPersistedSkillsState()).map(s => ({
      id: s.id,
      label: s.name,
      sublabel: `${s.category}${s.subcategory ? ' · ' + s.subcategory : ''}`,
    }));
  };

  const [validatingKey, setValidatingKey] = useState<string | null>(null);
  const [deletingKeyIds, setDeletingKeyIds] = useState<Record<string, boolean>>({});
  const [keyValidationResults, setKeyValidationResults] = useState<Record<string, { valid: boolean; message: string }>>({});
  const [showMcpModal, setShowMcpModal] = useState(false);
  const [editingMcpId, setEditingMcpId] = useState<string | null>(null);
  const [mcpModalTab, setMcpModalTab] = useState<'guided' | 'json'>('guided');
  const [mcpJsonRaw, setMcpJsonRaw] = useState('');
  const [mcpFormError, setMcpFormError] = useState<string | null>(null);
  const [mcpToolsByServer, setMcpToolsByServer] = useState<Record<string, Array<{ name: string; description: string }>>>({});
  const [expandedMcpToolsId, setExpandedMcpToolsId] = useState<string | null>(null);
  const [connectingMcpId, setConnectingMcpId] = useState<string | null>(null);
  const [mcpForm, setMcpForm] = useState({
    name: '',
    transport: 'stdio' as 'stdio' | 'remote',
    command: 'npx',
    args: '',
    remoteUrl: '',
    authHeader: '',
    envPairs: [] as Array<{ key: string; value: string }>,
    envJson: '',
    envMode: 'rows' as 'rows' | 'json',
    autoConnect: false,
  });
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);

  // Overview states (daily internet benchmarks + live system models only)
  const [overviewModels, setOverviewModels] = useState<EvaluatedSystemModel[]>([]);
  const [overviewTokenStats, setOverviewTokenStats] = useState<
    Record<
      string,
      {
        used: number;
        cap: number;
        scope?: 'account' | 'platform' | 'model';
        accountUsed?: number;
        accountCap?: number | null;
        platformKey?: string;
      }
    >
  >({});
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [dailySnapshot, setDailySnapshot] = useState<DailyBenchmarkSnapshot | null>(() => {
    try {
      const cached = localStorage.getItem('exco:daily-benchmarks');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [hiddenChartModels, setHiddenChartModels] = useState<Record<string, boolean>>({});
  const [hoveredChartCol, setHoveredChartCol] = useState<number | null>(null);
  const [inventoryTierFilter, setInventoryTierFilter] = useState<'all' | 'turbo' | 'standard' | 'deep-thought'>('all');
  const [inventoryUseFilter, setInventoryUseFilter] = useState<string>('all');
  const [tokenInventoryExpanded, setTokenInventoryExpanded] = useState<boolean>(false);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState<number | null>(null);
  const [hoveredTokenPos, setHoveredTokenPos] = useState<{ left: number; top: number } | null>(null);
  const [expandedTierGroups, setExpandedTierGroups] = useState<Record<string, boolean>>({});
  const [expandedUseGroups, setExpandedUseGroups] = useState<Record<string, boolean>>({});
  const [preferredModelId, setPreferredModelId] = useState<string>(() => {
    const saved = localStorage.getItem('exco:chat:preferred-model');
    return saved && saved !== 'auto' && saved !== 'default' ? saved : 'category-best';
  });

  const syncOverviewBenchmarks = useCallback(async (forceFetch = false) => {
    setLoadingOverview(true);
    try {
      const d = new Date();
      const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      let activeSnapshot = dailySnapshot;

      if (forceFetch || !activeSnapshot || activeSnapshot.date !== todayKey) {
        try {
          const fresh = await window.exco.providers.getDailyBenchmarks();
          if (fresh && fresh.date) {
            activeSnapshot = fresh;
            setDailySnapshot(fresh);
            localStorage.setItem('exco:daily-benchmarks', JSON.stringify(fresh));
          }
        } catch {
          // Keep cached snapshot if offline
        }
      }

      const [keys, providersList] = await Promise.all([
        window.exco.keys.list().catch(() => []),
        window.exco.providers.list().catch(() => []),
      ]);

      const seenBySource = new Set<string>();
      const seenProviderModel = new Set<string>();
      const evaluated: EvaluatedSystemModel[] = [];
      const tokenMap: Record<
        string,
        {
          used: number;
          cap: number;
          scope?: 'account' | 'platform' | 'model';
          accountUsed?: number;
          accountCap?: number | null;
          platformKey?: string;
        }
      > = {};
      let colorIdx = 0;

      const appendModels = (models: any[], sourceId: string, sourceName: string, defaultProviderType: string, isProviderFallback = false) => {
        if (!Array.isArray(models)) return;
        for (const m of models) {
          if (!m?.id || m.id === 'auto') continue;
          const provId = m.providerId || defaultProviderType;
          const provModelKey = `${provId}:${m.id}`;
          if (isProviderFallback && seenProviderModel.has(provModelKey)) continue;
          const sourceKey = `${sourceId}:${m.id}`;
          if (seenBySource.has(sourceKey)) continue;
          seenBySource.add(sourceKey);
          seenProviderModel.add(provModelKey);
          evaluated.push(evaluateSystemModel(m, sourceId, sourceName, colorIdx++, activeSnapshot?.telemetryById));
          const mUsed = Number((m as any).tokensUsed) || 0;
          const mCap = Number((m as any).tokenCap || m.contextWindow) || 128000;
          tokenMap[sourceKey] = {
            used: mUsed,
            cap: Math.max(mUsed, mCap),
            scope: (m as any).tokenCapScope || 'model',
            accountUsed: Number((m as any).accountTokensUsed) || 0,
            accountCap: (m as any).accountTokenCap ?? null,
            platformKey: (m as any).platformKey || undefined,
          };
        }
      };

      const keyById = new Map<string, any>((Array.isArray(keys) ? keys : []).map((k: any) => [k.id, k]));
      if (Array.isArray(keys) && keys.length > 0) {
        const allKeyModels = await window.exco.providers.listModels({ allKeys: true }).catch(() => []);
        const grouped = new Map<string, any[]>();
        for (const m of Array.isArray(allKeyModels) ? allKeyModels : []) {
          const kId = (m as any).keyId || (m as any).providerId || 'default';
          const bucket = grouped.get(kId) || [];
          bucket.push(m);
          grouped.set(kId, bucket);
        }
        for (const k of keys) {
          appendModels(grouped.get(k.id) || [], k.id, k.keyName, k.providerId, false);
        }
        for (const [kId, bucket] of grouped.entries()) {
          if (!keyById.has(kId)) {
            appendModels(bucket, kId, bucket[0]?.keyName || kId, bucket[0]?.providerId || 'custom', false);
          }
        }
      }

      if (Array.isArray(providersList) && providersList.length > 0) {
        const enabledProvs = providersList.filter((p: any) => p?.enabled);
        const provResults = await Promise.all(
          enabledProvs.map(async (p: any) => {
            try {
              const models = await window.exco.providers.listModels({ providerId: p.id });
              return { p, models };
            } catch {
              return { p, models: Array.isArray(p.models) ? p.models : [] };
            }
          })
        );
        for (const { p, models } of provResults) {
          appendModels(models, p.id, p.name || p.type, p.type, true);
        }
      }

      setOverviewModels(evaluated);
      setOverviewTokenStats(tokenMap);
    } finally {
      setLoadingOverview(false);
    }
  }, [dailySnapshot]);

  const activeToolRef = React.useRef(activeTool);
  activeToolRef.current = activeTool;
  const overviewDirtyRef = React.useRef(false);

  useEffect(() => {
    if (activeTool === 'overview') {
      syncOverviewBenchmarks(false);
      overviewDirtyRef.current = false;
    } else {
      overviewDirtyRef.current = true;
    }
  }, [activeTool]);

  useEffect(() => {
    const onKeysChange = () => {
      if (activeToolRef.current === 'overview') {
        syncOverviewBenchmarks(false);
        overviewDirtyRef.current = false;
      } else {
        overviewDirtyRef.current = true;
      }
    };
    window.addEventListener('exco:keys-updated', onKeysChange);
    return () => window.removeEventListener('exco:keys-updated', onKeysChange);
  }, []);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setStatusNotice({ type, text });
    setTimeout(() => {
      setStatusNotice(prev => (prev?.text === text ? null : prev));
    }, 3500);
  };

  const requestInlineConfirm = (targetId: string): boolean => {
    if (confirmTargetId !== targetId) {
      setConfirmTargetId(targetId);
      setTimeout(() => {
        setConfirmTargetId(prev => (prev === targetId ? null : prev));
      }, 3000);
      return false;
    }
    setConfirmTargetId(null);
    return true;
  };

  useEffect(() => {
    loadProviders();
    loadApiKeys();
    loadMcpServers();
    const onKeysChanged = () => {
      loadProviders();
      loadApiKeys();
    };
    window.addEventListener('exco:keys-updated', onKeysChanged);
    return () => window.removeEventListener('exco:keys-updated', onKeysChanged);
  }, []);

  const loadProviders = async () => {
    try {
      const data = await window.exco.providers.list();
      setProviders(data);
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const loadApiKeys = async () => {
    try {
      const data = await window.exco.keys.list();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const loadMcpServers = async () => {
    try {
      const data = await window.exco.mcp.listServers();
      setMcpServers(data);
    } catch (error) {
      console.error('Failed to load MCP servers:', error);
    }
  };

  const handleAddProvider = async () => {
    if (!providerForm.name.trim()) return;
    setLoading(true);
    setProviderError(null);
    try {
      let normalizedUrl = providerForm.baseUrl.trim();
      if (!normalizedUrl && providerForm.type === 'openrouter') {
        normalizedUrl = 'https://openrouter.ai/api';
      } else if (!normalizedUrl && providerForm.type === 'ollama') {
        normalizedUrl = 'http://localhost:11434';
      } else if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = normalizedUrl.startsWith('localhost') || normalizedUrl.startsWith('127.0.0.1')
          ? `http://${normalizedUrl}`
          : `https://${normalizedUrl}`;
      }

      await window.exco.providers.create({
        name: providerForm.name.trim(),
        type: providerForm.type as any,
        config: { baseUrl: normalizedUrl || undefined, apiKey: providerForm.apiKey || undefined },
        models: [],
        enabled: true,
      });
      await loadProviders();
      setShowAddProviderModal(false);
      setProviderForm({ name: '', type: 'custom', baseUrl: '', apiKey: '' });
    } catch (err) {
      console.error('Failed to add provider:', err);
      setProviderError(err instanceof Error ? err.message : 'Failed to save provider');
    } finally {
      setLoading(false);
    }
  };

  const handleAddApiKey = async () => {
    if (!showApiKeyModal || !newApiKey.trim()) return;

    setLoading(true);
    setApiKeyError(null);
    try {
      const rawSecret = newApiKey.trim();
      const profile = resolveApiKeyProfile(rawSecret);
      const created = await window.exco.keys.create({
        keyName: showApiKeyModal.keyName?.trim() || 'Default Key',
        key: rawSecret,
      });
      await Promise.all([loadApiKeys(), loadProviders()]);
      window.dispatchEvent(new CustomEvent('exco:keys-updated', {
        detail: { keyId: created?.id, providerId: created?.providerId },
      }));
      const endpointNote = profile.baseUrl ? ` · Auto-configured ${profile.displayName} (${profile.baseUrl})` : ` — detected ${getProviderDisplayName(created?.providerId)}`;
      showNotice(
        'success',
        `Saved "${created?.keyName || showApiKeyModal.keyName?.trim() || 'Default Key'}"${endpointNote}.`
      );
      setShowApiKeyModal(null);
      setNewApiKey('');
    } catch (error) {
      console.error('Failed to add API key:', error);
      setApiKeyError(error instanceof Error ? error.message : 'Failed to save API key');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (deletingKeyIds[id]) return;
    if (!requestInlineConfirm(`key:${id}`)) return;
    const removedKey = apiKeys.find(k => k.id === id);
    setDeletingKeyIds(prev => ({ ...prev, [id]: true }));
    setApiKeys(prev => prev.filter(k => k.id !== id));
    setKeyValidationResults(prev => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setCustomLists(prev => {
      const hasMatch = (prev['api-keys'] || []).some(l => l.itemIds.includes(id));
      if (!hasMatch) return prev;
      const next = {
        ...prev,
        'api-keys': (prev['api-keys'] || []).map(l => ({ ...l, itemIds: l.itemIds.filter(itemId => itemId !== id) })),
      };
      saveCustomLists(next);
      return next;
    });
    try {
      await window.exco.keys.delete(id);
      window.dispatchEvent(new CustomEvent('exco:keys-updated'));
      showNotice('success', `Deleted API key${removedKey?.keyName ? ` "${removedKey.keyName}"` : ''}.`);
    } catch (error) {
      console.error('Failed to delete API key:', error);
      await loadApiKeys();
      showNotice('error', 'Failed to delete API key.');
    } finally {
      setDeletingKeyIds(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleCleanInvalidApiKeys = async () => {
    const invalidKeys = apiKeys.filter(
      k => keyValidationResults[k.id]?.valid === false || (!k.isValid && Boolean(k.lastValidated))
    );
    if (invalidKeys.length === 0) return;
    if (!requestInlineConfirm('key:clean-invalid')) return;
    const ids = new Set(invalidKeys.map(k => k.id));
    setApiKeys(prev => prev.filter(k => !ids.has(k.id)));
    setKeyValidationResults(prev => {
      const next = { ...prev };
      for (const id of ids) delete next[id];
      return next;
    });
    try {
      await Promise.all(invalidKeys.map(k => window.exco.keys.delete(k.id)));
      window.dispatchEvent(new CustomEvent('exco:keys-updated'));
      showNotice('success', `Removed ${invalidKeys.length} invalid API key${invalidKeys.length === 1 ? '' : 's'}.`);
    } catch (error) {
      console.error('Failed to clean invalid API keys:', error);
      await loadApiKeys();
      showNotice('error', 'Failed to remove some invalid API keys.');
    }
  };

  const handleValidateApiKey = async (id: string) => {
    setValidatingKey(id);
    setKeyValidationResults(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    try {
      const result = await window.exco.keys.validate(id);
      const valid = Boolean(result?.valid);
      setKeyValidationResults(prev => ({
        ...prev,
        [id]: {
          valid,
          message: valid ? 'Valid key' : result?.error || 'Invalid or unauthorized key',
        },
      }));
      await loadApiKeys();
    } catch (error) {
      console.error('Failed to validate key:', error);
      setKeyValidationResults(prev => ({
        ...prev,
        [id]: {
          valid: false,
          message: error instanceof Error ? error.message : 'Validation check failed',
        },
      }));
    } finally {
      setValidatingKey(null);
    }
  };

  const resetMcpModal = () => {
    setEditingMcpId(null);
    setMcpModalTab('guided');
    setMcpJsonRaw('');
    setMcpFormError(null);
    setMcpForm({
      name: '',
      transport: 'stdio',
      command: 'npx',
      args: '',
      remoteUrl: '',
      authHeader: '',
      envPairs: [],
      envJson: '',
      envMode: 'rows',
      autoConnect: false,
    });
  };

  const openEditMcpModal = (server: MCPServerConfig) => {
    const isRemoteBridge =
      server.command === 'npx' &&
      server.args.length >= 3 &&
      server.args[0] === '-y' &&
      server.args[1] === 'mcp-remote';
    let remoteUrl = '';
    let authHeader = '';
    if (isRemoteBridge) {
      remoteUrl = server.args[2] || '';
      const hIdx = server.args.indexOf('--header');
      if (hIdx >= 0 && server.args[hIdx + 1]) {
        authHeader = server.args[hIdx + 1];
      }
    }
    const envEntries = Object.entries(server.env || {}).map(([key, value]) => ({ key, value }));
    setEditingMcpId(server.id);
    setMcpModalTab('guided');
    setMcpJsonRaw('');
    setMcpFormError(null);
    setMcpForm({
      name: server.name,
      transport: isRemoteBridge ? 'remote' : 'stdio',
      command: server.command,
      args: formatCliArgs(server.args),
      remoteUrl,
      authHeader,
      envPairs: envEntries,
      envJson: envEntries.length > 0 ? JSON.stringify(server.env, null, 2) : '',
      envMode: 'rows',
      autoConnect: Boolean(server.autoConnect),
    });
    setShowMcpModal(true);
  };

  const buildMcpEnv = (): Record<string, string> => {
    if (mcpForm.envMode === 'json') {
      const trimmed = mcpForm.envJson.trim();
      if (!trimmed) return {};
      const parsed = JSON.parse(trimmed);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Environment Variables JSON must be a key-value object.');
      }
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (k.trim()) out[k.trim()] = String(v ?? '');
      }
      return out;
    }
    const out: Record<string, string> = {};
    for (const pair of mcpForm.envPairs) {
      const k = pair.key.trim();
      if (k) out[k] = pair.value;
    }
    return out;
  };

  const handleSaveMcpServer = async () => {
    setMcpFormError(null);
    const cleanName = mcpForm.name.trim();
    if (!cleanName) {
      setMcpFormError('Server name is required.');
      return;
    }

    let command = mcpForm.command.trim();
    let args: string[] = [];
    if (mcpForm.transport === 'remote') {
      const cleanUrl = mcpForm.remoteUrl.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) {
        setMcpFormError('Enter a valid http:// or https:// MCP endpoint URL.');
        return;
      }
      command = 'npx';
      args = ['-y', 'mcp-remote', cleanUrl];
      if (mcpForm.authHeader.trim()) {
        args.push('--header', mcpForm.authHeader.trim());
      }
    } else {
      if (!command) {
        setMcpFormError('Executable command is required (e.g. npx, uvx, node, python).');
        return;
      }
      args = parseCliArgs(mcpForm.args);
    }

    let env: Record<string, string> = {};
    try {
      env = buildMcpEnv();
    } catch (err) {
      setMcpFormError(err instanceof Error ? err.message : 'Invalid Environment Variables JSON.');
      return;
    }

    setLoading(true);
    try {
      if (editingMcpId) {
        await window.exco.mcp.updateServer({
          id: editingMcpId,
          updates: {
            name: cleanName,
            command,
            args,
            env,
            autoConnect: mcpForm.autoConnect,
          },
        });
        showNotice('success', `Updated MCP server "${cleanName}".`);
      } else {
        await window.exco.mcp.createServer({
          name: cleanName,
          command,
          args,
          env,
          enabled: true,
          autoConnect: mcpForm.autoConnect,
        });
        showNotice('success', `Added MCP server "${cleanName}".`);
      }
      await loadMcpServers();
      setShowMcpModal(false);
      resetMcpModal();
    } catch (error) {
      console.error('Failed to save MCP server:', error);
      setMcpFormError(error instanceof Error ? error.message : 'Failed to save MCP server.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportMcpJson = async () => {
    setMcpFormError(null);
    const raw = mcpJsonRaw.trim();
    if (!raw) {
      setMcpFormError('Paste a Claude Desktop / Gemini CLI / Cursor mcpServers JSON snippet.');
      return;
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setMcpFormError('Invalid JSON syntax.');
      return;
    }

    const entries: Array<{ name: string; command: string; args: string[]; env: Record<string, string> }> = [];
    const extractEntry = (name: string, cfg: any) => {
      if (!cfg || typeof cfg !== 'object') return;
      if (typeof cfg.url === 'string' && cfg.url.trim()) {
        const remoteArgs = ['-y', 'mcp-remote', cfg.url.trim()];
        if (cfg.headers && typeof cfg.headers === 'object') {
          for (const [hk, hv] of Object.entries(cfg.headers)) {
            remoteArgs.push('--header', `${hk}:${hv}`);
          }
        }
        entries.push({ name, command: 'npx', args: remoteArgs, env: cfg.env || {} });
      } else if (typeof cfg.command === 'string' && cfg.command.trim()) {
        entries.push({
          name,
          command: cfg.command.trim(),
          args: Array.isArray(cfg.args) ? cfg.args.map(String) : [],
          env: cfg.env && typeof cfg.env === 'object' ? Object.fromEntries(Object.entries(cfg.env).map(([k, v]) => [k, String(v ?? '')])) : {},
        });
      }
    };

    if (parsed.mcpServers && typeof parsed.mcpServers === 'object') {
      for (const [name, cfg] of Object.entries(parsed.mcpServers)) {
        extractEntry(name, cfg);
      }
    } else if (parsed.command || parsed.url) {
      extractEntry(parsed.name || 'Imported MCP Server', parsed);
    } else if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [name, cfg] of Object.entries(parsed)) {
        extractEntry(name, cfg);
      }
    }

    if (entries.length === 0) {
      setMcpFormError('No valid server entries with "command" or "url" found in JSON.');
      return;
    }

    setLoading(true);
    try {
      for (const item of entries) {
        await window.exco.mcp.createServer({
          name: item.name,
          command: item.command,
          args: item.args,
          env: item.env,
          enabled: true,
          autoConnect: mcpForm.autoConnect,
        });
      }
      await loadMcpServers();
      setShowMcpModal(false);
      resetMcpModal();
      showNotice('success', `Imported ${entries.length} MCP server${entries.length > 1 ? 's' : ''} from JSON.`);
    } catch (error) {
      setMcpFormError(error instanceof Error ? error.message : 'Failed to import MCP JSON.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMcpServer = async (id: string) => {
    if (!requestInlineConfirm(`mcp:${id}`)) return;
    try {
      await window.exco.mcp.deleteServer(id);
      setMcpToolsByServer(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await loadMcpServers();
      showNotice('success', 'MCP server deleted.');
    } catch (error) {
      console.error('Failed to delete MCP server:', error);
      showNotice('error', 'Failed to delete MCP server.');
    }
  };

  const handleConnectMcp = async (id: string) => {
    setConnectingMcpId(id);
    try {
      const result = await window.exco.mcp.connect(id);
      if (result.success) {
        setMcpToolsByServer(prev => ({
          ...prev,
          [id]: (result.tools || []).map((t: any) => ({ name: t.name, description: t.description || '' })),
        }));
        setExpandedMcpToolsId(id);
        showNotice('success', `Connected! Discovered ${result.tools.length} tool${result.tools.length === 1 ? '' : 's'}.`);
      } else {
        showNotice('error', `Connection failed: ${result.error}`);
      }
      await loadMcpServers();
    } catch (error) {
      console.error('Failed to connect MCP server:', error);
      showNotice('error', 'Failed to connect MCP server.');
    } finally {
      setConnectingMcpId(null);
    }
  };

  const handleDisconnectMcp = async (id: string) => {
    try {
      await window.exco.mcp.disconnect(id);
      setMcpToolsByServer(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (expandedMcpToolsId === id) setExpandedMcpToolsId(null);
      showNotice('success', 'Disconnected MCP server.');
    } catch (error) {
      console.error('Failed to disconnect MCP server:', error);
      showNotice('error', 'Failed to disconnect MCP server.');
    }
  };

  const getProviderVisuals = (providerOrType: string | AIProvider) => {
    const type = typeof providerOrType === 'string' ? providerOrType : providerOrType.type;
    const baseUrl = typeof providerOrType === 'string' ? '' : (providerOrType.config?.baseUrl || '').toLowerCase();

    switch (type) {
      case 'google':
        return {
          label: 'Google Gemini',
          Icon: Sparkles,
          iconClass: 'bg-sky-500/15 text-sky-400',
          badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        };
      case 'anthropic':
        return {
          label: 'Anthropic Claude',
          Icon: Brain,
          iconClass: 'bg-amber-500/15 text-amber-400',
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        };
      case 'openai':
        return {
          label: 'OpenAI',
          Icon: Zap,
          iconClass: 'bg-emerald-500/15 text-emerald-400',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'openrouter':
        return {
          label: 'OpenRouter',
          Icon: Network,
          iconClass: 'bg-emerald-500/15 text-emerald-500',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        };
      case 'ollama':
        return {
          label: 'Ollama Local',
          Icon: HardDrive,
          iconClass: 'bg-purple-500/15 text-purple-500',
          badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        };
      default: {
        const inferredLabel = baseUrl.includes('nvidia')
          ? 'NVIDIA NIM'
          : baseUrl.includes('groq')
          ? 'Groq'
          : baseUrl.includes('127.0.0.1:31415')
          ? 'FreeLLMAPI'
          : baseUrl.includes('deepseek')
          ? 'DeepSeek'
          : baseUrl.includes('mistral')
          ? 'Mistral AI'
          : baseUrl.includes('x.ai')
          ? 'xAI Grok'
          : baseUrl.includes('cerebras')
          ? 'Cerebras'
          : baseUrl.includes('perplexity')
          ? 'Perplexity'
          : baseUrl.includes('together')
          ? 'Together AI'
          : baseUrl.includes('fireworks')
          ? 'Fireworks AI'
          : baseUrl.includes('huggingface')
          ? 'Hugging Face'
          : 'Custom Endpoint';
        return {
          label: inferredLabel,
          Icon: Globe,
          iconClass: 'bg-sky-500/15 text-sky-500',
          badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
        };
      }
    }
  };

  const getKeyIconVisual = (providerId: string, keyName: string) => {
    const base = getProviderVisuals(providerId);
    if (providerId && providerId !== 'custom') {
      return base;
    }
    const hint = (keyName || '').toLowerCase();
    if (hint.includes('openai') || hint.includes('gpt')) return getProviderVisuals('openai');
    if (hint.includes('claude') || hint.includes('anthropic')) return getProviderVisuals('anthropic');
    if (hint.includes('gemini') || hint.includes('google')) return getProviderVisuals('google');
    if (hint.includes('openrouter')) return getProviderVisuals('openrouter');
    if (hint.includes('ollama')) return getProviderVisuals('ollama');
    if (hint.includes('deepseek') || hint.includes('cohere') || hint.includes('cloudflare')) {
      return {
        ...base,
        Icon: Key,
        iconClass: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25',
      };
    }
    if (hint.includes('aion') || hint.includes('kilo') || hint.includes('z-ai') || hint.includes('parallel')) {
      return {
        ...base,
        Icon: Key,
        iconClass: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25',
      };
    }
    return {
      ...base,
      Icon: Key,
      iconClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25',
    };
  };

  const getPluginIconClass = (type?: string) => {
    switch (type) {
      case 'mcp':
        return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25';
      case 'workflow':
        return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25';
      case 'package':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25';
      case 'gemini-extension':
        return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25';
      case 'claude-plugin':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25';
      case 'openai-action':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25';
      default:
        return 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25';
    }
  };

  const selectBestModel = (model: EvaluatedSystemModel, workflowTarget: 'turbo' | 'standard' | 'deep-thought') => {
    localStorage.setItem('exco:chat:preferred-model', model.id);
    sessionStorage.setItem('exco:chat:workflow-mode', workflowTarget);
    setPreferredModelId(model.id);
    window.dispatchEvent(
      new CustomEvent('exco:model-preference-updated', {
        detail: { scope: 'chat', modelId: model.id, workflowMode: workflowTarget },
      })
    );
    showNotice('success', `Selected "${model.name}" (${workflowTarget.toUpperCase()}) for Chat.`);
  };

  const renderOverviewSection = () => {
    const turboModels = overviewModels.filter(m => m.category === 'turbo');
    const standardModels = overviewModels.filter(m => m.category === 'standard');
    const deepModels = overviewModels.filter(m => m.category === 'deep-thought');

    const pickTop = (list: EvaluatedSystemModel[], metric: keyof EvaluatedSystemModel['scores'] | 'overall') => {
      if (list.length === 0) return null;
      return [...list].sort((a, b) =>
        metric === 'overall' ? b.overallScore - a.overallScore : b.scores[metric] - a.scores[metric]
      )[0];
    };

    const bestChat = pickTop(overviewModels, 'chat');
    const bestTurbo = pickTop(turboModels, 'speed') || pickTop(turboModels, 'overall');
    const bestStandard = pickTop(standardModels, 'overall');
    const bestDeep = pickTop(deepModels, 'reasoning') || pickTop(deepModels, 'overall');
    const bestResearch = pickTop(overviewModels, 'reasoning');
    const bestCoding = pickTop(overviewModels, 'coding');
    const bestImage = pickTop(overviewModels, 'imageGen');
    const bestVideo = pickTop(overviewModels, 'videoGen');

    const useCasesOrder: MajorUseCase[] = [
      'Coding & Agents',
      'Research & Reasoning',
      'Image Creation',
      'Video Creation',
      'Fast Chat & Drafting',
      'Chat & General',
    ];

    const filteredOverviewModels = overviewModels.filter(m => {
      if (inventoryTierFilter !== 'all' && m.category !== inventoryTierFilter) return false;
      if (inventoryUseFilter !== 'all' && m.useCase !== inventoryUseFilter) return false;
      return true;
    });

    const formatTok = (n: number): string => {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
      return String(Math.max(0, Math.round(n)));
    };

    const tokenRows = overviewModels.map(m => {
      const k = `${m.keyId || m.providerId}:${m.id}`;
      const stat = overviewTokenStats[k] || { used: 0, cap: 128000, scope: 'model' as const };
      const cap = Math.max(stat.used, stat.cap || 128000);
      const used = Math.max(0, stat.used);
      const left = Math.max(0, cap - used);
      return {
        model: m,
        cap,
        used,
        left,
        scope: stat.scope || 'model',
        accountUsed: stat.accountUsed || 0,
        accountCap: stat.accountCap ?? null,
        platformKey: stat.platformKey,
      };
    });

    const keyGroupStats = new Map<
      string,
      {
        keyId: string;
        keyLabel: string;
        modelCount: number;
        cap: number;
        used: number;
        left: number;
        seenPlatforms: Set<string>;
        accountResolved: boolean;
      }
    >();
    for (const row of tokenRows) {
      const gk = row.model.keyId || row.model.providerId || 'default';
      const gLabel = row.model.keyName || getProviderDisplayName(row.model.providerId) || gk;
      let grp = keyGroupStats.get(gk);
      if (!grp) {
        grp = {
          keyId: gk,
          keyLabel: gLabel,
          modelCount: 0,
          cap: 0,
          used: 0,
          left: 0,
          seenPlatforms: new Set<string>(),
          accountResolved: false,
        };
        keyGroupStats.set(gk, grp);
      }
      grp.modelCount += 1;
      if (row.scope === 'account') {
        if (!grp.accountResolved) {
          grp.accountResolved = true;
          const acctCap = Math.max(row.accountUsed, Number(row.accountCap || row.cap) || 0);
          const acctUsed = Math.max(0, row.accountUsed || row.used);
          grp.cap += acctCap;
          grp.used += acctUsed;
        }
      } else if (row.scope === 'platform' && row.platformKey) {
        if (!grp.seenPlatforms.has(row.platformKey)) {
          grp.seenPlatforms.add(row.platformKey);
          grp.cap += row.cap;
          grp.used += row.used;
        }
      } else {
        grp.cap += row.cap;
        grp.used += row.used;
      }
      grp.left = Math.max(0, grp.cap - grp.used);
    }
    const aggregatedKeyGroups = Array.from(keyGroupStats.values());
    const totalTokensCap = aggregatedKeyGroups.reduce((s, g) => s + g.cap, 0);
    const totalTokensUsed = aggregatedKeyGroups.reduce((s, g) => s + g.used, 0);
    const totalTokensLeft = Math.max(0, totalTokensCap - totalTokensUsed);

    const chartModels = filteredOverviewModels.slice(0, 8);
    const visibleChartModels = chartModels.filter(m => !hiddenChartModels[`${m.providerId}:${m.id}`]);

    const svgW = 820;
    const svgH = 260;
    const padL = 42;
    const padR = 26;
    const padT = 20;
    const padB = 38;
    const plotW = svgW - padL - padR;
    const plotH = svgH - padT - padB;
    const colCount = CHECKLIST_COLUMNS.length;
    const getY = (score: number) => padT + ((100 - Math.max(0, Math.min(100, score))) / 100) * plotH;

    return (
      <div className="space-y-5">
        {/* Model Token Inventory Health Bar (By API Key) + Hover Popup + Dropdown */}
        {overviewModels.length > 0 && (() => {
          const API_BAR_PALETTE = [
            '#38bdf8', // sky
            '#10b981', // emerald
            '#a855f7', // purple
            '#f59e0b', // amber
            '#ec4899', // pink
            '#6366f1', // indigo
            '#14b8a6', // teal
            '#f97316', // orange
          ];
          const apiKeyGroups = aggregatedKeyGroups;
          let runningPct = 0;
          const barSegments = apiKeyGroups.map((group, idx) => {
            const widthPct = totalTokensCap > 0 ? (group.cap / totalTokensCap) * 100 : 100 / apiKeyGroups.length;
            const midPct = runningPct + widthPct / 2;
            runningPct += widthPct;
            const color =
              idx < API_BAR_PALETTE.length
                ? API_BAR_PALETTE[idx]
                : `hsl(${Math.round((idx * 137.508) % 360)}, 75%, 52%)`;
            return { group, idx, widthPct, midPct, color };
          });
          const hoveredSeg = hoveredTokenIdx !== null ? barSegments[hoveredTokenIdx] : null;

          return (
            <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
              {/* Exact Usage Numbers Directly Above the Health Bar */}
              <div className="px-4 pt-3 pb-2.5 space-y-2 relative">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <span className="text-amber-400 font-semibold">
                      Used: {totalTokensUsed.toLocaleString()}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Left: {totalTokensLeft.toLocaleString()}
                    </span>
                    <span className="text-[rgb(var(--color-foreground-muted))]">
                      Provided: {totalTokensCap.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))]">
                    {apiKeyGroups.length} {apiKeyGroups.length === 1 ? 'API Key' : 'API Keys'} · {tokenRows.length} models
                  </span>
                </div>

                {/* Health Bar Grouped by API Key (1 color per API key; hover-only portal popup above all layers) */}
                <div
                  className="relative"
                  onMouseLeave={() => {
                    setHoveredTokenIdx(null);
                    setHoveredTokenPos(null);
                  }}
                >
                  {hoveredSeg && hoveredTokenPos && typeof document !== 'undefined' &&
                    createPortal(
                      <div
                        style={{
                          left: `${Math.max(120, Math.min(window.innerWidth - 120, hoveredTokenPos.left))}px`,
                          top: `${hoveredTokenPos.top}px`,
                        }}
                        className="pointer-events-none fixed -translate-x-1/2 z-[99999] w-60 px-3.5 py-2.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl text-xs space-y-1.5"
                      >
                        <div className="flex items-center gap-2 font-semibold text-[rgb(var(--color-foreground))] pb-1 border-b border-[rgb(var(--color-border))]">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: hoveredSeg.color }}
                          />
                          <span className="truncate">{hoveredSeg.group.keyLabel}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                          <span>Models</span>
                          <span className="text-[rgb(var(--color-foreground))] font-semibold">{hoveredSeg.group.modelCount}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                          <span>Provided</span>
                          <span className="text-sky-400 font-semibold">{hoveredSeg.group.cap.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                          <span>Used</span>
                          <span className="text-amber-400 font-semibold">{hoveredSeg.group.used.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                          <span>Left</span>
                          <span className="text-emerald-400 font-semibold">{hoveredSeg.group.left.toLocaleString()}</span>
                        </div>
                      </div>,
                      document.body
                    )}

                  <div className="w-full h-3.5 rounded-full bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] overflow-hidden flex items-stretch gap-px">
                    {barSegments.map(({ group, idx, widthPct, color }) => {
                      const isHovered = hoveredTokenIdx === idx;
                      return (
                        <div
                          key={group.keyId}
                          onMouseEnter={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredTokenIdx(idx);
                            setHoveredTokenPos({
                              left: rect.left + rect.width / 2,
                              top: rect.bottom + 8,
                            });
                          }}
                          style={{
                            width: `${widthPct}%`,
                            minWidth: '6px',
                            backgroundColor: color,
                            opacity: hoveredTokenIdx === null || isHovered ? 1 : 0.45,
                          }}
                          className="h-full transition-opacity"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Collapsible Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setTokenInventoryExpanded(prev => !prev)}
                className={cn(
                  'w-full px-4 py-2 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))] hover:bg-[rgb(var(--color-background))]/60 flex items-center justify-between gap-2 text-left transition-colors',
                  tokenInventoryExpanded ? '' : 'rounded-b-xl'
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-[rgb(var(--color-foreground-muted))] transition-transform flex-shrink-0',
                      tokenInventoryExpanded && 'rotate-180'
                    )}
                  />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    All Models Token Inventory ({tokenRows.length})
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))]">
                  {tokenInventoryExpanded ? 'Hide' : 'Show all'}
                </span>
              </button>

              {tokenInventoryExpanded && (
                <div className="border-t border-[rgb(var(--color-border))] rounded-b-xl max-h-72 overflow-y-auto divide-y divide-[rgb(var(--color-border))]">
                  <div className="px-4 py-1.5 grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] bg-[rgb(var(--color-background))]/40 sticky top-0">
                    <span>Model</span>
                    <span className="text-right min-w-[64px]">Used</span>
                    <span className="text-right min-w-[64px]">Left</span>
                  </div>
                  {tokenRows.map(({ model, used, left }) => (
                    <div
                      key={`${model.keyId || model.providerId}:${model.id}`}
                      className="px-4 py-2 grid grid-cols-[1fr_auto_auto] items-center gap-4 text-xs hover:bg-[rgb(var(--color-surface-hover))]/40"
                    >
                      <span className="truncate font-medium text-[rgb(var(--color-foreground))]">
                        {model.name}
                      </span>
                      <span className="font-mono text-[11px] text-amber-400 text-right min-w-[64px]">
                        {formatTok(used)}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 text-right min-w-[64px]">
                        {formatTok(left)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })()}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">Model Inventory &amp; Daily Internet Benchmarks</h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
              Displays only models currently active via your API keys · Daily Sync: <span className="font-mono">{dailySnapshot?.date || 'Today'}</span> ({dailySnapshot?.source || 'Verified Benchmarks'})
            </p>
          </div>
          <button
            type="button"
            onClick={() => syncOverviewBenchmarks(true)}
            disabled={loadingOverview}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50 whitespace-nowrap flex-shrink-0"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loadingOverview && 'animate-spin')} />
            <span>{loadingOverview ? 'Syncing...' : 'Sync Today\'s Benchmarks'}</span>
          </button>
        </div>

        {overviewModels.length === 0 ? (
          <div className="p-8 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-center space-y-3">
            <Key className="w-10 h-10 mx-auto opacity-35 text-[rgb(var(--color-primary))]" />
            <h4 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
              No Active Models Present on System
            </h4>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] max-w-md mx-auto leading-relaxed">
              Overview displays ratings, task winners, and the 10-checklist linear graph strictly for models available through your saved API keys. Add an API key in the Sidebar to inspect live models.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: 'api-keys' } }))}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[rgb(var(--color-primary))] text-white hover:bg-[rgb(var(--color-primary-hover))] whitespace-nowrap flex-shrink-0"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Open API Keys</span>
            </button>
          </div>
        ) : (
          <>
            {/* Summary Counts Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
                <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Total Present Models</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-foreground))] mt-0.5">{overviewModels.length}</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <p className="text-[11px] text-amber-400 flex items-center gap-1 font-medium"><Zap className="w-3 h-3" /> Turbo Tier</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-foreground))] mt-0.5">{turboModels.length}</p>
              </div>
              <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-500/5">
                <p className="text-[11px] text-sky-400 flex items-center gap-1 font-medium"><Sparkles className="w-3 h-3" /> Standard Tier</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-foreground))] mt-0.5">{standardModels.length}</p>
              </div>
              <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/5">
                <p className="text-[11px] text-purple-400 flex items-center gap-1 font-medium"><Brain className="w-3 h-3" /> Deep Thought</p>
                <p className="text-2xl font-bold text-[rgb(var(--color-foreground))] mt-0.5">{deepModels.length}</p>
              </div>
            </div>

            {/* Best Model Under Each Task / Tier (Updated Daily from Internet Telemetry) */}
            <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">Daily Best Model Pick Under Each Category</h4>
                <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Select the highest-scoring model for Chat, Research, Coding, Image Creation, Video Creation, or Speed Tier</p>
              </div>
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { title: 'Best for Chat', model: bestChat, scoreLabel: bestChat ? `Chat ${bestChat.scores.chat}/100` : '', workflow: (bestChat?.category || 'standard') as 'turbo' | 'standard' | 'deep-thought' },
                  { title: 'Best for Research', model: bestResearch, scoreLabel: bestResearch ? `Research ${bestResearch.scores.reasoning}/100` : '', workflow: 'deep-thought' as const },
                  { title: 'Best for Coding', model: bestCoding, scoreLabel: bestCoding ? `Coding ${bestCoding.scores.coding}/100` : '', workflow: 'deep-thought' as const },
                  { title: 'Best for Image Creation', model: bestImage, scoreLabel: bestImage ? `Image ${bestImage.scores.imageGen}/100` : '', workflow: 'standard' as const },
                  { title: 'Best for Video Creation', model: bestVideo, scoreLabel: bestVideo ? `Video ${bestVideo.scores.videoGen}/100` : '', workflow: 'standard' as const },
                  { title: 'Best under Turbo', model: bestTurbo, scoreLabel: bestTurbo ? `Speed ${bestTurbo.scores.speed}/100` : '', workflow: 'turbo' as const },
                  { title: 'Best under Standard', model: bestStandard, scoreLabel: bestStandard ? `Avg ${bestStandard.overallScore}/100` : '', workflow: 'standard' as const },
                  { title: 'Best under Deep Thought', model: bestDeep, scoreLabel: bestDeep ? `Logic ${bestDeep.scores.reasoning}/100` : '', workflow: 'deep-thought' as const },
                ]
                  .filter(item => item.model !== null)
                  .map(item => {
                    const m = item.model!;
                    const isActive = preferredModelId === m.id;
                    return (
                      <div key={item.title} className="p-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/50 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--color-primary))]">{item.title}</p>
                          <p className="text-xs font-semibold text-[rgb(var(--color-foreground))] truncate">{m.name}</p>
                          <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">{item.scoreLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectBestModel(m, item.workflow)}
                          className={cn(
                            'inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap flex-shrink-0',
                            isActive
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                              : 'bg-[rgb(var(--color-primary))] border-transparent text-white hover:bg-[rgb(var(--color-primary-hover))]'
                          )}
                        >
                          {isActive && <Check className="w-3.5 h-3.5" />}
                          <span>{isActive ? 'Selected' : 'Select'}</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* 10-Checklist Line-Bar Benchmark Graph (0-100) with Tier & Major Use Filter Dropdowns */}
            <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Benchmark Line-Bar Graph (10 Checklists · Score out of 100)
                  </h4>
                  <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
                    Grouped vertical bars per model with active group average trend line
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={inventoryTierFilter}
                    onChange={e => setInventoryTierFilter(e.target.value as any)}
                    className="text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1"
                    title="Filter models by tier"
                  >
                    <option value="all">All Tiers ({overviewModels.length})</option>
                    <option value="turbo">Turbo ({turboModels.length})</option>
                    <option value="standard">Standard ({standardModels.length})</option>
                    <option value="deep-thought">Deep Thought ({deepModels.length})</option>
                  </select>
                  <select
                    value={inventoryUseFilter}
                    onChange={e => setInventoryUseFilter(e.target.value)}
                    className="text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1"
                    title="Filter models by major use case"
                  >
                    <option value="all">All Major Uses</option>
                    {useCasesOrder.map(uc => {
                      const cnt = overviewModels.filter(m => m.useCase === uc).length;
                      if (cnt === 0) return null;
                      return (
                        <option key={uc} value={uc}>
                          {uc} ({cnt})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {chartModels.map(m => {
                      const key = `${m.keyId || m.providerId}:${m.id}`;
                      const hidden = Boolean(hiddenChartModels[`${m.providerId}:${m.id}`]);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setHiddenChartModels(prev => ({
                              ...prev,
                              [`${m.providerId}:${m.id}`]: !prev[`${m.providerId}:${m.id}`],
                            }))
                          }
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-opacity whitespace-nowrap',
                            hidden
                              ? 'opacity-40 border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]'
                              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]'
                          )}
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                          <span>{m.name}</span>
                          <span className="font-mono text-[10px] opacity-75">{m.overallScore}</span>
                        </button>
                      );
                    })}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[rgb(var(--color-foreground-muted))]">
                    <span className="inline-block w-4 h-0.5 bg-cyan-400" />
                    <span>Group Avg Line</span>
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  {(() => {
                    const groupStep = plotW / Math.max(1, colCount);
                    const getGroupCenterX = (colIdx: number) => padL + colIdx * groupStep + groupStep / 2;
                    const yBaseline = getY(0);
                    const modelCount = Math.max(1, visibleChartModels.length);
                    const clusterW = Math.min(groupStep * 0.78, modelCount * 11);
                    const barW = Math.max(3, Math.min(12, clusterW / modelCount - 1.5));
                    const actualClusterW = modelCount * barW + (modelCount - 1) * 1.5;

                    const avgPoints = CHECKLIST_COLUMNS.map((col, idx) => {
                      const avgScore =
                        visibleChartModels.length > 0
                          ? visibleChartModels.reduce((sum, m) => sum + m.scores[col.key], 0) / visibleChartModels.length
                          : 0;
                      return { x: getGroupCenterX(idx), y: getY(avgScore), score: Math.round(avgScore) };
                    });
                    const avgPolyline = avgPoints.map(p => `${p.x},${p.y}`).join(' ');

                    return (
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[640px] h-64 select-none">
                        {[0, 25, 50, 75, 100].map(val => {
                          const y = getY(val);
                          return (
                            <g key={val}>
                              <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeDasharray={val === 0 ? undefined : '4 4'} />
                              <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity="0.55">
                                {val}
                              </text>
                            </g>
                          );
                        })}

                        {CHECKLIST_COLUMNS.map((col, colIdx) => {
                          const centerX = getGroupCenterX(colIdx);
                          const startX = centerX - actualClusterW / 2;
                          return (
                            <g
                              key={col.key}
                              onMouseEnter={() => setHoveredChartCol(colIdx)}
                              onMouseLeave={() => setHoveredChartCol(null)}
                              className="cursor-pointer"
                            >
                              {hoveredChartCol === colIdx && (
                                <rect
                                  x={centerX - groupStep / 2}
                                  y={padT}
                                  width={groupStep}
                                  height={plotH}
                                  fill="currentColor"
                                  fillOpacity="0.06"
                                  rx="4"
                                />
                              )}
                              {visibleChartModels.map((m, mIdx) => {
                                const score = m.scores[col.key];
                                const topY = getY(score);
                                const barH = Math.max(2, yBaseline - topY);
                                const bx = startX + mIdx * (barW + 1.5);
                                return (
                                  <rect
                                    key={`${m.keyId || m.providerId}:${m.id}:${col.key}`}
                                    x={bx}
                                    y={topY}
                                    width={barW}
                                    height={barH}
                                    rx="2"
                                    fill={m.color}
                                    fillOpacity={hoveredChartCol === null || hoveredChartCol === colIdx ? 0.9 : 0.45}
                                  >
                                    <title>{`${m.name} — ${col.label}: ${score}/100 (${col.source})`}</title>
                                  </rect>
                                );
                              })}
                              <text
                                x={centerX}
                                y={svgH - 14}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight={hoveredChartCol === colIdx ? '700' : '500'}
                                fill="currentColor"
                                opacity={hoveredChartCol === colIdx ? '1' : '0.72'}
                              >
                                {col.shortLabel}
                              </text>
                            </g>
                          );
                        })}

                        {visibleChartModels.length > 0 && (
                          <g>
                            <polyline
                              fill="none"
                              stroke="#22d3ee"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={avgPolyline}
                            />
                            {avgPoints.map((pt, idx) => (
                              <circle
                                key={CHECKLIST_COLUMNS[idx].key}
                                cx={pt.x}
                                cy={pt.y}
                                r={hoveredChartCol === idx ? 5 : 3.5}
                                fill="#22d3ee"
                                stroke="rgb(15, 23, 42)"
                                strokeWidth="1.5"
                              >
                                <title>{`${CHECKLIST_COLUMNS[idx].label} Avg: ${pt.score}/100`}</title>
                              </circle>
                            ))}
                          </g>
                        )}
                      </svg>
                    );
                  })()}
                </div>

                <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-lg border border-[rgb(var(--color-border))]">
                  <table className="w-full text-xs text-left">
                    <thead className="sticky top-0 z-10 bg-[rgb(var(--color-surface-hover))] text-[11px] uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                      <tr>
                        <th className="px-3 py-2">Model</th>
                        <th className="px-2 py-2">Tier</th>
                        <th className="px-2 py-2">Major Use</th>
                        {CHECKLIST_COLUMNS.map(col => (
                          <th key={col.key} className="px-2 py-2 text-center" title={col.source}>{col.shortLabel}</th>
                        ))}
                        <th className="px-2 py-2 text-center">Avg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgb(var(--color-border))]">
                      {filteredOverviewModels.map(m => (
                        <tr key={`${m.providerId}:${m.id}`} className="hover:bg-[rgb(var(--color-surface-hover))]/60">
                          <td className="px-3 py-2 font-medium text-[rgb(var(--color-foreground))] whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                              <span>{m.name}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap">
                            <span className={cn(
                              'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase',
                              m.category === 'turbo' ? 'bg-amber-500/15 text-amber-400' : m.category === 'deep-thought' ? 'bg-purple-500/15 text-purple-400' : 'bg-sky-500/15 text-sky-400'
                            )}>
                              {m.category}
                            </span>
                          </td>
                          <td className="px-2 py-2 text-[11px] text-[rgb(var(--color-foreground-muted))] whitespace-nowrap">{m.useCase}</td>
                          {CHECKLIST_COLUMNS.map(col => (
                            <td key={col.key} className="px-2 py-2 text-center font-mono">
                              {m.scores[col.key]}
                            </td>
                          ))}
                          <td className="px-2 py-2 text-center font-mono font-bold text-[rgb(var(--color-primary))]">
                            {m.overallScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Categorized Dropdowns by Tier & Primary Use Case */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">By Tier Dropdowns (Turbo / Standard / Deep Thought)</h4>
                </div>
                <div className="p-2.5 space-y-2 text-xs">
                  {[
                    { id: 'turbo', title: 'Turbo Models', items: turboModels, badge: 'bg-amber-500/15 text-amber-400' },
                    { id: 'standard', title: 'Standard Models', items: standardModels, badge: 'bg-sky-500/15 text-sky-400' },
                    { id: 'deep-thought', title: 'Deep Thought Models', items: deepModels, badge: 'bg-purple-500/15 text-purple-400' },
                  ].map(group => {
                    const isOpen = Boolean(expandedTierGroups[group.id]);
                    return (
                      <div key={group.id} className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/40 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedTierGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }))}
                          className="w-full px-3 py-2 flex items-center justify-between gap-2 hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                        >
                          <span className="font-semibold text-[rgb(var(--color-foreground))]">{group.title}</span>
                          <span className="flex items-center gap-1.5">
                            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold', group.badge)}>{group.items.length}</span>
                            <ChevronDown className={cn('w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))] transition-transform', isOpen && 'rotate-180')} />
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-2.5 pt-1 border-t border-[rgb(var(--color-border))]/60 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                            {group.items.length === 0 ? (
                              <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">None in current keys</p>
                            ) : (
                              group.items.map(m => (
                                <button
                                  key={`${m.providerId}:${m.id}`}
                                  type="button"
                                  onClick={() => selectBestModel(m, group.id as any)}
                                  className="px-2 py-0.5 rounded bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] text-[11px] transition-colors"
                                  title="Click to select this model"
                                >
                                  {m.name} ({m.overallScore})
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">By Major Use Case Dropdowns</h4>
                </div>
                <div className="p-2.5 space-y-2 text-xs">
                  {useCasesOrder.map(useCase => {
                    const matched = overviewModels.filter(m => m.useCase === useCase);
                    if (matched.length === 0) return null;
                    const isOpen = Boolean(expandedUseGroups[useCase]);
                    return (
                      <div key={useCase} className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/40 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedUseGroups(prev => ({ ...prev, [useCase]: !prev[useCase] }))}
                          className="w-full px-3 py-2 flex items-center justify-between gap-2 hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                        >
                          <span className="font-semibold text-[rgb(var(--color-foreground))]">{useCase}</span>
                          <span className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-surface-hover))] text-[10px] font-mono text-[rgb(var(--color-foreground-muted))]">{matched.length}</span>
                            <ChevronDown className={cn('w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))] transition-transform', isOpen && 'rotate-180')} />
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-2.5 pt-1 border-t border-[rgb(var(--color-border))]/60 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto">
                            {matched.map(m => (
                              <button
                                key={`${m.providerId}:${m.id}`}
                                type="button"
                                onClick={() => selectBestModel(m, m.category)}
                                className="px-2 py-0.5 rounded bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))] text-[11px] transition-colors"
                                title="Click to select this model"
                              >
                                {m.name} ({m.overallScore})
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderProvidersSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">AI Providers</h3>
        <button
          onClick={() => {
            setProviderError(null);
            setShowAddProviderModal(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[rgb(var(--color-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-primary-hover))] transition-colors whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span>Add Provider</span>
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-8 text-[rgb(var(--color-foreground-muted))]">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No custom providers configured</p>
          <p className="text-xs mt-1">Add a unified/custom endpoint, OpenRouter, or local Ollama server</p>
        </div>
      ) : (
        <div className="space-y-3">
          {providers.map(provider => {
            const visuals = getProviderVisuals(provider);
            const ProviderIcon = visuals.Icon;
            const endpointUrl = provider.config?.baseUrl || (provider.type === 'ollama' ? 'http://localhost:11434' : provider.type === 'openrouter' ? 'https://openrouter.ai/api' : '');

            return (
              <div
                key={provider.id}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  'flex items-center justify-between gap-4',
                  provider.enabled
                    ? 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]'
                    : 'bg-[rgb(var(--color-surface-hover))] border-[rgb(var(--color-border))] opacity-60'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', visuals.iconClass)}>
                    <ProviderIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{provider.name}</p>
                      <span className={cn('px-2 py-0.5 text-[11px] font-medium rounded-full border flex-shrink-0', visuals.badgeClass)}>
                        {visuals.label}
                      </span>
                    </div>
                    {endpointUrl && (
                      <p className="text-xs font-mono text-[rgb(var(--color-foreground-muted))] truncate mt-0.5">
                        {endpointUrl}
                      </p>
                    )}
                    <p className="text-xs text-[rgb(var(--color-foreground-muted))] mt-0.5">
                      {provider.enabled ? 'Enabled' : 'Disabled'} · {provider.models?.length || 0} models
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={async () => {
                      setTestingProviderId(provider.id);
                      try {
                        const res = await window.exco.providers.test(provider.id);
                        await loadProviders();
                        window.dispatchEvent(new CustomEvent('exco:keys-updated'));
                        showNotice(
                          res?.success ? 'success' : 'error',
                          res?.success ? `${provider.name} is reachable — models refreshed.` : `Connection check failed: ${res?.error || 'Unable to reach endpoint'}`
                        );
                      } finally {
                        setTestingProviderId(null);
                      }
                    }}
                    disabled={testingProviderId === provider.id}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] rounded hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                  >
                    <TestTube className="w-4 h-4 flex-shrink-0" />
                    <span>{testingProviderId === provider.id ? 'Testing...' : 'Test'}</span>
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={provider.enabled}
                      onChange={async e => {
                        await window.exco.providers.update({ id: provider.id, updates: { enabled: e.target.checked } });
                        loadProviders();
                      }}
                      className="sr-only peer"
                    />
                      <div className={cn(
                        'w-11 h-6 bg-slate-300 dark:bg-zinc-800 border border-slate-400/60 dark:border-zinc-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                        'peer-checked:bg-emerald-500 peer-checked:border-emerald-400'
                      )} />
                  </label>
                  <button
                    onClick={async () => {
                      if (!requestInlineConfirm(`provider:${provider.id}`)) return;
                      await window.exco.providers.delete(provider.id);
                      loadProviders();
                      showNotice('success', `Removed provider "${provider.name}".`);
                    }}
                    className={cn(
                      'p-2 rounded transition-colors',
                      confirmTargetId === `provider:${provider.id}`
                        ? 'bg-red-500 text-white px-2.5 text-xs font-medium'
                        : 'text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10'
                    )}
                    title={confirmTargetId === `provider:${provider.id}` ? 'Click again to confirm delete' : 'Delete provider'}
                  >
                    {confirmTargetId === `provider:${provider.id}` ? 'Confirm' : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddProviderModal && (
        <div className="modal-overlay" onClick={() => setShowAddProviderModal(false)}>
          <div className="modal-content p-6 w-96" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4 text-[rgb(var(--color-foreground))]">Add AI Provider</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Provider Name</label>
                <input
                  type="text"
                  value={providerForm.name}
                  onChange={e => setProviderForm({ ...providerForm, name: e.target.value })}
                  placeholder="e.g. My Provider, OpenRouter, Local Ollama"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Provider Type</label>
                <select
                  value={providerForm.type}
                  onChange={e => {
                    const nextType = e.target.value as 'custom' | 'openrouter' | 'ollama';
                    const defaultUrl = nextType === 'openrouter'
                      ? 'https://openrouter.ai/api'
                      : nextType === 'ollama'
                      ? 'http://localhost:11434'
                      : '';
                    setProviderForm({
                      ...providerForm,
                      type: nextType,
                      baseUrl: defaultUrl || (providerForm.baseUrl === 'https://openrouter.ai/api' || providerForm.baseUrl === 'http://localhost:11434' ? '' : providerForm.baseUrl),
                    });
                  }}
                  className="w-full"
                >
                  <option value="custom">Custom Endpoint (Unified / REST Chat API)</option>
                  <option value="openrouter">OpenRouter</option>
                  <option value="ollama">Ollama (Local)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Base URL</label>
                <input
                  type="text"
                  value={providerForm.baseUrl}
                  onChange={e => setProviderForm({ ...providerForm, baseUrl: e.target.value })}
                  placeholder={
                    providerForm.type === 'openrouter'
                      ? 'https://openrouter.ai/api'
                      : providerForm.type === 'ollama'
                      ? 'http://localhost:11434'
                      : 'https://your-provider-endpoint/v1'
                  }
                  className="w-full text-xs font-mono"
                />
                <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] mt-1">
                  {providerForm.type === 'ollama'
                    ? 'Runs locally on your machine — no API key required.'
                    : providerForm.type === 'openrouter'
                    ? 'Unified OpenRouter API gateway.'
                    : 'Paste the base endpoint URL from your API service documentation.'}
                </p>
              </div>
              {providerError && (
                <p className="text-xs text-[rgb(var(--color-error))]">{providerError}</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddProviderModal(false);
                  setProviderError(null);
                }}
                className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProvider}
                disabled={loading || !providerForm.name.trim()}
                className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Save Provider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderApiKeyCard = (key: ApiKeyEntry) => {
    const keyVisual = getKeyIconVisual(key.providerId, key.keyName);
    return (
      <div
        key={key.id}
        className="p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn('w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0', keyVisual.iconClass)}>
            <Key className="w-5 h-5" />
          </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium truncate text-[rgb(var(--color-foreground))]">{key.keyName}</p>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-500/15 text-sky-500 dark:text-sky-400">
              {getProviderDisplayName(key.providerId)}
            </span>
          </div>
          <p className="text-xs mt-0.5 text-[rgb(var(--color-foreground-muted))]">
            <span className={cn(
              'badge',
              key.isValid ? 'badge-success' : 'badge-warning'
            )}>
              {key.isValid ? 'Valid' : 'Stored Locally'}
            </span>
            {key.lastValidated && ` • Last checked ${formatRelativeTime(key.lastValidated)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {keyValidationResults[key.id] && (
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium shadow-sm max-w-[230px]',
              keyValidationResults[key.id].valid
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'
                : 'bg-red-500/15 border-red-500/35 text-red-400'
            )}
            title={keyValidationResults[key.id].message}
          >
            <span className="truncate">
              {keyValidationResults[key.id].valid ? '✓ ' : '✕ '}
              {keyValidationResults[key.id].message}
            </span>
            <button
              type="button"
              onClick={() =>
                setKeyValidationResults(prev => {
                  const next = { ...prev };
                  delete next[key.id];
                  return next;
                })
              }
              className="opacity-70 hover:opacity-100 flex-shrink-0"
              aria-label="Dismiss validation result"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <button
          onClick={() => handleValidateApiKey(key.id)}
          disabled={validatingKey === key.id}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm border border-[rgb(var(--color-border))] rounded text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50 whitespace-nowrap flex-shrink-0"
        >
          {validatingKey === key.id ? (
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-[rgb(var(--color-primary))] border-t-transparent rounded-full animate-spin" /> Validating...</span>
          ) : (
            <>
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Validate</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleDeleteApiKey(key.id)}
          disabled={Boolean(deletingKeyIds[key.id])}
          className={cn(
            'p-2 rounded transition-colors flex-shrink-0',
            confirmTargetId === `key:${key.id}`
              ? 'bg-red-500 text-white px-2.5 text-xs font-medium'
              : 'text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10',
            deletingKeyIds[key.id] && 'opacity-50 cursor-wait'
          )}
          title={confirmTargetId === `key:${key.id}` ? 'Click again to confirm delete' : 'Delete API key'}
        >
          {confirmTargetId === `key:${key.id}` ? 'Confirm' : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
    );
  };

  const renderApiKeysSection = () => {
    const detectedProviders = Array.from(new Set(apiKeys.map(k => getProviderDisplayName(k.providerId))));
    const invalidKeyCount = apiKeys.filter(
      k => keyValidationResults[k.id]?.valid === false || (!k.isValid && Boolean(k.lastValidated))
    ).length;
    const keyCardsById = new Map<string, React.ReactNode>(apiKeys.map(k => [k.id, renderApiKeyCard(k)]));
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">API Keys</h3>
            <InfoTip
              align="left"
              title="Auto-Configured Providers"
              text="Adding a key automatically detects its AI service and pre-fills extra provider metadata (including Base URL for NVIDIA NIM, Groq, OpenRouter, FreeLLMAPI, xAI, Cerebras, Together, Fireworks, and Hugging Face)."
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {invalidKeyCount > 0 && (
              <button
                type="button"
                onClick={handleCleanInvalidApiKeys}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border whitespace-nowrap transition-colors',
                  confirmTargetId === 'key:clean-invalid'
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                )}
                title="Remove all API keys that failed validation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>
                  {confirmTargetId === 'key:clean-invalid'
                    ? `Confirm Clean (${invalidKeyCount})`
                    : `Clean Invalid (${invalidKeyCount})`}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setListModal({ scope: 'api-keys', editingList: null })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] whitespace-nowrap"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create List</span>
            </button>
            <button
              onClick={() => {
                setApiKeyError(null);
                setShowApiKeyModal({ keyName: '' });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>Add Key</span>
            </button>
          </div>
        </div>

        {detectedProviders.length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-[rgb(var(--color-surface-hover))] border border-[rgb(var(--color-border))] flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[rgb(var(--color-foreground-muted))]">Detected AI Providers:</span>
            {detectedProviders.map(label => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-500 dark:text-sky-400 font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        <CustomListsAccordion
          lists={customLists['api-keys']}
          itemsById={keyCardsById}
          onEditList={list => setListModal({ scope: 'api-keys', editingList: list })}
          onDeleteList={listId => handleDeleteCustomList('api-keys', listId)}
        />

        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-[rgb(var(--color-foreground-muted))]">
            <Key className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No API keys stored</p>
            <p className="text-xs mt-1">Name and paste an API key to save it locally</p>
          </div>
        ) : (
          <div className="space-y-3">
            {apiKeys.map(renderApiKeyCard)}
          </div>
        )}

        {showApiKeyModal && (
          <div className="modal-overlay" onClick={() => { setShowApiKeyModal(null); setApiKeyError(null); }}>
            <div className="modal-content p-6 w-96" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">Add API Key</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Key Name</label>
                  <input
                    type="text"
                    value={showApiKeyModal.keyName}
                    onChange={e => setShowApiKeyModal({ ...showApiKeyModal, keyName: e.target.value })}
                    placeholder="e.g. Personal Key"
                    autoFocus
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <div className="relative">
                    <input
                      type={showKeyPassword ? 'text' : 'password'}
                      value={newApiKey}
                      onChange={e => setNewApiKey(e.target.value)}
                      placeholder="Paste your API key"
                      className="w-full pr-10 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeyPassword(!showKeyPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
                    >
                      {showKeyPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {newApiKey.trim().length > 3 && (() => {
                    const preview = resolveApiKeyProfile(newApiKey, undefined, showApiKeyModal?.keyName);
                    return (
                      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-[rgb(var(--color-surface-hover))] border border-[rgb(var(--color-border))] flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-sky-400 truncate">
                          {preview.displayName}
                        </span>
                        {preview.baseUrl && (
                          <InfoTip
                            title="Auto Base URL"
                            text={`Endpoint will auto-fill: ${preview.baseUrl}`}
                          />
                        )}
                      </div>
                    );
                  })()}
                </div>
                {apiKeyError && (
                  <p className="text-xs text-[rgb(var(--color-error))]">{apiKeyError}</p>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowApiKeyModal(null); setNewApiKey(''); setApiKeyError(null); }}
                  className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddApiKey}
                  disabled={loading || !newApiKey.trim()}
                  className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-white rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Add Key'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMcpSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">MCP Servers</h3>
          <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
            Connect stdio commands, remote URLs, or paste Claude Desktop / Gemini CLI mcpServers JSON
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetMcpModal();
            setShowMcpModal(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span>Add Server</span>
        </button>
      </div>

      {mcpServers.length === 0 ? (
        <div className="text-center py-8 text-[rgb(var(--color-foreground-muted))]">
          <Server className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No MCP servers configured</p>
          <p className="text-xs mt-1">Add presets, local stdio commands, remote HTTP/SSE URLs, or paste mcpServers JSON</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mcpServers.map(server => {
            const tools = mcpToolsByServer[server.id];
            const isConnected = Array.isArray(tools);
            const isConnecting = connectingMcpId === server.id;
            const envCount = Object.keys(server.env || {}).length;
            const isToolsExpanded = expandedMcpToolsId === server.id;
            return (
              <div
                key={server.id}
                className={cn(
                  'p-4 rounded-lg border transition-colors space-y-2.5',
                  server.enabled
                    ? 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))]'
                    : 'bg-[rgb(var(--color-surface-hover))] border-[rgb(var(--color-border))] opacity-60'
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
                      <Server className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate text-[rgb(var(--color-foreground))]">{server.name}</p>
                        {isConnected && (
                          <button
                            type="button"
                            onClick={() => setExpandedMcpToolsId(isToolsExpanded ? null : server.id)}
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                          >
                            {tools.length} tool{tools.length === 1 ? '' : 's'} active
                          </button>
                        )}
                        {envCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]">
                            {envCount} env
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[rgb(var(--color-foreground-muted))] font-mono truncate">
                        {server.command} {formatCliArgs(server.args)}
                      </p>
                      <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                        {server.enabled ? 'Enabled' : 'Disabled'} · {server.autoConnect ? 'Auto-connect' : 'Manual connect'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isConnected ? (
                      <button
                        type="button"
                        onClick={() => handleDisconnectMcp(server.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs border border-emerald-500/40 text-emerald-500 rounded-lg hover:bg-emerald-500/10 whitespace-nowrap"
                      >
                        <Plug className="w-3.5 h-3.5" />
                        <span>Disconnect</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isConnecting || !server.enabled}
                        onClick={() => handleConnectMcp(server.id)}
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50 whitespace-nowrap"
                      >
                        <Plug className="w-3.5 h-3.5" />
                        <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEditMcpModal(server)}
                      className="p-2 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] rounded"
                      title="Edit MCP Server"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={server.enabled}
                        onChange={async e => {
                          await window.exco.mcp.updateServer({ id: server.id, updates: { enabled: e.target.checked } });
                          loadMcpServers();
                        }}
                        className="sr-only peer"
                      />
                      <div className={cn(
                        'w-11 h-6 bg-slate-300 dark:bg-zinc-800 border border-slate-400/60 dark:border-zinc-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
                        'peer-checked:bg-emerald-500 peer-checked:border-emerald-400'
                      )} />
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteMcpServer(server.id)}
                      className={cn(
                        'inline-flex items-center justify-center rounded transition-colors whitespace-nowrap flex-shrink-0',
                        confirmTargetId === `mcp:${server.id}`
                          ? 'bg-red-500 text-white px-2.5 py-1.5 text-xs font-medium'
                          : 'p-2 text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10'
                      )}
                      title={confirmTargetId === `mcp:${server.id}` ? 'Click again to confirm delete' : 'Delete MCP server'}
                    >
                      {confirmTargetId === `mcp:${server.id}` ? 'Confirm' : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isConnected && isToolsExpanded && (
                  <div className="pt-2 border-t border-[rgb(var(--color-border))] space-y-1">
                    {tools.length === 0 ? (
                      <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Server connected cleanly, no tools reported.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                        {tools.map(t => (
                          <div key={t.name} className="px-2.5 py-1.5 rounded bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))]">
                            <div className="text-[11px] font-mono font-semibold text-[rgb(var(--color-foreground))] truncate">{t.name}</div>
                            {t.description && (
                              <div className="text-[10px] text-[rgb(var(--color-foreground-muted))] line-clamp-1">{t.description}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showMcpModal && (
        <div className="modal-overlay" onClick={() => { setShowMcpModal(false); resetMcpModal(); }}>
          <div className="modal-content p-6 w-full max-w-xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
                  {editingMcpId ? 'Edit MCP Server' : 'Add MCP Server'}
                </h3>
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Compatible with Claude Desktop, Gemini CLI, Cursor, and OpenAI remote MCP endpoints
                </p>
              </div>
              {!editingMcpId && (
                <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-hover))] p-1 border border-[rgb(var(--color-border))]">
                  <button
                    type="button"
                    onClick={() => { setMcpModalTab('guided'); setMcpFormError(null); }}
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      mcpModalTab === 'guided'
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Guided Setup</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMcpModalTab('json'); setMcpFormError(null); }}
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      mcpModalTab === 'json'
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    <span>Paste JSON</span>
                  </button>
                </div>
              )}
            </div>

            {mcpFormError && (
              <div className="mb-3 px-3 py-2 rounded-lg text-xs border border-red-500/30 bg-red-500/10 text-red-500">
                {mcpFormError}
              </div>
            )}

            {mcpModalTab === 'json' && !editingMcpId ? (
              <div className="space-y-3">
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Paste standard <code className="font-mono">mcpServers</code> JSON from Claude Desktop, Gemini CLI (<code className="font-mono">settings.json</code>), Cursor, or a single server config object:
                </p>
                <textarea
                  rows={10}
                  value={mcpJsonRaw}
                  onChange={e => setMcpJsonRaw(e.target.value)}
                  placeholder={`{\n  "mcpServers": {\n    "filesystem": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\\\Users"]\n    },\n    "remote-docs": {\n      "url": "https://mcp.example.com/mcp"\n    }\n  }\n}`}
                  className="w-full font-mono text-xs"
                  autoFocus
                />
                <label className="flex items-center gap-2 text-xs text-[rgb(var(--color-foreground))] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mcpForm.autoConnect}
                    onChange={e => setMcpForm(prev => ({ ...prev, autoConnect: e.target.checked }))}
                  />
                  <span>Auto-connect imported servers on EXCO startup</span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {!editingMcpId && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] mb-1.5">
                      Quick Presets
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {MCP_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setMcpFormError(null);
                            setMcpForm(prev => ({
                              ...prev,
                              name: preset.name,
                              transport: preset.transport,
                              command: preset.command,
                              args: preset.args,
                              remoteUrl: preset.remoteUrl,
                              envPairs: preset.envPairs,
                              envJson: preset.envPairs.length > 0
                                ? JSON.stringify(Object.fromEntries(preset.envPairs.map(p => [p.key, p.value])), null, 2)
                                : '',
                            }));
                          }}
                          title={preset.hint}
                          className="px-2.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-surface-hover))] text-left transition-colors"
                        >
                          <div className="text-[11px] font-semibold text-[rgb(var(--color-foreground))] truncate">{preset.label}</div>
                          <div className="text-[10px] text-[rgb(var(--color-foreground-muted))] truncate">{preset.hint}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Server Name</label>
                    <input
                      type="text"
                      value={mcpForm.name}
                      onChange={e => setMcpForm({ ...mcpForm, name: e.target.value })}
                      placeholder="e.g. GitHub Tools"
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Transport Type</label>
                    <select
                      value={mcpForm.transport}
                      onChange={e => setMcpForm({ ...mcpForm, transport: e.target.value as 'stdio' | 'remote' })}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                    >
                      <option value="stdio">Local Command (stdio)</option>
                      <option value="remote">Remote URL (HTTP / SSE via mcp-remote)</option>
                    </select>
                  </div>
                </div>

                {mcpForm.transport === 'remote' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">MCP Endpoint URL</label>
                      <input
                        type="url"
                        value={mcpForm.remoteUrl}
                        onChange={e => setMcpForm({ ...mcpForm, remoteUrl: e.target.value })}
                        placeholder="https://mcp.example.com/mcp"
                        className="w-full font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Authorization / Custom Header (optional)</label>
                      <input
                        type="text"
                        value={mcpForm.authHeader}
                        onChange={e => setMcpForm({ ...mcpForm, authHeader: e.target.value })}
                        placeholder="Authorization:Bearer your-token"
                        className="w-full font-mono text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1">Runtime / Command</label>
                        <input
                          type="text"
                          value={mcpForm.command}
                          onChange={e => setMcpForm({ ...mcpForm, command: e.target.value })}
                          placeholder="npx, uvx, node, python"
                          className="w-full font-mono text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium mb-1">Arguments (quotes supported for spaces)</label>
                        <input
                          type="text"
                          value={mcpForm.args}
                          onChange={e => setMcpForm({ ...mcpForm, args: e.target.value })}
                          placeholder='-y @modelcontextprotocol/server-filesystem "C:\Projects"'
                          className="w-full font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-medium">Environment Variables</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (mcpForm.envMode === 'rows') {
                            const obj: Record<string, string> = {};
                            mcpForm.envPairs.forEach(p => { if (p.key.trim()) obj[p.key.trim()] = p.value; });
                            setMcpForm(prev => ({
                              ...prev,
                              envMode: 'json',
                              envJson: Object.keys(obj).length > 0 ? JSON.stringify(obj, null, 2) : prev.envJson,
                            }));
                          } else {
                            try {
                              const parsed = mcpForm.envJson.trim() ? JSON.parse(mcpForm.envJson) : {};
                              setMcpForm(prev => ({
                                ...prev,
                                envMode: 'rows',
                                envPairs: Object.entries(parsed).map(([key, value]) => ({ key, value: String(value ?? '') })),
                              }));
                            } catch {
                              setMcpForm(prev => ({ ...prev, envMode: 'rows' }));
                            }
                          }
                        }}
                        className="text-[11px] text-[rgb(var(--color-accent-ink))] hover:underline"
                      >
                        {mcpForm.envMode === 'rows' ? 'Edit as JSON' : 'Edit as Key/Value'}
                      </button>
                      {mcpForm.envMode === 'rows' && (
                        <button
                          type="button"
                          onClick={() => setMcpForm(prev => ({ ...prev, envPairs: [...prev.envPairs, { key: '', value: '' }] }))}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-[rgb(var(--color-border))] text-[11px] hover:bg-[rgb(var(--color-surface-hover))]"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Var</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {mcpForm.envMode === 'json' ? (
                    <textarea
                      value={mcpForm.envJson}
                      onChange={e => setMcpForm({ ...mcpForm, envJson: e.target.value })}
                      placeholder='{"API_KEY": "value"}'
                      rows={3}
                      className="w-full font-mono text-xs"
                    />
                  ) : mcpForm.envPairs.length === 0 ? (
                    <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] px-2.5 py-2 rounded border border-dashed border-[rgb(var(--color-border))]">
                      No environment variables needed. Click <strong>Add Var</strong> to pass API tokens or secrets.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {mcpForm.envPairs.map((pair, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={pair.key}
                            onChange={e =>
                              setMcpForm(prev => ({
                                ...prev,
                                envPairs: prev.envPairs.map((p, i) => (i === idx ? { ...p, key: e.target.value } : p)),
                              }))
                            }
                            placeholder="ENV_KEY"
                            className="w-2/5 font-mono text-xs"
                          />
                          <input
                            type="text"
                            value={pair.value}
                            onChange={e =>
                              setMcpForm(prev => ({
                                ...prev,
                                envPairs: prev.envPairs.map((p, i) => (i === idx ? { ...p, value: e.target.value } : p)),
                              }))
                            }
                            placeholder="value"
                            className="flex-1 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setMcpForm(prev => ({
                                ...prev,
                                envPairs: prev.envPairs.filter((_, i) => i !== idx),
                              }))
                            }
                            className="p-1.5 text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10 rounded"
                            title="Remove variable"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 text-xs text-[rgb(var(--color-foreground))] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mcpForm.autoConnect}
                    onChange={e => setMcpForm(prev => ({ ...prev, autoConnect: e.target.checked }))}
                  />
                  <span>Auto-connect this MCP server when EXCO launches</span>
                </label>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowMcpModal(false); resetMcpModal(); }}
                className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
              >
                Cancel
              </button>
              {mcpModalTab === 'json' && !editingMcpId ? (
                <button
                  type="button"
                  onClick={handleImportMcpJson}
                  disabled={loading || !mcpJsonRaw.trim()}
                  className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50"
                >
                  {loading ? 'Importing...' : 'Import JSON'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveMcpServer}
                  disabled={loading || !mcpForm.name.trim()}
                  className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingMcpId ? 'Save Changes' : 'Add Server'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const resetPluginModal = () => {
    setEditingPluginId(null);
    setPluginModalTab('guided');
    setPluginManifestRaw('');
    setPluginFormError(null);
    setPluginForm({ name: '', type: 'local', source: '', desc: '', instructions: '' });
  };

  const openEditPluginModal = (plugin: (typeof DEFAULT_PLUGINS)[number]) => {
    setEditingPluginId(plugin.id);
    setPluginModalTab('guided');
    setPluginManifestRaw('');
    setPluginFormError(null);
    setPluginForm({
      name: plugin.name,
      type: plugin.type || 'local',
      source: plugin.source || '',
      desc: plugin.desc || '',
      instructions: plugin.instructions || '',
    });
    setShowAddPluginModal(true);
  };

  const handleSavePlugin = () => {
    setPluginFormError(null);
    if (pluginModalTab === 'manifest' && !editingPluginId) {
      const raw = pluginManifestRaw.trim();
      if (!raw) {
        setPluginFormError('Paste a plugin.json, gemini-extension.json, or OpenAPI schema.');
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        const manifestName = parsed.name || parsed.info?.title || parsed.id;
        if (!manifestName || typeof manifestName !== 'string') {
          setPluginFormError('Manifest must contain a "name" or OpenAPI "info.title" field.');
          return;
        }
        const isOpenApi = Boolean(parsed.openapi || parsed.swagger || parsed.paths);
        const inferredType = isOpenApi
          ? 'openai-action'
          : parsed.contextFileName || parsed.mcpServers
          ? 'gemini-extension'
          : parsed.commands || parsed.hooks
          ? 'claude-plugin'
          : 'local';
        const inferredSource =
          parsed.servers?.[0]?.url || parsed.repository || parsed.homepage || parsed.command || '';
        const newPlugin = {
          id: `plugin-${Date.now()}`,
          name: manifestName.trim(),
          desc: (parsed.description || parsed.info?.description || 'Imported plugin manifest').trim(),
          source: typeof inferredSource === 'string' && inferredSource ? inferredSource : undefined,
          type: inferredType as (typeof DEFAULT_PLUGINS)[number]['type'],
          instructions: typeof parsed.instructions === 'string' ? parsed.instructions : undefined,
          enabled: true,
          builtIn: false,
        };
        setPlugins(prev => [newPlugin, ...prev]);
        setShowAddPluginModal(false);
        resetPluginModal();
        showNotice('success', `Imported plugin "${newPlugin.name}".`);
      } catch {
        setPluginFormError('Manifest must be valid JSON.');
      }
      return;
    }

    const cleanName = pluginForm.name.trim();
    if (!cleanName) {
      setPluginFormError('Plugin name is required.');
      return;
    }

    if (editingPluginId) {
      setPlugins(prev =>
        prev.map(p =>
          p.id === editingPluginId
            ? {
                ...p,
                name: cleanName,
                type: pluginForm.type,
                source: pluginForm.source.trim() || undefined,
                desc: pluginForm.desc.trim() || (pluginForm.source.trim() ? `Source: ${pluginForm.source.trim()}` : 'Custom EXCO plugin'),
                instructions: pluginForm.instructions.trim() || undefined,
              }
            : p
        )
      );
      setShowAddPluginModal(false);
      resetPluginModal();
      showNotice('success', `Updated plugin "${cleanName}".`);
      return;
    }

    const newPlugin = {
      id: `plugin-${Date.now()}`,
      name: cleanName,
      desc: pluginForm.desc.trim() || (pluginForm.source.trim() ? `Source: ${pluginForm.source.trim()}` : 'Custom EXCO plugin'),
      source: pluginForm.source.trim() || undefined,
      type: pluginForm.type,
      instructions: pluginForm.instructions.trim() || undefined,
      enabled: true,
      builtIn: false,
    };
    setPlugins(prev => [newPlugin, ...prev]);
    setShowAddPluginModal(false);
    resetPluginModal();
    showNotice('success', `Added plugin "${cleanName}".`);
  };

  const handleDeletePlugin = (id: string, name: string) => {
    if (!requestInlineConfirm(`plugin:${id}`)) return;
    setPlugins(prev => prev.filter(p => p.id !== id));
    showNotice('success', `Removed plugin "${name}".`);
  };

  const renderPluginCard = (plugin: (typeof DEFAULT_PLUGINS)[number]) => (
    <div
      key={plugin.id}
      className="p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={cn('w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0', getPluginIconClass(plugin.type))}>
          <Plug className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-sm text-[rgb(var(--color-foreground))] truncate">{plugin.name}</p>
            {plugin.type && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/15 text-sky-500 dark:text-sky-400 uppercase">
                {plugin.type}
              </span>
            )}
          </div>
          <p className="text-xs text-[rgb(var(--color-foreground-muted))]">{plugin.desc}</p>
          {plugin.source && (
            <p className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))] truncate mt-0.5">{plugin.source}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {!plugin.builtIn && (
          <button
            type="button"
            onClick={() => openEditPluginModal(plugin)}
            className="p-2 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] rounded"
            title="Edit plugin"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            checked={plugin.enabled}
            onChange={e => {
              const checked = e.target.checked;
              setPlugins(prev => prev.map(p => p.id === plugin.id ? { ...p, enabled: checked } : p));
            }}
            className="sr-only peer"
          />
          <div className={cn(
            'w-11 h-6 bg-slate-300 dark:bg-zinc-800 border border-slate-400/60 dark:border-zinc-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all',
            'peer-checked:bg-emerald-500 peer-checked:border-emerald-400'
          )} />
        </label>
        <button
          type="button"
          onClick={() => handleDeletePlugin(plugin.id, plugin.name)}
          className={cn(
            'inline-flex items-center justify-center rounded transition-colors whitespace-nowrap flex-shrink-0',
            confirmTargetId === `plugin:${plugin.id}`
              ? 'bg-red-500 text-white px-2.5 py-1.5 text-xs font-medium'
              : 'p-2 text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10'
          )}
          title={confirmTargetId === `plugin:${plugin.id}` ? 'Click again to confirm delete' : 'Remove plugin'}
        >
          {confirmTargetId === `plugin:${plugin.id}` ? 'Confirm' : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const renderPluginsSection = () => {
    const pluginCardsById = new Map<string, React.ReactNode>(plugins.map(p => [p.id, renderPluginCard(p)]));
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">Installed Plugins</h3>
              <span className="badge badge-success text-xs whitespace-nowrap">{plugins.filter(p => p.enabled).length} Active</span>
            </div>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))]">Manage Claude-style plugins, Gemini extensions, OpenAPI actions, and local bundles</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setListModal({ scope: 'plugins', editingList: null })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] whitespace-nowrap"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Create List</span>
            </button>
            <button
              type="button"
              onClick={() => { resetPluginModal(); setShowAddPluginModal(true); }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>Add Plugin</span>
            </button>
          </div>
        </div>

        <CustomListsAccordion
          lists={customLists.plugins}
          itemsById={pluginCardsById}
          onEditList={list => setListModal({ scope: 'plugins', editingList: list })}
          onDeleteList={listId => handleDeleteCustomList('plugins', listId)}
        />

        <div className="space-y-3">
          {plugins.map(renderPluginCard)}
        </div>

      {showAddPluginModal && (
        <div className="modal-overlay" onClick={() => { setShowAddPluginModal(false); resetPluginModal(); }}>
          <div className="modal-content p-6 w-full max-w-xl max-h-[88vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
                  {editingPluginId ? 'Edit Plugin' : 'Add Plugin / Extension'}
                </h3>
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Install local tools, Claude plugins, Gemini extensions, or OpenAI-style OpenAPI actions
                </p>
              </div>
              {!editingPluginId && (
                <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-hover))] p-1 border border-[rgb(var(--color-border))]">
                  <button
                    type="button"
                    onClick={() => { setPluginModalTab('guided'); setPluginFormError(null); }}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      pluginModalTab === 'guided'
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    Configure
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPluginModalTab('manifest'); setPluginFormError(null); }}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      pluginModalTab === 'manifest'
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    Import Manifest JSON
                  </button>
                </div>
              )}
            </div>

            {pluginFormError && (
              <div className="mb-3 px-3 py-2 rounded-lg text-xs border border-red-500/30 bg-red-500/10 text-red-500">
                {pluginFormError}
              </div>
            )}

            {pluginModalTab === 'manifest' && !editingPluginId ? (
              <div className="space-y-3">
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Paste a <code className="font-mono">plugin.json</code> (Claude), <code className="font-mono">gemini-extension.json</code> (Gemini), or OpenAPI JSON spec (ChatGPT Action):
                </p>
                <textarea
                  rows={10}
                  value={pluginManifestRaw}
                  onChange={e => setPluginManifestRaw(e.target.value)}
                  placeholder={`{\n  "name": "my-extension",\n  "description": "Extends workspace analysis",\n  "repository": "https://github.com/org/repo"\n}`}
                  className="w-full font-mono text-xs"
                  autoFocus
                />
              </div>
            ) : (
              <div className="space-y-4">
                {!editingPluginId && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] mb-1.5">
                      Templates
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PLUGIN_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPluginFormError(null);
                            setPluginForm({
                              name: preset.name,
                              type: preset.type,
                              source: preset.source,
                              desc: preset.desc,
                              instructions: preset.instructions,
                            });
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-surface-hover))] text-left transition-colors"
                        >
                          <div className="text-[11px] font-semibold text-[rgb(var(--color-foreground))] truncate">{preset.label}</div>
                          <div className="text-[10px] text-[rgb(var(--color-foreground-muted))] truncate">{preset.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Plugin Name</label>
                    <input
                      type="text"
                      value={pluginForm.name}
                      onChange={e => setPluginForm({ ...pluginForm, name: e.target.value })}
                      placeholder="e.g. Docker Inspector"
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Plugin Format / Type</label>
                    <select
                      value={pluginForm.type}
                      onChange={e => setPluginForm({ ...pluginForm, type: e.target.value as any })}
                      className="w-full text-xs px-2.5 py-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                    >
                      <option value="local">Local Extension / Folder</option>
                      <option value="claude-plugin">Claude Plugin (.claude-plugin)</option>
                      <option value="gemini-extension">Gemini CLI Extension</option>
                      <option value="openai-action">OpenAI Action / OpenAPI URL</option>
                      <option value="mcp">MCP Tool Plugin</option>
                      <option value="workflow">Workflow / Agent Plugin</option>
                      <option value="package">npm / uvx Package</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Source (GitHub Repo URL, OpenAPI URL, Package, or Path)</label>
                  <input
                    type="text"
                    value={pluginForm.source}
                    onChange={e => setPluginForm({ ...pluginForm, source: e.target.value })}
                    placeholder="e.g. https://github.com/org/plugin, @exco/docker-plugin, or C:\plugins\tool"
                    className="w-full font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={pluginForm.desc}
                    onChange={e => setPluginForm({ ...pluginForm, desc: e.target.value })}
                    placeholder="Short description of what this plugin adds"
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Agent Usage Notes / Instructions (optional)</label>
                  <textarea
                    rows={3}
                    value={pluginForm.instructions}
                    onChange={e => setPluginForm({ ...pluginForm, instructions: e.target.value })}
                    placeholder="Guidance for AI models when invoking this plugin or extension"
                    className="w-full font-mono text-xs"
                  />
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddPluginModal(false);
                  resetPluginModal();
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] whitespace-nowrap flex-shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlugin}
                disabled={pluginModalTab === 'manifest' ? !pluginManifestRaw.trim() : !pluginForm.name.trim()}
                className="inline-flex items-center justify-center px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 whitespace-nowrap flex-shrink-0"
              >
                {pluginModalTab === 'manifest' && !editingPluginId
                  ? 'Import Manifest'
                  : editingPluginId
                  ? 'Save Changes'
                  : 'Add Plugin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  const modalSeg = segments.modalSurface;
  const hasGlobalBackdrop = Boolean(resolveActiveWallpaper(globalFilter));
  const hasModalOverride = Boolean(
    modalSeg?.bgImage ||
    (modalSeg?.grain ?? 0) > 0.005 ||
    (modalSeg?.tintOpacity ?? 0) > 0.005
  );
  const modalStyle = modalSeg
    ? {
        backgroundColor: modalSeg.bg || undefined,
        color: modalSeg.text || undefined,
        borderColor: modalSeg.border || undefined,
      }
    : undefined;

  const ActiveIcon = TOOL_META[activeTool].icon;

  return (
    <aside
      className={cn(
        'settings-drawer overflow-hidden flex flex-col',
        !modalSeg?.bg && hasGlobalBackdrop && 'bg-[rgb(var(--color-surface))]/85 backdrop-blur-md'
      )}
      style={modalStyle}
    >
      {hasModalOverride && (
        <VisualOverlay
          grain={modalSeg?.grain}
          tintColor={modalSeg?.tintColor}
          tintOpacity={modalSeg?.tintOpacity}
          bgImage={modalSeg?.bgImage}
          bgImageOpacity={modalSeg?.bgImageOpacity}
          bgImageBlur={modalSeg?.bgImageBlur}
          bgImageFit={modalSeg?.bgImageFit}
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-between p-4 border-b border-[rgb(var(--color-border))]">
        <div className="flex items-center gap-2">
          <ActiveIcon className="w-5 h-5 text-[rgb(var(--color-accent-ink))]" />
          <h2 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">{TOOL_META[activeTool].label}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        {statusNotice && (
          <div
            className={cn(
              'mb-4 px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between',
              statusNotice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            )}
          >
            <span>{statusNotice.text}</span>
            <button type="button" onClick={() => setStatusNotice(null)} className="ml-2 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {activeTool === 'overview' && renderOverviewSection()}
        {activeTool === 'providers' && renderProvidersSection()}
        {activeTool === 'api-keys' && renderApiKeysSection()}
        {activeTool === 'mcp' && renderMcpSection()}
        {activeTool === 'plugins' && renderPluginsSection()}
        {activeTool === 'skills' && (
          <SkillsSection
            lists={customLists.skills}
            onOpenCreateList={() => setListModal({ scope: 'skills', editingList: null })}
            onEditList={list => setListModal({ scope: 'skills', editingList: list })}
            onDeleteList={listId => handleDeleteCustomList('skills', listId)}
            confirmTargetId={confirmTargetId}
            requestInlineConfirm={requestInlineConfirm}
            showNotice={showNotice}
          />
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 flex-shrink-0 p-4 border-t border-[rgb(var(--color-border))] flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]">
          Done
        </button>
      </div>

      {listModal && (
        <CustomListModal
          scope={listModal.scope}
          editingList={listModal.editingList}
          candidates={getListCandidates(listModal.scope)}
          onClose={() => setListModal(null)}
          onSave={handleSaveCustomList}
        />
      )}
    </aside>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

export default ConfigToolDrawer;
