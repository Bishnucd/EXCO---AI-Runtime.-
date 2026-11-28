import { describe, it, expect } from 'vitest';
import {
  classifyModelCategory,
  computeModelBenchmarks,
  segregateCategoryFromScores,
  scoreModelForWorkflowCategory,
  isPathWithin,
  resolveApiKeyProfile,
  inferProviderFromApiKey,
} from './utils';
import {
  appConfigSchema,
  createApiKeyInputSchema,
  createConversationInputSchema,
  createMcpServerInputSchema,
  createProviderInputSchema,
  fileDataSchema,
  updateConversationInputSchema,
  uuidSchema,
} from './schemas';
import { serializeVoiceSession, parseVoiceSession } from './utils/voiceSession';
import { sanitizeHtml } from '../renderer/src/utils/sanitizeHtml';

describe('EXCO Shared Security, Sanitization, Schema & Workflow Tests', () => {
  describe('Smoke & Key Profile Resolution', () => {
    it('detects provider profiles accurately without exposing raw secrets', () => {
      const cases = [
        { key: 'nvapi-testkey1234567890', expectedProvider: 'custom', expectedName: 'NVIDIA NIM' },
        { key: 'sk-or-v1-testkey1234567890', expectedProvider: 'openrouter', expectedName: 'OpenRouter' },
        { key: 'AIzaSyDummyGoogleKeyForUnitTest12345', expectedProvider: 'google', expectedName: 'Google Gemini' },
        { key: 'sk-ant-api03-testkey1234567890', expectedProvider: 'anthropic', expectedName: 'Anthropic Claude' },
        { key: 'gsk_testkey1234567890', expectedProvider: 'custom', expectedName: 'Groq' },
        { key: 'sk_testkey1234567890', expectedProvider: 'custom', expectedName: 'ElevenLabs' },
      ];
      for (const c of cases) {
        const profile = resolveApiKeyProfile(c.key);
        expect(profile.providerId).toBe(c.expectedProvider);
        expect(profile.displayName).toBe(c.expectedName);
        expect(JSON.stringify(profile)).not.toContain(c.key);
      }

      const elevenLabsProfile = resolveApiKeyProfile('sk_testkey1234567890');
      expect(elevenLabsProfile.baseUrl).toBe('https://api.elevenlabs.io/v1');
      expect(elevenLabsProfile.providerId).not.toBe('openai');

      expect(resolveApiKeyProfile('opaque-key', 'custom', 'Aion Labs').baseUrl).toBe('https://api.aionlabs.ai/v1');
      expect(resolveApiKeyProfile('opaque-key', 'custom', 'Parallel').baseUrl).toBe('https://api.parallel.ai/v1');
      expect(resolveApiKeyProfile('opaque-key', 'custom', 'LLM7').baseUrl).toBe('https://api.llm7.io/v1');
      expect(inferProviderFromApiKey('nvapi-abc')).toBe('custom');
    });

    it('classifies turbo, standard, and deep-thought models cleanly via 0-100 Overview scores', () => {
      const flash = computeModelBenchmarks({ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' });
      const r1 = computeModelBenchmarks({ id: 'deepseek-r1', name: 'DeepSeek R1 Reasoning' });
      const gpt4o = computeModelBenchmarks({ id: 'gpt-4o', name: 'GPT-4o' });

      expect(flash.category).toBe('turbo');
      expect(r1.category).toBe('deep-thought');
      expect(gpt4o.category).toBe('standard');

      expect(classifyModelCategory({ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' })).toBe('turbo');
      expect(classifyModelCategory({ id: 'deepseek-r1', name: 'DeepSeek R1 Reasoning' })).toBe('deep-thought');
      expect(classifyModelCategory({ id: 'gpt-4o', name: 'GPT-4o' })).toBe('standard');

      expect(segregateCategoryFromScores(flash.scores)).toBe('turbo');
      expect(segregateCategoryFromScores(r1.scores)).toBe('deep-thought');
      expect(segregateCategoryFromScores(gpt4o.scores)).toBe('standard');

      expect(scoreModelForWorkflowCategory(flash.scores, flash.overallScore, 'turbo')).toBeGreaterThan(
        scoreModelForWorkflowCategory(gpt4o.scores, gpt4o.overallScore, 'turbo')
      );
      expect(scoreModelForWorkflowCategory(r1.scores, r1.overallScore, 'deep-thought')).toBeGreaterThan(
        scoreModelForWorkflowCategory(flash.scores, flash.overallScore, 'deep-thought')
      );
    });

    it('encodes and parses voice sessions safely', () => {
      const encoded = serializeVoiceSession({
        version: 1,
        startedAt: 1795839988000,
        endedAt: 1795840000000,
        durationSec: 12,
        modelsUsed: ['gemini-2.5-flash'],
        entries: [
          { id: 'v1', role: 'user', text: 'Build me a site', timestamp: 1795839988000 },
          { id: 'v2', role: 'assistant', text: 'Done.', modelId: 'gemini-2.5-flash', timestamp: 1795840000000 },
        ],
      });
      const parsed = parseVoiceSession(encoded);
      expect(parsed?.entries).toHaveLength(2);
      expect(parsed?.entries[1].modelId).toBe('gemini-2.5-flash');
      expect(parseVoiceSession('plain text message')).toBeNull();
      expect(parseVoiceSession('<!--EXCO_VOICE_SESSION:{"broken":-->')).toBeNull();
    });
  });

  describe('XSS & HTML Injection Defense (sanitizeHtml)', () => {
    it('strips dangerous scripts, iframes, svgs, styles, and inline event handlers', () => {
      const dirty = [
        '<script>alert("xss")</script>',
        '<img src="https://example.com/a.png" onerror="alert(1)" onload="fetch(\'http://evil\')">',
        '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
        '<svg onload="alert(1)"><circle /></svg>',
        '<style>body { background: url(javascript:alert(1)); }</style>',
        '<object data="evil.swf"></object><embed src="evil.swf">',
        '<math><mi>x</mi></math>',
        '<p onclick="steal()">Safe paragraph</p>',
      ].join('');

      const clean = sanitizeHtml(dirty);
      expect(clean.toLowerCase()).not.toContain('<script');
      expect(clean.toLowerCase()).not.toContain('<iframe');
      expect(clean.toLowerCase()).not.toContain('<svg');
      expect(clean.toLowerCase()).not.toContain('<style');
      expect(clean.toLowerCase()).not.toContain('<object');
      expect(clean.toLowerCase()).not.toContain('<embed');
      expect(clean.toLowerCase()).not.toContain('<math');
      expect(clean.toLowerCase()).not.toContain('onerror');
      expect(clean.toLowerCase()).not.toContain('onload');
      expect(clean.toLowerCase()).not.toContain('onclick');
      expect(clean.toLowerCase()).not.toContain('srcdoc');
      expect(clean).toContain('Safe paragraph');
    });

    it('blocks javascript:, vbscript:, obfuscated schemes, and SVG data URLs while keeping safe links', () => {
      const dirty = [
        '<a href="javascript:alert(1)">Bad1</a>',
        '<a href="j\na\tv\ra\u0000script:alert(1)">Bad2</a>',
        '<a href="vbscript:msgbox(1)">Bad3</a>',
        '<img src="data:image/svg+xml;base64,PHN2Zz4=">',
        '<img src="data:image/png;base64,iVBORw0KGgo=">',
        '<a href="https://github.com/Bishnucd/EXCO">EXCO</a>',
      ].join('');

      const clean = sanitizeHtml(dirty);
      expect(clean.toLowerCase()).not.toContain('javascript:');
      expect(clean.toLowerCase()).not.toContain('vbscript:');
      expect(clean.toLowerCase()).not.toContain('data:image/svg');
      expect(clean).toContain('data:image/png;base64');
      expect(clean).toContain('href="https://github.com/Bishnucd/EXCO"');
      expect(clean).toContain('rel="noopener noreferrer"');
    });
  });

  describe('Path Traversal & Workspace Sandbox Containment (isPathWithin)', () => {
    it('prevents sibling-prefix bypass and parent directory traversal', () => {
      const root = 'C:\\Users\\dev\\Websites\\test';
      expect(isPathWithin(root, root)).toBe(true);
      expect(isPathWithin(root, 'C:\\Users\\dev\\Websites\\test\\index.html')).toBe(true);
      expect(isPathWithin(root, 'c:\\users\\dev\\websites\\test\\sub\\app.js')).toBe(true);

      // Classic sibling prefix trap: /test_other starts with /test stringwise
      expect(isPathWithin(root, 'C:\\Users\\dev\\Websites\\test_other\\secret.txt')).toBe(false);
      // Traversal escape
      expect(isPathWithin(root, 'C:\\Users\\dev\\Websites\\test\\..\\secret.txt')).toBe(false);
      expect(isPathWithin(root, 'C:\\Windows\\System32\\cmd.exe')).toBe(false);
    });
  });

  describe('IPC Input & Zod Validation Security', () => {
    it('rejects SQLi/XSS payloads in UUIDs, out-of-range numbers, and invalid URLs', () => {
      expect(uuidSchema.safeParse("' OR '1'='1").success).toBe(false);
      expect(uuidSchema.safeParse('1234; DROP TABLE conversations; --').success).toBe(false);

      expect(
        updateConversationInputSchema.safeParse({
          id: "not-a-uuid' OR 1=1 --",
          updates: { title: 'x' },
        }).success
      ).toBe(false);

      expect(
        createConversationInputSchema.safeParse({
          title: 'x'.repeat(201),
          temperature: 5,
        }).success
      ).toBe(false);

      expect(
        createProviderInputSchema.safeParse({
          name: 'Bad',
          type: 'custom',
          config: { baseUrl: 'not-a-url' },
        }).success
      ).toBe(false);

      expect(
        fileDataSchema.safeParse({
          name: 'test.txt',
          mimeType: 'text/plain',
          size: -10,
          base64: 'abc',
        }).success
      ).toBe(false);

      expect(
        createApiKeyInputSchema.safeParse({
          keyName: '',
          key: 'secret',
        }).success
      ).toBe(false);

      expect(
        createMcpServerInputSchema.safeParse({
          name: '',
          command: '',
        }).success
      ).toBe(false);

      expect(
        appConfigSchema.safeParse({
          mode: 'work',
          theme: 'dark',
          permissionLevel: 'root-superuser',
        }).success
      ).toBe(false);
    });
  });
});
