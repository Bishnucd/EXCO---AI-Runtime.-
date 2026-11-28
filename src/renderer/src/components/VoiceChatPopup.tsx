/**
 * EXCO Live Bidirectional Voice Chat Pop-up
 * Isolated floating voice interface with:
 * - Left-side live session timer (MM:SS) & audio level bars
 * - Mute/Unmute Mic, Mute/Unmute AI Sound, Voice Speed & Calibration popover, Search transcript, Minimize, End Chat
 * - Strict isolation: model routing, failover, and responses stay inside this pop-up until the call ends.
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Search,
  Minimize2,
  Maximize2,
  PhoneOff,
  Send,
  X,
  AudioLines,
  Loader2,
  Square,
  Settings,
} from 'lucide-react';
import { cn, formatVoiceDuration } from '@shared/utils';
import type { VoiceSessionPayload, VoiceTranscriptEntry } from '@shared/types';
import { encodeSamplesToWavBase64, type WorkflowSelection } from '../utils/chatHelpers';
import {
  useVoiceSettingsStore,
  VOICE_MODULE_PRESETS,
  VOICE_PREVIEW_SENTENCE,
  getInstantVoicePreviewAudio,
  resolveVoiceForModule,
  stripLeadingSpeakerLabel,
  getVadThresholdForSensitivity,
  cleanTextForSpeech,
  stopAllVoiceAudio,
  playExclusiveAudioBase64,
  playExclusiveAudioUrl,
  setLiveVoicePlaybackSpeed,
  type ApiVoiceOption,
  type MicSensitivity,
} from '../stores/voiceSettingsStore';
import { useThemeStore, getSegmentStyle } from '../stores/themeStore';
import { VisualOverlay } from './VisualOverlay';

interface VoiceChatPopupProps {
  conversationId?: string;
  selectedModel: string;
  selectedKeyId: string;
  preferredFailover: boolean;
  workflowMode: WorkflowSelection;
  onEndSession: (payload: VoiceSessionPayload) => Promise<void>;
  onCancelEmpty: () => void;
}

type VoicePhase = 'listening' | 'transcribing' | 'thinking' | 'speaking' | 'muted' | 'error';

export const VoiceChatPopup: React.FC<VoiceChatPopupProps> = ({
  conversationId,
  selectedModel,
  selectedKeyId,
  preferredFailover,
  workflowMode,
  onEndSession,
  onCancelEmpty,
}) => {
  const voiceSettings = useVoiceSettingsStore();
  const { modelSelector } = useThemeStore((s) => s.segments);
  const globalFilter = useThemeStore((s) => s.globalFilter);

  const [sessionId] = useState(() => `voice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const [startedAt] = useState(() => Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [aiMuted, setAiMuted] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [phase, setPhase] = useState<VoicePhase>('listening');
  const [statusLabel, setStatusLabel] = useState('Listening...');
  const [activeModelLabel, setActiveModelLabel] = useState<string>('');
  const [livePreviewText, setLivePreviewText] = useState<string>('');
  const [micLevel, setMicLevel] = useState(0);
  const [entries, setEntries] = useState<VoiceTranscriptEntry[]>([]);
  const [ending, setEnding] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [apiVoices, setApiVoices] = useState<ApiVoiceOption[]>([]);

  useEffect(() => {
    const load = () => {
      window.exco.chat.listApiVoices?.().then(list => setApiVoices(Array.isArray(list) ? list : [])).catch(() => {});
    };
    load();
    window.addEventListener('exco:keys-updated', load);
    return () => window.removeEventListener('exco:keys-updated', load);
  }, []);

  // Mutable refs for audio loop & cancellation
  const isMountedRef = useRef(true);
  const endingRef = useRef(false);
  const micMutedRef = useRef(false);
  const aiMutedRef = useRef(false);
  const phaseRef = useRef<VoicePhase>('listening');
  const entriesRef = useRef<VoiceTranscriptEntry[]>([]);
  const modelsUsedRef = useRef<Set<string>>(new Set());

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  const preBufferRef = useRef<Float32Array[]>([]);
  const speechChunksRef = useRef<Float32Array[]>([]);
  const isUserSpeakingRef = useRef(false);
  const consecutiveLoudFramesRef = useRef(0);
  const activeSpeechFramesRef = useRef(0);
  const peakRmsRef = useRef(0);
  const noiseFloorRmsRef = useRef(0.005);
  const echoGuardUntilRef = useRef(0);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const lastVoiceActiveAtRef = useRef(0);
  const speechStartedAtRef = useRef(0);
  const ttsAbortTokenRef = useRef(0);
  const turnAudioTokenRef = useRef(0);
  const streamSpokenOffsetRef = useRef(0);
  const firstChunkQueuedRef = useRef(false);
  const speechQueuePromiseRef = useRef<Promise<void>>(Promise.resolve());
  const processingTurnRef = useRef(false);
  const submitUtteranceRef = useRef<(chunks: Float32Array[], sampleRate: number) => Promise<void>>(async () => {});

  micMutedRef.current = micMuted;
  aiMutedRef.current = aiMuted;
  phaseRef.current = phase;
  entriesRef.current = entries;

  // Tick timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  // Keep latest spoken/typed transcript visible inside the expanded conversation box
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [entries.length, livePreviewText, phase]);

  // Pre-warm Edge Neural TTS WebSocket on mount and whenever edgeVoice changes
  useEffect(() => {
    if (voiceSettings.voiceModule === 'edge-neural') {
      window.exco.chat.warmTts?.(voiceSettings.edgeVoice).catch(() => {});
    }
  }, [voiceSettings.voiceModule, voiceSettings.edgeVoice]);

  // Apply speed changes immediately to any currently playing audio
  useEffect(() => {
    setLiveVoicePlaybackSpeed(voiceSettings.voiceSpeed || 1.0);
  }, [voiceSettings.voiceSpeed]);

  const enqueueSpeechSegment = useCallback(
    (segmentText: string, turnToken: number) => {
      const spokenText = cleanTextForSpeech(segmentText);
      if (!spokenText || aiMutedRef.current || endingRef.current || ttsAbortTokenRef.current !== turnToken) {
        return;
      }

      const settings = useVoiceSettingsStore.getState();
      const isApiVoice =
        settings.voiceModule === 'elevenlabs' ||
        settings.voiceModule === 'gemini' ||
        settings.voiceModule === 'openai' ||
        settings.voiceModule === 'custom';
      const synthKeyId = isApiVoice ? settings.apiVoiceKeyId || selectedKeyId || undefined : selectedKeyId || undefined;
      // Synthesize cleanly in background so playback starts immediately without starving the socket
      const synthPromise = window.exco.chat.synthesizeSpeech({
        text: spokenText,
        engine: settings.voiceModule,
        voice: resolveVoiceForModule(settings),
        modelId: isApiVoice ? settings.apiVoiceModelId || undefined : undefined,
        baseUrl: isApiVoice ? settings.apiVoiceBaseUrl || undefined : undefined,
        speed: settings.voiceSpeed,
        pitch: settings.voicePitch,
        keyId: synthKeyId,
      });

      speechQueuePromiseRef.current = speechQueuePromiseRef.current.then(async () => {
        if (ttsAbortTokenRef.current !== turnToken || aiMutedRef.current || endingRef.current) return;
        setPhase('speaking');
        setStatusLabel('EXCO speaking...');

        try {
          const res = await synthPromise;
          if (ttsAbortTokenRef.current !== turnToken || aiMutedRef.current || endingRef.current) return;
          if (res?.warning) setErrorBanner(res.warning);

          if (res?.audioBase64) {
            const status = await playExclusiveAudioBase64(
              res.audioBase64,
              res.mimeType || 'audio/mpeg',
              useVoiceSettingsStore.getState().voiceSpeed || 1.0,
              turnAudioTokenRef.current
            );
            // Never fall through into SpeechSynthesis when interrupted/aborted
            if (status === 'played' || status === 'aborted') return;
          }

          // Fallback to browser SpeechSynthesis ONLY if TTS synthesis produced no playable audio
          if (
            !res?.audioBase64 &&
            typeof window !== 'undefined' &&
            window.speechSynthesis &&
            ttsAbortTokenRef.current === turnToken &&
            !aiMutedRef.current
          ) {
            await new Promise<void>((resolve) => {
              const cur = useVoiceSettingsStore.getState();
              const utter = new SpeechSynthesisUtterance(spokenText);
              utter.lang = !cur.speechLanguage || cur.speechLanguage === 'auto' ? 'en-US' : cur.speechLanguage;
              utter.rate = cur.voiceSpeed || 1.0;
              utter.pitch = cur.voicePitch || 1.0;
              utter.onend = () => resolve();
              utter.onerror = () => resolve();
              try { window.speechSynthesis.cancel(); window.speechSynthesis.resume(); } catch {}
              window.speechSynthesis.speak(utter);
            });
          }
        } catch {}
      });
    },
    [selectedKeyId]
  );

  // Subscribe ONLY to isolated chat:voice-progress events (never touches main chat)
  useEffect(() => {
    const unsub = window.exco.chat.onVoiceProgress?.((ev) => {
      if (!ev || ev.sessionId !== sessionId || endingRef.current) return;
      if (ev.modelId) {
        setActiveModelLabel(ev.modelId);
      }
      if (ev.type === 'routing') {
        streamSpokenOffsetRef.current = 0;
        firstChunkQueuedRef.current = false;
        if (ev.statusText) setStatusLabel(ev.statusText);
        return;
      }
      if (ev.type === 'chunk' && typeof ev.content === 'string') {
        const cleanedChunk = stripLeadingSpeakerLabel(ev.content);
        if (cleanedChunk) {
          setLivePreviewText(cleanedChunk);
          // Pre-synthesize the first spoken clause (>=18 chars on sentence/clause boundary) for instant TTS playback
          if (!firstChunkQueuedRef.current) {
            const unqueued = cleanedChunk.slice(streamSpokenOffsetRef.current);
            const match = unqueued.match(/^([\s\S]{18,}?(?:[.!?,;\n](?:\s+|$)))/);
            if (match) {
              firstChunkQueuedRef.current = true;
              const sentence = match[1];
              streamSpokenOffsetRef.current += sentence.length;
              enqueueSpeechSegment(sentence, ttsAbortTokenRef.current);
            }
          }
        }
      } else if (ev.statusText) {
        setStatusLabel(ev.statusText);
      }
    });
    const onRestore = () => setMinimized(false);
    window.addEventListener('exco:voice-chat-restore', onRestore);
    return () => {
      unsub?.();
      window.removeEventListener('exco:voice-chat-restore', onRestore);
    };
  }, [enqueueSpeechSegment, sessionId]);

  const stopAiSpeech = useCallback(() => {
    ttsAbortTokenRef.current += 1;
    turnAudioTokenRef.current = stopAllVoiceAudio();
    echoGuardUntilRef.current = Date.now() + 950;
    preBufferRef.current = [];
    consecutiveLoudFramesRef.current = 0;
    if (!endingRef.current && isMountedRef.current && phaseRef.current === 'speaking') {
      setPhase(micMutedRef.current ? 'muted' : 'listening');
      setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
    }
  }, []);

  const submitUtterance = useCallback(
    async (chunks: Float32Array[], sampleRate: number) => {
      if (processingTurnRef.current || endingRef.current || chunks.length === 0) return;
      processingTurnRef.current = true;
      setErrorBanner(null);

      try {
        const wavBase64 = encodeSamplesToWavBase64(chunks, sampleRate);
        if (!wavBase64) return;

        setPhase('transcribing');
        setStatusLabel('Transcribing speech...');

        const settings = useVoiceSettingsStore.getState();
        const transcriptRes = await window.exco.chat.transcribeAudio({
          wavBase64,
          keyId: selectedKeyId || undefined,
          preferredEngine: settings.speechEngine,
          language: settings.speechLanguage || 'en',
        });

        if (endingRef.current || !isMountedRef.current) return;

        const userText = (transcriptRes?.text || '').trim();
        if (!userText || userText.length < 2) {
          if (transcriptRes?.error) {
            setErrorBanner(transcriptRes.error);
          }
          setPhase(micMutedRef.current ? 'muted' : 'listening');
          setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
          return;
        }

        const userEntry: VoiceTranscriptEntry = {
          id: `v-u-${Date.now()}`,
          role: 'user',
          text: userText,
          timestamp: Date.now(),
        };
        const updatedEntries = [...entriesRef.current, userEntry];
        entriesRef.current = updatedEntries;
        setEntries(updatedEntries);
        setLivePreviewText(`You: ${userText}`);

        setPhase('thinking');
        setStatusLabel('Selecting model & thinking...');

        const turnToken = ++ttsAbortTokenRef.current;
        turnAudioTokenRef.current = stopAllVoiceAudio();
        streamSpokenOffsetRef.current = 0;
        firstChunkQueuedRef.current = false;
        speechQueuePromiseRef.current = Promise.resolve();

        // Include every previous spoken turn (preserving unanswered inputs if a prior turn failed/switched)
        const historyPayload = updatedEntries.slice(0, -1).map((e) => ({
          role: e.role,
          text: e.text,
        }));

        const reply = await window.exco.chat.voiceTurn({
          sessionId,
          conversationId,
          userText,
          voiceHistory: historyPayload,
          modelId: selectedModel,
          keyId: selectedKeyId || undefined,
          preferredFailover,
          workflowMode: 'turbo',
          language: settings.speechLanguage || 'en',
        });

        if (endingRef.current || reply?.aborted || !isMountedRef.current) return;

        if (reply?.error && !reply?.assistantText) {
          setErrorBanner(reply.error);
          setPhase(micMutedRef.current ? 'muted' : 'listening');
          setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
          return;
        }

        const assistantText = stripLeadingSpeakerLabel(reply?.assistantText || '').trim();
        if (assistantText) {
          if (reply?.modelId && reply.modelId !== 'none') {
            modelsUsedRef.current.add(reply.modelId);
            setActiveModelLabel(reply.modelId);
          }
          const assistantEntry: VoiceTranscriptEntry = {
            id: `v-a-${Date.now()}`,
            role: 'assistant',
            text: assistantText,
            timestamp: Date.now(),
            modelId: reply?.modelId,
            providerId: reply?.providerId,
          };
          const withReply = [...entriesRef.current, assistantEntry];
          entriesRef.current = withReply;
          setEntries(withReply);
          setLivePreviewText(assistantText);

          // Queue any remaining un-spoken tail from the streamed response
          const remainingTail = assistantText.slice(streamSpokenOffsetRef.current).trim();
          if (remainingTail) {
            enqueueSpeechSegment(remainingTail, turnToken);
          }
          await speechQueuePromiseRef.current;

          if (ttsAbortTokenRef.current === turnToken && !endingRef.current && isMountedRef.current) {
            echoGuardUntilRef.current = Date.now() + 950;
            preBufferRef.current = [];
            consecutiveLoudFramesRef.current = 0;
            setPhase(micMutedRef.current ? 'muted' : 'listening');
            setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
          }
        } else {
          setErrorBanner(reply?.error || `No response from ${reply?.modelId || 'model'}.`);
          setPhase(micMutedRef.current ? 'muted' : 'listening');
          setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
        }
      } catch (err: any) {
        if (!endingRef.current && isMountedRef.current) {
          setErrorBanner(err?.message || 'Voice turn failed.');
          setPhase(micMutedRef.current ? 'muted' : 'listening');
          setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
        }
      } finally {
        processingTurnRef.current = false;
      }
    },
    [conversationId, enqueueSpeechSegment, preferredFailover, selectedKeyId, selectedModel, sessionId, workflowMode]
  );

  submitUtteranceRef.current = submitUtterance;

  // Cleanup mic & audio resources
  const cleanupAudio = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try { processorRef.current?.disconnect(); } catch {}
    processorRef.current = null;
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}
    streamRef.current = null;
  }, []);

  // Initialize continuous microphone capture + VAD loop
  useEffect(() => {
    isMountedRef.current = true;
    let cancelled = false;

    const startMic = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setPhase('error');
          setStatusLabel('Microphone unavailable');
          setErrorBanner('Microphone capture is not supported in this window.');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        const silentGain = ctx.createGain();
        silentGain.gain.value = 0;

        source.connect(analyser);
        analyser.connect(processor);
        processor.connect(silentGain);
        silentGain.connect(ctx.destination);

        streamRef.current = stream;
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
        processorRef.current = processor;

        processor.onaudioprocess = (ev) => {
          if (endingRef.current || cancelled) return;
          const channel = new Float32Array(ev.inputBuffer.getChannelData(0));

          let sumSq = 0;
          for (let i = 0; i < channel.length; i++) {
            sumSq += channel[i] * channel[i];
          }
          const rms = Math.sqrt(sumSq / channel.length);
          const scaledLevel = Math.min(1, rms * 10);
          setMicLevel(micMutedRef.current ? 0 : scaledLevel);

          const settings = useVoiceSettingsStore.getState();
          const baseThreshold = getVadThresholdForSensitivity(settings.micSensitivity);
          const adaptiveThreshold = Math.max(baseThreshold, Math.min(0.12, noiseFloorRmsRef.current * 2.6));
          const nowMs = Date.now();

          // Ignore mic input while muted, processing a turn, speaking (echo guard), or during 650ms post-TTS reverb cooldown
          const blockedByEcho =
            (settings.pauseMicWhileSpeaking && phaseRef.current === 'speaking') ||
            nowMs < echoGuardUntilRef.current;
          if (micMutedRef.current || processingTurnRef.current || blockedByEcho) {
            isUserSpeakingRef.current = false;
            consecutiveLoudFramesRef.current = 0;
            activeSpeechFramesRef.current = 0;
            peakRmsRef.current = 0;
            speechChunksRef.current = [];
            preBufferRef.current = [];
            return;
          }

          // Update rolling noise floor only during quiet non-speaking intervals
          if (!isUserSpeakingRef.current && rms < adaptiveThreshold) {
            noiseFloorRmsRef.current = noiseFloorRmsRef.current * 0.94 + rms * 0.06;
          }

          // Maintain rolling ~0.5s pre-speech ring buffer
          preBufferRef.current.push(channel);
          if (preBufferRef.current.length > 6) {
            preBufferRef.current.shift();
          }

          if (rms >= adaptiveThreshold) {
            consecutiveLoudFramesRef.current += 1;

            // Barge-in requires 2+ consecutive loud frames so speaker pops/clicks never cut off AI speech
            if (phaseRef.current === 'speaking' && !settings.pauseMicWhileSpeaking && consecutiveLoudFramesRef.current >= 2) {
              stopAiSpeech();
            }

            if (!isUserSpeakingRef.current) {
              // Debounce: require 2 consecutive frames (~170ms) above threshold before opening speech capture
              if (consecutiveLoudFramesRef.current >= 2) {
                isUserSpeakingRef.current = true;
                speechStartedAtRef.current = nowMs;
                activeSpeechFramesRef.current = consecutiveLoudFramesRef.current;
                peakRmsRef.current = rms;
                speechChunksRef.current = [...preBufferRef.current];
                setStatusLabel('Hearing you...');
              }
            } else {
              activeSpeechFramesRef.current += 1;
              if (rms > peakRmsRef.current) peakRmsRef.current = rms;
              speechChunksRef.current.push(channel);
            }
            lastVoiceActiveAtRef.current = nowMs;
          } else {
            consecutiveLoudFramesRef.current = 0;
            if (isUserSpeakingRef.current) {
              speechChunksRef.current.push(channel);
              const silentFor = nowMs - lastVoiceActiveAtRef.current;
              if (silentFor >= (settings.silenceDelayMs || 1150)) {
                const spokenDuration = nowMs - speechStartedAtRef.current;
                const activeFrames = activeSpeechFramesRef.current;
                const peakRms = peakRmsRef.current;
                const captured = [...speechChunksRef.current];
                isUserSpeakingRef.current = false;
                activeSpeechFramesRef.current = 0;
                peakRmsRef.current = 0;
                speechChunksRef.current = [];
                preBufferRef.current = [];
                // Reject transient clicks/ghost triggers: require >=4 vocal frames (~340ms) and clear peak above ambient floor
                if (spokenDuration >= 480 && activeFrames >= 4 && peakRms >= adaptiveThreshold * 1.15) {
                  submitUtteranceRef.current(captured, ctx.sampleRate || 48000);
                } else {
                  setStatusLabel('Listening...');
                }
              }
            }
          }
        };
      } catch (err: any) {
        if (!cancelled) {
          setPhase('error');
          setStatusLabel('Microphone access denied');
          setErrorBanner(err?.message || 'Microphone permission denied or unavailable.');
        }
      }
    };

    startMic();

    return () => {
      cancelled = true;
      isMountedRef.current = false;
      stopAiSpeech();
      cleanupAudio();
      window.exco.chat.cancelVoiceTurn(sessionId).catch(() => {});
    };
  }, [cleanupAudio, sessionId, stopAiSpeech]);

  const playVoiceSwitchSample = useCallback(async () => {
    if (aiMutedRef.current || endingRef.current) return;
    stopAiSpeech();
    const latest = useVoiceSettingsStore.getState();
    const turnToken = ++ttsAbortTokenRef.current;
    const audioToken = stopAllVoiceAudio();
    turnAudioTokenRef.current = audioToken;
    try {
      if (latest.voiceModule === 'edge-neural') {
        const prebuiltBase64 = getInstantVoicePreviewAudio(latest.edgeVoice);
        if (prebuiltBase64) {
          await playExclusiveAudioBase64(
            prebuiltBase64,
            'audio/mpeg',
            latest.voiceSpeed || 1.0,
            audioToken
          );
          return;
        }
      } else if (latest.apiVoicePreviewUrl) {
        const resStatus = await playExclusiveAudioUrl(latest.apiVoicePreviewUrl, latest.voiceSpeed || 1.0, audioToken);
        if (resStatus === 'played' || resStatus === 'aborted') return;
      }

      const isApiVoice =
        latest.voiceModule === 'elevenlabs' ||
        latest.voiceModule === 'gemini' ||
        latest.voiceModule === 'openai' ||
        latest.voiceModule === 'custom';
      const synthKeyId = isApiVoice ? latest.apiVoiceKeyId || selectedKeyId || undefined : selectedKeyId || undefined;

      const res = await window.exco.chat.synthesizeSpeech({
        text: VOICE_PREVIEW_SENTENCE,
        engine: latest.voiceModule,
        voice: resolveVoiceForModule(latest),
        modelId: isApiVoice ? latest.apiVoiceModelId || undefined : undefined,
        baseUrl: isApiVoice ? latest.apiVoiceBaseUrl || undefined : undefined,
        speed: latest.voiceSpeed,
        pitch: latest.voicePitch,
        keyId: synthKeyId,
      });
      if (ttsAbortTokenRef.current !== turnToken || aiMutedRef.current || endingRef.current) return;
      if (res?.warning) setErrorBanner(res.warning);
      if (res?.audioBase64) {
        await playExclusiveAudioBase64(
          res.audioBase64,
          res.mimeType || 'audio/mpeg',
          useVoiceSettingsStore.getState().voiceSpeed || 1.0,
          audioToken
        );
      }
    } catch {}
  }, [selectedKeyId, stopAiSpeech]);

  const handleRetryLastTurn = useCallback(async () => {
    if (processingTurnRef.current || endingRef.current) return;
    const lastEntry = entriesRef.current[entriesRef.current.length - 1];
    const lastUserEntry = lastEntry?.role === 'user'
      ? lastEntry
      : [...entriesRef.current].reverse().find((e) => e.role === 'user');
    if (!lastUserEntry?.text) return;

    processingTurnRef.current = true;
    setErrorBanner(null);
    setPhase('thinking');
    setStatusLabel('Retrying your question...');
    try {
      const settings = useVoiceSettingsStore.getState();
      const turnToken = ++ttsAbortTokenRef.current;
      turnAudioTokenRef.current = stopAllVoiceAudio();
      streamSpokenOffsetRef.current = 0;
      firstChunkQueuedRef.current = false;
      speechQueuePromiseRef.current = Promise.resolve();

      const idx = entriesRef.current.lastIndexOf(lastUserEntry);
      const historyPayload = entriesRef.current
        .slice(0, Math.max(0, idx))
        .map((e) => ({ role: e.role, text: e.text }));

      const reply = await window.exco.chat.voiceTurn({
        sessionId,
        conversationId,
        userText: lastUserEntry.text,
        voiceHistory: historyPayload,
        modelId: selectedModel,
        keyId: selectedKeyId || undefined,
        preferredFailover,
        workflowMode: 'turbo',
        language: settings.speechLanguage || 'en',
      });
      if (endingRef.current || reply?.aborted || !isMountedRef.current) return;
      const assistantText = stripLeadingSpeakerLabel(reply?.assistantText || '').trim();
      if (assistantText) {
        if (reply?.modelId && reply.modelId !== 'none') {
          modelsUsedRef.current.add(reply.modelId);
          setActiveModelLabel(reply.modelId);
        }
        const assistantEntry: VoiceTranscriptEntry = {
          id: `v-a-${Date.now()}`,
          role: 'assistant',
          text: assistantText,
          timestamp: Date.now(),
          modelId: reply?.modelId,
          providerId: reply?.providerId,
        };
        const withReply = [...entriesRef.current, assistantEntry];
        entriesRef.current = withReply;
        setEntries(withReply);
        setLivePreviewText(assistantText);
        const remainingTail = assistantText.slice(streamSpokenOffsetRef.current).trim();
        if (remainingTail) enqueueSpeechSegment(remainingTail, turnToken);
        await speechQueuePromiseRef.current;
      } else {
        setErrorBanner(reply?.error || 'Retry returned an empty response.');
      }
    } catch (err: any) {
      setErrorBanner(err?.message || 'Retry failed.');
    } finally {
      processingTurnRef.current = false;
      if (!endingRef.current && isMountedRef.current) {
        echoGuardUntilRef.current = Date.now() + 950;
        preBufferRef.current = [];
        consecutiveLoudFramesRef.current = 0;
        setPhase(micMutedRef.current ? 'muted' : 'listening');
        setStatusLabel(micMutedRef.current ? 'Mic muted' : 'Listening...');
      }
    }
  }, [conversationId, enqueueSpeechSegment, preferredFailover, selectedKeyId, selectedModel, sessionId]);

  const handleToggleMicMute = () => {
    const next = !micMuted;
    setMicMuted(next);
    micMutedRef.current = next;
    if (next) {
      isUserSpeakingRef.current = false;
      speechChunksRef.current = [];
      setMicLevel(0);
      if (phase === 'listening') setStatusLabel('Mic muted');
      setPhase(phase === 'listening' ? 'muted' : phase);
    } else {
      if (phase === 'muted') {
        setPhase('listening');
        setStatusLabel('Listening...');
      }
    }
  };

  const handleToggleAiMute = () => {
    const next = !aiMuted;
    setAiMuted(next);
    aiMutedRef.current = next;
    if (next) {
      stopAiSpeech();
    }
  };

  const handleManualSendTurn = () => {
    if (!isUserSpeakingRef.current || speechChunksRef.current.length === 0 || processingTurnRef.current) return;
    const captured = [...speechChunksRef.current];
    const rate = audioCtxRef.current?.sampleRate || 48000;
    isUserSpeakingRef.current = false;
    speechChunksRef.current = [];
    preBufferRef.current = [];
    submitUtterance(captured, rate);
  };

  const handleEndVoiceChat = async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    setEnding(true);
    stopAiSpeech();
    cleanupAudio();
    await window.exco.chat.cancelVoiceTurn(sessionId).catch(() => {});

    const capturedEntries = entriesRef.current;
    if (capturedEntries.length === 0) {
      onCancelEmpty();
      return;
    }

    const payload: VoiceSessionPayload = {
      version: 1,
      startedAt,
      endedAt: Date.now(),
      durationSec: Math.max(1, Math.floor((Date.now() - startedAt) / 1000)),
      entries: capturedEntries,
      modelsUsed: Array.from(modelsUsedRef.current),
    };
    await onEndSession(payload);
  };

  const filteredLiveEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) =>
        e.text.toLowerCase().includes(q) ||
        (e.modelId && e.modelId.toLowerCase().includes(q)) ||
        (e.role === 'user' ? 'you' : 'exco').includes(q)
    );
  }, [entries, searchQuery]);

  const timerStr = formatVoiceDuration(elapsedSec);

  // Minimized floating pill
  if (minimized) {
    return (
      <div className="fixed bottom-24 right-6 z-[60] animate-scale-in">
        <div
          className="relative overflow-hidden rounded-full border border-[rgb(var(--color-border))] ui-translucent shadow-2xl px-3.5 py-2 flex items-center gap-2.5"
          style={getSegmentStyle(modelSelector)}
        >
          <span
            className={cn(
              'w-2.5 h-2.5 rounded-full flex-shrink-0',
              phase === 'speaking'
                ? 'bg-emerald-400 animate-pulse'
                : phase === 'thinking' || phase === 'transcribing'
                ? 'bg-sky-400 animate-pulse'
                : micMuted
                ? 'bg-amber-400'
                : 'bg-red-400 animate-pulse'
            )}
          />
          <span className="font-mono text-xs font-semibold text-[rgb(var(--color-foreground))] tabular-nums">
            {timerStr}
          </span>
          <span className="text-[11px] text-[rgb(var(--color-foreground-muted))] max-w-[110px] truncate">
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={handleToggleMicMute}
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
              micMuted
                ? 'bg-amber-500/20 text-amber-400'
                : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))]'
            )}
            title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setMinimized(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
            title="Expand voice chat"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleEndVoiceChat}
            disabled={ending}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30"
            title="End voice chat"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-30 px-4 md:px-8 pb-2 animate-slide-up">
      <div className="max-w-3xl mx-auto relative">
        {/* Calibration / Speed / Voice Modules Popover */}
        {showCalibration && (
          <div
            className="absolute right-0 bottom-full mb-2 w-80 max-w-[92vw] rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] shadow-2xl p-3.5 z-50 space-y-3 animate-scale-in"
            style={getSegmentStyle(modelSelector)}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground))]">
                Voice Speed & Calibration
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalibration(false);
                    window.dispatchEvent(new CustomEvent('exco:open-settings', { detail: { tab: 'voice' } }));
                  }}
                  className="p-1 rounded hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
                  title="Open full Voice Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowCalibration(false)}
                  className="p-1 rounded hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Voice Speed */}
            <div>
              <div className="text-[11px] font-medium text-[rgb(var(--color-foreground-muted))] mb-1.5">
                AI Voice Speed
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => voiceSettings.setVoiceSettings({ voiceSpeed: rate })}
                    className={cn(
                      'py-1 rounded-lg text-[11px] font-mono border transition-colors',
                      voiceSettings.voiceSpeed === rate
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] border-transparent font-semibold'
                        : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))]'
                    )}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Module Quick Picker */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-[rgb(var(--color-foreground-muted))]">
                  Voice Module
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowCalibration(false);
                    window.dispatchEvent(new CustomEvent('exco:open-settings', { detail: { tab: 'voice' } }));
                  }}
                  className="text-[10px] font-medium text-sky-400 hover:underline"
                >
                  + ElevenLabs / API Voices
                </button>
              </div>
              <select
                value={voiceSettings.selectedPresetId}
                onChange={(e) => {
                  const val = e.target.value;
                  const apiMatch = apiVoices.find(v => v.id === val);
                  if (apiMatch) {
                    voiceSettings.applyApiVoice(apiMatch);
                  } else {
                    voiceSettings.applyPreset(val);
                  }
                  playVoiceSwitchSample();
                }}
                className="w-full text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2 py-1.5"
              >
                <optgroup label="Free Built-in (Edge Neural)">
                  {VOICE_MODULE_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
                {apiVoices.length > 0 && (
                  <optgroup label="Extracted API Voices (All Connected Keys)">
                    {apiVoices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.category || v.engine})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Speech Language */}
            <div>
              <div className="text-[11px] font-medium text-[rgb(var(--color-foreground-muted))] mb-1">
                Conversation Language
              </div>
              <select
                value={voiceSettings.speechLanguage}
                onChange={(e) => voiceSettings.setVoiceSettings({ speechLanguage: e.target.value })}
                className="w-full text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2 py-1.5"
              >
                <option value="en">English (en)</option>
                <option value="auto">Auto-detect</option>
                <option value="hi">Hindi (hi)</option>
                <option value="es">Spanish (es)</option>
                <option value="fr">French (fr)</option>
                <option value="de">German (de)</option>
              </select>
            </div>

            {/* Mic Calibration & Live Meter */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[rgb(var(--color-foreground-muted))] mb-1">
                <span>Mic Sensitivity</span>
                <span className="capitalize font-medium text-[rgb(var(--color-foreground))]">{voiceSettings.micSensitivity}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {(['high', 'medium', 'low'] as MicSensitivity[]).map((sens) => (
                  <button
                    key={sens}
                    type="button"
                    onClick={() => voiceSettings.setVoiceSettings({ micSensitivity: sens })}
                    className={cn(
                      'py-1 rounded-lg text-[11px] capitalize border transition-colors',
                      voiceSettings.micSensitivity === sens
                        ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] border-transparent font-semibold'
                        : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))]'
                    )}
                  >
                    {sens === 'high' ? 'Sensitive' : sens === 'medium' ? 'Balanced' : 'Noisy'}
                  </button>
                ))}
              </div>
              <div className="h-1.5 w-full rounded-full bg-[rgb(var(--color-background))] overflow-hidden border border-[rgb(var(--color-border))]">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.round(micLevel * 100)}%` }}
                />
              </div>
            </div>

            <label className="flex items-center justify-between gap-2 text-[11px] text-[rgb(var(--color-foreground-muted))] cursor-pointer pt-1 border-t border-[rgb(var(--color-border))]">
              <span>Pause mic while EXCO speaks</span>
              <input
                type="checkbox"
                checked={voiceSettings.pauseMicWhileSpeaking}
                onChange={(e) => voiceSettings.setVoiceSettings({ pauseMicWhileSpeaking: e.target.checked })}
              />
            </label>
          </div>
        )}

        {/* Always-Visible Expanded Live Transcript & Optional Filter */}
        <div
          className="mb-2 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col"
          style={getSegmentStyle(modelSelector)}
        >
          {showSearch && (
            <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] flex items-center gap-2 bg-[rgb(var(--color-background))]/50">
              <Search className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter live voice transcript..."
                autoFocus
                className="flex-1 text-xs bg-transparent border-0 outline-none p-0 text-[rgb(var(--color-foreground))]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
              >
                Hide Filter
              </button>
            </div>
          )}

          <div className="h-60 sm:h-64 overflow-y-auto px-4 py-3 space-y-2.5">
            {filteredLiveEntries.length === 0 && !(phase === 'thinking' || phase === 'speaking' || phase === 'transcribing') ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <AudioLines className="w-6 h-6 text-sky-400/70 mb-2" />
                <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">
                  {entries.length === 0 ? 'Speak naturally to start' : 'No matching voice turns'}
                </p>
                <p className="text-xs text-[rgb(var(--color-foreground-muted))] mt-1 max-w-md">
                  {entries.length === 0
                    ? 'Everything you say and every AI reply appears clearly here in real time until you end the call.'
                    : 'Clear the filter above to view your full live conversation.'}
                </p>
              </div>
            ) : (
              <>
                {filteredLiveEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex flex-col gap-0.5',
                      entry.role === 'user' ? 'items-end' : 'items-start'
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--color-foreground-muted))] px-1">
                      <span className={cn('font-semibold', entry.role === 'user' ? 'text-sky-400' : 'text-emerald-400')}>
                        {entry.role === 'user' ? 'You' : 'EXCO'}
                      </span>
                      {entry.role === 'assistant' && entry.modelId && (
                        <span className="font-mono opacity-80">· {entry.modelId}</span>
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[88%] rounded-xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words',
                        entry.role === 'user'
                          ? 'bg-sky-500/15 border border-sky-400/25 text-[rgb(var(--color-foreground))]'
                          : 'bg-[rgb(var(--color-background))]/80 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))]'
                      )}
                    >
                      {entry.text}
                    </div>
                  </div>
                ))}

                {/* Live Streaming / Pending Turn Indicator */}
                {phase === 'transcribing' && (
                  <div className="flex items-center gap-2 text-xs text-sky-400 px-1 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Transcribing what you said...</span>
                  </div>
                )}
                {(phase === 'thinking' || phase === 'speaking') &&
                  livePreviewText &&
                  !livePreviewText.startsWith('You:') &&
                  livePreviewText !== filteredLiveEntries[filteredLiveEntries.length - 1]?.text && (
                    <div className="flex flex-col gap-0.5 items-start">
                      <div className="flex items-center gap-1.5 text-[10px] text-[rgb(var(--color-foreground-muted))] px-1">
                        <span className="font-semibold text-emerald-400">EXCO (Live)</span>
                        {activeModelLabel && <span className="font-mono opacity-80">· {activeModelLabel}</span>}
                      </div>
                      <div className="max-w-[88%] rounded-xl px-3.5 py-2 text-[13px] leading-relaxed whitespace-pre-wrap break-words bg-[rgb(var(--color-background))]/80 border border-emerald-400/30 text-[rgb(var(--color-foreground))]">
                        {livePreviewText}
                      </div>
                    </div>
                  )}
                {phase === 'thinking' && (!livePreviewText || livePreviewText.startsWith('You:')) && (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 px-1 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{statusLabel || 'Thinking...'}</span>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Main Voice Chat Pop-up Bar */}
        <div
          className="relative overflow-hidden rounded-2xl border border-[rgb(var(--color-border))] ui-translucent shadow-2xl px-4 py-3"
          style={getSegmentStyle(modelSelector)}
        >
          <VisualOverlay
            grain={modelSelector?.grain || globalFilter.grain}
            tintColor={modelSelector?.tintColor || globalFilter.tintColor || ''}
            tintOpacity={modelSelector?.tintOpacity || globalFilter.tintOpacity}
            bgImage={modelSelector?.bgImage}
            bgImageOpacity={modelSelector?.bgImageOpacity}
            bgImageBlur={modelSelector?.bgImageBlur}
            bgImageFit={modelSelector?.bgImageFit}
          />

          <div className="relative z-10 flex flex-col gap-2">
            {errorBanner && (
              <div className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-400/30 text-xs text-amber-300">
                <span className="truncate">{errorBanner}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {entries.some((e) => e.role === 'user') && !processingTurnRef.current && (
                    <button
                      type="button"
                      onClick={handleRetryLastTurn}
                      className="px-2 py-0.5 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 font-medium"
                    >
                      Retry
                    </button>
                  )}
                  <button type="button" onClick={() => setErrorBanner(null)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              {/* Left Side: Live Timer + Audio Bars + Status */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[rgb(var(--color-background))]/70 border border-[rgb(var(--color-border))] flex-shrink-0">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full',
                      phase === 'speaking'
                        ? 'bg-emerald-400 animate-pulse'
                        : phase === 'thinking' || phase === 'transcribing'
                        ? 'bg-sky-400 animate-pulse'
                        : phase === 'error'
                        ? 'bg-amber-400'
                        : micMuted
                        ? 'bg-slate-400'
                        : 'bg-red-400 animate-pulse'
                    )}
                  />
                  <span className="font-mono text-xs font-semibold tabular-nums text-[rgb(var(--color-foreground))]">
                    {timerStr}
                  </span>
                </div>

                {/* Live Audio Waveform Bars */}
                <div className="flex items-center gap-0.5 h-5 flex-shrink-0" aria-hidden="true">
                  {[0.35, 0.7, 1, 0.65, 0.4].map((weight, idx) => {
                    const active = phase === 'speaking' ? 0.55 + ((idx % 2) * 0.35) : Math.max(0.18, micLevel * weight);
                    return (
                      <span
                        key={idx}
                        className={cn(
                          'w-1 rounded-full transition-all duration-75',
                          phase === 'speaking'
                            ? 'bg-emerald-400'
                            : micMuted
                            ? 'bg-slate-500/40'
                            : 'bg-sky-400'
                        )}
                        style={{ height: `${Math.round(active * 18)}px` }}
                      />
                    );
                  })}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[rgb(var(--color-foreground))] truncate">
                      {statusLabel}
                    </span>
                    {activeModelLabel && (
                      <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-surface-hover))] text-[10px] font-mono text-[rgb(var(--color-foreground-muted))] truncate max-w-[180px]">
                        {activeModelLabel}
                      </span>
                    )}
                    <span className="text-[10px] text-[rgb(var(--color-foreground-muted))] flex-shrink-0">
                      · {entries.length} {entries.length === 1 ? 'turn' : 'turns'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Manual Send / Interrupt */}
                {phase === 'speaking' && (
                  <button
                    type="button"
                    onClick={stopAiSpeech}
                    className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30 flex items-center gap-1"
                    title="Interrupt EXCO speaking"
                  >
                    <Square className="w-3 h-3" />
                    <span>Interrupt</span>
                  </button>
                )}

                {isUserSpeakingRef.current && phase === 'listening' && (
                  <button
                    type="button"
                    onClick={handleManualSendTurn}
                    className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 flex items-center gap-1"
                    title="Send spoken phrase now"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                )}

                {/* Mute Mic */}
                <button
                  type="button"
                  onClick={handleToggleMicMute}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
                    micMuted
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Mute AI Sound */}
                <button
                  type="button"
                  onClick={handleToggleAiMute}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
                    aiMuted
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-400'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title={aiMuted ? 'Unmute EXCO voice' : 'Mute EXCO voice'}
                >
                  {aiMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Voice Speed & Calibration */}
                <button
                  type="button"
                  onClick={() => {
                    setShowCalibration((v) => !v);
                    setShowSearch(false);
                  }}
                  className={cn(
                    'h-8 px-2.5 rounded-full flex items-center gap-1 border text-xs font-mono transition-colors',
                    showCalibration
                      ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] border-transparent'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title="Voice speed, calibration & modules"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{voiceSettings.voiceSpeed}x</span>
                </button>

                {/* Search Live Transcript */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSearch((v) => !v);
                    setShowCalibration(false);
                  }}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border transition-colors',
                    showSearch
                      ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] border-transparent'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  )}
                  title="Search live voice transcript"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Minimize Pop-up */}
                <button
                  type="button"
                  onClick={() => {
                    setShowCalibration(false);
                    setShowSearch(false);
                    setMinimized(true);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
                  title="Minimize voice chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>

                {/* End Voice Chat */}
                <button
                  type="button"
                  onClick={handleEndVoiceChat}
                  disabled={ending}
                  className="h-8 px-3 rounded-full flex items-center gap-1.5 bg-red-500/20 border border-red-400/40 text-red-400 hover:bg-red-500/30 text-xs font-semibold transition-colors"
                  title="End voice chat and save collapsible transcript"
                >
                  {ending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PhoneOff className="w-3.5 h-3.5" />}
                  <span>End</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
