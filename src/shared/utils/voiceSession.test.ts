import { describe, it, expect } from 'vitest';
import {
  formatVoiceDuration,
  serializeVoiceSession,
  parseVoiceSession,
  stripVoiceSessionMarkerForContext,
} from './voiceSession';
import type { VoiceSessionPayload } from '../types';

describe('voiceSession helpers', () => {
  it('formats durations across seconds, minutes, and hours', () => {
    expect(formatVoiceDuration(0)).toBe('00:00');
    expect(formatVoiceDuration(65)).toBe('01:05');
    expect(formatVoiceDuration(1800)).toBe('30:00');
    expect(formatVoiceDuration(3665)).toBe('01:01:05');
  });

  it('serializes and parses a voice session payload round-trip', () => {
    const payload: VoiceSessionPayload = {
      version: 1,
      startedAt: 1700000000000,
      endedAt: 1700001800000,
      durationSec: 1800,
      modelsUsed: ['gemini-2.5-flash', 'gpt-4o-mini'],
      entries: [
        { id: 'u1', role: 'user', text: 'Hey, check this arrow --> test', timestamp: 1700000005000 },
        { id: 'a1', role: 'assistant', text: 'Sure, all good!', timestamp: 1700000010000, modelId: 'gpt-4o-mini', providerId: 'openai' },
      ],
    };

    const serialized = serializeVoiceSession(payload);
    const parsed = parseVoiceSession(serialized);
    expect(parsed).not.toBeNull();
    expect(parsed?.durationSec).toBe(1800);
    expect(parsed?.modelsUsed).toEqual(['gemini-2.5-flash', 'gpt-4o-mini']);
    expect(parsed?.entries).toHaveLength(2);
    expect(parsed?.entries[0].text).toBe('Hey, check this arrow --> test');
    expect(parsed?.entries[1].modelId).toBe('gpt-4o-mini');

    const stripped = stripVoiceSessionMarkerForContext(serialized);
    expect(stripped.startsWith('### Voice Chat Transcript (30:00 · 2 turns)')).toBe(true);
    expect(stripped).toContain('**You:** Hey, check this arrow --> test');
  });

  it('returns null for normal chat messages', () => {
    expect(parseVoiceSession('Hello EXCO')).toBeNull();
    expect(parseVoiceSession([{ type: 'text', text: 'hi' }])).toBeNull();
    expect(parseVoiceSession('<!--EXCO_VOICE_SESSION:not-json-->')).toBeNull();
  });
});
