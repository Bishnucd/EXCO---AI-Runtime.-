/**
 * EXCO Chatbot Mode Page
 * Main chat interface with conversations, messages, and AI interaction
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Send,
  Paperclip,
  Mic,
  Copy,
  Check,
  RotateCcw,
  MoreVertical,
  Archive,
  Loader2,
  ChevronDown,
  X,
  Plus,
  ArrowUp,
  Cpu,
  RefreshCw,
  Search,
  Zap,
  Brain,
  Wand2,
  Sparkles,
  FileText,
  AudioLines,
} from 'lucide-react';
import { marked } from 'marked';
import {
  cn,
  formatRelativeTime,
  formatFileSize,
  classifyModelCategory,
  getProviderDisplayName,
  AUTO_WORKFLOW_INFO,
  WORKFLOW_CATEGORIES,
  parseVoiceSession,
  type ModelCategory,
  type WorkflowSelection,
} from '@shared/utils';
import type { VoiceSessionPayload } from '@shared/types';
import { VisualOverlay } from '../components/VisualOverlay';
import { InfoTip } from '../components/InfoTip';
import { VoiceChatPopup } from '../components/VoiceChatPopup';
import { VoiceTranscriptCard } from '../components/VoiceTranscriptCard';
import { useVoiceSettingsStore } from '../stores/voiceSettingsStore';
import { useDismissOutside } from '../hooks/useDismissOutside';
import { useThemeStore, getSegmentStyle, resolveActiveWallpaper } from '../stores/themeStore';
import { buildActiveSkillContext } from '../stores/skillsStore';
import { sanitizeHtml } from '../utils/sanitizeHtml';

// Configure marked for code highlighting
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string | any[];
  createdAt: number;
  modelId?: string;
  providerId?: string;
  status: 'pending' | 'streaming' | 'complete' | 'error';
  tokens?: { inputTokens: number; outputTokens: number; totalTokens: number };
}

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  modelId: string;
  providerId: string;
}

const ChatbotMode: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const conversationId = params.id as string | undefined;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [showKeySelector, setShowKeySelector] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const saved = localStorage.getItem('exco:chat:preferred-model');
    return saved && saved !== 'default' ? saved : 'auto';
  });
  const [preferredFailover, setPreferredFailover] = useState<boolean>(() => localStorage.getItem('exco:chat:preferred-failover') !== 'false');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [usageSummary, setUsageSummary] = useState<{ tokensUsed: number; tokenCap: number | null; requests: number; source: string } | null>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [workflowMode, setWorkflowMode] = useState<WorkflowSelection>(() => {
    const saved = localStorage.getItem('exco:chat:workflow-mode');
    return saved === 'auto' || saved === 'turbo' || saved === 'standard' || saved === 'deep-thought' ? saved : 'auto';
  });
  const [modelCategoryTab, setModelCategoryTab] = useState<ModelCategory>(() => {
    const savedWf = localStorage.getItem('exco:chat:workflow-mode');
    return savedWf === 'standard' || savedWf === 'deep-thought' ? savedWf : 'turbo';
  });
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceChatActive, setVoiceChatActive] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
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
  const [liveRoutingStatus, setLiveRoutingStatus] = useState<string>('');
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [openModelInfoId, setOpenModelInfoId] = useState<string | null>(null);

  useEffect(() => {
    if (!openModelInfoId) return;
    const close = () => setOpenModelInfoId(null);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [openModelInfoId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  const modeSelectorRef = useRef<HTMLDivElement>(null);
  const activeConversationIdRef = useRef<string | undefined>(conversationId);
  const justCreatedConvIdRef = useRef<string | null>(null);
  const deletedConversationsRef = useRef<Set<string>>(new Set());
  const activeRequestTokenRef = useRef<number>(0);

  useDismissOutside(showModelSelector, modelSelectorRef, () => setShowModelSelector(false));
  useDismissOutside(showModeSelector, modeSelectorRef, () => setShowModeSelector(false));
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunksRef = useRef<Float32Array[]>([]);
  const speechRecRef = useRef<any>(null);
  const speechLiveTextRef = useRef<string>('');

  const loadApiKeys = async (preferredKeyId?: string) => {
    try {
      const keys = await window.exco.keys.list();
      const list = keys || [];
      setApiKeys(list);

      if (list.length > 0) {
        const savedKeyId = localStorage.getItem('exco:chat:preferred-key-id');
        const nextKeyId =
          (preferredKeyId && list.some((k: any) => k.id === preferredKeyId) && preferredKeyId) ||
          (savedKeyId && list.some((k: any) => k.id === savedKeyId) && savedKeyId) ||
          (list.some((k: any) => k.id === selectedKeyId) && selectedKeyId) ||
          list[0].id;
        setSelectedKeyId(nextKeyId);
        if (preferredKeyId) {
          setSelectedModel('auto');
          localStorage.setItem('exco:chat:preferred-model', 'auto');
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

  const formatCompactTokens = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    if (num === 0) return '0';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}K`;
    return String(num);
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

  // Load models & token usage whenever selected API key changes
  useEffect(() => {
    if (apiKeys.length > 0 && selectedKeyId) {
      loadModelsAndUsage(selectedKeyId);
    }
  }, [selectedKeyId, apiKeys.length]);

  // Load conversations and API keys on mount
  useEffect(() => {
    loadConversations();
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
        setModelCategoryTab(detail.workflowMode === 'auto' ? 'turbo' : detail.workflowMode);
      }
    };
    const handleConvDeleted = (ev: Event) => {
      const detail = (ev as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id) return;
      deletedConversationsRef.current.add(detail.id);
      if (activeConversationIdRef.current === detail.id) {
        activeRequestTokenRef.current += 1;
        setLoading(false);
        setStreaming(false);
        setLiveRoutingStatus('');
        setStreamingContent('');
        setAttachedFiles([]);
        setMessages([]);
      }
    };
    const unsubProgress = window.exco.chat.onChatProgress?.((ev: any) => {
      if (!ev || ev.conversationId !== activeConversationIdRef.current) return;
      if (deletedConversationsRef.current.has(ev.conversationId)) return;
      if (ev.type === 'done') {
        setLiveRoutingStatus('');
        setStreamingContent('');
      } else if (ev.type === 'chunk' && typeof ev.content === 'string') {
        setStreamingContent(ev.content);
      } else if (ev.statusText) {
        setLiveRoutingStatus(ev.statusText);
      } else if (ev.type === 'routing' && ev.modelId) {
        setLiveRoutingStatus(`Generating reply with ${ev.modelId}...`);
      }
    });
    window.addEventListener('exco:keys-updated', handleKeysUpdate as EventListener);
    window.addEventListener('exco:model-preference-updated', handleModelPrefUpdate as EventListener);
    window.addEventListener('exco:conversation-deleted', handleConvDeleted as EventListener);
    return () => {
      window.removeEventListener('exco:keys-updated', handleKeysUpdate as EventListener);
      window.removeEventListener('exco:model-preference-updated', handleModelPrefUpdate as EventListener);
      window.removeEventListener('exco:conversation-deleted', handleConvDeleted as EventListener);
      unsubProgress?.();
    };
  }, []);

  // Load messages, cancel pending spinner state, and restore composer focus when conversation changes
  useEffect(() => {
    activeConversationIdRef.current = conversationId;

    // If this navigation came from handleSendMessage auto-creating a chat from the empty view,
    // keep the active send request & spinner alive instead of cancelling our own request!
    if (conversationId && justCreatedConvIdRef.current === conversationId) {
      justCreatedConvIdRef.current = null;
      return;
    }

    activeRequestTokenRef.current += 1;
    setLoading(false);
    setStreaming(false);
    setLiveRoutingStatus('');
    setStreamingContent('');
    setAttachedFiles([]);

    if (conversationId) {
      loadMessages(conversationId);
    } else {
      setMessages([]);
    }
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const loadConversations = async () => {
    try {
      const convs = await window.exco.chat.listConversations();
      setConversations((convs || []).filter((c: any) => !String(c?.title || '').startsWith('[Work] ')));
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (id: string) => {
    const reqToken = activeRequestTokenRef.current;
    try {
      const msgs = await window.exco.chat.getMessages(id);
      if (
        activeRequestTokenRef.current !== reqToken ||
        activeConversationIdRef.current !== id ||
        deletedConversationsRef.current.has(id)
      ) {
        return;
      }
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

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
              const isTextMime =
                mime.startsWith('text/') ||
                mime.includes('json') ||
                mime.includes('xml') ||
                mime.includes('javascript') ||
                mime.includes('typescript') ||
                mime.includes('yaml') ||
                mime.includes('csv');

              if (!isImage && (isTextExt || isTextMime || file.size <= 256 * 1024)) {
                try {
                  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 250 * 1024));
                  // Treat as readable text only if there are no null bytes and ratio of printable chars is high
                  if (!decoded.includes('\u0000')) {
                    textContent = decoded;
                  }
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

  const encodeSamplesToWavBase64 = (chunks: Float32Array[], sourceRate: number): string => {
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    if (totalLength === 0) return '';
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }

    const targetRate = 16000;
    const ratio = sourceRate / targetRate;
    const targetLength = Math.max(1, Math.round(merged.length / ratio));
    const downsampled = new Int16Array(targetLength);
    for (let i = 0; i < targetLength; i++) {
      const idx = Math.min(merged.length - 1, Math.floor(i * ratio));
      const s = Math.max(-1, Math.min(1, merged[idx]));
      downsampled[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    const buffer = new ArrayBuffer(44 + downsampled.length * 2);
    const view = new DataView(buffer);
    const writeStr = (pos: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + downsampled.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, targetRate, true);
    view.setUint32(28, targetRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, downsampled.length * 2, true);
    for (let i = 0; i < downsampled.length; i++) {
      view.setInt16(44 + i * 2, downsampled[i], true);
    }

    const bytes = new Uint8Array(buffer);
    let binary = '';
    const step = 0x8000;
    for (let i = 0; i < bytes.length; i += step) {
      binary += String.fromCharCode(...bytes.subarray(i, i + step));
    }
    return btoa(binary);
  };

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

  useEffect(() => {
    return () => {
      cleanupAudioCapture();
    };
  }, []);

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
        setVoiceError('No audio captured. Hold or speak clearly before stopping.');
        return;
      }

      setIsTranscribing(true);
      try {
        const voiceCfg = useVoiceSettingsStore.getState();
        const res = await window.exco.chat.transcribeAudio({
          wavBase64,
          keyId: selectedKeyId || undefined,
          preferredEngine: voiceCfg.speechEngine,
          language: voiceCfg.speechLanguage || 'en',
        });
        if (res?.text?.trim()) {
          const cleanText = res.text.trim();
          setInput(prev => (prev ? `${prev.trimEnd()} ${cleanText}` : cleanText));
          textareaRef.current?.focus();
        } else {
          setVoiceError(res?.error || 'Could not recognize speech. Try speaking closer to the microphone.');
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
        setVoiceError('Microphone capture is not supported in this window.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      audioChunksRef.current = [];
      speechLiveTextRef.current = '';
      processor.onaudioprocess = (ev) => {
        const channel = ev.inputBuffer.getChannelData(0);
        audioChunksRef.current.push(new Float32Array(channel));
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
            let finalText = '';
            for (let i = 0; i < event.results.length; i++) {
              finalText += event.results[i][0].transcript + ' ';
            }
            speechLiveTextRef.current = finalText.trim();
          };
          rec.onerror = () => {
            // Ignore Chromium SpeechRecognition network errors; WAV backend transcriber handles it on stop
          };
          rec.start();
          speechRecRef.current = rec;
        } catch {
          // Optional Web Speech live helper failed; WAV capture continues cleanly
        }
      }

      setIsRecording(true);
    } catch (err: any) {
      cleanupAudioCapture();
      setVoiceError(err?.message || 'Microphone access denied or unavailable.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || loading || streaming) return;

    let currentKeys = apiKeys;
    if (currentKeys.length === 0) {
      const freshKeys = await window.exco.keys.list().catch(() => []);
      if (Array.isArray(freshKeys) && freshKeys.length > 0) {
        currentKeys = freshKeys;
        setApiKeys(freshKeys);
        if (!selectedKeyId) setSelectedKeyId(freshKeys[0].id);
      }
    }

    if (currentKeys.length === 0) {
      window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: 'api-keys' } }));
      setMessages(prev => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          conversationId: conversationId || 'new',
          role: 'user',
          content: input.trim(),
          createdAt: Date.now(),
          status: 'complete',
        },
        {
          id: `err-${Date.now()}`,
          conversationId: conversationId || 'new',
          role: 'assistant',
          content: '⚠️ **API Key Required**: Please open **Sidebar → API Keys**, name your key, and paste your API key to start chatting.',
          createdAt: Date.now(),
          status: 'complete',
        },
      ]);
      setInput('');
      return;
    }

    const content = input.trim();
    const filesToSend = [...attachedFiles];
    const effectiveContent =
      content || (filesToSend.length > 0 ? `Analyze attached file${filesToSend.length > 1 ? 's' : ''}: ${filesToSend.map(f => f.name).join(', ')}` : '');
    const reqToken = ++activeRequestTokenRef.current;
    const tempUserId = `temp-user-${Date.now()}`;
    const optimisticUserMsg: Message = {
      id: tempUserId,
      conversationId: conversationId || 'pending',
      role: 'user',
      content: effectiveContent,
      createdAt: Date.now(),
      status: 'complete',
    };
    setInput('');
    setAttachedFiles([]);
    setStreamingContent('');
    setLiveRoutingStatus(conversationId ? 'Routing request in Chat...' : 'Creating new chat...');
    setMessages(prev => [...prev, optimisticUserMsg]);
    setLoading(true);

    let targetConvId = conversationId;
    try {
      const attachmentsPayload = filesToSend.map(f =>
        f.imageUrl
          ? { type: 'image', imageUrl: f.imageUrl, fileData: { name: f.name, mimeType: f.mimeType, size: f.size, base64: f.base64 } }
          : { type: 'file', fileData: { name: f.name, mimeType: f.mimeType, size: f.size, base64: f.base64, textContent: f.textContent } }
      );

      const selectedModelObj = availableModels.find((m: any) => m.id === selectedModel);
      const activeKey =
        (selectedModelObj?.keyId ? currentKeys.find((k: any) => k.id === selectedModelObj.keyId) : undefined) ||
        currentKeys.find((k: any) => k.id === selectedKeyId) ||
        currentKeys[0];
      const providerId = activeKey?.providerId || 'auto';

      if (!targetConvId) {
        // Create new conversation automatically when sending from unselected/empty state
        const initialTitle = content ? content.slice(0, 50) : filesToSend[0]?.name || 'Attached File Chat';
        const newConv = await window.exco.chat.createConversation({
          title: initialTitle,
          modelId: selectedModel === 'auto' ? 'auto' : 'default',
          providerId,
        });
        targetConvId = newConv.id;
        if (activeRequestTokenRef.current !== reqToken || deletedConversationsRef.current.has(targetConvId)) {
          await window.exco.chat.deleteConversation(targetConvId).catch(() => {});
          return;
        }
        justCreatedConvIdRef.current = targetConvId;
        activeConversationIdRef.current = targetConvId;
        setConversations(prev => [newConv, ...prev]);
        window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
        navigate(`/chat/${newConv.id}`, { replace: true });
      }

      const result = await window.exco.chat.sendMessage({
        conversationId: targetConvId,
        content: effectiveContent,
        attachments: attachmentsPayload,
        providerId,
        keyId: activeKey?.id,
        modelId: selectedModel,
        preferredFailover,
        workflowMode,
        skillContext: buildActiveSkillContext(effectiveContent),
      });

      if (
        result?.aborted ||
        activeRequestTokenRef.current !== reqToken ||
        deletedConversationsRef.current.has(targetConvId) ||
        activeConversationIdRef.current !== targetConvId
      ) {
        return;
      }

      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserId),
        result.userMessage,
        result.assistantMessage,
      ]);
      window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
      loadModelsAndUsage(activeKey?.id);
    } catch (error) {
      if (
        activeRequestTokenRef.current !== reqToken ||
        (targetConvId && deletedConversationsRef.current.has(targetConvId))
      ) {
        return;
      }
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserId),
        optimisticUserMsg,
        {
          id: `error-${Date.now()}`,
          conversationId: targetConvId || conversationId || 'new',
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
          createdAt: Date.now(),
          status: 'error',
        },
      ]);
    } finally {
      if (activeRequestTokenRef.current === reqToken) {
        setLoading(false);
        setStreamingContent('');
        setLiveRoutingStatus('');
      }
    }
  };

  const handleStreamMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || streaming) return;

    const content = input.trim();
    setInput('');
    setStreaming(true);

    // Add user message immediately
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      conversationId: conversationId || 'new',
      role: 'user',
      content,
      createdAt: Date.now(),
      status: 'complete',
    };
    setMessages(prev => [...prev, userMsg]);

    const activeKey = apiKeys.find((k: any) => k.id === selectedKeyId) || apiKeys[0];
    const modelId = 'default';

    // Add placeholder assistant message
    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      conversationId: conversationId || 'new',
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      modelId,
      providerId: activeKey?.providerId || 'default',
      status: 'streaming',
    };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      if (!conversationId) {
        const newConv = await window.exco.chat.createConversation({
          title: content.slice(0, 50),
          modelId,
          providerId: activeKey?.providerId || 'default',
        });
        navigate(`/chat/${newConv.id}`, { replace: true });
        assistantMsg.conversationId = newConv.id;
        userMsg.conversationId = newConv.id;
        setConversations(prev => [newConv, ...prev]);
      }

      // Stream response
      const stream = await window.exco.chat.streamMessage({
        conversationId: conversationId || assistantMsg.conversationId,
        content,
        modelId,
      });

      let fullContent = '';
      for await (const chunk of stream) {
        if (chunk.type === 'content' && chunk.content) {
          fullContent += chunk.content;
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsg.id ? { ...msg, content: fullContent } : msg
          ));
        } else if (chunk.type === 'done') {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsg.id ? { ...msg, status: 'complete', content: fullContent } : msg
          ));
          break;
        } else if (chunk.type === 'error') {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsg.id ? { ...msg, status: 'error', content: chunk.error || 'Stream error' } : msg
          ));
          break;
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMsg.id ? { ...msg, status: 'error', content: `Error: ${error instanceof Error ? error.message : 'Stream failed'}` } : msg
      ));
    } finally {
      setStreaming(false);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    const msgIndex = messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const userMsg = messages[msgIndex - 1];
    if (!userMsg || userMsg.role !== 'user') return;

    setMessages(prev => prev.map((msg, i) =>
      i > msgIndex ? { ...msg, content: '', status: 'streaming' as const } : msg
    ));

    try {
      const stream = await window.exco.chat.streamMessage({
        conversationId: conversationId!,
        content: typeof userMsg.content === 'string' ? userMsg.content : '',
        modelId: 'default',
      });

      let fullContent = '';
      const assistantMsgId = messages[msgIndex + 1]?.id;

      for await (const chunk of stream) {
        if (chunk.type === 'content' && chunk.content) {
          fullContent += chunk.content;
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, content: fullContent } : msg
          ));
        } else if (chunk.type === 'done') {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMsgId ? { ...msg, status: 'complete', content: fullContent } : msg
          ));
          break;
        }
      }
    } catch (error) {
      console.error('Regenerate error:', error);
    }
  };

  const handleNewConversation = async () => {
    const activeKey = apiKeys.find((k: any) => k.id === selectedKeyId) || apiKeys[0];
    const newConv = await window.exco.chat.createConversation({
      title: 'New Conversation',
      modelId: 'default',
      providerId: activeKey?.providerId || 'default',
    });
    navigate(`/chat/${newConv.id}`, { replace: true });
    setConversations(prev => [newConv, ...prev]);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('exco:conversation-deleted', { detail: { id } }));
    setConversations(prev => prev.filter(c => c.id !== id));
    if (conversationId === id) {
      navigate('/chat', { replace: true });
    }
    await window.exco.chat.cancelStream(id).catch(() => {});
    await window.exco.chat.deleteConversation(id);
    window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
  };

  const handleArchiveConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await window.exco.chat.archiveConversation(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, archivedAt: Date.now() } : c));
    if (conversationId === id) {
      navigate('/chat', { replace: true });
    }
  };

  const renderMessageContent = (content: string | any[]) => {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked.parse(content) as string) }} className="prose prose-slate dark:prose-invert max-w-none" />;
    }
    return (
      <div className="space-y-2">
        {content.map((part, i) => (
          <div key={i} className="prose prose-slate dark:prose-invert max-w-none">
            {part.type === 'text' && part.text && <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(marked.parse(part.text) as string) }} />}
            {part.type === 'image' && part.imageUrl && (
              <img src={part.imageUrl} alt="Attachment" className="max-w-full h-auto rounded-lg" />
            )}
            {part.type === 'file' && part.fileData && (
              <div className="flex items-center gap-2 p-2 bg-[rgb(var(--color-surface-hover))] rounded-lg">
                <span className="font-mono text-sm">{part.fileData.name}</span>
                <span className="text-xs text-[rgb(var(--color-foreground-muted))]">{part.fileData.size} bytes</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCopyMessage = (id: string, content: string | any[]) => {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId(prev => (prev === id ? null : prev));
    }, 1500);
  };

  const {
    mainCanvas,
    composer,
    userBubble,
    assistantBubble,
    modelSelector,
    modalSurface,
  } = useThemeStore(state => state.segments);
  const globalFilter = useThemeStore(state => state.globalFilter);
  const activeWorkflowLabel =
    workflowMode === 'auto'
      ? 'Auto'
      : WORKFLOW_CATEGORIES.find(w => w.id === workflowMode)?.label || 'Standard';

  const hasActiveWallpaper =
    Boolean(globalFilter.bgImageMode === 'auto' ? globalFilter.autoWallpaperUrl : globalFilter.bgImage) &&
    (globalFilter.bgImageOpacity ?? 0) > 0.005;

  return (
    <div
      className={cn(
        'relative h-full flex flex-col overflow-hidden',
        mainCanvas?.bg && !(hasActiveWallpaper && !mainCanvas?.bgImage) ? 'bg-[rgb(var(--color-background))]' : 'bg-transparent'
      )}
      style={{
        ...getSegmentStyle(mainCanvas),
        ...(hasActiveWallpaper && !mainCanvas?.bgImage ? { backgroundColor: 'transparent' } : {}),
      }}
      onDragOver={e => {
        e.preventDefault();
        setIsDraggingFile(true);
      }}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDraggingFile(false);
        }
      }}
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
        <div className="pointer-events-none fixed inset-0 z-[300] bg-sky-500/15 border-2 border-dashed border-sky-400 flex items-center justify-center">
          <div className="px-5 py-3 rounded-2xl bg-[rgb(var(--color-surface))] border border-sky-400/50 shadow-2xl text-sm font-semibold text-[rgb(var(--color-foreground))]">
            Drop any file here to attach to chat
          </div>
        </div>
      )}

      {/* Centered AI Chat Messages (Matched to Work Mode width & spacing — zero duplicate top header) */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6 min-h-full flex flex-col">
          {messages.length === 0 && !conversationId && (
            <div className="flex flex-col items-center justify-center flex-1 text-center my-auto pb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-semibold text-[rgb(var(--color-foreground))] tracking-tight">
                  What can I help with?
                </h3>
                <InfoTip
                  align="center"
                  title="EXCO Chat"
                  text="Connect an API key in Settings to start coding, reviewing, and brainstorming with EXCO. Drop or attach any file format below."
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['Explain a concept', 'Write code', 'Debug an issue', 'Review code'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); textareaRef.current?.focus(); }}
                    className="px-4 py-2 text-xs font-medium border border-[rgb(var(--color-border))] rounded-full bg-[rgb(var(--color-surface))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const voiceSession = parseVoiceSession(message.content);
            if (voiceSession) {
              return (
                <VoiceTranscriptCard
                  key={message.id}
                  session={voiceSession}
                  createdAt={message.createdAt}
                  bubbleStyle={getSegmentStyle(assistantBubble)}
                />
              );
            }

            if (message.role === 'system') {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="message-bubble system">
                    {renderMessageContent(message.content)}
                  </div>
                </div>
              );
            }

            if (message.role === 'user') {
              return (
                <div key={message.id} className="group flex flex-col items-end">
                  <div
                    className="relative overflow-hidden message-bubble user max-w-[78%] shadow-sm border border-transparent"
                    style={getSegmentStyle(userBubble)}
                  >
                    <VisualOverlay
                      grain={userBubble?.grain || 0}
                      tintColor={userBubble?.tintColor || ''}
                      tintOpacity={userBubble?.tintOpacity || 0}
                      bgImage={userBubble?.bgImage}
                      bgImageOpacity={userBubble?.bgImageOpacity}
                      bgImageBlur={userBubble?.bgImageBlur}
                      bgImageFit={userBubble?.bgImageFit}
                    />
                    <div className="relative z-10 message-content text-left">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="p-1 rounded hover:bg-[rgb(var(--color-surface-hover))] transition-colors text-[rgb(var(--color-foreground-muted))]"
                      title="Copy message"
                    >
                      {copiedMessageId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="group flex flex-col w-full">
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'relative overflow-hidden message-bubble assistant',
                      message.status === 'streaming' && 'animate-pulse'
                    )}
                    style={getSegmentStyle(assistantBubble)}
                  >
                    <VisualOverlay
                      grain={assistantBubble?.grain || 0}
                      tintColor={assistantBubble?.tintColor || ''}
                      tintOpacity={assistantBubble?.tintOpacity || 0}
                      bgImage={assistantBubble?.bgImage}
                      bgImageOpacity={assistantBubble?.bgImageOpacity}
                      bgImageBlur={assistantBubble?.bgImageBlur}
                      bgImageFit={assistantBubble?.bgImageFit}
                    />
                    <div className="relative z-10 message-content">
                      {renderMessageContent(message.content)}
                    </div>

                    {message.status === 'error' && (
                      <div className="relative z-10 mt-2 text-sm text-[rgb(var(--color-error))]">
                        Failed to generate response. Try regenerating below.
                      </div>
                    )}
                  </div>

                  {/* Clean Action Row */}
                  <div className="flex items-center gap-2 mt-2 text-[rgb(var(--color-foreground-muted))]">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(message.id, message.content)}
                      className="p-1.5 rounded-md hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))] transition-colors flex items-center gap-1 text-xs"
                      title="Copy response"
                    >
                      {copiedMessageId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {message.status === 'complete' && (
                      <button
                        type="button"
                        onClick={() => handleRegenerate(message.id)}
                        className="p-1.5 rounded-md hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))] transition-colors flex items-center gap-1 text-xs"
                        title="Regenerate"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(message.modelId || message.tokens) && (
                      <div className="relative inline-block" onPointerDown={e => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            setOpenModelInfoId(prev => (prev === message.id ? null : message.id));
                          }}
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
                            openModelInfoId === message.id
                              ? 'bg-[rgb(var(--color-primary))]/65 border-white/25 text-white'
                              : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/60 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                          )}
                          title="View model used for this response"
                        >
                          <Cpu className="w-3 h-3" />
                          <span>Model</span>
                          <ChevronDown className={cn('w-3 h-3 transition-transform', openModelInfoId === message.id && 'rotate-180')} />
                        </button>
                        {openModelInfoId === message.id && (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="absolute left-0 top-full mt-1.5 z-40 min-w-[200px] px-3 py-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl text-xs space-y-1 animate-scale-in"
                          >
                            {message.modelId && (
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Model</span>
                                <span className="font-mono font-semibold text-[rgb(var(--color-foreground))] truncate max-w-[200px]">
                                  {message.modelId}
                                </span>
                              </div>
                            )}
                            {message.tokens && (
                              <div className="flex items-center justify-between gap-3 text-[11px] text-[rgb(var(--color-foreground-muted))]">
                                <span>Tokens</span>
                                <span className="font-mono">
                                  {message.tokens.inputTokens} in · {message.tokens.outputTokens} out
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {(loading || streaming) && (
            <div className="flex flex-col w-full">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full ui-translucent border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-foreground-muted))]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400 flex-shrink-0" />
                  <span className="truncate">{liveRoutingStatus || 'Preparing response...'}</span>
                </div>
                {streamingContent && (
                  <div
                    className="relative overflow-hidden message-bubble assistant"
                    style={getSegmentStyle(assistantBubble)}
                  >
                    <VisualOverlay
                      grain={assistantBubble?.grain || 0}
                      tintColor={assistantBubble?.tintColor || ''}
                      tintOpacity={assistantBubble?.tintOpacity || 0}
                      bgImage={assistantBubble?.bgImage}
                      bgImageOpacity={assistantBubble?.bgImageOpacity}
                      bgImageBlur={assistantBubble?.bgImageBlur}
                      bgImageFit={assistantBubble?.bgImageFit}
                    />
                    <div className="relative z-10 message-content">
                      {renderMessageContent(streamingContent)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Live Bidirectional Voice Chat Pop-up (isolated from main chat until ended) */}
      {voiceChatActive && (
        <VoiceChatPopup
          conversationId={conversationId}
          selectedModel={selectedModel}
          selectedKeyId={selectedKeyId}
          preferredFailover={preferredFailover}
          workflowMode={workflowMode}
          onCancelEmpty={() => setVoiceChatActive(false)}
          onEndSession={async (payload: VoiceSessionPayload) => {
            try {
              const activeKey = apiKeys.find((k: any) => k.id === selectedKeyId) || apiKeys[0];
              const res = await window.exco.chat.saveVoiceSession({
                conversationId,
                payload,
                modelId: selectedModel,
                providerId: activeKey?.providerId || 'auto',
              });
              setVoiceChatActive(false);
              if (res?.conversation && !conversationId) {
                justCreatedConvIdRef.current = res.conversationId;
                activeConversationIdRef.current = res.conversationId;
                setConversations(prev => [res.conversation!, ...prev]);
                navigate(`/chat/${res.conversationId}`, { replace: true });
              }
              if (res?.message) {
                setMessages(prev => [...prev, res.message]);
              }
              window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
            } catch (err) {
              console.error('Failed to save voice chat transcript:', err);
              setVoiceChatActive(false);
            }
          }}
        />
      )}

      {/* Centered Floating Pill Prompt Composer (Matched to Work Mode) */}
      <div className="relative z-20 flex-shrink-0 px-4 md:px-8 pb-5 pt-2 bg-transparent">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            onClick={() => textareaRef.current?.focus()}
            className="relative rounded-3xl border border-[rgb(var(--color-border))] ui-translucent shadow-xl px-4 py-3 transition-all focus-within:border-[rgb(var(--color-primary))]"
            style={getSegmentStyle(composer)}
          >
            <VisualOverlay
              grain={composer?.grain || globalFilter.grain}
              tintColor={composer?.tintColor || globalFilter.tintColor || (globalFilter.preset === 'cyber-cyan' ? '#06b6d4' : '')}
              tintOpacity={composer?.tintOpacity || globalFilter.tintOpacity}
              bgImage={composer?.bgImage}
              bgImageOpacity={composer?.bgImageOpacity}
              bgImageBlur={composer?.bgImageBlur}
              bgImageFit={composer?.bgImageFit}
              className="rounded-3xl"
            />
            <div className="relative z-10">
            {/* Attached Files Chips (Supports Any Format) */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-2 mb-1.5 border-b border-[rgb(var(--color-border))]/50" onClick={e => e.stopPropagation()}>
                {attachedFiles.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] text-xs max-w-[230px]"
                  >
                    {f.imageUrl ? (
                      <img src={f.imageUrl} alt={f.name} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-sky-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[rgb(var(--color-foreground))]">{f.name}</p>
                      <p className="text-[10px] text-[rgb(var(--color-foreground-muted))]">
                        {formatFileSize(f.size)} · {f.textContent ? 'text' : (f.mimeType.split('/')[1] || 'file')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFiles(prev => prev.filter(item => item.id !== f.id))}
                      className="p-0.5 rounded hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-red-400"
                      title="Remove attachment"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Voice Input Status / Error Banner */}
            {(isRecording || isTranscribing || voiceError) && (
              <div className="mb-1.5 flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg text-xs border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/80">
                <span className={cn(
                  isRecording ? 'text-red-400 font-medium' : isTranscribing ? 'text-sky-400 font-medium' : 'text-amber-400'
                )}>
                  {isRecording
                    ? 'Listening... Speak into your microphone, then click the Mic button to transcribe.'
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

            {/* Auto-resizing Seamless Textarea */}
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
                  handleSendMessage(e as any);
                }
              }}
              placeholder="Ask anything or attach any file..."
              rows={1}
              className="composer-textarea w-full px-1 pt-1 pb-2 text-[15px] text-[rgb(var(--color-foreground))] placeholder-[rgb(var(--color-foreground-muted))] resize-none"
              style={{ minHeight: '40px', maxHeight: '180px' }}
            />

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              {/* Left Actions: + and API Key Selector Pill */}
              <div className="flex items-center gap-1.5 relative">
                {/* Universal Multi-Format File Attachment Button */}
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.length) {
                      handleFilesAdded(e.target.files);
                    }
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
                  title="Attach any file format (code, PDF, image, JSON, CSV, logs, etc.)"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Show Add API Key button ONLY when no keys exist; once added, only models appear */}
                {apiKeys.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: 'api-keys' } }))}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-amber-500 dark:text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 transition-colors whitespace-nowrap"
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
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                      title="Select AI model"
                    >
                      <Cpu className="w-3.5 h-3.5 opacity-80" />
                      <span className="max-w-[160px] truncate">
                        {selectedModel === 'auto' ? `Auto (${activeWorkflowLabel})` : selectedModel}
                      </span>
                      {usageSummary && (
                        <span className="text-[10px] font-mono opacity-75">
                          {formatCompactTokens(usageSummary.tokensUsed)}/{formatCompactTokens(usageSummary.tokenCap)}
                        </span>
                      )}
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showModelSelector && (() => {
                      const catalog = availableModels.filter(m => m.id !== 'auto');
                      const query = modelSearchQuery.trim().toLowerCase();
                      const categorized = catalog.map((m: any) => ({
                        ...m,
                        category: classifyModelCategory(m),
                      }));
                      const counts: Record<ModelCategory, number> = {
                        turbo: categorized.filter(m => m.category === 'turbo').length,
                        standard: categorized.filter(m => m.category === 'standard').length,
                        'deep-thought': categorized.filter(m => m.category === 'deep-thought').length,
                      };
                      const filteredModels = categorized.filter(m => {
                        if (m.category !== modelCategoryTab) return false;
                        if (!query) return true;
                        const wfLabel = WORKFLOW_CATEGORIES.find(w => w.id === m.category)?.label.toLowerCase() || '';
                        return (
                          (m.id || '').toLowerCase().includes(query) ||
                          (m.name || '').toLowerCase().includes(query) ||
                          (m.providerId || '').toLowerCase().includes(query) ||
                          wfLabel.includes(query)
                        );
                      });
                      const activeWorkflowInfo =
                        WORKFLOW_CATEGORIES.find(w => w.id === modelCategoryTab) || AUTO_WORKFLOW_INFO;

                      return (
                        <div
                          className="absolute left-0 bottom-full mb-2 w-[26rem] max-w-[92vw] bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-2 z-50 animate-scale-in overflow-hidden"
                          style={getSegmentStyle(modelSelector)}
                          onClick={e => e.stopPropagation()}
                        >
                          <VisualOverlay
                            grain={modelSelector?.grain || globalFilter.grain}
                            tintColor={modelSelector?.tintColor || globalFilter.tintColor || (globalFilter.preset === 'cyber-cyan' ? '#06b6d4' : '')}
                            tintOpacity={modelSelector?.tintOpacity || globalFilter.tintOpacity}
                            bgImage={modelSelector?.bgImage}
                            bgImageOpacity={modelSelector?.bgImageOpacity}
                            bgImageBlur={modelSelector?.bgImageBlur}
                            bgImageFit={modelSelector?.bgImageFit}
                          />
                          <div className="relative z-10">
                          <div className="px-3 pb-2 border-b border-[rgb(var(--color-border))] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="text-[11px] font-semibold text-[rgb(var(--color-foreground))] uppercase tracking-wider">
                                Models ({filteredModels.length})
                              </div>
                              <InfoTip
                                align="left"
                                title={activeWorkflowInfo.label}
                                text={activeWorkflowInfo.detail}
                              />
                              {usageSummary && (
                                <div className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))] ml-1">
                                  {formatCompactTokens(usageSummary.tokensUsed)}/{formatCompactTokens(usageSummary.tokenCap)}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-1 text-[11px] text-[rgb(var(--color-foreground-muted))] cursor-pointer" title="Automatically fall back if preferred model hits rate limit">
                                <input
                                  type="checkbox"
                                  checked={preferredFailover}
                                  onChange={e => {
                                    const next = e.target.checked;
                                    setPreferredFailover(next);
                                    localStorage.setItem('exco:chat:preferred-failover', String(next));
                                  }}
                                  className="p-0"
                                />
                                <span>Fallback</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => loadModelsAndUsage(selectedKeyId)}
                                className="p-1 rounded hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
                                title="Refresh models & token usage"
                              >
                                <RefreshCw className={cn('w-3.5 h-3.5', loadingModels && 'animate-spin')} />
                              </button>
                            </div>
                          </div>

                          {/* Search Bar */}
                          <div className="px-3 py-2 border-b border-[rgb(var(--color-border))]">
                            <div className="relative">
                              <Search className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={modelSearchQuery}
                                onChange={e => setModelSearchQuery(e.target.value)}
                                placeholder="Filter models in category..."
                                autoFocus
                                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] focus:outline-none focus:border-sky-500"
                              />
                              {modelSearchQuery && (
                                <button
                                  type="button"
                                  onClick={() => setModelSearchQuery('')}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
                                  title="Clear search"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Single Active Category Tabs (renders only models in the selected category) */}
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {WORKFLOW_CATEGORIES.map(wf => (
                                <button
                                  key={wf.id}
                                  type="button"
                                  onClick={() => {
                                    setModelCategoryTab(wf.id);
                                    setWorkflowMode(wf.id);
                                    localStorage.setItem('exco:chat:workflow-mode', wf.id);
                                  }}
                                  className={cn(
                                    'px-2 py-1 rounded-md text-[11px] font-medium transition-colors border text-center',
                                    modelCategoryTab === wf.id
                                      ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))]'
                                      : 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))]'
                                  )}
                                >
                                  {wf.label} ({counts[wf.id]})
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="max-h-64 overflow-y-auto py-1">
                            {/* Column header */}
                            <div className="px-3 py-1 grid grid-cols-[1fr_auto_auto] gap-2 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                              <span>Model</span>
                              <span>Used / Cap</span>
                              <span>Tier</span>
                            </div>

                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setSelectedModel('auto');
                                localStorage.setItem('exco:chat:preferred-model', 'auto');
                                setShowModelSelector(false);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedModel('auto');
                                  localStorage.setItem('exco:chat:preferred-model', 'auto');
                                  setShowModelSelector(false);
                                }
                              }}
                              className={cn(
                                'w-full px-3 py-1.5 text-left text-xs grid grid-cols-[1fr_auto_auto] items-center gap-2 transition-colors cursor-pointer select-none',
                                selectedModel === 'auto'
                                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 text-[rgb(var(--color-primary-foreground))] font-semibold'
                                  : 'text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                              )}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="truncate text-left">
                                  Auto ({activeWorkflowLabel})
                                </span>
                                <InfoTip
                                  align="left"
                                  title="Auto Routing"
                                  text={AUTO_WORKFLOW_INFO.detail}
                                />
                              </div>
                              <span className="font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                                {usageSummary
                                  ? `${formatCompactTokens(usageSummary.tokensUsed)}/${formatCompactTokens(usageSummary.tokenCap)}`
                                  : '0/128K'}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-500">
                                Free
                              </span>
                            </div>

                            {filteredModels.map((m: any) => {
                              const usedStr = formatCompactTokens(m.tokensUsed || 0);
                              const capStr = formatCompactTokens(m.tokenCap ?? m.contextWindow);
                              const isFree = m.tier === 'free' || m.id.includes(':free');
                              const sourceTag = m.keyName || m.providerDisplayName || getProviderDisplayName(m.providerId);
                              return (
                                <button
                                  key={`${m.keyId || m.providerId}:${m.id}`}
                                  type="button"
                                  onClick={() => {
                                    setSelectedModel(m.id);
                                    if (m.keyId) {
                                      setSelectedKeyId(m.keyId);
                                      localStorage.setItem('exco:chat:preferred-key-id', m.keyId);
                                    }
                                    setWorkflowMode(modelCategoryTab);
                                    localStorage.setItem('exco:chat:preferred-model', m.id);
                                    localStorage.setItem('exco:chat:workflow-mode', modelCategoryTab);
                                    setShowModelSelector(false);
                                  }}
                                  className={cn(
                                    'w-full px-3 py-1.5 text-left text-xs grid grid-cols-[1fr_auto_auto] items-center gap-2 transition-colors',
                                    selectedModel === m.id && (!m.keyId || m.keyId === selectedKeyId)
                                      ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 text-[rgb(var(--color-primary-foreground))] font-semibold'
                                      : 'text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                                  )}
                                  title={`${m.id} · ${sourceTag}`}
                                >
                                  <span className="truncate flex items-center gap-1.5 min-w-0">
                                    <span className="truncate">{m.name || m.id}</span>
                                    {sourceTag && (
                                      <span className="px-1.5 py-0.2 rounded bg-[rgb(var(--color-surface-hover))] text-[9px] text-[rgb(var(--color-foreground-muted))] flex-shrink-0">
                                        {sourceTag}
                                      </span>
                                    )}
                                  </span>
                                  <span className="font-mono text-[11px] text-[rgb(var(--color-foreground-muted))]">
                                    {usedStr}/{capStr}
                                  </span>
                                  <span
                                    className={cn(
                                      'px-1.5 py-0.5 rounded text-[10px] font-semibold text-center',
                                      isFree ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                                    )}
                                  >
                                    {isFree ? 'Free' : 'Paid'}
                                  </span>
                                </button>
                              );
                            })}

                            {!loadingModels && filteredModels.length === 0 && (
                              <p className="px-3 py-2 text-[11px] text-[rgb(var(--color-foreground-muted))]">
                                {catalog.length === 0
                                  ? 'No extra model catalog returned yet. Auto will route using your active key and workflow.'
                                  : 'No models match your search or category filter.'}
                              </p>
                            )}
                          </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Right Actions: Workflow Pill, Mic, Submit Arrow Button */}
              <div className="flex items-center gap-2 relative">
                {/* Workflow Selector Pill */}
                <div className="relative" ref={modeSelectorRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModeSelector(!showModeSelector);
                      setShowKeySelector(false);
                      setShowModelSelector(false);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] text-xs font-medium transition-colors"
                    title="Auto picks Turbo, Standard, or Deep Thought automatically, or pin one manually"
                  >
                    {workflowMode === 'auto' ? (
                      <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : workflowMode === 'turbo' ? (
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    ) : workflowMode === 'deep-thought' ? (
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    )}
                    <span>{activeWorkflowLabel}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {/* Workflow Dropdown Menu */}
                  {showModeSelector && (
                    <div
                      className="absolute right-0 bottom-full mb-2 w-72 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-1.5 z-50 animate-scale-in overflow-hidden"
                      style={getSegmentStyle(modelSelector)}
                    >
                      <VisualOverlay
                        grain={modelSelector?.grain || globalFilter.grain}
                        tintColor={modelSelector?.tintColor || globalFilter.tintColor || (globalFilter.preset === 'cyber-cyan' ? '#06b6d4' : '')}
                        tintOpacity={modelSelector?.tintOpacity || globalFilter.tintOpacity}
                        bgImage={modelSelector?.bgImage}
                        bgImageOpacity={modelSelector?.bgImageOpacity}
                        bgImageBlur={modelSelector?.bgImageBlur}
                        bgImageFit={modelSelector?.bgImageFit}
                      />
                      <div className="relative z-10">
                      <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                        AI Workflow Mode
                      </div>
                      {[
                        { ...AUTO_WORKFLOW_INFO, id: 'auto' as const },
                        ...WORKFLOW_CATEGORIES,
                      ].map(modeItem => {
                        const Icon =
                          modeItem.id === 'auto'
                            ? Wand2
                            : modeItem.id === 'turbo'
                            ? Zap
                            : modeItem.id === 'deep-thought'
                            ? Brain
                            : Sparkles;
                        return (
                          <div
                            key={modeItem.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setWorkflowMode(modeItem.id);
                              setModelCategoryTab(modeItem.id === 'auto' ? 'turbo' : modeItem.id);
                              localStorage.setItem('exco:chat:workflow-mode', modeItem.id);
                              setShowModeSelector(false);
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setWorkflowMode(modeItem.id);
                                setModelCategoryTab(modeItem.id === 'auto' ? 'turbo' : modeItem.id);
                                localStorage.setItem('exco:chat:workflow-mode', modeItem.id);
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
                    </div>
                  )}
                </div>

                {/* Voice Input Button (Voice-to-Text) */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  disabled={isTranscribing || voiceChatActive}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                    isRecording
                      ? 'bg-red-500/20 text-red-400 animate-pulse ring-1 ring-red-400/50'
                      : isTranscribing
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title={isRecording ? 'Stop recording and convert speech to text' : isTranscribing ? 'Transcribing audio...' : 'Voice input (speech to text)'}
                >
                  {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Live Voice Chat Button (Right next to Voice Input Button) */}
                <button
                  type="button"
                  onClick={() => {
                    if (voiceChatActive) {
                      window.dispatchEvent(new CustomEvent('exco:voice-chat-restore'));
                      return;
                    }
                    if (isRecording) {
                      cleanupAudioCapture();
                      setIsRecording(false);
                    }
                    setVoiceError(null);
                    setVoiceChatActive(true);
                  }}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                    voiceChatActive
                      ? 'bg-sky-500/20 text-sky-400 animate-pulse ring-1 ring-sky-400/50'
                      : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title={voiceChatActive ? 'Live voice chat active' : 'Start live voice chat'}
                >
                  <AudioLines className="w-4 h-4" />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!input.trim() && attachedFiles.length === 0) || loading || streaming}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                    input.trim() || attachedFiles.length > 0
                      ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/80 border border-slate-900/15 dark:border-white/25 text-[rgb(var(--color-primary-foreground))] hover:bg-[rgb(var(--color-primary-hover))]'
                      : 'bg-slate-200 border border-slate-300 text-slate-600 dark:bg-[rgb(var(--color-primary))]/50 dark:border-white/15 dark:text-white/85 cursor-not-allowed'
                  )}
                  title="Send message"
                >
                  {loading || streaming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { ChatbotMode };
export default ChatbotMode;