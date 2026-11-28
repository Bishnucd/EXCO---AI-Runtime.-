/**
 * EXCO Settings Drawer Component
 * Compact, user-friendly slide-out settings panel with General and Appearance tabs
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  User,
  RotateCcw,
  Volume2,
  Play,
  Square,
  Mic,
  Sliders,
  Key,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { cn } from '@shared/utils';
import { useSettingsStore } from '../stores/settingsStore';
import {
  useThemeStore,
  ACCENT_COLORS,
  THEME_PRESETS,
  WALLPAPER_CATEGORIES,
  PREBUILT_APP_FONTS,
  EXCO_BRAND_WALLPAPER,
  AUTO_WALLPAPER_ID,
  resolveActiveWallpaper,
  type AccentColorId,
  type GlobalFilterPreset,
  type BackgroundImageFit,
} from '../stores/themeStore';
import type { Settings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/constants';
import { VisualOverlay } from './VisualOverlay';
import { InfoTip } from './InfoTip';
import {
  useVoiceSettingsStore,
  VOICE_MODULE_PRESETS,
  VOICE_PREVIEW_SENTENCE,
  getInstantVoicePreviewAudio,
  resolveVoiceForModule,
  stopAllVoiceAudio,
  playExclusiveAudioBase64,
  playExclusiveAudioUrl,
  setLiveVoicePlaybackSpeed,
  type ApiVoiceOption,
  type SpeechRecognitionEngine,
  type MicSensitivity,
} from '../stores/voiceSettingsStore';

interface SettingsDrawerProps {
  onClose: () => void;
  initialTab?: string;
}

const TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'voice', label: 'Voice', icon: Volume2 },
] as const;

function isSupportedImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) return true;
  if (file.type && !file.type.startsWith('image/')) return false;
  return /\.(png|jpe?g|webp|gif|bmp|svg|avif|ico|tiff?|heic)$/i.test(file.name);
}

async function readImageAsDataUrl(file: File): Promise<string> {
  if (!isSupportedImageFile(file)) {
    throw new Error('ONLY_IMAGE_FORMAT');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ONLY_IMAGE_FORMAT'));
    reader.onload = () => {
      const rawUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => reject(new Error('ONLY_IMAGE_FORMAT'));
      img.onload = () => {
        // Return original full-quality image without any downscaling or lossy compression
        resolve(rawUrl);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function SettingsDrawer({ onClose, initialTab }: SettingsDrawerProps) {
  const { settings, updateSettings } = useSettingsStore();
  const {
    theme,
    setTheme,
    resolvedTheme,
    accentColor,
    customAccentHex,
    fontFamily,
    activePreset,
    globalFilter,
    segments,
    setAccentColor,
    setFontFamily,
    setGlobalFilter,
    applyPreset,
    resetAppearance,
    syncAutoWallpaper,
  } = useThemeStore();

  const [selectedWallpaperCat, setSelectedWallpaperCat] = useState<string>(
    () =>
      globalFilter.wallpaperCategory && globalFilter.wallpaperCategory !== 'all'
        ? globalFilter.wallpaperCategory
        : WALLPAPER_CATEGORIES[0].id
  );
  const [imageFormatPopup, setImageFormatPopup] = useState<{ fileName: string } | null>(null);
  const globalWallpaperInputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'voice'>(
    initialTab === 'appearance' ? 'appearance' : initialTab === 'voice' ? 'voice' : 'general'
  );
  const voiceSettings = useVoiceSettingsStore();
  const [testingVoice, setTestingVoice] = useState(false);
  const sampleTokenRef = React.useRef(0);
  const [apiVoices, setApiVoices] = useState<ApiVoiceOption[]>([]);
  const [loadingApiVoices, setLoadingApiVoices] = useState(false);
  const [showElevenLabsConnect, setShowElevenLabsConnect] = useState(false);
  const [elevenLabsKeyInput, setElevenLabsKeyInput] = useState('');
  const [savingElevenLabsKey, setSavingElevenLabsKey] = useState(false);
  const [voiceSearchQuery, setVoiceSearchQuery] = useState('');

  const loadApiVoices = React.useCallback(async () => {
    setLoadingApiVoices(true);
    try {
      const list = await window.exco.chat.listApiVoices?.();
      setApiVoices(Array.isArray(list) ? list : []);
    } catch {
      setApiVoices([]);
    } finally {
      setLoadingApiVoices(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'voice') {
      loadApiVoices();
    }
    const onKeysChanged = () => loadApiVoices();
    window.addEventListener('exco:keys-updated', onKeysChanged);
    return () => window.removeEventListener('exco:keys-updated', onKeysChanged);
  }, [activeTab, loadApiVoices]);

  useEffect(() => {
    if (voiceSettings.voiceModule === 'edge-neural') {
      window.exco.chat.warmTts?.(voiceSettings.edgeVoice).catch(() => {});
    }
  }, [voiceSettings.voiceModule, voiceSettings.edgeVoice]);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setStatusNotice({ type, text });
    setTimeout(() => {
      setStatusNotice(prev => (prev?.text === text ? null : prev));
    }, 3500);
  };

  const handleSettingChange = async (key: keyof Settings, value: any) => {
    await updateSettings({ [key]: value });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    handleSettingChange('theme', newTheme);
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
          General Preferences
        </span>
        <button
          type="button"
          onClick={async () => {
            await window.exco.settings.set(DEFAULT_SETTINGS);
            showNotice('success', 'General settings reset to defaults.');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] divide-y divide-[rgb(var(--color-border))] shadow-sm">
        {/* Startup Behavior */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Startup</span>
            <InfoTip align="left" title="Startup Behavior" text="Choose which screen EXCO opens into on launch." />
          </div>
          <select
            value={settings.startupBehavior}
            onChange={e => handleSettingChange('startupBehavior', e.target.value as any)}
            className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
          >
            <option value="welcome">Welcome Screen</option>
            <option value="last-workspace">Last Workspace</option>
            <option value="new-chat">New Chat</option>
            <option value="last-mode">Last Mode</option>
          </select>
        </div>

        {/* Text Size */}
        <div className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Code Text Size (px)</span>
            <InfoTip align="left" title="Code Text Size" text="Font size used inside code blocks and workspace file editors (10–24px)." />
          </div>
          <input
            type="number"
            min={10}
            max={24}
            value={settings.fontSize}
            onChange={e => handleSettingChange('fontSize', Math.min(24, Math.max(10, parseInt(e.target.value) || 14)))}
            className="w-20 text-center font-mono text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2 py-1"
          />
        </div>

        {/* Compact Behavior Toggles */}
        {[
          { key: 'autoSave' as const, label: 'Auto Save', tip: 'Automatically save workspace file edits.' },
          { key: 'compactMode' as const, label: 'Compact Mode', tip: 'Use tighter vertical padding across panels and lists.' },
          { key: 'animationsEnabled' as const, label: 'Animations', tip: 'Enable smooth modal and drawer transition effects.' },
        ].map(toggle => (
          <label key={toggle.key} className="px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">{toggle.label}</span>
              <InfoTip align="left" title={toggle.label} text={toggle.tip} />
            </div>
            <input
              type="checkbox"
              checked={Boolean(settings[toggle.key])}
              onChange={e => handleSettingChange(toggle.key, e.target.checked)}
            />
          </label>
        ))}
      </section>
    </div>
  );

  const renderAppearanceTab = () => {
    const activeAccentHex =
      accentColor === 'custom'
        ? customAccentHex
        : ACCENT_COLORS[accentColor]?.hex || '#3f3f46';

    const clampPctNum = (raw: string): number => {
      const parsed = Number(raw);
      if (Number.isNaN(parsed)) return 0;
      return Math.min(100, Math.max(0, Math.round(parsed)));
    };
    const pctVal = (v: number | undefined): number => Math.round(Math.min(1, Math.max(0, v ?? 0)) * 100);

    const handleWallpaperUpload = async (file: File | undefined) => {
      if (!file) return;
      try {
        const dataUrl = await readImageAsDataUrl(file);
        setGlobalFilter({
          bgImageMode: 'fixed',
          bgImage: dataUrl,
          bgImageOpacity: (globalFilter.bgImageOpacity ?? 0) > 0.005 ? globalFilter.bgImageOpacity : 1,
        });
        showNotice('success', `Applied custom wallpaper "${file.name}".`);
      } catch {
        setImageFormatPopup({ fileName: file.name });
      }
    };

    const activeCatObj = WALLPAPER_CATEGORIES.find(c => c.id === selectedWallpaperCat) || WALLPAPER_CATEGORIES[0];
    const isAutoWallpaper = globalFilter.bgImageMode === 'auto' || globalFilter.bgImage === AUTO_WALLPAPER_ID;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
            Theme &amp; Wallpapers
          </span>
          <button
            type="button"
            onClick={() => {
              resetAppearance();
              showNotice('success', 'Appearance reset to default Grayish Black.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Core Theme Controls */}
        <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] divide-y divide-[rgb(var(--color-border))] shadow-sm">
          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Base Mode</span>
              <InfoTip align="left" title="Base Mode" text={`Switch between Dark, Light, or your OS theme (currently ${resolvedTheme}).`} />
            </div>
            <select
              value={theme}
              onChange={e => handleThemeChange(e.target.value as any)}
              className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
            >
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
              <option value="system">System ({resolvedTheme})</option>
            </select>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Theme Preset</span>
              <InfoTip align="left" title="Theme Preset" text="Coordinated surface and contrast palettes across EXCO." />
            </div>
            <select
              value={activePreset}
              onChange={e => applyPreset(e.target.value as any)}
              className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
            >
              {THEME_PRESETS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Accent Color</span>
              <InfoTip align="left" title="Accent Color" text="Highlight and button accent color across the interface." />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={accentColor}
                onChange={e => setAccentColor(e.target.value as AccentColorId)}
                className="w-40 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
              >
                {(Object.keys(ACCENT_COLORS) as Array<Exclude<AccentColorId, 'custom'>>).map(k => (
                  <option key={k} value={k}>{ACCENT_COLORS[k].label}</option>
                ))}
                <option value="custom">Custom ({customAccentHex})</option>
              </select>
              <input
                type="color"
                value={activeAccentHex}
                onChange={e => setAccentColor('custom', e.target.value)}
                className="w-7 h-7 p-0.5 rounded border border-[rgb(var(--color-border))] bg-transparent cursor-pointer"
                title="Pick custom accent color"
              />
            </div>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Font</span>
              <InfoTip align="left" title="App Font" text="Typography applied to chats, sidebar, and menus." />
            </div>
            <select
              value={PREBUILT_APP_FONTS.some(f => f.css === fontFamily) ? fontFamily : PREBUILT_APP_FONTS[0].css}
              onChange={e => setFontFamily(e.target.value)}
              className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
            >
              {PREBUILT_APP_FONTS.map(f => (
                <option key={f.id} value={f.css}>{f.label}</option>
              ))}
            </select>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Screen Filter</span>
              <InfoTip align="left" title="Screen Filter" text="Optional visual filter applied across the whole window." />
            </div>
            <select
              value={globalFilter.preset}
              onChange={e => setGlobalFilter({ preset: e.target.value as GlobalFilterPreset })}
              className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
            >
              <option value="none">None (Default)</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Warm Sepia</option>
              <option value="cyber-cyan">Cyber Cyan</option>
              <option value="high-contrast">High Contrast</option>
              <option value="soft-matte">Soft Matte</option>
            </select>
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Opacity Level</span>
              <InfoTip align="left" title="Opacity Level" text="Adjusts translucency of the sidebar, top bar, prompt box, and chat bubbles (default 50%)." />
            </div>
            <div className="flex items-center gap-2 w-48">
              <input
                type="range"
                min={0}
                max={100}
                value={pctVal(globalFilter.uiOpacity ?? 0.5)}
                onChange={e => setGlobalFilter({ uiOpacity: clampPctNum(e.target.value) / 100 })}
                className="flex-1 p-0 cursor-pointer accent-[rgb(var(--color-primary))]"
              />
              <span className="text-xs font-mono w-9 text-right">{pctVal(globalFilter.uiOpacity ?? 0.5)}%</span>
            </div>
          </div>
        </section>

        {/* Compact Wallpaper Visibility & Gallery (All 10 Categories x 10 Downloaded Wallpapers Intact) */}
        <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden shadow-sm">
          <input
            ref={globalWallpaperInputRef}
            type="file"
            className="hidden"
            onChange={async e => {
              await handleWallpaperUpload(e.target.files?.[0]);
              e.target.value = '';
            }}
          />

          <div className="px-4 py-2.5 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-foreground))]">
                Wallpapers ({WALLPAPER_CATEGORIES.length} × 10)
              </span>
              <InfoTip
                align="left"
                title="Wallpaper Controls"
                text="Browse all 100 unique wallpapers across 10 categories. Toggle Shift on Reopen / Shift off Reopen to switch wallpapers on each relaunch or lock your selected wallpaper."
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <select
                value={selectedWallpaperCat}
                onChange={e => {
                  const cat = e.target.value;
                  setSelectedWallpaperCat(cat);
                  setGlobalFilter({ wallpaperCategory: cat });
                }}
                className="text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2 py-1"
              >
                {WALLPAPER_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label} ({cat.items.length})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  if (isAutoWallpaper) {
                    const currentShown = resolveActiveWallpaper(globalFilter);
                    setGlobalFilter({
                      bgImageMode: 'fixed',
                      bgImage: currentShown && currentShown !== AUTO_WALLPAPER_ID ? currentShown : activeCatObj.items[0]?.url || '',
                      bgImageOpacity: (globalFilter.bgImageOpacity ?? 0) > 0.005 ? globalFilter.bgImageOpacity : 1,
                    });
                    showNotice('success', 'Shift off Reopen: selected wallpaper will stay fixed across restarts.');
                  } else {
                    setGlobalFilter({
                      bgImageMode: 'auto',
                      bgImage: AUTO_WALLPAPER_ID,
                      wallpaperCategory: 'all',
                      bgImageOpacity: (globalFilter.bgImageOpacity ?? 0) > 0.005 ? globalFilter.bgImageOpacity : 1,
                    });
                    syncAutoWallpaper(true);
                    showNotice('success', 'Shift on Reopen: a new wallpaper loads every time EXCO opens.');
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-colors',
                  isAutoWallpaper
                    ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 border-slate-900/15 dark:border-white/25 text-[rgb(var(--color-primary-foreground))] font-semibold'
                    : 'bg-[rgb(var(--color-surface))] border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                )}
                title={isAutoWallpaper ? 'Currently shifting on every reopen — click to switch to Shift off Reopen' : 'Currently locked — click to switch to Shift on Reopen'}
              >
                <span className={cn('w-2 h-2 rounded-full', isAutoWallpaper ? 'bg-emerald-400' : 'bg-zinc-400')} />
                <span>{isAutoWallpaper ? 'Shift on Reopen' : 'Shift off Reopen'}</span>
              </button>

              <button
                type="button"
                onClick={() => globalWallpaperInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-xs border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))]"
              >
                + Custom
              </button>

              {(globalFilter.bgImage || isAutoWallpaper) && (
                <button
                  type="button"
                  onClick={() => setGlobalFilter({ bgImageMode: 'fixed', bgImage: '', bgImageOpacity: 0 })}
                  className="px-2.5 py-1 rounded-lg text-xs border border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* 10 HD Wallpaper Preview Cards */}
          <div
            className="p-3 space-y-3"
            onDragOver={e => e.preventDefault()}
            onDrop={async e => {
              e.preventDefault();
              await handleWallpaperUpload(e.dataTransfer?.files?.[0]);
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {activeCatObj.items.map((wp, idx) => {
                const isActive = !isAutoWallpaper && globalFilter.bgImage === wp.url;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => {
                      setGlobalFilter({
                        bgImageMode: 'fixed',
                        wallpaperCategory: activeCatObj.id,
                        bgImage: wp.url,
                        bgImageOpacity: (globalFilter.bgImageOpacity ?? 0) > 0.005 ? globalFilter.bgImageOpacity : 1,
                      });
                    }}
                    className={cn(
                      'group relative aspect-video rounded-lg overflow-hidden border-2 transition-all bg-[rgb(var(--color-background))] text-left',
                      isActive
                        ? 'border-[rgb(var(--color-primary))] ring-2 ring-[rgb(var(--color-primary))]/40 scale-[1.02]'
                        : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-foreground-muted))]'
                    )}
                    title={wp.label}
                  >
                    <img
                      src={wp.thumb}
                      alt={wp.label}
                      loading="eager"
                      referrerPolicy="no-referrer"
                      onError={e => {
                        const img = e.currentTarget;
                        const localFallback =
                          activeCatObj.items.find(item => item.url.startsWith('./'))?.thumb || EXCO_BRAND_WALLPAPER;
                        if (!img.dataset.fallbackApplied) {
                          img.dataset.fallbackApplied = '1';
                          img.src = localFallback;
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-1.5 py-1">
                      <p className="text-[9px] font-medium text-white truncate">
                        {idx + 1}. {wp.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Compact Wallpaper Visibility, Blur & Fit */}
            <div className="pt-2 border-t border-[rgb(var(--color-border))] grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[rgb(var(--color-foreground-muted))] whitespace-nowrap">Visibility</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pctVal(globalFilter.bgImageOpacity)}
                  onChange={e => setGlobalFilter({ bgImageOpacity: clampPctNum(e.target.value) / 100 })}
                  className="flex-1 p-0 cursor-pointer accent-[rgb(var(--color-primary))]"
                />
                <span className="text-[11px] font-mono w-9 text-right">{pctVal(globalFilter.bgImageOpacity)}%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[rgb(var(--color-foreground-muted))] whitespace-nowrap">Blur</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pctVal(globalFilter.bgImageBlur)}
                  onChange={e => setGlobalFilter({ bgImageBlur: clampPctNum(e.target.value) / 100 })}
                  className="flex-1 p-0 cursor-pointer accent-[rgb(var(--color-primary))]"
                />
                <span className="text-[11px] font-mono w-9 text-right">{pctVal(globalFilter.bgImageBlur)}%</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-[rgb(var(--color-foreground-muted))]">Fit</span>
                <select
                  value={globalFilter.bgImageFit || 'cover'}
                  onChange={e => setGlobalFilter({ bgImageFit: e.target.value as BackgroundImageFit })}
                  className="text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2 py-1"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="tile">Tile</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const stopSamplePlayback = () => {
    sampleTokenRef.current += 1;
    stopAllVoiceAudio();
    setTestingVoice(false);
  };

  const playVoiceSample = async (overrideVoice?: ApiVoiceOption) => {
    const audioToken = stopAllVoiceAudio();
    const uiToken = ++sampleTokenRef.current;
    const latest = useVoiceSettingsStore.getState();

    setTestingVoice(true);
    try {
      if (overrideVoice?.previewUrl) {
        const resStatus = await playExclusiveAudioUrl(overrideVoice.previewUrl, latest.voiceSpeed || 1.0, audioToken);
        if (resStatus === 'played' || resStatus === 'aborted') {
          if (sampleTokenRef.current === uiToken) setTestingVoice(false);
          return;
        }
      }

      const activeEngine = overrideVoice ? overrideVoice.engine : latest.voiceModule;
      const activeVoice = overrideVoice ? overrideVoice.voiceId : resolveVoiceForModule(latest);
      const activeKeyId = overrideVoice ? overrideVoice.keyId : latest.apiVoiceKeyId || undefined;

      // Pre-built single-sentence preview per Edge Neural voice plays in <1ms with zero network wait
      if (activeEngine === 'edge-neural') {
        const prebuiltBase64 = getInstantVoicePreviewAudio(latest.edgeVoice);
        if (prebuiltBase64) {
          await playExclusiveAudioBase64(
            prebuiltBase64,
            'audio/mpeg',
            latest.voiceSpeed || 1.0,
            audioToken
          );
          if (sampleTokenRef.current === uiToken) {
            setTestingVoice(false);
          }
          return;
        }
      } else if (!overrideVoice && latest.apiVoicePreviewUrl) {
        const resStatus = await playExclusiveAudioUrl(latest.apiVoicePreviewUrl, latest.voiceSpeed || 1.0, audioToken);
        if (resStatus === 'played' || resStatus === 'aborted') {
          if (sampleTokenRef.current === uiToken) setTestingVoice(false);
          return;
        }
      }

      const res = await window.exco.chat.synthesizeSpeech({
        text: VOICE_PREVIEW_SENTENCE,
        engine: activeEngine,
        voice: activeVoice,
        modelId: overrideVoice ? overrideVoice.modelId : latest.apiVoiceModelId || undefined,
        baseUrl: overrideVoice ? overrideVoice.baseUrl : latest.apiVoiceBaseUrl || undefined,
        speed: latest.voiceSpeed,
        pitch: latest.voicePitch,
        keyId: activeKeyId,
      });
      if (sampleTokenRef.current !== uiToken) return;
      if (res?.warning) {
        showNotice('error', res.warning);
      }
      if (res?.audioBase64) {
        await playExclusiveAudioBase64(
          res.audioBase64,
          res.mimeType || 'audio/mpeg',
          useVoiceSettingsStore.getState().voiceSpeed || 1.0,
          audioToken
        );
        if (sampleTokenRef.current === uiToken) {
          setTestingVoice(false);
        }
        return;
      }
      if (res?.error) {
        showNotice('error', res.error);
      }
      if (sampleTokenRef.current === uiToken) {
        setTestingVoice(false);
      }
    } catch {
      if (sampleTokenRef.current === uiToken) setTestingVoice(false);
    }
  };

  const handleOpenElevenLabsPortal = async () => {
    setShowElevenLabsConnect(true);
    try {
      await window.exco.app.openExternal('https://elevenlabs.io/app/settings/api-keys');
    } catch {}
    showNotice('success', 'Opened ElevenLabs in your browser — sign in, copy your API key, and paste it below.');
  };

  const handleSaveElevenLabsKey = async () => {
    const cleanKey = elevenLabsKeyInput.trim();
    if (!cleanKey) return;
    setSavingElevenLabsKey(true);
    try {
      const created = await window.exco.keys.create({
        keyName: 'ElevenLabs',
        key: cleanKey,
      });
      setElevenLabsKeyInput('');
      setShowElevenLabsConnect(false);
      window.dispatchEvent(new CustomEvent('exco:keys-updated', { detail: { keyId: created?.id } }));
      await loadApiVoices();
      showNotice('success', 'ElevenLabs API key saved! Extracted available voices below.');
    } catch (err: any) {
      showNotice('error', err?.message || 'Failed to save ElevenLabs API key');
    } finally {
      setSavingElevenLabsKey(false);
    }
  };

  const handleTestVoiceModule = async () => {
    if (testingVoice) {
      stopSamplePlayback();
      return;
    }
    await playVoiceSample();
  };

  const renderVoiceTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
          Voice Modules & Audio Settings
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestVoiceModule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-sky-500/40 bg-sky-500/15 text-sky-400 hover:bg-sky-500/25"
          >
            {testingVoice ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{testingVoice ? 'Stop Preview' : 'Test Voice'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              voiceSettings.resetVoiceSettings();
              showNotice('success', 'Voice settings reset to defaults.');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Voice Output Modules */}
      <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-sky-400" />
            <span className="text-sm font-semibold text-[rgb(var(--color-foreground))]">Microsoft Edge Neural Voices</span>
            <InfoTip
              align="left"
              title="Instant Voice Comparison"
              text={`Every voice reads "${VOICE_PREVIEW_SENTENCE}" instantly from pre-built audio so you can pick your favorite in milliseconds.`}
            />
          </div>
          <span className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
            Preview: &ldquo;{VOICE_PREVIEW_SENTENCE}&rdquo;
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VOICE_MODULE_PRESETS.map(preset => {
            const active = voiceSettings.selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  voiceSettings.applyPreset(preset.id);
                  showNotice('success', `Voice module set to ${preset.label}.`);
                  playVoiceSample();
                }}
                className={cn(
                  'text-left p-3 rounded-xl border transition-all',
                  active
                    ? 'border-sky-400/70 bg-sky-500/10 ring-1 ring-sky-400/30'
                    : 'border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))]'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[rgb(var(--color-foreground))]">{preset.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-400">
                      Instant
                    </span>
                    {active && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-400">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] mt-1 whitespace-normal leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ElevenLabs Voice Modules (External Sign-In -> Paste API Key -> Extract Voices) */}
      {(() => {
        const elevenLabsVoices = apiVoices.filter(v => v.engine === 'elevenlabs');
        const otherApiVoices = apiVoices.filter(v => v.engine !== 'elevenlabs');
        const queryL = voiceSearchQuery.trim().toLowerCase();
        const filteredEleven = elevenLabsVoices.filter(
          v => !queryL || v.name.toLowerCase().includes(queryL) || (v.description || '').toLowerCase().includes(queryL)
        );
        const filteredOther = otherApiVoices.filter(
          v => !queryL || v.name.toLowerCase().includes(queryL) || v.engine.toLowerCase().includes(queryL)
        );

        return (
          <>
            <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 space-y-3 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-[rgb(var(--color-foreground))]">ElevenLabs Voice Modules</span>
                  <InfoTip
                    align="left"
                    title="ElevenLabs API Voices"
                    text="Click Get API Key to sign in at ElevenLabs in your browser (Free tier: 10,000 credits/mo), then paste your API key to extract and preview your ElevenLabs voices."
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleOpenElevenLabsPortal}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{elevenLabsVoices.length > 0 ? 'Add / Open ElevenLabs' : 'Sign In & Get API Key'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadApiVoices}
                    disabled={loadingApiVoices}
                    className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]"
                    title="Refresh extracted API voices"
                  >
                    <RefreshCw className={cn('w-3.5 h-3.5', loadingApiVoices && 'animate-spin')} />
                  </button>
                </div>
              </div>

              {(elevenLabsVoices.length === 0 || showElevenLabsConnect) && (
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                      <span className="font-semibold text-[rgb(var(--color-foreground))]">Connect ElevenLabs:</span>{' '}
                      Sign in on ElevenLabs in your external browser, create/copy your API key, and paste it below to extract your voices into Voice Previewer &amp; Voice Chat.
                    </div>
                    {elevenLabsVoices.length === 0 && (
                      <button
                        type="button"
                        onClick={handleOpenElevenLabsPortal}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[11px] font-semibold whitespace-nowrap flex-shrink-0 hover:bg-amber-500/30"
                      >
                        Open ElevenLabs
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Key className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))] absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={elevenLabsKeyInput}
                        onChange={e => setElevenLabsKeyInput(e.target.value)}
                        placeholder="Paste ElevenLabs API key (sk_...)"
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!elevenLabsKeyInput.trim() || savingElevenLabsKey}
                      onClick={handleSaveElevenLabsKey}
                      className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs font-semibold whitespace-nowrap disabled:opacity-50"
                    >
                      {savingElevenLabsKey ? 'Extracting...' : 'Save & Extract Voices'}
                    </button>
                  </div>
                </div>
              )}

              {apiVoices.length > 4 && (
                <input
                  type="text"
                  value={voiceSearchQuery}
                  onChange={e => setVoiceSearchQuery(e.target.value)}
                  placeholder="Search extracted API voices..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))]"
                />
              )}

              {filteredEleven.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredEleven.map(v => {
                    const active = voiceSettings.selectedPresetId === v.id;
                    return (
                      <div
                        key={v.id}
                        className={cn(
                          'p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2',
                          active
                            ? 'border-amber-400/70 bg-amber-500/10 ring-1 ring-amber-400/30'
                            : 'border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))]'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            voiceSettings.applyApiVoice(v);
                            showNotice('success', `Voice module set to ${v.name} (ElevenLabs).`);
                            playVoiceSample(v);
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[rgb(var(--color-foreground))] truncate">{v.name}</span>
                            {active && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-400 flex-shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[rgb(var(--color-foreground-muted))] truncate">
                            {v.description || v.category || 'ElevenLabs Voice'}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => playVoiceSample(v)}
                          className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))] text-sky-400 flex-shrink-0"
                          title={`Preview ${v.name}`}
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Connected Gemini & OpenAI API Voices */}
            {filteredOther.length > 0 && (
              <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                      Extracted API Key Voices (All Connected Keys)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))]">
                    {filteredOther.length} voices
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {filteredOther.map(v => {
                    const active = voiceSettings.selectedPresetId === v.id;
                    return (
                      <div
                        key={v.id}
                        className={cn(
                          'p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2',
                          active
                            ? 'border-purple-400/70 bg-purple-500/10 ring-1 ring-purple-400/30'
                            : 'border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))]'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            voiceSettings.applyApiVoice(v);
                            showNotice('success', `Voice module set to ${v.name}.`);
                            playVoiceSample(v);
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[rgb(var(--color-foreground))] truncate">{v.name}</span>
                            <span className="px-1 py-0.2 rounded bg-[rgb(var(--color-surface-hover))] text-[9px] uppercase text-[rgb(var(--color-foreground-muted))] flex-shrink-0">
                              {v.engine}
                            </span>
                            {active && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-400 flex-shrink-0">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[rgb(var(--color-foreground-muted))] truncate">
                            {v.description || v.keyName}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => playVoiceSample(v)}
                          className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-surface-hover))] text-sky-400 flex-shrink-0"
                          title={`Preview ${v.name}`}
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        );
      })()}

      {/* Speed, Pitch & Speech Recognition */}
      <section className="rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] divide-y divide-[rgb(var(--color-border))] shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sliders className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))]" />
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Voice Speed</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[0.75, 1, 1.25, 1.5, 2].map(rate => (
              <button
                key={rate}
                type="button"
                onClick={() => {
                  voiceSettings.setVoiceSettings({ voiceSpeed: rate });
                  if (testingVoice) {
                    setLiveVoicePlaybackSpeed(rate);
                  } else {
                    playVoiceSample();
                  }
                }}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors',
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

        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Voice Pitch (System)</span>
            <span className="text-xs font-mono text-[rgb(var(--color-foreground-muted))]">{voiceSettings.voicePitch.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.75}
            max={1.35}
            step={0.05}
            value={voiceSettings.voicePitch}
            onChange={e => voiceSettings.setVoiceSettings({ voicePitch: parseFloat(e.target.value) })}
            className="w-44 p-0"
          />
        </div>

        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <Mic className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))]" />
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Speech-to-Text Module</span>
            <InfoTip
              align="left"
              title="Speech Recognition Engine"
              text="Auto uses whichever connected key supports fast transcription (Groq Whisper, OpenAI Whisper, Gemini, or offline Windows Speech)."
            />
          </div>
          <select
            value={voiceSettings.speechEngine}
            onChange={e => voiceSettings.setVoiceSettings({ speechEngine: e.target.value as SpeechRecognitionEngine })}
            className="w-56 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
          >
            <option value="auto">Auto (All Connected Keys + Fallback)</option>
            <option value="openai-whisper">Prefer OpenAI Whisper</option>
            <option value="gemini">Prefer Gemini Audio</option>
            <option value="windows-speech">Offline Windows Speech</option>
          </select>
        </div>

        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Voice Conversation Language</span>
            <InfoTip
              align="left"
              title="Speech Language"
              text="Locks transcription and EXCO voice replies to English (recommended) or auto-detects spoken language."
            />
          </div>
          <select
            value={voiceSettings.speechLanguage}
            onChange={e => voiceSettings.setVoiceSettings({ speechLanguage: e.target.value })}
            className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
          >
            <option value="en">English (en)</option>
            <option value="auto">Auto-detect</option>
            <option value="hi">Hindi (hi)</option>
            <option value="es">Spanish (es)</option>
            <option value="fr">French (fr)</option>
            <option value="de">German (de)</option>
          </select>
        </div>

        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Mic Detection Sensitivity</span>
          </div>
          <select
            value={voiceSettings.micSensitivity}
            onChange={e => voiceSettings.setVoiceSettings({ micSensitivity: e.target.value as MicSensitivity })}
            className="w-48 text-xs bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg px-2.5 py-1.5"
          >
            <option value="high">High (Quiet Room)</option>
            <option value="medium">Balanced (Default)</option>
            <option value="low">Low (Noisy Environment)</option>
          </select>
        </div>

        <label className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium text-[rgb(var(--color-foreground))]">Echo Protection (Pause Mic While EXCO Speaks)</span>
            <InfoTip
              align="left"
              title="Echo Protection"
              text="Prevents speaker audio from triggering the mic when not using headphones. Disable for hands-free interruption with headphones."
            />
          </div>
          <input
            type="checkbox"
            checked={voiceSettings.pauseMicWhileSpeaking}
            onChange={e => voiceSettings.setVoiceSettings({ pauseMicWhileSpeaking: e.target.checked })}
          />
        </label>
      </section>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'voice':
        return renderVoiceTab();
      default:
        return renderGeneralTab();
    }
  };

  const modalSeg = segments.modalSurface;
  const hasGlobalBackdrop = Boolean(resolveActiveWallpaper(globalFilter)) && (globalFilter.bgImageOpacity ?? 0) > 0.005;
  const hasModalOverride = Boolean(
    modalSeg?.bgImage ||
      (modalSeg?.grain ?? 0) > 0.005 ||
      (modalSeg?.tintOpacity ?? 0) > 0.005
  );
  const modalStyle = modalSeg
    ? {
        backgroundColor: modalSeg.bg || undefined,
        color: modalSeg.text || undefined,
        borderColor: modalSeg.border || undefined,
      }
    : undefined;

  return (
    <>
      <aside
        className={cn(
          'settings-drawer overflow-hidden flex flex-col',
          !modalSeg?.bg && hasGlobalBackdrop && 'bg-[rgb(var(--color-surface))]/85 backdrop-blur-md'
        )}
        style={modalStyle}
      >
        {hasModalOverride && (
          <VisualOverlay
            grain={modalSeg?.grain}
            tintColor={modalSeg?.tintColor}
            tintOpacity={modalSeg?.tintOpacity}
            bgImage={modalSeg?.bgImage}
            bgImageOpacity={modalSeg?.bgImageOpacity}
            bgImageBlur={modalSeg?.bgImageBlur}
            bgImageFit={modalSeg?.bgImageFit}
          />
        )}

        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex items-center justify-between p-4 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <nav className="relative z-10 flex-shrink-0 border-b border-[rgb(var(--color-border))] overflow-x-auto" aria-label="Settings categories">
          <ul className="flex gap-1 px-2 py-1 min-w-max">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                      activeTab === tab.id
                        ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] font-semibold'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4">
          {statusNotice && (
            <div
              className={cn(
                'mb-4 px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between',
                statusNotice.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  : 'bg-red-500/10 border-red-500/30 text-red-500'
              )}
            >
              <span>{statusNotice.text}</span>
              <button type="button" onClick={() => setStatusNotice(null)} className="ml-2 opacity-70 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {renderTab()}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex-shrink-0 p-4 border-t border-[rgb(var(--color-border))] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]">
            Done
          </button>
        </div>
      </aside>

      {/* Non-Image Wallpaper Rejection Popup */}
      {imageFormatPopup && (
        <div
          className="fixed inset-0 z-[700] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImageFormatPopup(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-amber-500/40 bg-[rgb(var(--color-surface))] p-5 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
              Only Select an Image Format
            </h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--color-foreground-muted))] mb-4">
              <span className="font-semibold text-[rgb(var(--color-foreground))]">&ldquo;{imageFormatPopup.fileName}&rdquo;</span> is not a valid image file. Please select only an image format (PNG, JPG, JPEG, WebP, GIF, BMP, SVG, or AVIF). Videos and other file formats are not allowed for wallpapers.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setImageFormatPopup(null)}
                className="px-4 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-xs font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
