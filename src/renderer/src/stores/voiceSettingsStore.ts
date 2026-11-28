/**
 * EXCO Voice Settings Store
 * Persistent settings for Voice Chat powered by Microsoft Edge Neural TTS,
 * pre-built millisecond voice previews, speech speed, pitch, language, and mic calibration.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import edgeVoicePreviews from '../assets/edgeVoicePreviews.json';

export type VoiceOutputModule = 'edge-neural' | 'elevenlabs' | 'gemini' | 'openai' | 'custom' | 'system';
export type SpeechRecognitionEngine = 'auto' | 'gemini' | 'openai-whisper' | 'windows-speech';
export type MicSensitivity = 'low' | 'medium' | 'high';

export interface ApiVoiceOption {
  id: string;
  engine: 'elevenlabs' | 'gemini' | 'openai' | 'custom';
  keyId: string;
  keyName: string;
  voiceId: string;
  modelId?: string;
  baseUrl?: string;
  name: string;
  category?: string;
  description?: string;
  previewUrl?: string;
}

/** Single uniform single-sentence preview read by every voice module for instant side-by-side comparison. */
export const VOICE_PREVIEW_SENTENCE = 'Hello, I am ready for live voice chat.';

const EDGE_PREVIEW_MAP = edgeVoicePreviews as Record<string, string>;

export function getInstantVoicePreviewAudio(edgeVoice?: string): string | null {
  const key = (edgeVoice || 'en-US-AvaNeural').trim();
  return EDGE_PREVIEW_MAP[key] || EDGE_PREVIEW_MAP['en-US-AvaNeural'] || null;
}

export interface VoiceModulePreset {
  id: string;
  label: string;
  description: string;
  module: VoiceOutputModule;
  edgeVoice: string;
  pitch?: number;
}

export const VOICE_MODULE_PRESETS: VoiceModulePreset[] = [
  {
    id: 'edge-ava',
    label: 'Edge Neural · Ava (Natural Female)',
    description: 'Warm, expressive conversational voice — Microsoft’s best free natural female voice.',
    module: 'edge-neural',
    edgeVoice: 'en-US-AvaNeural',
  },
  {
    id: 'edge-andrew',
    label: 'Edge Neural · Andrew (Warm Male)',
    description: 'Authentic, calm conversational voice — Microsoft’s best free natural male voice.',
    module: 'edge-neural',
    edgeVoice: 'en-US-AndrewNeural',
  },
];

export interface VoiceSettingsState {
  voiceModule: VoiceOutputModule;
  selectedPresetId: string;
  edgeVoice: string;
  apiVoiceId: string;
  apiVoiceModelId: string;
  apiVoiceBaseUrl: string;
  apiVoiceKeyId: string;
  apiVoiceName: string;
  apiVoicePreviewUrl: string;
  systemVoiceURI: string;
  speechEngine: SpeechRecognitionEngine;
  speechLanguage: string;
  voiceSpeed: number;
  voicePitch: number;
  micSensitivity: MicSensitivity;
  silenceDelayMs: number;
  pauseMicWhileSpeaking: boolean;
  setVoiceSettings: (patch: Partial<Omit<VoiceSettingsState, 'setVoiceSettings' | 'applyPreset' | 'applyApiVoice' | 'resetVoiceSettings'>>) => void;
  applyPreset: (presetId: string) => void;
  applyApiVoice: (voice: ApiVoiceOption) => void;
  resetVoiceSettings: () => void;
}

const DEFAULT_VOICE_SETTINGS = {
  voiceModule: 'edge-neural' as VoiceOutputModule,
  selectedPresetId: 'edge-ava',
  edgeVoice: 'en-US-AvaNeural',
  apiVoiceId: '',
  apiVoiceModelId: '',
  apiVoiceBaseUrl: '',
  apiVoiceKeyId: '',
  apiVoiceName: '',
  apiVoicePreviewUrl: '',
  systemVoiceURI: '',
  speechEngine: 'auto' as SpeechRecognitionEngine,
  speechLanguage: 'en',
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  micSensitivity: 'medium' as MicSensitivity,
  silenceDelayMs: 700,
  pauseMicWhileSpeaking: true,
};

export const useVoiceSettingsStore = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_VOICE_SETTINGS,
      setVoiceSettings: (patch) => set((state) => ({ ...state, ...patch })),
      applyPreset: (presetId) => {
        const preset = VOICE_MODULE_PRESETS.find((p) => p.id === presetId) || VOICE_MODULE_PRESETS[0];
        set((state) => ({
          ...state,
          selectedPresetId: preset.id,
          voiceModule: preset.module,
          edgeVoice: preset.edgeVoice,
          apiVoiceId: '',
          apiVoiceModelId: '',
          apiVoiceBaseUrl: '',
          apiVoiceKeyId: '',
          apiVoiceName: '',
          apiVoicePreviewUrl: '',
          ...(preset.pitch !== undefined ? { voicePitch: preset.pitch } : {}),
        }));
      },
      applyApiVoice: (voice) => {
        set((state) => ({
          ...state,
          selectedPresetId: voice.id,
          voiceModule: voice.engine,
          apiVoiceId: voice.voiceId,
          apiVoiceModelId: voice.modelId || '',
          apiVoiceBaseUrl: voice.baseUrl || '',
          apiVoiceKeyId: voice.keyId,
          apiVoiceName: voice.name,
          apiVoicePreviewUrl: voice.previewUrl || '',
        }));
      },
      resetVoiceSettings: () => set({ ...DEFAULT_VOICE_SETTINGS }),
    }),
    {
      name: 'exco:voice:settings:v5',
      storage: createJSONStorage(() => localStorage),
      version: 5,
    }
  )
);

export function getVadThresholdForSensitivity(sensitivity: MicSensitivity): number {
  switch (sensitivity) {
    case 'high':
      return 0.020;
    case 'low':
      return 0.060;
    case 'medium':
    default:
      return 0.036;
  }
}

export function resolveVoiceForModule(
  settings: Pick<VoiceSettingsState, 'voiceModule' | 'edgeVoice' | 'systemVoiceURI' | 'apiVoiceId'>
): string {
  if (settings.voiceModule === 'system') {
    return settings.systemVoiceURI || '';
  }
  if (settings.voiceModule === 'elevenlabs' || settings.voiceModule === 'gemini' || settings.voiceModule === 'openai' || settings.voiceModule === 'custom') {
    return settings.apiVoiceId || '';
  }
  return settings.edgeVoice || 'en-US-AvaNeural';
}

/**
 * Strips leading speaker prefixes like "AI Assistant:" or "EXCO:" from voice replies.
 */
export function stripLeadingSpeakerLabel(raw: string): string {
  return (raw || '')
    .replace(/^\s*(?:\*{0,2}(?:AI\s*Assistant|Assistant|EXCO(?:\s+AI)?|Model|Bot)\*{0,2}\s*[:\-–—]\s*)+/i, '')
    .trimStart();
}

/**
 * Cleans markdown syntax so spoken TTS reads smoothly aloud.
 */
export function cleanTextForSpeech(raw: string): string {
  return stripLeadingSpeakerLabel(raw)
    .replace(/```[\s\S]*?```/g, ' code snippet omitted. ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Global single-channel audio player so two voices can NEVER overlap across the app.
let globalActiveAudio: HTMLAudioElement | null = null;
let globalAudioSessionToken = 0;

export function stopAllVoiceAudio(): number {
  globalAudioSessionToken += 1;
  try {
    window.speechSynthesis?.cancel();
  } catch {}
  if (globalActiveAudio) {
    try {
      globalActiveAudio.onended = null;
      globalActiveAudio.onerror = null;
      globalActiveAudio.pause();
      globalActiveAudio.src = '';
    } catch {}
    globalActiveAudio = null;
  }
  return globalAudioSessionToken;
}

export function setLiveVoicePlaybackSpeed(speed: number): void {
  if (globalActiveAudio) {
    globalActiveAudio.preservesPitch = true;
    globalActiveAudio.playbackRate = speed || 1.0;
  }
}

export function playExclusiveAudioBase64(
  audioBase64: string,
  mimeType: string,
  speed: number,
  expectedToken?: number
): Promise<'played' | 'aborted' | 'error'> {
  return new Promise((resolve) => {
    if (expectedToken !== undefined && expectedToken !== globalAudioSessionToken) {
      resolve('aborted');
      return;
    }

    // Stop any previous audio strictly before starting the next clip
    if (globalActiveAudio) {
      try {
        globalActiveAudio.onended = null;
        globalActiveAudio.onerror = null;
        globalActiveAudio.pause();
        globalActiveAudio.src = '';
      } catch {}
      globalActiveAudio = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {}

    const activeToken = expectedToken ?? globalAudioSessionToken;
    const audio = new Audio(`data:${mimeType || 'audio/mpeg'};base64,${audioBase64}`);
    audio.preservesPitch = true;
    audio.playbackRate = speed || 1.0;
    audio.volume = 1.0;
    globalActiveAudio = audio;

    audio.onended = () => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve(activeToken === globalAudioSessionToken ? 'played' : 'aborted');
    };
    audio.onerror = () => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve('error');
    };
    audio.play().catch(() => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve('error');
    });
  });
}

export function playExclusiveAudioUrl(
  url: string,
  speed: number,
  expectedToken?: number
): Promise<'played' | 'aborted' | 'error'> {
  return new Promise((resolve) => {
    if (!url || (expectedToken !== undefined && expectedToken !== globalAudioSessionToken)) {
      resolve('aborted');
      return;
    }

    if (globalActiveAudio) {
      try {
        globalActiveAudio.onended = null;
        globalActiveAudio.onerror = null;
        globalActiveAudio.pause();
        globalActiveAudio.src = '';
      } catch {}
      globalActiveAudio = null;
    }
    try {
      window.speechSynthesis?.cancel();
    } catch {}

    const activeToken = expectedToken ?? globalAudioSessionToken;
    const audio = new Audio(url);
    audio.preservesPitch = true;
    audio.playbackRate = speed || 1.0;
    audio.volume = 1.0;
    globalActiveAudio = audio;

    audio.onended = () => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve(activeToken === globalAudioSessionToken ? 'played' : 'aborted');
    };
    audio.onerror = () => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve('error');
    };
    audio.play().catch(() => {
      if (globalActiveAudio === audio) globalActiveAudio = null;
      resolve('error');
    });
  });
}
