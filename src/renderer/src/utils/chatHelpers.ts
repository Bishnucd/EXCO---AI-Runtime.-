/**
 * Shared Chat & Agent Helpers
 * Reusable workflow metadata, formatting helpers, and 16kHz PCM WAV voice encoder
 */

export type WorkflowSelection = 'turbo' | 'standard' | 'deep-thought';

export interface WorkflowOptionMeta {
  id: WorkflowSelection;
  label: string;
  shortDesc: string;
  detail: string;
}

export const WORKFLOW_CATEGORIES: WorkflowOptionMeta[] = [
  {
    id: 'turbo',
    label: 'Turbo',
    shortDesc: 'Ultra-fast instant responses for quick questions & drafting',
    detail: 'Selects the highest-scoring fast models (Flash / Mini / Haiku) ranked by Overview speed & efficiency scores.',
  },
  {
    id: 'standard',
    label: 'Standard',
    shortDesc: 'Balanced speed, depth & reliability for everyday tasks',
    detail: 'Selects the highest-scoring balanced flagship models ranked by Overview overall scores across your configured API keys.',
  },
  {
    id: 'deep-thought',
    label: 'Deep Thought',
    shortDesc: 'Maximum reasoning depth for coding, math & complex plans',
    detail: 'Selects the highest-scoring frontier reasoning models ranked by Overview research & coding scores.',
  },
];

export function formatCompactTokens(num: number | null | undefined): string {
  if (num === null || num === undefined) return '∞';
  if (num === 0) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1)}K`;
  return String(num);
}

export function encodeSamplesToWavBase64(chunks: Float32Array[], sourceRate: number): string {
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
}
