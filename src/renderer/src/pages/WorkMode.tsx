/**
 * EXCO Work Mode Page
 * Exact replica of Chatbot interface powered by Autonomous Workspace Agents,
 * complete file/shell tools, and the 3-tier Access Limiter (Ask Every Time / Default / Turbo).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FolderOpen,
  FileText,
  Mic,
  Copy,
  Check,
  Plus,
  ArrowUp,
  ChevronDown,
  X,
  Zap,
  Brain,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Edit3,
  Search,
  Trash2,
  FolderTree,
  Play,
  Square,
  CheckCircle2,
  XCircle,
  Loader2,
  Cpu,
  RefreshCw,
  Save,
  PanelRight,
} from 'lucide-react';
import { marked } from 'marked';
import {
  cn,
  formatFileSize,
  getProviderDisplayName,
  classifyModelCategory,
  computeModelBenchmarks,
  scoreModelForWorkflowCategory,
  type ModelCategory,
} from '@shared/utils';
import type { PermissionLevel } from '@shared/types';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useThemeStore, getSegmentStyle } from '../stores/themeStore';
import { buildActiveSkillContext } from '../stores/skillsStore';
import { sanitizeHtml } from '../utils/sanitizeHtml';
import { VisualOverlay } from '../components/VisualOverlay';
import { InfoTip } from '../components/InfoTip';
import { useDismissOutside } from '../hooks/useDismissOutside';
import {
  WORKFLOW_CATEGORIES,
  formatCompactTokens,
  encodeSamplesToWavBase64,
  type WorkflowSelection,
} from '../utils/chatHelpers';

marked.setOptions({
  breaks: true,
  gfm: true,
});

interface AgentStep {
  id: string;
  tool: string;
  args: Record<string, any>;
  thought?: string;
  major: boolean;
  status: 'pending-approval' | 'running' | 'completed' | 'denied' | 'error';
  output?: string;
  error?: string;
}

interface WorkMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | any[];
  createdAt: number;
  modelId?: string;
  providerId?: string;
  status: 'pending' | 'streaming' | 'complete' | 'error';
  tokens?: { inputTokens: number; outputTokens: number; totalTokens: number };
  steps?: AgentStep[];
}

const ACCESS_LIMITER_TIERS: Array<{
  id: PermissionLevel;
  label: string;
  shortLabel: string;
  badgeClass: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: 'ask',
    label: 'Ask Every Time',
    shortLabel: 'Ask Every Time',
    badgeClass: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400',
    desc: 'Agent asks confirmation before EVERY workspace action (reads, edits, deletes, commands).',
    icon: ShieldAlert,
  },
  {
    id: 'selected-folder',
    label: 'Default (Ask Major)',
    shortLabel: 'Default',
    badgeClass: 'border-sky-500/40 bg-sky-500/15 text-sky-400',
    desc: 'Runs normal workspace reads/edits automatically; asks approval only on major actions (terminal commands, deletions, paths outside workspace).',
    icon: Shield,
  },
  {
    id: 'full-access',
    label: 'Turbo (Folder Autonomous)',
    shortLabel: 'Turbo Folder',
    badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-400',
    desc: 'Full autonomous control strictly inside the selected workspace folder only — nothing outside the folder can ever be accessed.',
    icon: ShieldCheck,
  },
];

const WORK_STARTER_PROMPTS = [
  { label: 'Audit codebase', prompt: 'Inspect this workspace directory structure and summarize architecture, key files, and any issues.' },
  { label: 'Build & test check', prompt: 'Inspect package/project configuration and run tests or build checks to verify everything works.' },
  { label: 'Implement feature', prompt: 'Help me design and implement a new feature directly in this workspace cleanly.' },
  { label: 'Fix & refactor bugs', prompt: 'Search this repository for potential bugs, edge cases, or type errors and fix them.' },
];

const WorkMode: React.FC = () => {
  const {
    projects,
    activeProjectId,
    workspace,
    selectedFile,
    selectFile,
    loadFileTree,
    getEffectiveFolders,
    setProjectConversationId,
  } = useWorkspaceStore();

  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const effectiveFolders = getEffectiveFolders();
  const primaryFolder = workspace || effectiveFolders[0]?.folder || null;

  const {
    mainCanvas,
    userBubble,
    assistantBubble,
    composer,
    modelSelector,
    chatHeader,
    globalFilter,
  } = useThemeStore(state => ({
    mainCanvas: state.segments.mainCanvas,
    userBubble: state.segments.userBubble,
    assistantBubble: state.segments.assistantBubble,
    composer: state.segments.composer,
    modelSelector: state.segments.modelSelector,
    chatHeader: state.segments.chatHeader,
    globalFilter: state.globalFilter,
  }));

  // Work conversation persistence per project
  const [workConvId, setWorkConvId] = useState<string | undefined>(() => {
    if (!activeProjectId) return undefined;
    return activeProject?.conversationId || localStorage.getItem(`exco:work-conv:${activeProjectId}`) || undefined;
  });

  const [messages, setMessages] = useState<WorkMessage[]>([]);
  const [input, setInput] = useState('');
  const [runningAgent, setRunningAgent] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [agentStatusLine, setAgentStatusLine] = useState<string>('');
  const [liveSteps, setLiveSteps] = useState<AgentStep[]>([]);
  const [openModelInfoId, setOpenModelInfoId] = useState<string | null>(null);

  useEffect(() => {
    if (!openModelInfoId) return;
    const close = () => setOpenModelInfoId(null);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [openModelInfoId]);

  // 3-Tier Access Limiter state persisted across reloads
  const [accessLevel, setAccessLevel] = useState<PermissionLevel>(() => {
    const saved = localStorage.getItem('exco:access-limiter');
    return saved === 'ask' || saved === 'selected-folder' || saved === 'full-access' ? saved : 'selected-folder';
  });
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  // Isolated Work Mode state (Keys, Models, Workflow, Attachments, Voice — separate from Chat Mode)
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [showKeySelector, setShowKeySelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const saved = localStorage.getItem('exco:work:preferred-model');
    return saved && saved !== 'default' && saved !== 'auto' ? saved : 'category-best';
  });
  const [preferredFailover, setPreferredFailover] = useState<boolean>(() => localStorage.getItem('exco:work:preferred-failover') !== 'false');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [usageSummary, setUsageSummary] = useState<{ tokensUsed: number; tokenCap: number | null; requests: number; source: string } | null>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [workflowMode, setWorkflowMode] = useState<WorkflowSelection | null>(() => {
    localStorage.removeItem('exco:work:workflow-mode');
    const saved = sessionStorage.getItem('exco:work:workflow-mode');
    if (saved === 'turbo' || saved === 'standard' || saved === 'deep-thought') return saved;
    return null;
  });
  const [modelCategoryTab, setModelCategoryTab] = useState<ModelCategory>(() => {
    const savedWf = sessionStorage.getItem('exco:work:workflow-mode');
    return savedWf === 'standard' || savedWf === 'deep-thought' ? savedWf : 'turbo';
  });
  const [showModeSelector, setShowModeSelector] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState<Array<{
    id: string;
    name: string;
    mimeType: string;
    size: number;
    base64: string;
    textContent?: string;
    imageUrl?: string;
  }>>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Voice Input state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Optional right-hand File Preview / Editor drawer when clicking files in Explorer
  const [filePanelOpen, setFilePanelOpen] = useState(false);
  const [previewFileContent, setPreviewFileContent] = useState('');
  const [previewFileModified, setPreviewFileModified] = useState(false);
  const [loadingFilePreview, setLoadingFilePreview] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accessMenuRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const modeSelectorRef = useRef<HTMLDivElement>(null);
  const activeRunIdRef = useRef<string | null>(null);
  activeRunIdRef.current = activeRunId;

  useDismissOutside(showAccessMenu, accessMenuRef, () => setShowAccessMenu(false));
  useDismissOutside(showModelSelector, modelSelectorRef, () => setShowModelSelector(false));
  useDismissOutside(showModeSelector, modeSelectorRef, () => setShowModeSelector(false));

  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const speechRecRef = useRef<any>(null);
  const speechLiveTextRef = useRef<string>('');

  // Load workspace access setting from main appConfig if available
  useEffect(() => {
    window.exco.app.getConfig().then(cfg => {
      if (cfg?.permissionLevel) {
        setAccessLevel(cfg.permissionLevel);
      }
    }).catch(() => {});
  }, []);

  const handleChangeAccessLevel = async (level: PermissionLevel) => {
    setAccessLevel(level);
    localStorage.setItem('exco:access-limiter', level);
    setShowAccessMenu(false);
    try {
      await window.exco.app.setConfig({ permissionLevel: level });
    } catch {}
  };

  // Load conversation and reset any stale in-flight run UI when active project switches
  useEffect(() => {
    setRunningAgent(false);
    setActiveRunId(null);
    activeRunIdRef.current = null;
    setAgentStatusLine('');
    setLiveSteps([]);

    if (!activeProjectId) {
      setMessages([]);
      setWorkConvId(undefined);
      return;
    }
    let cancelled = false;
    loadFileTree();
    const savedConvId =
      activeProject?.conversationId || localStorage.getItem(`exco:work-conv:${activeProjectId}`) || undefined;
    setWorkConvId(savedConvId);
    if (savedConvId) {
      window.exco.chat.getMessages(savedConvId).then(msgs => {
        if (cancelled) return;
        if (Array.isArray(msgs)) {
          setMessages(
            msgs.map(m => ({
              ...m,
              steps: Array.isArray(m.toolCalls)
                ? m.toolCalls.map((tc: any) => ({
                    id: tc.id,
                    tool: tc.name,
                    args: tc.arguments || {},
                    thought: tc.arguments?.__thought,
                    major: Boolean(tc.arguments?.__major),
                    status: tc.status === 'error' ? (String(tc.result || '').includes('denied') ? 'denied' : 'error') : 'completed',
                    output: tc.result,
                    error: tc.error,
                  }))
                : undefined,
            }))
          );
        }
      }).catch(() => {
        if (!cancelled) setMessages([]);
      });
    } else {
      setMessages([]);
    }
    return () => {
      cancelled = true;
    };
  }, [activeProjectId]);

  // Immediately abort active Work Agent UI & backend run if its project is deleted
  useEffect(() => {
    const handleProjectDeleted = (ev: Event) => {
      const detail = (ev as CustomEvent<{ projectId?: string; conversationId?: string }>).detail;
      if (!detail) return;
      if (detail.projectId === activeProjectId || (detail.conversationId && detail.conversationId === workConvId)) {
        const runningId = activeRunIdRef.current;
        activeRunIdRef.current = null;
        setActiveRunId(null);
        setRunningAgent(false);
        setLiveSteps([]);
        setAgentStatusLine('');
        setMessages([]);
        setAttachedFiles([]);
        if (runningId) {
          window.exco.work.cancelAgent(runningId).catch(() => {});
        }
      }
    };
    window.addEventListener('exco:project-deleted', handleProjectDeleted as EventListener);

    const handleSelectWorkConv = (ev: Event) => {
      const detail = (ev as CustomEvent<{ projectId?: string; conversationId?: string }>).detail;
      const currentProjectId = useWorkspaceStore.getState().activeProjectId;
      if (!detail || (detail.projectId && detail.projectId !== currentProjectId)) return;
      const targetProjId = detail.projectId || currentProjectId;
      if (!detail.conversationId) {
        if (targetProjId) localStorage.removeItem(`exco:work-conv:${targetProjId}`);
        setWorkConvId(undefined);
        setMessages([]);
        setLiveSteps([]);
        return;
      }
      if (targetProjId) localStorage.setItem(`exco:work-conv:${targetProjId}`, detail.conversationId);
      setWorkConvId(detail.conversationId);
      window.exco.chat.getMessages(detail.conversationId).then(msgs => {
        if (Array.isArray(msgs)) {
          setMessages(
            msgs.map(m => ({
              ...m,
              steps: Array.isArray(m.toolCalls)
                ? m.toolCalls.map((tc: any) => ({
                    id: tc.id,
                    tool: tc.name,
                    args: tc.arguments || {},
                    thought: tc.arguments?.__thought,
                    major: Boolean(tc.arguments?.__major),
                    status: tc.status === 'error' ? (String(tc.result || '').includes('denied') ? 'denied' : 'error') : 'completed',
                    output: tc.result,
                    error: tc.error,
                  }))
                : undefined,
            }))
          );
        }
      }).catch(() => {});
    };

    const handleWorkConvDeleted = (ev: Event) => {
      const detail = (ev as CustomEvent<{ projectId?: string; conversationId?: string }>).detail;
      if (detail?.conversationId && detail.conversationId === workConvId) {
        if (activeProjectId) localStorage.removeItem(`exco:work-conv:${activeProjectId}`);
        setWorkConvId(undefined);
        setMessages([]);
        setLiveSteps([]);
      }
    };

    window.addEventListener('exco:work-select-conversation', handleSelectWorkConv as EventListener);
    window.addEventListener('exco:work-conv-deleted', handleWorkConvDeleted as EventListener);
    return () => {
      window.removeEventListener('exco:project-deleted', handleProjectDeleted as EventListener);
      window.removeEventListener('exco:work-select-conversation', handleSelectWorkConv as EventListener);
      window.removeEventListener('exco:work-conv-deleted', handleWorkConvDeleted as EventListener);
    };
  }, [activeProjectId, workConvId]);

  // Open file preview when clicking a file in Sidebar Explorer
  useEffect(() => {
    if (!selectedFile || selectedFile.type !== 'file') return;
    setFilePanelOpen(true);
    setLoadingFilePreview(true);
    window.exco.fs.readFile(selectedFile.path).then(res => {
      setPreviewFileContent(res.encoding === 'base64' ? `[Binary file: ${selectedFile.name}]` : res.content);
      setPreviewFileModified(false);
    }).catch(err => {
      setPreviewFileContent(`// Failed to read file: ${err?.message || 'Error'}`);
    }).finally(() => setLoadingFilePreview(false));
  }, [selectedFile?.path]);

  // Subscribe to real-time autonomous agent events
  useEffect(() => {
    const unsub = window.exco.work.onAgentEvent((ev: any) => {
      if (!ev || ev.runId !== activeRunIdRef.current) return;
      if (ev.type === 'status' && ev.message) {
        setAgentStatusLine(ev.message);
      } else if ((ev.type === 'step-update' || ev.type === 'approval-required') && ev.step) {
        setLiveSteps(prev => {
          const exists = prev.some(s => s.id === ev.step.id);
          return exists ? prev.map(s => (s.id === ev.step.id ? ev.step : s)) : [...prev, ev.step];
        });
      } else if (ev.type === 'files-changed' && workspace?.path) {
        loadFileTree(workspace.path);
      }
    });
    return () => unsub();
  }, [workspace?.path, loadFileTree]);

  // Load API keys & models
  const loadApiKeys = async (preferredKeyId?: string) => {
    try {
      const keys = await window.exco.keys.list();
      const list = keys || [];
      setApiKeys(list);
      if (list.length > 0) {
        const savedKeyId = localStorage.getItem('exco:work:preferred-key-id');
        const nextKeyId =
          (preferredKeyId && list.some((k: any) => k.id === preferredKeyId) && preferredKeyId) ||
          (savedKeyId && list.some((k: any) => k.id === savedKeyId) && savedKeyId) ||
          (list.some((k: any) => k.id === selectedKeyId) && selectedKeyId) ||
          list[0].id;
        setSelectedKeyId(nextKeyId);
        if (preferredKeyId) {
          setSelectedModel('category-best');
          localStorage.setItem('exco:work:preferred-model', 'category-best');
        }
        await loadModelsAndUsage(nextKeyId);
      } else {
        setSelectedKeyId('');
        setAvailableModels([]);
        setUsageSummary(null);
      }
    } catch (err) {
      console.error('Failed to load API keys:', err);
    }
  };

  const loadModelsAndUsage = useCallback(async (keyIdOverride?: string) => {
    const activeId = keyIdOverride ?? selectedKeyId;
    if (!activeId && apiKeys.length === 0) {
      setAvailableModels([]);
      setUsageSummary(null);
      return;
    }
    setLoadingModels(true);
    try {
      const targetKeyId = activeId || apiKeys[0]?.id;
      const [models, usage] = await Promise.all([
        window.exco.providers.listModels({ allKeys: true, keyId: targetKeyId }),
        window.exco.providers.getUsage({ keyId: targetKeyId }),
      ]);
      setAvailableModels(Array.isArray(models) ? models : []);
      if (usage) setUsageSummary(usage);
    } catch (err) {
      console.error('Failed to load models/usage:', err);
    } finally {
      setLoadingModels(false);
    }
  }, [selectedKeyId, apiKeys]);

  useEffect(() => {
    if (apiKeys.length > 0 && selectedKeyId) {
      loadModelsAndUsage(selectedKeyId);
    }
  }, [selectedKeyId, apiKeys.length]);

  useEffect(() => {
    loadApiKeys();
    const handleKeysUpdate = (ev: Event) => {
      const detail = (ev as CustomEvent<{ keyId?: string }>).detail;
      loadApiKeys(detail?.keyId);
    };
    const handleModelPrefUpdate = (ev: Event) => {
      const detail = (ev as CustomEvent<{ modelId?: string; workflowMode?: WorkflowSelection }>).detail;
      if (detail?.modelId) setSelectedModel(detail.modelId);
      if (detail?.workflowMode) {
        setWorkflowMode(detail.workflowMode);
        setModelCategoryTab(detail.workflowMode);
      }
    };
    window.addEventListener('exco:keys-updated', handleKeysUpdate as EventListener);
    window.addEventListener('exco:model-preference-updated', handleModelPrefUpdate as EventListener);
    return () => {
      window.removeEventListener('exco:keys-updated', handleKeysUpdate as EventListener);
      window.removeEventListener('exco:model-preference-updated', handleModelPrefUpdate as EventListener);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveSteps]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Universal Multi-Format File Upload Handler
  const handleFilesAdded = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const loaded = await Promise.all(
      files.map(
        file =>
          new Promise<{
            id: string;
            name: string;
            mimeType: string;
            size: number;
            base64: string;
            textContent?: string;
            imageUrl?: string;
          }>(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
              const buffer = reader.result as ArrayBuffer;
              const bytes = new Uint8Array(buffer);
              let binary = '';
              const chunkSize = 0x8000;
              for (let i = 0; i < bytes.length; i += chunkSize) {
                binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
              }
              const base64 = btoa(binary);
              const mime = file.type || 'application/octet-stream';
              const isImage = mime.startsWith('image/');
              let textContent: string | undefined;
              const isTextExt = /\.(txt|md|markdown|json|csv|tsv|xml|yaml|yml|toml|ini|cfg|conf|env|log|sql|ts|tsx|js|jsx|mjs|cjs|py|java|c|cpp|h|hpp|cs|go|rs|rb|php|html|htm|css|scss|less|sh|bash|zsh|ps1|bat|svg|graphql|proto|r|swift|kt)$/i.test(
                file.name
              );
              if (!isImage && (isTextExt || mime.startsWith('text/') || file.size <= 256 * 1024)) {
                try {
                  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 250 * 1024));
                  if (!decoded.includes('\u0000')) textContent = decoded;
                } catch {}
              }
              resolve({
                id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                name: file.name,
                mimeType: mime,
                size: file.size,
                base64,
                textContent,
                imageUrl: isImage ? `data:${mime};base64,${base64}` : undefined,
              });
            };
            reader.readAsArrayBuffer(file);
          })
      )
    );
    setAttachedFiles(prev => [...prev, ...loaded]);
  };

  // Voice Input Cleanup & Handler
  const cleanupAudioCapture = () => {
    try { speechRecRef.current?.stop?.(); } catch {}
    speechRecRef.current = null;
    try { audioProcessorRef.current?.disconnect(); } catch {}
    audioProcessorRef.current = null;
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
    try {
      audioStreamRef.current?.getTracks().forEach(t => t.stop());
    } catch {}
    audioStreamRef.current = null;
  };

  useEffect(() => () => cleanupAudioCapture(), []);

  const handleToggleVoiceInput = async () => {
    if (isTranscribing) return;
    setVoiceError(null);

    if (isRecording) {
      const sampleRate = audioCtxRef.current?.sampleRate || 48000;
      const chunks = [...audioChunksRef.current];
      const liveText = speechLiveTextRef.current.trim();
      setIsRecording(false);
      cleanupAudioCapture();

      if (liveText) {
        setInput(prev => (prev ? `${prev.trimEnd()} ${liveText}` : liveText));
        speechLiveTextRef.current = '';
        textareaRef.current?.focus();
        return;
      }

      const wavBase64 = encodeSamplesToWavBase64(chunks, sampleRate);
      if (!wavBase64) {
        setVoiceError('No audio captured. Speak clearly before stopping.');
        return;
      }

      setIsTranscribing(true);
      try {
        const res = await window.exco.chat.transcribeAudio({ wavBase64, keyId: selectedKeyId || undefined });
        if (res?.text?.trim()) {
          const clean = res.text.trim();
          setInput(prev => (prev ? `${prev.trimEnd()} ${clean}` : clean));
          textareaRef.current?.focus();
        } else {
          setVoiceError(res?.error || 'Could not recognize speech.');
        }
      } catch (err: any) {
        setVoiceError(err?.message || 'Voice transcription failed.');
      } finally {
        setIsTranscribing(false);
      }
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setVoiceError('Microphone capture is not supported.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      audioChunksRef.current = [];
      speechLiveTextRef.current = '';
      processor.onaudioprocess = ev => {
        audioChunksRef.current.push(new Float32Array(ev.inputBuffer.getChannelData(0)));
      };
      source.connect(processor);
      processor.connect(ctx.destination);

      audioStreamRef.current = stream;
      audioCtxRef.current = ctx;
      audioProcessorRef.current = processor;

      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';
          rec.onresult = (event: any) => {
            let txt = '';
            for (let i = 0; i < event.results.length; i++) {
              txt += event.results[i][0].transcript + ' ';
            }
            speechLiveTextRef.current = txt.trim();
          };
          rec.onerror = () => {};
          rec.start();
          speechRecRef.current = rec;
        } catch {}
      }

      setIsRecording(true);
    } catch (err: any) {
      cleanupAudioCapture();
      setVoiceError(err?.message || 'Microphone access denied or unavailable.');
    }
  };

  const handleSelectWorkspaceFolder = async () => {
    try {
      await useWorkspaceStore.getState().selectWorkspace();
    } catch (err) {
      console.error('Failed to select workspace:', err);
    }
  };

  const handleNewWorkSession = async () => {
    if (activeProjectId) {
      localStorage.removeItem(`exco:work-conv:${activeProjectId}`);
    }
    setWorkConvId(undefined);
    setMessages([]);
    setLiveSteps([]);
    textareaRef.current?.focus();
  };

  const handleSendWorkTask = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const trimmedPrompt = (promptOverride ?? input).trim();
    if ((!trimmedPrompt && attachedFiles.length === 0) || runningAgent) return;

    if (!primaryFolder && effectiveFolders.length === 0) {
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          conversationId: workConvId || 'work',
          role: 'user',
          content: trimmedPrompt,
          createdAt: Date.now(),
          status: 'complete',
        },
        {
          id: `err-${Date.now()}`,
          conversationId: workConvId || 'work',
          role: 'assistant',
          content: '📁 **Workspace Folder Not Selected**: Click **Select Folder** in the top bar or **Open Workspace Folder** whenever you are ready to grant folder access.',
          createdAt: Date.now(),
          status: 'complete',
        },
      ]);
      if (!promptOverride) setInput('');
      return;
    }

    if (apiKeys.length === 0) {
      window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: 'api-keys' } }));
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          conversationId: workConvId || 'work',
          role: 'user',
          content: trimmedPrompt,
          createdAt: Date.now(),
          status: 'complete',
        },
        {
          id: `err-${Date.now()}`,
          conversationId: workConvId || 'work',
          role: 'assistant',
          content: '⚠️ **API Key Required**: Click **API Keys** in the **Sidebar** to add your API key before launching Workspace Agents.',
          createdAt: Date.now(),
          status: 'complete',
        },
      ]);
      if (!promptOverride) setInput('');
      return;
    }

    if (!workflowMode) {
      setShowModeSelector(true);
      return;
    }

    const selectedModelObj = availableModels.find((m: any) => m.id === selectedModel);
    const activeKeyObj =
      (selectedModelObj?.keyId ? apiKeys.find((k: any) => k.id === selectedModelObj.keyId) : undefined) ||
      apiKeys.find((k: any) => k.id === selectedKeyId) ||
      apiKeys[0];
    const filesSnapshot = [...attachedFiles];
    const attachmentsPayload = filesSnapshot.map(f =>
      f.imageUrl
        ? { type: 'image', imageUrl: f.imageUrl, fileData: { name: f.name, mimeType: f.mimeType, size: f.size, base64: f.base64 } }
        : { type: 'file', fileData: { name: f.name, mimeType: f.mimeType, size: f.size, base64: f.base64, textContent: f.textContent } }
    );

    const runId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const tempUserId = `user-${Date.now()}`;
    const optimisticUserContent =
      attachmentsPayload.length > 0
        ? [...(trimmedPrompt ? [{ type: 'text', text: trimmedPrompt }] : []), ...attachmentsPayload]
        : trimmedPrompt;

    setMessages(prev => [
      ...prev,
      {
        id: tempUserId,
        conversationId: workConvId || 'work',
        role: 'user',
        content: optimisticUserContent,
        createdAt: Date.now(),
        status: 'complete',
      },
    ]);

    if (!promptOverride) setInput('');
    setAttachedFiles([]);
    setLiveSteps([]);
    setAgentStatusLine('Starting autonomous workspace agent...');
    setActiveRunId(runId);
    activeRunIdRef.current = runId;
    setRunningAgent(true);

    const expectedProjectId = activeProjectId;

    try {
      const response: any = await window.exco.work.runAgent({
        runId,
        conversationId: workConvId,
        workspacePath: primaryFolder!.path,
        workspacePaths: effectiveFolders.map(e => e.folder.path),
        prompt: trimmedPrompt || 'Analyze attached files in this workspace.',
        attachments: attachmentsPayload,
        keyId: activeKeyObj?.id,
        modelId: selectedModel && selectedModel !== 'auto' && selectedModel !== 'category-best' ? selectedModel : undefined,
        providerId: activeKeyObj?.providerId,
        preferredFailover,
        workflowMode,
        accessLevel,
        skillContext: buildActiveSkillContext(trimmedPrompt),
      });

      // Ignore result completely if this project/run was deleted or switched mid-flight
      if (response?.aborted || activeRunIdRef.current !== runId) {
        return;
      }

      if (response?.conversationId && expectedProjectId) {
        setWorkConvId(response.conversationId);
        localStorage.setItem(`exco:work-conv:${expectedProjectId}`, response.conversationId);
        await setProjectConversationId(expectedProjectId, response.conversationId);
        window.dispatchEvent(new CustomEvent('exco:work-conversations-updated'));
      }

      if (response?.userMessage && response?.assistantMessage) {
        const finalSteps: AgentStep[] = Array.isArray(response.steps) ? response.steps : [];
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempUserId),
          { ...response.userMessage },
          { ...response.assistantMessage, steps: finalSteps },
        ]);
      }

      if (effectiveFolders.length > 0) {
        loadFileTree();
      }
    } catch (err: any) {
      if (activeRunIdRef.current !== runId) {
        return;
      }
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          conversationId: workConvId || 'work',
          role: 'assistant',
          content: `❌ **Workspace Agent Failed**: ${err?.message || 'Unknown error'}`,
          createdAt: Date.now(),
          status: 'error',
        },
      ]);
    } finally {
      if (activeRunIdRef.current === runId) {
        setRunningAgent(false);
        setActiveRunId(null);
        activeRunIdRef.current = null;
        setAgentStatusLine('');
        setLiveSteps([]);
        textareaRef.current?.focus();
      }
    }
  };

  const handleStopAgent = async () => {
    if (activeRunId) {
      await window.exco.work.cancelAgent(activeRunId);
    }
  };

  const handleDecision = async (stepId: string, decision: 'allow-once' | 'allow-run' | 'deny') => {
    if (!activeRunId) return;
    await window.exco.work.approveAction({ runId: activeRunId, stepId, decision });
  };

  const handleSavePreviewFile = async () => {
    if (!selectedFile || !previewFileModified) return;
    await window.exco.fs.writeFile({ path: selectedFile.path, content: previewFileContent });
    setPreviewFileModified(false);
    if (workspace) loadFileTree(workspace.path);
  };

  const handleCopyMessage = (content: string | any[], msgId: string) => {
    const text =
      typeof content === 'string'
        ? content
        : content.map(p => (p.type === 'text' ? p.text : p.fileData ? `[File: ${p.fileData.name}]` : '')).filter(Boolean).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const renderMessageContent = (content: string | any[], isUser = false) => {
    if (typeof content === 'string') {
      if (isUser) {
        return <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>;
      }
      const html = sanitizeHtml(marked.parse(content) as string);
      return <div className="message-content" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (Array.isArray(content)) {
      return (
        <div className="space-y-2.5">
          {content.map((part, idx) => {
            if (part.type === 'text' && part.text) {
              if (isUser) {
                return <p key={idx} className="whitespace-pre-wrap text-[15px] leading-relaxed">{part.text}</p>;
              }
              return <div key={idx} className="message-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked.parse(part.text) as string) }} />;
            }
            if (part.type === 'image' && part.imageUrl) {
              return (
                <img
                  key={idx}
                  src={part.imageUrl}
                  alt={part.fileData?.name || 'Attached'}
                  className="max-w-xs max-h-60 rounded-xl border border-[rgb(var(--color-border))] object-cover"
                />
              );
            }
            if (part.type === 'file' && part.fileData) {
              return (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/70 text-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-medium">{part.fileData.name}</span>
                  <span className="text-[10px] opacity-70">{formatFileSize(part.fileData.size || 0)}</span>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    }
    return null;
  };

  const renderAgentStepsList = (steps: AgentStep[], isLiveTurn = false) => {
    if (!steps || steps.length === 0) return null;
    return (
      <div className="space-y-2 my-3">
        {steps.map(step => {
          const isOpen = Boolean(expandedSteps[step.id]) || step.status === 'pending-approval';
          const targetDesc =
            step.tool === 'run_command'
              ? step.args?.command
              : step.args?.path || step.args?.pattern || step.args?.dir || '.';

          const toolIcon =
            step.tool === 'run_command' ? (
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
            ) : step.tool === 'write_file' || step.tool === 'edit_file' ? (
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            ) : step.tool === 'delete_file' ? (
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            ) : step.tool === 'search_files' ? (
              <Search className="w-3.5 h-3.5 text-sky-400" />
            ) : step.tool === 'list_dir' ? (
              <FolderTree className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-sky-400" />
            );

          return (
            <div
              key={step.id}
              className={cn(
                'rounded-xl border text-xs overflow-hidden transition-colors',
                step.status === 'pending-approval'
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : step.status === 'denied' || step.status === 'error'
                  ? 'border-red-500/35 bg-red-500/5'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80'
              )}
            >
              <button
                type="button"
                onClick={() => setExpandedSteps(prev => ({ ...prev, [step.id]: !prev[step.id] }))}
                className="w-full px-3 py-2 flex items-center justify-between gap-2 text-left hover:bg-[rgb(var(--color-surface-hover))]/60 whitespace-normal"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {toolIcon}
                  <span className="font-mono font-semibold text-[rgb(var(--color-foreground))]">{step.tool}</span>
                  {step.major && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 text-[10px] font-semibold uppercase">
                      Major
                    </span>
                  )}
                  <span className="text-[rgb(var(--color-foreground-muted))] truncate font-mono">{String(targetDesc || '')}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {step.status === 'running' && <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />}
                  {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {(step.status === 'denied' || step.status === 'error') && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                  {step.status === 'pending-approval' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Needs Approval
                    </span>
                  )}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
                </div>
              </button>

              {isOpen && (
                <div className="px-3 pb-2.5 pt-1 border-t border-[rgb(var(--color-border))] space-y-2">
                  {step.thought && (
                    <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] italic">{step.thought}</p>
                  )}

                  {step.status === 'pending-approval' && isLiveTurn && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDecision(step.id, 'allow-once')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap flex-shrink-0"
                      >
                        <Play className="w-3 h-3" />
                        <span>Approve Action</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecision(step.id, 'allow-run')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-xs font-semibold whitespace-nowrap flex-shrink-0"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Allow All This Run</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDecision(step.id, 'deny')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold whitespace-nowrap flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                        <span>Deny</span>
                      </button>
                    </div>
                  )}

                  {step.output && (
                    <pre className="p-2 rounded bg-[rgb(var(--color-code-bg))] text-[11px] font-mono overflow-x-auto max-h-48 whitespace-pre-wrap">
                      {step.output}
                    </pre>
                  )}
                  {step.error && (
                    <pre className="p-2 rounded bg-red-500/10 text-red-400 text-[11px] font-mono overflow-x-auto max-h-36 whitespace-pre-wrap">
                      {step.error}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getCategoryRankedModels = useCallback(
    (category: ModelCategory) => {
      return availableModels
        .filter((m: any) => m && m.id && m.id !== 'auto')
        .map((m: any) => {
          const bench = computeModelBenchmarks(m);
          const resolvedCategory = m.category || bench.category || classifyModelCategory(m);
          const catScore =
            m.categoryScores?.[category] ??
            scoreModelForWorkflowCategory(bench.scores, bench.overallScore, category);
          const overallScore = m.overallScore ?? bench.overallScore;
          return {
            ...m,
            category: resolvedCategory,
            overallScore,
            catScore,
          };
        })
        .filter((m: any) => m.category === category)
        .sort((a: any, b: any) => (b.catScore - a.catScore) || (b.overallScore - a.overallScore));
    },
    [availableModels]
  );

  const activeTier = ACCESS_LIMITER_TIERS.find(t => t.id === accessLevel) || ACCESS_LIMITER_TIERS[1];
  const TierIcon = activeTier.icon;
  const activeWorkflowLabel = workflowMode
    ? WORKFLOW_CATEGORIES.find(w => w.id === workflowMode)?.label || 'Standard'
    : 'Select Mode';
  const activeCategoryTopModel = workflowMode ? getCategoryRankedModels(workflowMode)[0] : undefined;

  const hasActiveWallpaper =
    Boolean(globalFilter.bgImageMode === 'auto' ? globalFilter.autoWallpaperUrl : globalFilter.bgImage) &&
    (globalFilter.bgImageOpacity ?? 0) > 0.005;

  return (
    <div
      className="relative h-full w-full flex overflow-hidden bg-transparent"
      style={{
        ...getSegmentStyle(mainCanvas),
        ...(hasActiveWallpaper && !mainCanvas?.bgImage ? { backgroundColor: 'transparent' } : {}),
      }}
      onDragOver={e => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={e => {
        e.preventDefault();
        setIsDraggingFile(false);
        if (e.dataTransfer?.files?.length) {
          handleFilesAdded(e.dataTransfer.files);
        }
      }}
    >
      {(mainCanvas?.grain > 0.005 || mainCanvas?.tintOpacity > 0.005 || Boolean(mainCanvas?.bgImage)) && (
        <VisualOverlay
          grain={mainCanvas?.grain}
          tintColor={mainCanvas?.tintColor}
          tintOpacity={mainCanvas?.tintOpacity}
          bgImage={mainCanvas?.bgImage}
          bgImageOpacity={mainCanvas?.bgImageOpacity}
          bgImageBlur={mainCanvas?.bgImageBlur}
          bgImageFit={mainCanvas?.bgImageFit}
        />
      )}

      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-sky-500/15 backdrop-blur-sm border-2 border-dashed border-sky-400 flex items-center justify-center pointer-events-none">
          <div className="px-6 py-4 rounded-2xl bg-[rgb(var(--color-surface))] border border-sky-400/40 shadow-xl text-center">
            <p className="text-sm font-semibold text-sky-400">Drop files to attach to Workspace Agent</p>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] mt-1">Supports code, logs, screenshots, PDFs &amp; docs</p>
          </div>
        </div>
      )}

      {/* Main Work Agent Chat Area (Exact Replica of Chatbot Layout — zero duplicate top header) */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Messages Feed Area */}
        <div
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6"
          onClick={() => {
            setShowAccessMenu(false);
            setShowKeySelector(false);
            setShowModelSelector(false);
            setShowModeSelector(false);
          }}
        >
          {messages.length === 0 && !runningAgent ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-foreground))] tracking-tight">
                  {activeProject
                    ? `Work Agent — ${activeProject.name}`
                    : primaryFolder
                    ? `Work Agent — ${primaryFolder.name}`
                    : 'EXCO Autonomous Workspace'}
                </h2>
                <InfoTip
                  align="center"
                  title={activeProject?.name || 'EXCO Work Mode'}
                  text={
                    effectiveFolders.length > 1
                      ? `Working across ${effectiveFolders.length} project folders (${effectiveFolders.map(e => e.folder.name).join(', ')}).`
                      : primaryFolder
                      ? `Full agentic access to read files, search code, write edits, and execute builds/tests in ${primaryFolder.path}.`
                      : 'Select one or more local folders into your project to inspect codebases, run builds & tests, and execute tasks.'
                  }
                />
              </div>

              {effectiveFolders.length === 0 ? (
                <button
                  type="button"
                  onClick={handleSelectWorkspaceFolder}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold shadow-md whitespace-nowrap flex-shrink-0"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Select Folder</span>
                </button>
              ) : apiKeys.length > 0 && !workflowMode ? (
                <div className="w-full max-w-2xl rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 text-left shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Step 1 · Choose Your Workflow Mode
                  </p>
                  <p className="text-xs text-[rgb(var(--color-foreground))]/85 mt-1 leading-relaxed">
                    Select <strong>Turbo</strong>, <strong>Standard</strong>, or <strong>Deep Thought</strong> to get started. Work Agent automatically runs the top-ranked Overview model in your chosen mode and fails over across API keys if quota runs out.
                  </p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {WORKFLOW_CATEGORIES.map(wf => {
                      const Icon = wf.id === 'turbo' ? Zap : wf.id === 'deep-thought' ? Brain : Sparkles;
                      const topModel = getCategoryRankedModels(wf.id)[0];
                      return (
                        <button
                          key={wf.id}
                          type="button"
                          onClick={() => {
                            setWorkflowMode(wf.id);
                            setModelCategoryTab(wf.id);
                            setSelectedModel('category-best');
                            sessionStorage.setItem('exco:work:workflow-mode', wf.id);
                            localStorage.setItem('exco:work:preferred-model', 'category-best');
                          }}
                          className="p-3 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/70 hover:bg-[rgb(var(--color-surface-hover))] text-left whitespace-normal transition-all flex flex-col gap-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={cn('w-4 h-4 flex-shrink-0', wf.id === 'turbo' ? 'text-amber-400' : wf.id === 'deep-thought' ? 'text-purple-400' : 'text-sky-400')} />
                            <span className="text-xs font-bold text-[rgb(var(--color-foreground))]">{wf.label}</span>
                          </div>
                          <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] leading-snug">{wf.shortDesc}</p>
                          {topModel && (
                            <p className="text-[10px] font-mono text-emerald-400 truncate mt-auto pt-1">
                              Top: {topModel.name || topModel.id} ({topModel.catScore}/100)
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
                  {WORK_STARTER_PROMPTS.map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleSendWorkTask(undefined, item.prompt)}
                      className="p-3.5 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80 hover:bg-[rgb(var(--color-surface-hover))] text-left whitespace-normal transition-colors"
                    >
                      <p className="text-xs font-semibold text-[rgb(var(--color-foreground))]">{item.label}</p>
                      <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] mt-0.5 line-clamp-2">{item.prompt}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {messages.map(msg => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
                    {isUser ? (
                      <div
                        className="max-w-[82%] message-bubble user"
                        style={getSegmentStyle(userBubble)}
                      >
                        {renderMessageContent(msg.content, true)}
                      </div>
                    ) : (
                      <div
                        className="w-full message-bubble assistant space-y-2"
                        style={getSegmentStyle(assistantBubble)}
                      >
                        <div className="flex items-center justify-between gap-2 text-xs text-[rgb(var(--color-foreground-muted))]">
                          <div>
                            {msg.modelId && (
                              <div className="relative inline-block" onPointerDown={e => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setOpenModelInfoId(prev => (prev === msg.id ? null : msg.id));
                                  }}
                                  className={cn(
                                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors',
                                    openModelInfoId === msg.id
                                      ? 'bg-[rgb(var(--color-primary))]/65 border-white/25 text-white'
                                      : 'bg-[rgb(var(--color-surface))]/60 border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                                  )}
                                >
                                  <Cpu className="w-2.5 h-2.5" />
                                  <span>Model</span>
                                  <ChevronDown className={cn('w-2.5 h-2.5 transition-transform', openModelInfoId === msg.id && 'rotate-180')} />
                                </button>
                                {openModelInfoId === msg.id && (
                                  <div
                                    onClick={e => e.stopPropagation()}
                                    className="absolute left-0 top-full mt-1.5 z-40 px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl text-xs whitespace-nowrap"
                                  >
                                    <span className="text-[11px] text-[rgb(var(--color-foreground-muted))] mr-2">Model:</span>
                                    <span className="font-mono font-semibold text-[rgb(var(--color-foreground))]">{msg.modelId}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {msg.steps && msg.steps.length > 0 && renderAgentStepsList(msg.steps, false)}
                        {renderMessageContent(msg.content, false)}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Live Active Autonomous Agent Run */}
              {runningAgent && (
                <div className="w-full message-bubble assistant space-y-2" style={getSegmentStyle(assistantBubble)}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-sky-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-semibold">{agentStatusLine || 'Working in workspace...'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStopAgent}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-medium whitespace-nowrap flex-shrink-0"
                    >
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                  </div>
                  {renderAgentStepsList(liveSteps, true)}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Exact Replica Floating Pill Composer Box with Workspace Extension Strip */}
        <div className="px-4 md:px-8 pb-5 pt-2 flex-shrink-0">
          <form onSubmit={handleSendWorkTask} className="max-w-3xl mx-auto">
            {/* Attached Workspace Controls Extension on Top of Chat Composer */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={handleSelectWorkspaceFolder}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80 hover:bg-[rgb(var(--color-surface-hover))] text-xs font-medium whitespace-nowrap flex-shrink-0"
                  title={
                    effectiveFolders.length > 0
                      ? `Synced folders: ${effectiveFolders.map(e => e.folder.path).join(' | ')} — click to add another folder`
                      : 'Select folder for this project'
                  }
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[rgb(var(--color-accent-ink))]" />
                  <span className="max-w-[180px] truncate">
                    {effectiveFolders.length > 1
                      ? `${primaryFolder?.name} (+${effectiveFolders.length - 1})`
                      : primaryFolder
                      ? primaryFolder.name
                      : 'Select Folder'}
                  </span>
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleNewWorkSession}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80 text-xs font-medium text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] whitespace-nowrap flex-shrink-0"
                    title="Start a fresh workspace agent session"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>
                )}

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => setFilePanelOpen(prev => !prev)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors',
                      filePanelOpen
                        ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] font-semibold'
                        : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                  >
                    <PanelRight className="w-3.5 h-3.5" />
                    <span>File Preview</span>
                  </button>
                )}
              </div>

              {/* 3-Tier Workspace Access Limiter Extension */}
              <div className="relative" ref={accessMenuRef}>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setShowAccessMenu(prev => !prev);
                  }}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap flex-shrink-0',
                    activeTier.badgeClass
                  )}
                  title="Access Limiter: control what agent tasks require confirmation"
                >
                  <TierIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Access: {activeTier.shortLabel}</span>
                  <ChevronDown className="w-3 h-3 opacity-75" />
                </button>

                {showAccessMenu && (
                  <div
                    className="absolute right-0 bottom-full mb-2 w-80 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl py-1.5 z-50 overflow-hidden animate-scale-in"
                    style={getSegmentStyle(modelSelector)}
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                      Workspace Access Limiter
                    </div>
                    {ACCESS_LIMITER_TIERS.map(tier => {
                      const Icon = tier.icon;
                      return (
                        <div
                          key={tier.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleChangeAccessLevel(tier.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleChangeAccessLevel(tier.id);
                            }
                          }}
                          className={cn(
                            'w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none',
                            accessLevel === tier.id
                              ? 'bg-[rgb(var(--color-primary))]/65 text-white font-semibold'
                              : 'text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                          )}
                        >
                          <span className="flex items-center gap-2 min-w-0 flex-1 text-left">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold truncate">{tier.label}</span>
                          </span>
                          <InfoTip align="right" title={tier.label} text={tier.desc} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div
              className="relative rounded-3xl border border-[rgb(var(--color-border))] ui-translucent shadow-xl px-4 py-3 transition-all focus-within:border-[rgb(var(--color-primary))]"
              style={getSegmentStyle(composer)}
            >
              {apiKeys.length > 0 && !workflowMode && messages.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs">
                  <span className="font-medium text-amber-700 dark:text-amber-300">Select a workflow mode to send tasks:</span>
                  <div className="flex items-center gap-1.5">
                    {WORKFLOW_CATEGORIES.map(wf => (
                      <button
                        key={wf.id}
                        type="button"
                        onClick={() => {
                          setWorkflowMode(wf.id);
                          setModelCategoryTab(wf.id);
                          setSelectedModel('category-best');
                          sessionStorage.setItem('exco:work:workflow-mode', wf.id);
                          localStorage.setItem('exco:work:preferred-model', 'category-best');
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-surface-hover))] text-[11px] font-semibold"
                      >
                        {wf.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Attached Files Preview */}
              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {attachedFiles.map(f => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[rgb(var(--color-background))]/70 border border-[rgb(var(--color-border))] text-xs max-w-[220px]"
                    >
                      {f.imageUrl ? (
                        <img src={f.imageUrl} alt={f.name} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-sky-400 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="text-[10px] text-[rgb(var(--color-foreground-muted))]">{formatFileSize(f.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFiles(prev => prev.filter(item => item.id !== f.id))}
                        className="p-0.5 rounded hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Voice Input Status Banner */}
              {(isRecording || isTranscribing || voiceError) && (
                <div className="mb-1.5 flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg text-xs border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80">
                  <span className={cn(isRecording ? 'text-red-400 font-medium' : isTranscribing ? 'text-sky-400 font-medium' : 'text-amber-400')}>
                    {isRecording
                      ? 'Listening... Speak cleanly, then click Mic again to transcribe.'
                      : isTranscribing
                      ? 'Transcribing speech to text...'
                      : voiceError}
                  </span>
                  {voiceError && !isRecording && !isTranscribing && (
                    <button type="button" onClick={() => setVoiceError(null)} className="opacity-70 hover:opacity-100">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onPaste={e => {
                  const items = Array.from(e.clipboardData?.files || []) as File[];
                  if (items.length > 0) {
                    e.preventDefault();
                    handleFilesAdded(items);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendWorkTask();
                  }
                }}
                placeholder={
                  effectiveFolders.length > 0
                    ? `Instruct Work Agent across ${activeProject?.name || primaryFolder?.name} (${effectiveFolders.length} ${effectiveFolders.length === 1 ? 'folder' : 'folders'}, Access: ${activeTier.shortLabel})...`
                    : 'Select one or more folders into this project, then tell EXCO Work Agent what to build, inspect, or test...'
                }
                rows={1}
                className="composer-textarea w-full px-1 pt-1 pb-2 text-[15px] text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-foreground-muted))] resize-none"
                style={{ minHeight: '40px', maxHeight: '180px' }}
              />

              {/* Bottom Actions Bar (Identical to Chatbot Mode) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 relative">
                  <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.length) handleFilesAdded(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                    title="Attach any file format"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Show Add API Key button ONLY when no keys exist; once added, only models appear */}
                  {apiKeys.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: 'api-keys' } }))}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-amber-500 dark:text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 transition-colors whitespace-nowrap"
                    >
                      <span>⚠️ Add API Key</span>
                    </button>
                  ) : (
                    <div className="relative" ref={modelSelectorRef}>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          const nextOpen = !showModelSelector;
                          setShowModelSelector(nextOpen);
                          setShowKeySelector(false);
                          setShowModeSelector(false);
                          if (nextOpen) loadModelsAndUsage(selectedKeyId);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        <Cpu className="w-3.5 h-3.5 text-sky-400" />
                        <span className="truncate max-w-[160px]">
                          {selectedModel === 'category-best'
                            ? workflowMode
                              ? activeCategoryTopModel
                                ? `Best (${activeWorkflowLabel}): ${activeCategoryTopModel.name || activeCategoryTopModel.id}`
                                : `Best in ${activeWorkflowLabel}`
                              : 'Agent Models'
                            : availableModels.find((m: any) => m.id === selectedModel)?.name || selectedModel}
                        </span>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>

                      {showModelSelector && (() => {
                        const activeCategoryMeta =
                          WORKFLOW_CATEGORIES.find(w => w.id === modelCategoryTab) || WORKFLOW_CATEGORIES[0];
                        const categoryModels = getCategoryRankedModels(modelCategoryTab).filter(
                          (m: any) =>
                            !modelSearchQuery ||
                            `${m.id} ${m.name} ${m.keyName || ''} ${m.providerDisplayName || ''}`
                              .toLowerCase()
                              .includes(modelSearchQuery.toLowerCase())
                        );
                        const topInTab = categoryModels[0];
                        return (
                        <div
                          className="absolute left-0 bottom-full mb-2 w-[26rem] max-w-[92vw] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-2 z-50 animate-scale-in overflow-hidden"
                          style={getSegmentStyle(modelSelector)}
                          onClick={e => e.stopPropagation()}
                        >
                          <div className="px-3 pb-2 border-b border-[rgb(var(--color-border))] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                                Agent Models ({categoryModels.length})
                              </span>
                              <InfoTip
                                align="left"
                                title={activeCategoryMeta.label}
                                text={activeCategoryMeta.detail}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => loadModelsAndUsage()}
                              className="p-1 rounded hover:bg-[rgb(var(--color-surface-hover))]"
                              title="Refresh models"
                            >
                              <RefreshCw className={cn('w-3 h-3', loadingModels && 'animate-spin')} />
                            </button>
                          </div>

                          <div className="px-3 py-2 border-b border-[rgb(var(--color-border))] space-y-1.5">
                            <input
                              type="text"
                              value={modelSearchQuery}
                              onChange={e => setModelSearchQuery(e.target.value)}
                              placeholder="Filter models in category..."
                              className="w-full px-2.5 py-1 text-xs rounded-md bg-[rgb(var(--color-background))]"
                            />
                            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.45fr)] gap-1.5">
                              {WORKFLOW_CATEGORIES.map(wf => {
                                const wfCount = availableModels.filter((m: any) => m.id !== 'auto' && (m.category || classifyModelCategory(m)) === wf.id).length;
                                return (
                                  <button
                                    key={wf.id}
                                    type="button"
                                    onClick={() => {
                                      setModelCategoryTab(wf.id);
                                      setWorkflowMode(wf.id);
                                      sessionStorage.setItem('exco:work:workflow-mode', wf.id);
                                    }}
                                    className={cn(
                                      'min-w-0 w-full overflow-hidden inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors border whitespace-nowrap',
                                      modelCategoryTab === wf.id
                                        ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))]'
                                        : 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))]'
                                    )}
                                  >
                                    <span className="truncate">{wf.label}</span>
                                    <span className="flex-shrink-0 text-[10px] opacity-80">({wfCount})</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setSelectedModel('category-best');
                                setWorkflowMode(modelCategoryTab);
                                localStorage.setItem('exco:work:preferred-model', 'category-best');
                                sessionStorage.setItem('exco:work:workflow-mode', modelCategoryTab);
                                setShowModelSelector(false);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedModel('category-best');
                                  setWorkflowMode(modelCategoryTab);
                                  localStorage.setItem('exco:work:preferred-model', 'category-best');
                                  sessionStorage.setItem('exco:work:workflow-mode', modelCategoryTab);
                                  setShowModelSelector(false);
                                }
                              }}
                              className={cn(
                                'w-full px-2.5 py-1.5 text-left text-xs rounded-lg flex items-center justify-between gap-2 cursor-pointer select-none transition-colors',
                                selectedModel === 'category-best'
                                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 text-[rgb(var(--color-primary-foreground))] font-semibold'
                                  : 'hover:bg-[rgb(var(--color-surface-hover))]'
                              )}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="truncate text-left">
                                  Best in {activeCategoryMeta.label}{topInTab ? ` · ${topInTab.name || topInTab.id}` : ''}
                                </span>
                                <InfoTip
                                  align="left"
                                  title={`Best in ${activeCategoryMeta.label}`}
                                  text="Uses the highest-scoring Overview model in this category and switches across API keys automatically if quota runs out."
                                />
                              </div>
                              <span className="text-[10px] font-mono flex-shrink-0">
                                {topInTab ? `${topInTab.catScore}/100` : usageSummary && usageSummary.tokenCap ? `${formatCompactTokens(usageSummary.tokensUsed)}/${formatCompactTokens(usageSummary.tokenCap)}` : 'Top'}
                              </span>
                            </div>

                            {categoryModels.map((m: any) => {
                                const sourceTag = m.keyName || m.providerDisplayName || getProviderDisplayName(m.providerId);
                                const isFree = m.tier === 'free' || m.id.includes(':free');
                                return (
                                  <button
                                    key={`${m.keyId || m.providerId}:${m.id}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedModel(m.id);
                                      if (m.keyId) {
                                        setSelectedKeyId(m.keyId);
                                        localStorage.setItem('exco:work:preferred-key-id', m.keyId);
                                      }
                                      setWorkflowMode(modelCategoryTab);
                                      localStorage.setItem('exco:work:preferred-model', m.id);
                                      sessionStorage.setItem('exco:work:workflow-mode', modelCategoryTab);
                                      setShowModelSelector(false);
                                    }}
                                    className={cn(
                                      'w-full px-2.5 py-1.5 text-left text-xs rounded-lg flex items-center justify-between gap-2',
                                      selectedModel === m.id && (!m.keyId || m.keyId === selectedKeyId)
                                        ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 text-[rgb(var(--color-primary-foreground))] font-semibold'
                                        : 'hover:bg-[rgb(var(--color-surface-hover))]'
                                    )}
                                    title={`${m.id} · ${sourceTag} · Overview ${m.catScore}/100`}
                                  >
                                    <span className="truncate flex items-center gap-1.5 min-w-0">
                                      <span className="truncate">{m.name || m.id}</span>
                                      <span className="px-1 py-0.2 rounded bg-sky-500/10 text-[9px] font-mono text-sky-400 flex-shrink-0">
                                        {m.catScore}
                                      </span>
                                      {sourceTag && (
                                        <span className="px-1.5 py-0.2 rounded bg-[rgb(var(--color-surface-hover))] text-[9px] text-[rgb(var(--color-foreground-muted))] flex-shrink-0">
                                          {sourceTag}
                                        </span>
                                      )}
                                    </span>
                                    <span
                                      className={cn(
                                        'px-1.5 py-0.5 rounded text-[10px] font-semibold flex-shrink-0',
                                        isFree ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                                      )}
                                    >
                                      {isFree ? 'Free' : 'Paid'}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>

                          <div className="px-3 pt-1.5 border-t border-[rgb(var(--color-border))] flex items-center justify-between text-[11px]">
                            <span>Auto-failover on quota limit</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = !preferredFailover;
                                setPreferredFailover(next);
                                localStorage.setItem('exco:work:preferred-failover', String(next));
                              }}
                              className={cn('px-2 py-0.5 rounded font-semibold', preferredFailover ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15')}
                            >
                              {preferredFailover ? 'ON' : 'OFF'}
                            </button>
                          </div>
                        </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Right Actions: Workflow Mode, Mic, Send */}
                <div className="flex items-center gap-2 relative">
                  <div className="relative" ref={modeSelectorRef}>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setShowModeSelector(prev => !prev);
                        setShowKeySelector(false);
                        setShowModelSelector(false);
                      }}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                        !workflowMode && apiKeys.length > 0
                          ? 'text-amber-400 border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/15'
                          : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                      )}
                    >
                      {workflowMode === 'turbo' ? (
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      ) : workflowMode === 'deep-thought' ? (
                        <Brain className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span>{activeWorkflowLabel}</span>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showModeSelector && (
                      <div
                        className="absolute right-0 bottom-full mb-2 w-72 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-1.5 z-50 animate-scale-in overflow-hidden"
                        style={getSegmentStyle(modelSelector)}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                          Agent Workflow Mode
                        </div>
                        {WORKFLOW_CATEGORIES.map(modeItem => {
                          const Icon =
                            modeItem.id === 'turbo' ? Zap : modeItem.id === 'deep-thought' ? Brain : Sparkles;
                          return (
                            <div
                              key={modeItem.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setWorkflowMode(modeItem.id);
                                setModelCategoryTab(modeItem.id);
                                sessionStorage.setItem('exco:work:workflow-mode', modeItem.id);
                                setShowModeSelector(false);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setWorkflowMode(modeItem.id);
                                  setModelCategoryTab(modeItem.id);
                                  sessionStorage.setItem('exco:work:workflow-mode', modeItem.id);
                                  setShowModeSelector(false);
                                }
                              }}
                              className={cn(
                                'w-full px-3 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none',
                                workflowMode === modeItem.id
                                  ? 'bg-[rgb(var(--color-primary))]/65 text-white font-semibold'
                                  : 'text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                              )}
                            >
                              <span className="flex items-center gap-2 min-w-0 flex-1 text-left">
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="font-semibold truncate">{modeItem.label}</span>
                              </span>
                              <InfoTip align="right" title={modeItem.label} text={modeItem.detail || modeItem.shortDesc} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Voice Input Button (Voice-to-Text) */}
                  <button
                    type="button"
                    onClick={handleToggleVoiceInput}
                    disabled={isTranscribing}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                      isRecording
                        ? 'bg-red-500/20 text-red-400 animate-pulse ring-1 ring-red-400/50'
                        : isTranscribing
                        ? 'bg-sky-500/20 text-sky-400'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                    )}
                    title={isRecording ? 'Stop recording and convert speech to text' : 'Voice input (speech to text)'}
                  >
                    {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send / Execute Agent Button */}
                  <button
                    type="submit"
                    disabled={(!input.trim() && attachedFiles.length === 0) || runningAgent || (apiKeys.length > 0 && !workflowMode)}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                      input.trim() || attachedFiles.length > 0
                        ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/80 border border-slate-900/15 dark:border-white/25 text-[rgb(var(--color-primary-foreground))] hover:bg-[rgb(var(--color-primary-hover))]'
                        : 'bg-slate-200 border border-slate-300 text-slate-600 dark:bg-[rgb(var(--color-primary))]/50 dark:border-white/15 dark:text-white/85 cursor-not-allowed'
                    )}
                    title="Send to Work Agent"
                  >
                    {runningAgent ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Optional Slide-over Workspace File Viewer / Quick Editor Drawer */}
      {filePanelOpen && selectedFile && (
        <aside className="relative z-20 w-[420px] max-w-[45%] flex-shrink-0 border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/90 backdrop-blur-md flex flex-col">
          <div className="h-12 px-3 border-b border-[rgb(var(--color-border))] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate text-[rgb(var(--color-foreground))]">
                {selectedFile.name}{previewFileModified ? ' ●' : ''}
              </p>
              <p className="text-[10px] font-mono text-[rgb(var(--color-foreground-muted))] truncate">
                {selectedFile.path}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={handleSavePreviewFile}
                disabled={!previewFileModified}
                className="p-1.5 rounded hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-40"
                title="Save file"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFilePanelOpen(false)}
                className="p-1.5 rounded hover:bg-[rgb(var(--color-surface-hover))]"
                title="Close preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {loadingFilePreview ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[rgb(var(--color-primary))]" />
              </div>
            ) : (
              <textarea
                value={previewFileContent}
                onChange={e => {
                  setPreviewFileContent(e.target.value);
                  setPreviewFileModified(true);
                }}
                spellCheck={false}
                className="w-full h-full p-3 font-mono text-xs bg-transparent border-0 rounded-none resize-none outline-none leading-relaxed"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export { WorkMode };
export default WorkMode;
