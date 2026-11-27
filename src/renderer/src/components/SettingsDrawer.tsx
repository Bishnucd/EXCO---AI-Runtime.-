/**
 * EXCO Settings Drawer Component
 * Compact, user-friendly slide-out settings panel with General and Appearance tabs
 */

import React, { useState } from 'react';
import {
  X,
  Palette,
  User,
  RotateCcw,
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

interface SettingsDrawerProps {
  onClose: () => void;
  initialTab?: string;
}

const TABS = [
  { id: 'general', label: 'General', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
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
  const [activeTab, setActiveTab] = useState<'general' | 'appearance'>(
    initialTab === 'appearance' ? 'appearance' : 'general'
  );
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

  const renderTab = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'appearance':
        return renderAppearanceTab();
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
