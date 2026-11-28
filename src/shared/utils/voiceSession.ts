/**
 * Shared Voice Chat Session serialization, parsing, and formatting helpers.
 * Keeps live voice chat transcripts isolated in a single collapsible message entry.
 */

import type { VoiceSessionPayload, VoiceTranscriptEntry } from '../types';

export const VOICE_SESSION_MARKER_PREFIX = '<!--EXCO_VOICE_SESSION:';
export const VOICE_SESSION_MARKER_SUFFIX = '-->';

/**
 * Formats seconds into MM:SS or HH:MM:SS for timers and duration badges.
 */
export function formatVoiceDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  if (hrs > 0) {
    return `${String(hrs).padStart(2, '0')}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Serializes a completed voice chat session into a single persisted message string.
 * Stores structured JSON in a leading HTML comment so UI renders one collapsible dropdown,
 * followed by readable markdown transcript for downstream conversation context.
 */
export function serializeVoiceSession(payload: VoiceSessionPayload): string {
  const safePayload: VoiceSessionPayload = {
    version: 1,
    startedAt: payload.startedAt,
    endedAt: payload.endedAt,
    durationSec: Math.max(0, Math.round(payload.durationSec)),
    entries: Array.isArray(payload.entries) ? payload.entries : [],
    modelsUsed: Array.isArray(payload.modelsUsed) ? payload.modelsUsed : [],
  };

  // Escape any accidental "-->" inside JSON strings so comment parsing never breaks.
  const json = JSON.stringify(safePayload).replace(/-->/g, '--\\u003e');
  const durationLabel = formatVoiceDuration(safePayload.durationSec);
  const lines = safePayload.entries.map((entry) => {
    const speaker = entry.role === 'user' ? 'You' : `EXCO${entry.modelId ? ` (${entry.modelId})` : ''}`;
    return `**${speaker}:** ${entry.text}`;
  });

  return [
    `${VOICE_SESSION_MARKER_PREFIX}${json}${VOICE_SESSION_MARKER_SUFFIX}`,
    '',
    `### Voice Chat Transcript (${durationLabel} · ${safePayload.entries.length} turns)`,
    '',
    ...lines,
  ].join('\n');
}

/**
 * Parses a serialized voice chat session message. Returns null for regular messages.
 */
export function parseVoiceSession(content: unknown): VoiceSessionPayload | null {
  if (typeof content !== 'string') return null;
  const trimmed = content.trimStart();
  if (!trimmed.startsWith(VOICE_SESSION_MARKER_PREFIX)) return null;

  const endIdx = trimmed.indexOf(VOICE_SESSION_MARKER_SUFFIX, VOICE_SESSION_MARKER_PREFIX.length);
  if (endIdx === -1) return null;

  const jsonStr = trimmed.slice(VOICE_SESSION_MARKER_PREFIX.length, endIdx);
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.entries)) {
      return null;
    }
    const entries: VoiceTranscriptEntry[] = parsed.entries
      .filter((e: any) => e && (e.role === 'user' || e.role === 'assistant') && typeof e.text === 'string')
      .map((e: any, idx: number) => ({
        id: typeof e.id === 'string' ? e.id : `voice-entry-${idx}`,
        role: e.role,
        text: e.text,
        timestamp: typeof e.timestamp === 'number' ? e.timestamp : parsed.startedAt || Date.now(),
        modelId: typeof e.modelId === 'string' ? e.modelId : undefined,
        providerId: typeof e.providerId === 'string' ? e.providerId : undefined,
      }));

    return {
      version: 1,
      startedAt: typeof parsed.startedAt === 'number' ? parsed.startedAt : Date.now(),
      endedAt: typeof parsed.endedAt === 'number' ? parsed.endedAt : Date.now(),
      durationSec: typeof parsed.durationSec === 'number' ? Math.max(0, parsed.durationSec) : 0,
      entries,
      modelsUsed: Array.isArray(parsed.modelsUsed) ? parsed.modelsUsed.filter((m: any) => typeof m === 'string') : [],
    };
  } catch {
    return null;
  }
}

/**
 * Strips the leading metadata comment when feeding prior messages back into an LLM context.
 */
export function stripVoiceSessionMarkerForContext(content: string): string {
  if (!content.trimStart().startsWith(VOICE_SESSION_MARKER_PREFIX)) return content;
  const endIdx = content.indexOf(VOICE_SESSION_MARKER_SUFFIX);
  if (endIdx === -1) return content;
  return content.slice(endIdx + VOICE_SESSION_MARKER_SUFFIX.length).trim();
}
