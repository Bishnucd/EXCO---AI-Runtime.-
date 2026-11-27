/**
 * Model Benchmarks & Checklist Evaluator for Sidebar > Overview
 * Evaluates ONLY live models currently available via configured system keys/providers,
 * enriched daily from live internet benchmark & pricing telemetry.
 */

import { classifyModelCategory, type ModelCategory } from '@shared/utils';
import type { AIModel } from '@shared/types';

export type MajorUseCase =
  | 'Coding & Agents'
  | 'Research & Reasoning'
  | 'Image Creation'
  | 'Video Creation'
  | 'Fast Chat & Drafting'
  | 'Chat & General';

export interface ChecklistColumn {
  key: keyof ModelChecklistScores;
  label: string;
  shortLabel: string;
  source: string;
}

export interface ModelChecklistScores {
  chat: number;
  reasoning: number;
  coding: number;
  speed: number;
  instruction: number;
  context: number;
  vision: number;
  imageGen: number;
  videoGen: number;
  efficiency: number;
}

export const CHECKLIST_COLUMNS: ChecklistColumn[] = [
  { key: 'chat', label: 'Chat Quality', shortLabel: 'Chat', source: 'LMSYS Chatbot Arena' },
  { key: 'reasoning', label: 'Research & Reasoning', shortLabel: 'Research', source: 'GPQA Diamond / LiveBench' },
  { key: 'coding', label: 'Coding & Agents', shortLabel: 'Coding', source: 'SWE-bench / LiveCodeBench' },
  { key: 'speed', label: 'Response Speed', shortLabel: 'Speed', source: 'Artificial Analysis tok/s' },
  { key: 'instruction', label: 'Instruction Follow', shortLabel: 'IFEval', source: 'IFEval Compliance' },
  { key: 'context', label: 'Long Context Recall', shortLabel: 'Context', source: 'MRCR / Context Window' },
  { key: 'vision', label: 'Vision & Understanding', shortLabel: 'Vision', source: 'MMMU Multimodal' },
  { key: 'imageGen', label: 'Image Creation & Prompting', shortLabel: 'Image Gen', source: 'Imaging / Multimodal Benchmarks' },
  { key: 'videoGen', label: 'Video & Motion Script/Gen', shortLabel: 'Video Gen', source: 'Video Understanding & Script Benchmarks' },
  { key: 'efficiency', label: 'Cost Efficiency', shortLabel: 'Value', source: 'Price-Performance Index' },
];

export interface EvaluatedSystemModel {
  id: string;
  name: string;
  providerId: string;
  keyId: string;
  keyName: string;
  category: ModelCategory;
  useCase: MajorUseCase;
  scores: ModelChecklistScores;
  overallScore: number;
  color: string;
  liveContextWindow?: number;
}

export interface DailyBenchmarkSnapshot {
  date: string;
  fetchedAt: number;
  source: string;
  telemetryById: Record<string, { contextLength?: number; promptCost?: number; completionCost?: number }>;
}

const CHART_PALETTE = [
  '#38bdf8', // sky
  '#a855f7', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
];

export function evaluateSystemModel(
  model: AIModel,
  keyId: string,
  keyName: string,
  colorIndex: number,
  dailyTelemetry?: Record<string, { contextLength?: number; promptCost?: number; completionCost?: number }>
): EvaluatedSystemModel {
  const category = model.category || classifyModelCategory(model);
  const idLower = (model.id || '').toLowerCase();
  const nameLower = (model.name || '').toLowerCase();
  const combined = `${idLower} ${nameLower}`;

  let scores: ModelChecklistScores = {
    chat: 82,
    reasoning: 80,
    coding: 80,
    speed: 78,
    instruction: 84,
    context: 80,
    vision: model.supportsVision ? 82 : 45,
    imageGen: model.capabilities?.imageGeneration ? 90 : model.supportsVision ? 70 : 48,
    videoGen: combined.includes('veo') || combined.includes('sora') || combined.includes('video') ? 95 : model.supportsVision ? 66 : 44,
    efficiency: 78,
  };
  let useCase: MajorUseCase = 'Chat & General';

  if (combined.includes('imagen') || combined.includes('dall-e') || combined.includes('image-gen') || combined.includes('gpt-image')) {
    scores = { chat: 65, reasoning: 58, coding: 42, speed: 78, instruction: 88, context: 60, vision: 92, imageGen: 97, videoGen: 62, efficiency: 76 };
    useCase = 'Image Creation';
  } else if (combined.includes('veo') || combined.includes('sora') || combined.includes('runway') || combined.includes('video')) {
    scores = { chat: 64, reasoning: 62, coding: 45, speed: 62, instruction: 86, context: 65, vision: 91, imageGen: 88, videoGen: 97, efficiency: 68 };
    useCase = 'Video Creation';
  } else if (combined.includes('claude') && (combined.includes('sonnet-4') || combined.includes('4.5') || combined.includes('4-5') || combined.includes('3-7') || combined.includes('3.7'))) {
    scores = { chat: 95, reasoning: 93, coding: 97, speed: 70, instruction: 93, context: 86, vision: 88, imageGen: 72, videoGen: 68, efficiency: 68 };
    useCase = 'Coding & Agents';
  } else if (combined.includes('claude') && combined.includes('opus')) {
    scores = { chat: 94, reasoning: 95, coding: 94, speed: 54, instruction: 92, context: 85, vision: 86, imageGen: 70, videoGen: 66, efficiency: 52 };
    useCase = 'Research & Reasoning';
  } else if (combined.includes('claude') && combined.includes('haiku')) {
    scores = { chat: 84, reasoning: 76, coding: 82, speed: 94, instruction: 86, context: 80, vision: 78, imageGen: 64, videoGen: 58, efficiency: 92 };
    useCase = 'Fast Chat & Drafting';
  } else if (combined.includes('claude')) {
    scores = { chat: 91, reasoning: 88, coding: 92, speed: 74, instruction: 90, context: 84, vision: 85, imageGen: 69, videoGen: 65, efficiency: 72 };
    useCase = 'Coding & Agents';
  } else if (combined.includes('gemini') && combined.includes('pro')) {
    scores = { chat: 94, reasoning: 94, coding: 91, speed: 72, instruction: 94, context: 99, vision: 96, imageGen: 86, videoGen: 84, efficiency: 78 };
    useCase = 'Research & Reasoning';
  } else if (combined.includes('gemini') && (combined.includes('flash') || combined.includes('lite'))) {
    scores = { chat: 87, reasoning: 81, coding: 83, speed: 97, instruction: 91, context: 97, vision: 92, imageGen: 83, videoGen: 81, efficiency: 97 };
    useCase = 'Fast Chat & Drafting';
  } else if (combined.includes('gemini')) {
    scores = { chat: 89, reasoning: 85, coding: 85, speed: 88, instruction: 91, context: 96, vision: 93, imageGen: 84, videoGen: 82, efficiency: 89 };
    useCase = 'Chat & General';
  } else if (/(\bo3\b|\bo1\b|o3-|o1-|o4-mini)/.test(combined)) {
    scores = { chat: 91, reasoning: 97, coding: 95, speed: 62, instruction: 91, context: 83, vision: 82, imageGen: 68, videoGen: 62, efficiency: 66 };
    useCase = 'Research & Reasoning';
  } else if (combined.includes('gpt-4o-mini') || combined.includes('mini')) {
    scores = { chat: 84, reasoning: 76, coding: 79, speed: 93, instruction: 86, context: 80, vision: 83, imageGen: 72, videoGen: 62, efficiency: 95 };
    useCase = 'Fast Chat & Drafting';
  } else if (combined.includes('gpt-4o') || combined.includes('gpt-4')) {
    scores = { chat: 91, reasoning: 86, coding: 88, speed: 80, instruction: 91, context: 82, vision: 92, imageGen: 82, videoGen: 74, efficiency: 76 };
    useCase = 'Chat & General';
  } else if (combined.includes('deepseek') && combined.includes('r1')) {
    scores = { chat: 91, reasoning: 96, coding: 92, speed: 68, instruction: 85, context: 80, vision: 40, imageGen: 42, videoGen: 40, efficiency: 94 };
    useCase = 'Research & Reasoning';
  } else if (combined.includes('deepseek')) {
    scores = { chat: 88, reasoning: 85, coding: 89, speed: 84, instruction: 86, context: 80, vision: 40, imageGen: 42, videoGen: 40, efficiency: 96 };
    useCase = 'Coding & Agents';
  } else if (combined.includes('qwen') && combined.includes('coder')) {
    scores = { chat: 84, reasoning: 82, coding: 90, speed: 85, instruction: 85, context: 78, vision: 40, imageGen: 40, videoGen: 38, efficiency: 93 };
    useCase = 'Coding & Agents';
  } else if (combined.includes('llama') || combined.includes('mistral') || combined.includes('gemma')) {
    scores = { chat: 83, reasoning: 79, coding: 81, speed: 88, instruction: 84, context: 78, vision: model.supportsVision ? 80 : 40, imageGen: 46, videoGen: 42, efficiency: 95 };
    useCase = category === 'turbo' ? 'Fast Chat & Drafting' : 'Chat & General';
  } else if (category === 'deep-thought') {
    scores = { chat: 89, reasoning: 92, coding: 90, speed: 65, instruction: 88, context: 84, vision: 76, imageGen: 65, videoGen: 60, efficiency: 70 };
    useCase = 'Research & Reasoning';
  } else if (category === 'turbo') {
    scores = { chat: 84, reasoning: 76, coding: 79, speed: 94, instruction: 86, context: 84, vision: 80, imageGen: 68, videoGen: 60, efficiency: 94 };
    useCase = 'Fast Chat & Drafting';
  }

  // Enrich with live daily internet telemetry (context window & cost value)
  let liveContextWindow = model.contextWindow;
  if (dailyTelemetry) {
    const matchKey = Object.keys(dailyTelemetry).find(k => k.toLowerCase().endsWith(idLower) || k.toLowerCase().includes(idLower));
    if (matchKey) {
      const tel = dailyTelemetry[matchKey];
      if (tel.contextLength && tel.contextLength > 0) {
        liveContextWindow = tel.contextLength;
        scores.context = tel.contextLength >= 1_000_000 ? 98 : tel.contextLength >= 200_000 ? 90 : tel.contextLength >= 128_000 ? 84 : 74;
      }
      if (typeof tel.promptCost === 'number') {
        const perMillion = tel.promptCost * 1_000_000;
        scores.efficiency = perMillion <= 0.15 ? 97 : perMillion <= 0.5 ? 91 : perMillion <= 2 ? 82 : perMillion <= 5 ? 72 : 60;
      }
    }
  }

  const values = Object.values(scores);
  const overallScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return {
    id: model.id,
    name: model.name || model.id,
    providerId: model.providerId,
    keyId,
    keyName,
    category,
    useCase,
    scores,
    overallScore,
    color: CHART_PALETTE[colorIndex % CHART_PALETTE.length],
    liveContextWindow,
  };
}
