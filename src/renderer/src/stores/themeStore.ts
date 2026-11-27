/**
 * EXCO Theme Store
 * Manages application theme mode, accent colors, border lines, presets, filters, grain, and per-segment styling
 */

import React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  EXCO_BRAND_WALLPAPER,
  AUTO_WALLPAPER_ID,
  WALLPAPER_CATEGORIES,
  ALL_CURATED_WALLPAPERS,
  getNextAutoWallpaper,
} from './wallpaperCatalog';

export {
  EXCO_BRAND_WALLPAPER,
  AUTO_WALLPAPER_ID,
  WALLPAPER_CATEGORIES,
  ALL_CURATED_WALLPAPERS,
};

export type ThemeMode = 'light' | 'dark' | 'system';

export type AccentColorId =
  | 'dark-gray'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'amber'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'custom';

export type SegmentId =
  | 'titleBar'
  | 'sidebar'
  | 'chatHeader'
  | 'mainCanvas'
  | 'assistantBubble'
  | 'userBubble'
  | 'composer'
  | 'modelSelector'
  | 'modalSurface';

export type GlobalFilterPreset =
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'cyber-cyan'
  | 'high-contrast'
  | 'soft-matte';

export type ThemePresetId =
  | 'default'
  | 'pitch-black'
  | 'graphite'
  | 'pure-white'
  | 'monochrome'
  | 'emerald-filter'
  | 'warm-paper';

export type BackgroundImageFit = 'cover' | 'contain' | 'tile' | 'center';

export interface SegmentAppearance {
  bg: string;
  text: string;
  border: string;
  tintColor: string;
  tintOpacity: number;
  grain: number;
  bgImage?: string;
  bgImageOpacity?: number;
  bgImageBlur?: number;
  bgImageFit?: BackgroundImageFit;
}

export interface GlobalFilterConfig {
  preset: GlobalFilterPreset;
  contrast: number;
  sepia: number;
  grayscale: number;
  tintColor: string;
  tintOpacity: number;
  grain: number;
  bgImage: string;
  bgImageMode?: 'fixed' | 'auto';
  wallpaperCategory?: string;
  autoWallpaperDate?: string;
  autoWallpaperUrl?: string;
  bgImageOpacity: number;
  uiOpacity?: number;
  bgImageBlur: number;
  bgImageFit: BackgroundImageFit;
}

export function getLocalDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function resolveActiveWallpaper(globalFilter: GlobalFilterConfig, seg?: SegmentAppearance): string {
  if (seg?.bgImage && seg.bgImage !== AUTO_WALLPAPER_ID) {
    return seg.bgImage;
  }
  if (globalFilter.bgImageMode === 'auto' || globalFilter.bgImage === AUTO_WALLPAPER_ID) {
    return globalFilter.autoWallpaperUrl || EXCO_BRAND_WALLPAPER;
  }
  return globalFilter.bgImage ?? EXCO_BRAND_WALLPAPER;
}

export const BACKGROUND_WALLPAPERS: Array<{ id: string; label: string; value: string; preview: string }> = [
  { id: 'exco-brand', label: 'Midnight Grid (Default)', value: EXCO_BRAND_WALLPAPER, preview: 'linear-gradient(135deg, #00F2FE, #0B132B)' },
  { id: 'auto-reopen', label: 'Auto (Shift Next on App Reopen)', value: AUTO_WALLPAPER_ID, preview: 'linear-gradient(135deg, #38BDF8, #C084FC)' },
  { id: 'none', label: 'None (Solid Color)', value: '', preview: 'linear-gradient(135deg, #1e293b, #0f172a)' },
];

export const SEGMENT_LABELS: Record<SegmentId, { label: string; desc: string }> = {
  titleBar: { label: 'Title Bar', desc: 'Top window bar, window controls, and top-right tools' },
  sidebar: { label: 'Sidebar', desc: 'Left navigation rail, New Chat button, and chat history' },
  chatHeader: { label: 'Top Chat Bar', desc: 'Conversation header bar above the messages feed' },
  mainCanvas: { label: 'Main Canvas', desc: 'Main chat workspace & Info Page background' },
  assistantBubble: { label: 'AI Reply', desc: 'Assistant response cards and model badges' },
  userBubble: { label: 'User Chat', desc: 'Your sent message pills' },
  composer: { label: 'Prompt Box', desc: 'Bottom input box and toolbar strip' },
  modelSelector: { label: 'Model Selector', desc: 'Key, Model & Workflow pills and dropdown menus' },
  modalSurface: { label: 'Settings & Popups', desc: 'Settings drawer, update card, and confirmation modals' },
};

export const ACCENT_COLORS: Record<
  Exclude<AccentColorId, 'custom'>,
  { label: string; hex: string; primary: string; hover: string; light: string; darkLight: string }
> = {
  'dark-gray': { label: 'Gray Translucent (#474747)', hex: '#474747', primary: '71 71 71', hover: '98 98 98', light: '229 229 229', darkLight: '55 58 68' },
  sky: { label: 'Sky', hex: '#0ea5e9', primary: '14 165 233', hover: '2 132 199', light: '224 242 254', darkLight: '8 47 73' },
  blue: { label: 'Blue', hex: '#3b82f6', primary: '59 130 246', hover: '37 99 235', light: '219 234 254', darkLight: '23 37 84' },
  indigo: { label: 'Indigo', hex: '#6366f1', primary: '99 102 241', hover: '79 70 229', light: '224 231 255', darkLight: '30 27 75' },
  purple: { label: 'Purple', hex: '#a855f7', primary: '168 85 247', hover: '147 51 234', light: '243 232 255', darkLight: '59 7 100' },
  pink: { label: 'Pink', hex: '#ec4899', primary: '236 72 153', hover: '219 39 119', light: '252 231 243', darkLight: '80 7 36' },
  red: { label: 'Red', hex: '#ef4444', primary: '239 68 68', hover: '220 38 38', light: '254 226 226', darkLight: '69 10 10' },
  orange: { label: 'Orange', hex: '#f97316', primary: '249 115 22', hover: '234 88 12', light: '255 237 213', darkLight: '67 20 7' },
  amber: { label: 'Amber', hex: '#f59e0b', primary: '245 158 11', hover: '217 119 6', light: '254 243 199', darkLight: '69 26 3' },
  green: { label: 'Green', hex: '#22c55e', primary: '34 197 94', hover: '22 163 74', light: '220 252 231', darkLight: '5 46 22' },
  teal: { label: 'Teal', hex: '#14b8a6', primary: '20 184 166', hover: '13 148 136', light: '204 251 241', darkLight: '4 47 46' },
  cyan: { label: 'Cyan', hex: '#06b6d4', primary: '6 182 212', hover: '8 145 178', light: '207 250 254', darkLight: '8 51 68' },
};

export const PREBUILT_APP_FONTS: Array<{ id: string; label: string; css: string }> = [
  { id: 'inter', label: 'Inter (Default Sans)', css: "'Inter', 'Segoe UI', system-ui, sans-serif" },
  { id: 'segoe', label: 'Segoe UI (Windows Native)', css: "'Segoe UI', system-ui, sans-serif" },
  { id: 'jakarta', label: 'Plus Jakarta Sans', css: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" },
  { id: 'dmsans', label: 'DM Sans', css: "'DM Sans', 'Inter', system-ui, sans-serif" },
  { id: 'roboto', label: 'Roboto', css: "'Roboto', 'Segoe UI', system-ui, sans-serif" },
  { id: 'ibm', label: 'IBM Plex Sans', css: "'IBM Plex Sans', 'Segoe UI', sans-serif" },
  { id: 'georgia', label: 'Georgia (Editorial Serif)', css: "Georgia, Cambria, 'Times New Roman', serif" },
  { id: 'jetbrains', label: 'JetBrains Mono (Code UI)', css: "'JetBrains Mono', 'Cascadia Code', monospace" },
];

export const PREBUILT_MONO_FONTS: Array<{ id: string; label: string; css: string }> = [
  { id: 'jetbrains', label: 'JetBrains Mono', css: "'JetBrains Mono', 'Fira Code', monospace" },
  { id: 'cascadia', label: 'Cascadia Code', css: "'Cascadia Code', 'Consolas', monospace" },
  { id: 'fira', label: 'Fira Code', css: "'Fira Code', 'JetBrains Mono', monospace" },
  { id: 'ibm-mono', label: 'IBM Plex Mono', css: "'IBM Plex Mono', 'Consolas', monospace" },
  { id: 'consolas', label: 'Consolas', css: "Consolas, 'Courier New', monospace" },
  { id: 'system-mono', label: 'System Monospace', css: "ui-monospace, SFMono-Regular, Menlo, monospace" },
];

export const DEFAULT_SEGMENT_APPEARANCE: SegmentAppearance = {
  bg: '',
  text: '',
  border: '',
  tintColor: '',
  tintOpacity: 0,
  grain: 0,
  bgImage: '',
  bgImageOpacity: 0,
  bgImageBlur: 0,
  bgImageFit: 'cover',
};

export const createDefaultSegments = (): Record<SegmentId, SegmentAppearance> => ({
  titleBar: { ...DEFAULT_SEGMENT_APPEARANCE },
  sidebar: { ...DEFAULT_SEGMENT_APPEARANCE },
  chatHeader: { ...DEFAULT_SEGMENT_APPEARANCE },
  mainCanvas: { ...DEFAULT_SEGMENT_APPEARANCE },
  assistantBubble: { ...DEFAULT_SEGMENT_APPEARANCE },
  userBubble: { ...DEFAULT_SEGMENT_APPEARANCE },
  composer: { ...DEFAULT_SEGMENT_APPEARANCE },
  modelSelector: { ...DEFAULT_SEGMENT_APPEARANCE },
  modalSurface: { ...DEFAULT_SEGMENT_APPEARANCE },
});

export const DEFAULT_GLOBAL_FILTER: GlobalFilterConfig = {
  preset: 'none',
  contrast: 0,
  sepia: 0,
  grayscale: 0,
  tintColor: '',
  tintOpacity: 0,
  grain: 0,
  bgImage: AUTO_WALLPAPER_ID,
  bgImageMode: 'auto',
  wallpaperCategory: 'all',
  autoWallpaperDate: '',
  autoWallpaperUrl: ALL_CURATED_WALLPAPERS[0]?.url || '',
  bgImageOpacity: 1,
  uiOpacity: 0.5,
  bgImageBlur: 0,
  bgImageFit: 'cover',
};

export function hexToRgbTuple(hex: string): string | null {
  const clean = hex?.trim().replace('#', '');
  if (!clean || (clean.length !== 6 && clean.length !== 3)) return null;
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) return null;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export function adjustHex(hex: string, delta: number): string {
  const clean = hex?.trim().replace('#', '');
  if (!clean || clean.length !== 6) return hex;
  const num = parseInt(clean, 16);
  if (Number.isNaN(num)) return hex;
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((num >> 16) & 255) + delta);
  const g = clamp(((num >> 8) & 255) + delta);
  const b = clamp((num & 255) + delta);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getSegmentStyle(seg: SegmentAppearance | undefined): React.CSSProperties {
  if (!seg) return {};
  const style: Record<string, string> = {};
  if (seg.bg) style.backgroundColor = seg.bg;
  if (seg.text) {
    style.color = seg.text;
    const rgb = hexToRgbTuple(seg.text);
    if (rgb) style['--color-foreground'] = rgb;
  }
  if (seg.border) {
    style.borderColor = seg.border;
    const rgb = hexToRgbTuple(seg.border);
    if (rgb) style['--color-border'] = rgb;
  }
  return style as React.CSSProperties;
}

export const THEME_PRESETS: Array<{
  id: ThemePresetId;
  label: string;
  desc: string;
  preview: [string, string, string];
  theme?: ThemeMode;
  accentColor?: AccentColorId;
  customAccentHex?: string;
  borderColor?: string;
  globalFilter?: GlobalFilterConfig;
  segments?: Partial<Record<SegmentId, Partial<SegmentAppearance>>>;
}> = [
  {
    id: 'default',
    label: 'Default Studio',
    desc: 'Clean neutral surfaces',
    preview: ['#000000', '#09090b', '#0ea5e9'],
    accentColor: 'sky',
    borderColor: '',
    globalFilter: { ...DEFAULT_GLOBAL_FILTER },
    segments: {},
  },
  {
    id: 'pitch-black',
    label: 'Pitch Black (OLED)',
    desc: 'Pure pitch-black interface with dark grayish accent & colored icons',
    preview: ['#000000', '#0a0a0c', '#3f3f46'],
    theme: 'dark',
    accentColor: 'dark-gray',
    borderColor: '#1f1f24',
    globalFilter: { ...DEFAULT_GLOBAL_FILTER },
    segments: {
      titleBar: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      sidebar: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      chatHeader: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      mainCanvas: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      assistantBubble: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      userBubble: { bg: '#111114', text: '#fafafa', border: '#27272a' },
      composer: { bg: '#060608', text: '#fafafa', border: '#242429' },
      modelSelector: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
      modalSurface: { bg: '#000000', text: '#fafafa', border: '#1f1f24' },
    },
  },
  {
    id: 'graphite',
    label: 'Grayish Translucent',
    desc: 'Default neutral gray with 50% translucent shells & #474747 accents',
    preview: ['#2c2d33', '#242529', '#474747'],
    theme: 'dark',
    accentColor: 'dark-gray',
    customAccentHex: '#474747',
    borderColor: '#545660',
    globalFilter: { ...DEFAULT_GLOBAL_FILTER },
    segments: {
      titleBar: { bg: '', text: '', border: '' },
      sidebar: { bg: '', text: '', border: '' },
      chatHeader: { bg: '', text: '', border: '' },
      mainCanvas: { bg: '', text: '', border: '' },
      assistantBubble: { bg: '', text: '', border: '' },
      userBubble: { bg: '', text: '', border: '' },
      composer: { bg: '', text: '', border: '' },
      modelSelector: { bg: '', text: '', border: '' },
      modalSurface: { bg: '', text: '', border: '' },
    },
  },
  {
    id: 'pure-white',
    label: 'Everything White',
    desc: 'All-white bright minimalist surfaces',
    preview: ['#ffffff', '#f8fafc', '#0f172a'],
    theme: 'light',
    accentColor: 'custom',
    customAccentHex: '#0f172a',
    borderColor: '#e2e8f0',
    globalFilter: { ...DEFAULT_GLOBAL_FILTER, preset: 'none', tintColor: '#ffffff', tintOpacity: 0, grain: 0 },
    segments: {
      titleBar: { bg: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
      sidebar: { bg: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
      mainCanvas: { bg: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
      composer: { bg: '#f8fafc', text: '#0f172a', border: '#cbd5e1' },
      userBubble: { bg: '#f1f5f9', text: '#0f172a', border: '#e2e8f0' },
    },
  },
  {
    id: 'monochrome',
    label: 'Noir Monochrome',
    desc: 'High-contrast B&W with subtle grain',
    preview: ['#09090b', '#18181b', '#e4e4e7'],
    theme: 'dark',
    accentColor: 'custom',
    customAccentHex: '#a1a1aa',
    borderColor: '#27272a',
    globalFilter: { ...DEFAULT_GLOBAL_FILTER, preset: 'grayscale', tintColor: '', tintOpacity: 0, grain: 0.12 },
    segments: {
      titleBar: { bg: '#09090b', text: '#fafafa', border: '#27272a' },
      sidebar: { bg: '#0d0d10', text: '#e4e4e7', border: '#27272a' },
      mainCanvas: { bg: '#09090b', text: '#fafafa', border: '#27272a' },
      composer: { bg: '#141417', text: '#fafafa', border: '#3f3f46' },
      userBubble: { bg: '#27272a', text: '#fafafa' },
    },
  },
  {
    id: 'emerald-filter',
    label: 'Emerald Studio',
    desc: 'Deep forest emerald glass with subtle grain',
    preview: ['#071915', '#0b241e', '#10b981'],
    theme: 'dark',
    accentColor: 'teal',
    borderColor: '#134e4a',
    globalFilter: {
      ...DEFAULT_GLOBAL_FILTER,
      preset: 'none',
      tintColor: '#10b981',
      tintOpacity: 0.25,
      grain: 0.15,
    },
    segments: {
      titleBar: { bg: '#071a16', text: '#ecfdf5', border: '#115e59' },
      sidebar: { bg: '#081f1a', text: '#d1fae5', border: '#115e59' },
      chatHeader: { bg: '#071a16', text: '#ecfdf5', border: '#115e59' },
      mainCanvas: { bg: '#051411', text: '#ecfdf5', border: '#115e59' },
      composer: { bg: '#0b2620', text: '#ecfdf5', border: '#0f766e' },
      userBubble: { bg: '#113830', text: '#ecfdf5' },
      assistantBubble: { bg: '#08201b', text: '#ecfdf5' },
      modelSelector: { bg: '#081f1a', text: '#ecfdf5', border: '#115e59' },
      modalSurface: { bg: '#081c18', text: '#ecfdf5', border: '#115e59' },
    },
  },
  {
    id: 'warm-paper',
    label: 'Warm Film Grain',
    desc: 'Soft amber/sepia editorial finish',
    preview: ['#faf6ee', '#f3ead8', '#b45309'],
    theme: 'light',
    accentColor: 'amber',
    borderColor: '#dfd3bc',
    globalFilter: {
      ...DEFAULT_GLOBAL_FILTER,
      preset: 'sepia',
      tintColor: '#f59e0b',
      tintOpacity: 0.14,
      grain: 0.2,
    },
    segments: {
      titleBar: { bg: '#f6efe0', text: '#292524', border: '#e2d6be' },
      sidebar: { bg: '#f3ebd8', text: '#292524', border: '#e2d6be' },
      chatHeader: { bg: '#f6efe0', text: '#292524', border: '#e2d6be' },
      mainCanvas: { bg: '#faf6ee', text: '#1c1917', border: '#e2d6be' },
      composer: { bg: '#fffcf5', text: '#1c1917', border: '#d6c6a8' },
      userBubble: { bg: '#ede2cb', text: '#1c1917' },
      modelSelector: { bg: '#f6efe0', text: '#292524', border: '#e2d6be' },
      modalSurface: { bg: '#faf6ee', text: '#1c1917', border: '#dfd3bc' },
    },
  },
];

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  accentColor: AccentColorId;
  customAccentHex: string;
  borderColor: string;
  fontFamily: string;
  activePreset: ThemePresetId;
  globalFilter: GlobalFilterConfig;
  segments: Record<SegmentId, SegmentAppearance>;
  setTheme: (theme: ThemeMode) => void;
  setAccentColor: (color: AccentColorId, customHex?: string) => void;
  setBorderColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setGlobalFilter: (updates: Partial<GlobalFilterConfig>) => void;
  updateSegment: (segment: SegmentId, updates: Partial<SegmentAppearance>) => void;
  resetSegment: (segment: SegmentId) => void;
  applyPreset: (presetId: ThemePresetId) => void;
  resetAppearance: () => void;
  syncAutoWallpaper: (forceOnLaunch?: boolean) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'system'];

function getResolvedTheme(theme: ThemeMode): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function isLightHexColor(hex?: string): boolean {
  const rgb = hex ? hexToRgbTuple(hex) : null;
  if (!rgb) return false;
  const [r, g, b] = rgb.split(' ').map(Number);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.58;
}

function adaptSegmentsToTheme(
  segments: Record<SegmentId, SegmentAppearance>,
  resolvedTheme: 'light' | 'dark'
): Record<SegmentId, SegmentAppearance> {
  const next = { ...segments };
  (Object.keys(next) as SegmentId[]).forEach((segKey) => {
    const seg = { ...next[segKey] };
    if (resolvedTheme === 'light') {
      if (seg.bg && !isLightHexColor(seg.bg)) seg.bg = '';
      if (seg.text && isLightHexColor(seg.text)) seg.text = '';
      if (seg.border && !isLightHexColor(seg.border)) seg.border = '';
    } else {
      if (seg.bg && isLightHexColor(seg.bg)) seg.bg = '';
      if (seg.text && !isLightHexColor(seg.text)) seg.text = '';
      if (seg.border && isLightHexColor(seg.border)) seg.border = '';
    }
    next[segKey] = seg;
  });
  return next;
}

const createGrayishBlackSegments = (): Record<SegmentId, SegmentAppearance> => ({
  titleBar: { ...DEFAULT_SEGMENT_APPEARANCE },
  sidebar: { ...DEFAULT_SEGMENT_APPEARANCE },
  chatHeader: { ...DEFAULT_SEGMENT_APPEARANCE },
  mainCanvas: { ...DEFAULT_SEGMENT_APPEARANCE },
  assistantBubble: { ...DEFAULT_SEGMENT_APPEARANCE },
  userBubble: { ...DEFAULT_SEGMENT_APPEARANCE },
  composer: { ...DEFAULT_SEGMENT_APPEARANCE },
  modelSelector: { ...DEFAULT_SEGMENT_APPEARANCE },
  modalSurface: { ...DEFAULT_SEGMENT_APPEARANCE },
});

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      accentColor: 'dark-gray',
      customAccentHex: '#474747',
      borderColor: '#545660',
      fontFamily: PREBUILT_APP_FONTS[0].css,
      activePreset: 'graphite',
      globalFilter: { ...DEFAULT_GLOBAL_FILTER },
      segments: createGrayishBlackSegments(),

      setTheme: (theme: ThemeMode) => {
        const resolved = getResolvedTheme(theme);
        set((state) => ({
          theme,
          resolvedTheme: resolved,
          borderColor:
            resolved === 'light' && state.borderColor && !isLightHexColor(state.borderColor)
              ? ''
              : resolved === 'dark' && state.borderColor && isLightHexColor(state.borderColor)
              ? ''
              : state.borderColor,
          segments: adaptSegmentsToTheme(state.segments, resolved),
        }));
      },

      setAccentColor: (accentColor: AccentColorId, customHex?: string) => {
        set((state) => ({
          accentColor,
          customAccentHex: customHex ?? (accentColor !== 'custom' ? ACCENT_COLORS[accentColor].hex : state.customAccentHex),
        }));
      },

      setBorderColor: (borderColor: string) => {
        set({ borderColor });
      },

      setFontFamily: (fontFamily: string) => {
        set({ fontFamily });
      },

      setGlobalFilter: (updates: Partial<GlobalFilterConfig>) => {
        set((state) => {
          const nextFilter = { ...state.globalFilter, ...updates };
          const hasWallpaperTarget =
            updates.bgImageMode === 'auto' ||
            (typeof updates.bgImage === 'string' && updates.bgImage.length > 0);
          if (hasWallpaperTarget && updates.bgImageOpacity === undefined && (nextFilter.bgImageOpacity ?? 0) <= 0.005) {
            nextFilter.bgImageOpacity = 1;
          }
          return { globalFilter: nextFilter };
        });
      },

      updateSegment: (segment: SegmentId, updates: Partial<SegmentAppearance>) => {
        set((state) => ({
          segments: {
            ...state.segments,
            [segment]: { ...state.segments[segment], ...updates },
          },
        }));
      },

      resetSegment: (segment: SegmentId) => {
        set((state) => ({
          segments: {
            ...state.segments,
            [segment]: { ...DEFAULT_SEGMENT_APPEARANCE },
          },
        }));
      },

      applyPreset: (presetId: ThemePresetId) => {
        const preset = THEME_PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        const baseSegments = createDefaultSegments();
        if (preset.segments) {
          (Object.keys(preset.segments) as SegmentId[]).forEach((segKey) => {
            baseSegments[segKey] = { ...DEFAULT_SEGMENT_APPEARANCE, ...preset.segments![segKey] };
          });
        }
        const nextTheme = preset.theme ?? get().theme;
        set({
          activePreset: presetId,
          theme: nextTheme,
          resolvedTheme: getResolvedTheme(nextTheme),
          accentColor: preset.accentColor ?? 'sky',
          customAccentHex: preset.customAccentHex ?? (preset.accentColor && preset.accentColor !== 'custom' ? ACCENT_COLORS[preset.accentColor].hex : '#0ea5e9'),
          borderColor: preset.borderColor ?? '',
          globalFilter: preset.globalFilter ? { ...preset.globalFilter } : { ...DEFAULT_GLOBAL_FILTER },
          segments: baseSegments,
        });
      },

      resetAppearance: () => {
        set({
          theme: 'dark',
          resolvedTheme: 'dark',
          activePreset: 'graphite',
          accentColor: 'dark-gray',
          customAccentHex: '#474747',
          borderColor: '#545660',
          fontFamily: PREBUILT_APP_FONTS[0].css,
          globalFilter: { ...DEFAULT_GLOBAL_FILTER, uiOpacity: 0.5 },
          segments: createGrayishBlackSegments(),
        });
      },

      syncAutoWallpaper: (forceOnLaunch = false) => {
        const { globalFilter } = get();
        const isAuto = globalFilter.bgImageMode === 'auto' || globalFilter.bgImage === AUTO_WALLPAPER_ID;
        if (!isAuto) return;

        // Only advance when EXCO opens/launches (never on focus/midnight) and never repeat the previous wallpaper
        if (forceOnLaunch || !globalFilter.autoWallpaperUrl) {
          let storedLast = '';
          try {
            storedLast = localStorage.getItem('exco:last-wallpaper-url') || '';
          } catch {}
          const previousUrl = storedLast || globalFilter.autoWallpaperUrl || resolveActiveWallpaper(globalFilter);
          let picked = getNextAutoWallpaper(
            previousUrl,
            globalFilter.wallpaperCategory || 'all'
          );
          if (picked.url === previousUrl && ALL_CURATED_WALLPAPERS.length > 1) {
            picked = getNextAutoWallpaper(picked.url, 'all');
          }
          try {
            localStorage.setItem('exco:last-wallpaper-url', picked.url);
          } catch {}
          set((state) => ({
            globalFilter: {
              ...state.globalFilter,
              autoWallpaperUrl: picked.url,
              bgImageOpacity: (state.globalFilter.bgImageOpacity ?? 0) > 0.005 ? state.globalFilter.bgImageOpacity : 1,
            },
          }));
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const currentIndex = THEME_ORDER.indexOf(theme);
        const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
        const nextTheme = THEME_ORDER[nextIndex];
        get().setTheme(nextTheme);
      },

      initializeTheme: () => {
        const { theme } = get();
        get().setTheme(theme);
        get().syncAutoWallpaper(true);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
          const { theme } = get();
          if (theme === 'system') {
            get().setTheme('system');
          }
        };

        mediaQuery.addEventListener?.('change', handleChange);
      },
    }),
    {
      name: 'exco:theme',
      version: 10,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined' && state) {
          state.initializeTheme();
        }
      },
      migrate: (persistedState: any, version: number) => {
        if (version < 9) {
          const existingFilter = persistedState?.globalFilter;
          const isFixedPinned =
            existingFilter?.bgImageMode === 'fixed' &&
            typeof existingFilter?.bgImage === 'string' &&
            existingFilter.bgImage.length > 0 &&
            existingFilter.bgImage !== AUTO_WALLPAPER_ID;
          return {
            theme: 'dark',
            accentColor: 'dark-gray',
            customAccentHex: '#474747',
            borderColor: '#545660',
            fontFamily: PREBUILT_APP_FONTS[0].css,
            activePreset: 'graphite',
            globalFilter: isFixedPinned
              ? { ...DEFAULT_GLOBAL_FILTER, ...existingFilter, bgImageOpacity: existingFilter.bgImageOpacity ?? 1 }
              : { ...DEFAULT_GLOBAL_FILTER },
            segments: createGrayishBlackSegments(),
          };
        }
        if (version < 10 && persistedState) {
          const resolved = getResolvedTheme(persistedState.theme || 'dark');
          const nextSegments = adaptSegmentsToTheme(
            { ...createDefaultSegments(), ...(persistedState.segments || {}) },
            resolved
          );
          // Clear legacy graphite hardcoded #ffffff / #2c2d33 / #545660 so CSS light/dark tokens take over cleanly
          (Object.keys(nextSegments) as SegmentId[]).forEach((k) => {
            const s = nextSegments[k];
            if (s.text?.toLowerCase() === '#ffffff' && !s.bg) s.text = '';
            if (s.bg?.toLowerCase() === '#2c2d33') s.bg = '';
            if (s.border?.toLowerCase() === '#545660') s.border = '';
          });
          return {
            ...persistedState,
            segments: nextSegments,
          };
        }
        return persistedState;
      },
      merge: (persistedState: any, currentState: ThemeState) => {
        const persisted = persistedState || {};
        const mergedSegments = createDefaultSegments();
        if (persisted.segments && typeof persisted.segments === 'object') {
          (Object.keys(mergedSegments) as SegmentId[]).forEach((segKey) => {
            if (persisted.segments[segKey]) {
              mergedSegments[segKey] = {
                ...DEFAULT_SEGMENT_APPEARANCE,
                ...persisted.segments[segKey],
              };
            }
          });
        }
        return {
          ...currentState,
          ...persisted,
          globalFilter: {
            ...DEFAULT_GLOBAL_FILTER,
            ...(persisted.globalFilter || {}),
          },
          segments: mergedSegments,
        };
      },
      partialize: (state) => ({
        theme: state.theme,
        accentColor: state.accentColor,
        customAccentHex: state.customAccentHex,
        borderColor: state.borderColor,
        fontFamily: state.fontFamily,
        activePreset: state.activePreset,
        globalFilter: state.globalFilter,
        segments: state.segments,
      }),
    }
  )
);

// Handled cleanly via onRehydrateStorage once persisted localStorage finishes hydrating.

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return children as React.ReactElement;
};