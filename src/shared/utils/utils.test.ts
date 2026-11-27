import { describe, it, expect } from 'vitest';
import {
  cn,
  generateId,
  formatTimestamp,
  formatRelativeTime,
  getFileExtension,
  formatFileSize,
  truncate,
  capitalize,
  slugify,
  deepClone,
  deepMerge,
  clamp,
  isWindows,
  isMac,
  isLinux,
} from '../utils';

describe('Shared Utilities', () => {
  describe('cn', () => {
    it('combines class names', () => {
      expect(cn('a', 'b', 'c')).toBe('a b c');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
    });

    it('merges tailwind classes', () => {
      expect(cn('p-2 p-4', 'm-2')).toBe('p-4 m-2');
    });
  });

  describe('generateId', () => {
    it('generates a valid UUID', () => {
      const id = generateId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it('generates unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('formatTimestamp', () => {
    it('formats timestamp correctly', () => {
      // Fixed date: 2024-01-15 14:30:00 UTC
      const timestamp = 1705329000000;
      const formatted = formatTimestamp(timestamp);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats relative time', () => {
      const now = Date.now();
      const minuteAgo = now - 60000;
      const hourAgo = now - 3600000;
      const dayAgo = now - 86400000;

      expect(formatRelativeTime(minuteAgo)).toContain('minute');
      expect(formatRelativeTime(hourAgo)).toContain('hour');
      expect(formatRelativeTime(dayAgo)).toContain('day');
    });
  });

  describe('getFileExtension', () => {
    it('extracts extension', () => {
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('file.ts')).toBe('ts');
      expect(getFileExtension('path/to/file.json')).toBe('json');
    });

    it('handles no extension', () => {
      expect(getFileExtension('file')).toBe('');
      expect(getFileExtension('.hidden')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('hello world', 8)).toBe('hel...');
      expect(truncate('short', 10)).toBe('short');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('')).toBe('');
      expect(capitalize('WORLD')).toBe('WORLD');
    });
  });

  describe('slugify', () => {
    it('creates slug from string', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Test_String')).toBe('test-string');
      expect(slugify('  spaces  ')).toBe('spaces');
    });
  });

  describe('deepClone', () => {
    it('clones objects deeply', () => {
      const original = { a: 1, b: { c: 2 } };
      const cloned = deepClone(original);
      cloned.b.c = 3;
      expect(original.b.c).toBe(2);
    });
  });

  describe('deepMerge', () => {
    it('merges objects deeply', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { c: 4 }, e: 5 };
      const merged = deepMerge(target, source);
      expect(merged).toEqual({ a: 1, b: { c: 4, d: 3 }, e: 5 });
    });
  });

  describe('clamp', () => {
    it('clamps values', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('platform detection', () => {
    it('detects platform', () => {
      // These will depend on the test environment
      expect(typeof isWindows()).toBe('boolean');
      expect(typeof isMac()).toBe('boolean');
      expect(typeof isLinux()).toBe('boolean');
    });
  });
});