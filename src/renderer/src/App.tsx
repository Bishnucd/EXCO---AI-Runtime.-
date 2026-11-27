/**
 * EXCO Main Application Component
 * Root component with mode switching and layout
 */

import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Minus,
  Square,
  Copy,
  X,
  ArrowLeft,
  ArrowRight,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Download,
  RefreshCw,
  RotateCw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { useThemeStore, ACCENT_COLORS, hexToRgbTuple, adjustHex, getSegmentStyle, resolveActiveWallpaper } from './stores/themeStore';
import { useSettingsStore } from './stores/settingsStore';
import { useWorkspaceStore } from './stores/workspaceStore';
import { Sidebar } from './components/Sidebar';
import { ChatbotMode } from './pages/ChatbotMode';
import { WorkMode } from './pages/WorkMode';
import { InfoPage } from './pages/InfoPage';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ConfigToolDrawer, type ConfigToolId } from './components/ConfigToolDrawer';
import { VisualOverlay } from './components/VisualOverlay';
import { ExcoLogo } from './components/ExcoLogo';
import { cn } from '@shared/utils';

function App() {
  const {
    theme,
    resolvedTheme,
    accentColor,
    customAccentHex,
    borderColor,
    fontFamily,
    globalFilter,
    segments,
    toggleTheme,
    syncAutoWallpaper,
  } = useThemeStore();

  // Wallpaper rotation now runs strictly on EXCO launch inside initializeTheme(); no daily midnight timer or focus cycling.
  const { settings, initializeSettings } = useSettingsStore();
  const { projects, activeProjectId, workspace, initializeWorkspace, getEffectiveFolders } = useWorkspaceStore();
  const activeProject = projects.find(p => p.id === activeProjectId) || null;
  const effectiveFolders = getEffectiveFolders();
  const navigate = useNavigate();
  const location = useLocation();
  const isInfoPage = location.pathname.startsWith('/info');
  const [mode, setMode] = useState<'chatbot' | 'work'>('chatbot');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string | undefined>(undefined);
  const [activeConfigTool, setActiveConfigTool] = useState<ConfigToolId | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [updateMenuOpen, setUpdateMenuOpen] = useState(false);
  const updateButtonRef = useRef<HTMLButtonElement>(null);
  const [updateAnchor, setUpdateAnchor] = useState<{ top: number; right: number }>({ top: 52, right: 96 });

  useEffect(() => {
    if (!updateMenuOpen) return;
    const syncPosition = () => {
      const rect = updateButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setUpdateAnchor({
        top: Math.round(rect.bottom + 6),
        right: Math.max(8, Math.round(window.innerWidth - rect.right)),
      });
    };
    syncPosition();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUpdateMenuOpen(false);
    };
    window.addEventListener('resize', syncPosition);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('resize', syncPosition);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [updateMenuOpen]);
  const [navHistory, setNavHistory] = useState<string[]>(() => [location.pathname + location.search]);
  const [navIndex, setNavIndex] = useState(0);
  const pendingNavStepRef = useRef<-1 | 1 | null>(null);
  const navIndexRef = useRef(0);
  navIndexRef.current = navIndex;
  const [updateInfo, setUpdateInfo] = useState<{
    status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'up-to-date' | 'error';
    currentVersion: string;
    availableVersion?: string;
    progress?: number;
    error?: string;
  }>({ status: 'idle', currentVersion: '0.1.0' });

  // Subscribe to background update status
  useEffect(() => {
    window.exco?.updater?.getStatus?.().then(state => {
      if (state) setUpdateInfo(state);
    }).catch(() => {});

    const unsubscribe = window.exco?.updater?.onStatusChange?.(state => {
      if (state) setUpdateInfo(state);
    });
    return () => {
      unsubscribe?.();
    };
  }, []);

  // Apply theme, accent colors, and global divider lines to document
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    let activePrimaryRgb = '71 71 71';
    if (accentColor === 'custom') {
      const customRgb = hexToRgbTuple(customAccentHex) || '14 165 233';
      const hoverRgb = hexToRgbTuple(adjustHex(customAccentHex, resolvedTheme === 'dark' ? 20 : -24)) || customRgb;
      activePrimaryRgb = customRgb;
      root.style.setProperty('--color-primary', customRgb);
      root.style.setProperty('--color-primary-hover', hoverRgb);
      root.style.setProperty('--color-primary-light', resolvedTheme === 'dark' ? '30 41 59' : '241 245 249');
    } else {
      const palette = ACCENT_COLORS[accentColor] || ACCENT_COLORS.sky;
      activePrimaryRgb = palette.primary;
      root.style.setProperty('--color-primary', palette.primary);
      root.style.setProperty('--color-primary-hover', palette.hover);
      root.style.setProperty(
        '--color-primary-light',
        resolvedTheme === 'dark' ? palette.darkLight : palette.light
      );
    }

    const [pr, pg, pb] = activePrimaryRgb.split(' ').map(Number);
    const primaryLum = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255;
    root.style.setProperty('--color-primary-foreground', primaryLum > 0.62 ? '10 10 12' : '255 255 255');
    const accentInk =
      resolvedTheme === 'dark' && primaryLum < 0.38
        ? '226 232 240'
        : resolvedTheme === 'light' && primaryLum > 0.62
        ? '30 41 59'
        : activePrimaryRgb;
    root.style.setProperty('--color-accent-ink', accentInk);

    const customBorderRgb = borderColor ? hexToRgbTuple(borderColor) : null;
    if (customBorderRgb && resolvedTheme === 'dark') {
      root.style.setProperty('--color-border', customBorderRgb);
    } else {
      root.style.removeProperty('--color-border');
    }

    const activeFont = fontFamily || "'Inter', 'Segoe UI', system-ui, sans-serif";
    root.style.setProperty('--font-sans', activeFont);
    document.body.style.fontFamily = activeFont;

    const uiOpacity = Math.min(1, Math.max(0, globalFilter.uiOpacity ?? 0.5));
    root.style.setProperty('--ui-surface-opacity', String(uiOpacity));
  }, [resolvedTheme, accentColor, customAccentHex, borderColor, fontFamily, globalFilter.uiOpacity]);

  // Initialize stores & sync active AI Skills registry on mount
  useEffect(() => {
    initializeSettings();
    initializeWorkspace();
    import('./stores/skillsStore').then(m => m.syncSkillsToMain()).catch(() => {});
    window.exco?.window?.isMaximized?.().then(max => setIsMaximized(max));
  }, [initializeSettings, initializeWorkspace]);

  // Sync mode + in-app navigation history stack for Back/Forward controls
  useEffect(() => {
    if (location.pathname.startsWith('/work')) {
      setMode('work');
    } else if (location.pathname.startsWith('/chat')) {
      setMode('chatbot');
    }

    const fullPath = location.pathname + location.search;
    if (pendingNavStepRef.current !== null) {
      const delta = pendingNavStepRef.current;
      pendingNavStepRef.current = null;
      setNavIndex(prev => Math.max(0, Math.min(navHistory.length - 1, prev + delta)));
      return;
    }

    setNavHistory(prev => {
      const curIdx = navIndexRef.current;
      if (prev[curIdx] === fullPath) return prev;
      const sliced = prev.slice(0, curIdx + 1);
      sliced.push(fullPath);
      setNavIndex(sliced.length - 1);
      return sliced;
    });
  }, [location.pathname, location.search]);

  // Listen for open settings and sidebar tool panel custom events
  useEffect(() => {
    const toolIds: ConfigToolId[] = ['overview', 'providers', 'api-keys', 'mcp', 'plugins', 'skills'];
    const handleOpenSettings = (e: any) => {
      const requestedTab = e.detail?.tab;
      if (requestedTab && toolIds.includes(requestedTab)) {
        setSettingsOpen(false);
        setActiveConfigTool(requestedTab as ConfigToolId);
        return;
      }
      setActiveConfigTool(null);
      setSettingsTab(requestedTab);
      setSettingsOpen(true);
    };
    const handleOpenSidebarTool = (e: any) => {
      const requestedTool = e.detail?.tool as ConfigToolId | undefined;
      if (requestedTool && toolIds.includes(requestedTool)) {
        setSettingsOpen(false);
        setActiveConfigTool(requestedTool);
      }
    };
    window.addEventListener('exco:open-settings', handleOpenSettings);
    window.addEventListener('exco:open-sidebar-tool', handleOpenSidebarTool);
    return () => {
      window.removeEventListener('exco:open-settings', handleOpenSettings);
      window.removeEventListener('exco:open-sidebar-tool', handleOpenSidebarTool);
    };
  }, []);

  const canGoBack = navIndex > 0;
  const canGoForward = navIndex < navHistory.length - 1;

  const handleNavBack = () => {
    if (!canGoBack) return;
    pendingNavStepRef.current = -1;
    navigate(-1);
  };

  const handleNavForward = () => {
    if (!canGoForward) return;
    pendingNavStepRef.current = 1;
    navigate(1);
  };

  const handleNavReload = () => {
    window.location.reload();
  };

  const handleMinimize = () => {
    window.exco?.window?.minimize?.();
  };

  const handleMaximize = async () => {
    if (window.exco?.window?.maximize) {
      const max = await window.exco.window.maximize();
      setIsMaximized(max);
    }
  };

  const handleClose = () => {
    window.exco?.window?.close?.();
  };

  const handleWorkspaceSelect = async () => {
    try {
      await useWorkspaceStore.getState().selectWorkspace();
      if (useWorkspaceStore.getState().workspace) {
        setMode('work');
        setSidebarCollapsed(false);
      }
    } catch (error) {
      console.error('Failed to select workspace:', error);
    }
  };

  const getCssFilterString = () => {
    switch (globalFilter.preset) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(35%) saturate(1.05)';
      case 'cyber-cyan':
        return 'hue-rotate(170deg) saturate(1.15)';
      case 'high-contrast':
        return 'contrast(1.15)';
      case 'soft-matte':
        return 'contrast(0.94) saturate(0.9)';
      default:
        return undefined;
    }
  };

  const titleSegment = segments.titleBar;
  const effectiveTitleGrain = titleSegment?.grain || 0;
  const effectiveTitleTint = titleSegment?.tintColor || '';
  const effectiveTitleTintOpacity = titleSegment?.tintOpacity || 0;
  const activeGlobalWallpaper = resolveActiveWallpaper(globalFilter);
  const hasGlobalBackdrop = Boolean(activeGlobalWallpaper) && (globalFilter.bgImageOpacity ?? 0) > 0.005;
  const titleHasOwnBg = Boolean(titleSegment?.bg || titleSegment?.bgImage);

  return (
    <div
      className="relative h-screen w-screen flex flex-col overflow-hidden bg-[rgb(var(--color-background))]"
      style={{ filter: getCssFilterString() }}
    >
      {/* Unified Root Wallpaper / Tint / Grain spanning seamlessly behind Sidebar, Title Bar & Main Canvas */}
      <VisualOverlay
        grain={globalFilter.grain}
        tintColor={globalFilter.tintColor || (globalFilter.preset === 'cyber-cyan' ? '#06b6d4' : '')}
        tintOpacity={globalFilter.tintOpacity}
        bgImage={activeGlobalWallpaper}
        bgImageOpacity={globalFilter.bgImageOpacity}
        bgImageBlur={globalFilter.bgImageBlur}
        bgImageFit={globalFilter.bgImageFit}
      />

      {/* Full-Width Top Bar Header spanning across Sidebar + Main Canvas */}
      <header
        className={cn(
          'relative h-12 w-full flex items-center justify-between px-3 border-b border-[rgb(var(--color-border))] z-20 flex-shrink-0 select-none overflow-hidden',
          !titleHasOwnBg && (hasGlobalBackdrop || resolvedTheme === 'dark')
            ? 'ui-translucent'
            : 'bg-[rgb(var(--color-surface))]'
        )}
        style={{ WebkitAppRegion: 'drag', ...getSegmentStyle(titleSegment) } as any}
      >
        {(effectiveTitleGrain > 0.005 || effectiveTitleTintOpacity > 0.005 || Boolean(titleSegment?.bgImage)) && (
          <VisualOverlay
            grain={effectiveTitleGrain}
            tintColor={effectiveTitleTint}
            tintOpacity={effectiveTitleTintOpacity}
            bgImage={titleSegment?.bgImage}
            bgImageOpacity={titleSegment?.bgImageOpacity}
            bgImageBlur={titleSegment?.bgImageBlur}
            bgImageFit={titleSegment?.bgImageFit}
          />
        )}
        <div className="relative z-10 flex items-center gap-2.5">
          {/* 3-Line Menu Toggle + EXCO Brand Name */}
          <div className="flex items-center gap-2 pr-2 border-r border-[rgb(var(--color-border))]" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(prev => !prev)}
              className="p-1.5 rounded-md text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
            <ExcoLogo className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold text-base tracking-wide text-[rgb(var(--color-foreground))]">EXCO</span>
          </div>

          {/* Browser-style Navigation Controls (Back, Forward, Reload) */}
          <div
            className="flex items-center gap-0.5 pr-2 mr-0.5 border-r border-[rgb(var(--color-border))]"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <button
              type="button"
              onClick={handleNavBack}
              disabled={!canGoBack}
              className={cn(
                'p-1.5 rounded-md transition-colors border',
                canGoBack
                  ? 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  : 'bg-slate-200/90 border-slate-300 text-slate-600 dark:bg-[#474747]/55 dark:border-white/15 dark:text-white/80 cursor-not-allowed'
              )}
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNavForward}
              disabled={!canGoForward}
              className={cn(
                'p-1.5 rounded-md transition-colors border',
                canGoForward
                  ? 'border-transparent text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
                  : 'bg-slate-200/90 border-slate-300 text-slate-600 dark:bg-[#474747]/55 dark:border-white/15 dark:text-white/80 cursor-not-allowed'
              )}
              title="Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNavReload}
              className="p-1.5 rounded-md text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
              title="Reload"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
          <h1 className="text-base font-semibold tracking-tight" style={{ color: titleSegment?.text || undefined }}>
            {isInfoPage ? 'Info Page' : mode === 'chatbot' ? 'Chatbot' : 'Work Mode'}
          </h1>
          <span className="badge badge-primary text-xs">
            {isInfoPage
              ? 'Guide'
              : mode === 'chatbot'
              ? 'AI Chat'
              : activeProject
              ? effectiveFolders.length > 1
                ? `${activeProject.name} (${effectiveFolders.length} folders)`
                : activeProject.name
              : workspace?.name || 'No Project'}
          </span>
        </div>

        {/* Top Right Tools & Window Controls */}
        <div className="relative z-10 flex items-center gap-1.5" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {/* Info Page Shortcut */}
          <button
            onClick={() => navigate(isInfoPage ? '/chat' : '/info')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors',
              isInfoPage
                ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))]'
                : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
            )}
            title="Open EXCO Info Page"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Info Page</span>
          </button>
          {/* Manual Update Indicator */}
          <button
            ref={updateButtonRef}
            onClick={() => setUpdateMenuOpen(prev => !prev)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
              updateInfo.status === 'downloaded'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/60 shadow-[0_0_14px_rgba(16,185,129,0.55)] animate-pulse hover:bg-emerald-500/30'
                : updateInfo.status === 'downloading' || updateInfo.status === 'available'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.35)]'
                : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]'
            )}
            title={
              updateInfo.status === 'downloaded'
                ? `Update v${updateInfo.availableVersion || ''} downloaded — click to restart`
                : updateInfo.status === 'downloading'
                ? `Downloading update (${updateInfo.progress || 0}%)`
                : 'Software Updates'
            }
          >
            {updateInfo.status === 'downloaded' ? (
              <>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Update Ready</span>
              </>
            ) : updateInfo.status === 'downloading' || updateInfo.status === 'available' ? (
              <>
                <Download className="w-3.5 h-3.5 animate-bounce" />
                <span>{updateInfo.progress ? `${updateInfo.progress}%` : 'Downloading'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Updates</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
            title={`Theme: ${theme}`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              setActiveConfigTool(null);
              setSettingsTab(undefined);
              setSettingsOpen(true);
            }}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Window Controls (Minimize, Maximize, Close) */}
          <div className="flex items-center gap-1 border-l border-[rgb(var(--color-border))] pl-2 ml-1">
            <button
              onClick={handleMinimize}
              className="p-1.5 rounded-md hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              title="Minimize"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1.5 rounded-md hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-md hover:bg-red-500 hover:text-white text-[rgb(var(--color-foreground-muted))] transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Row: Collapsible Sidebar + Main Content */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="relative z-10 h-full flex-shrink-0">
          <Sidebar
            mode={mode}
            collapsed={sidebarCollapsed}
            onCollapseChange={setSidebarCollapsed}
            onModeChange={setMode}
            onWorkspaceSelect={handleWorkspaceSelect}
            activeConfigTool={activeConfigTool}
            onOpenConfigTool={(tool) => {
              setSettingsOpen(false);
              setActiveConfigTool(prev => (prev === tool ? null : tool));
            }}
          />
        </div>

        {/* Page Content */}
        <main className="relative z-10 flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatbotMode />} />
            <Route path="/chat/:id" element={<ChatbotMode />} />
            <Route path="/work" element={<WorkMode />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>

          {/* Settings Drawer (General, Appearance, Overview) — covers whole Chat / Work area */}
          {settingsOpen && (
            <SettingsDrawer initialTab={settingsTab} onClose={() => setSettingsOpen(false)} />
          )}

          {/* Sidebar Configuration Tool Drawer — covers whole Chat / Work area */}
          {activeConfigTool && (
            <ConfigToolDrawer
              activeTool={activeConfigTool}
              onClose={() => setActiveConfigTool(null)}
            />
          )}
        </main>
      </div>

      {/* Top-Right Updates Popover */}
      {updateMenuOpen && (
        <div
          className="fixed inset-0 z-[450]"
          onPointerDown={e => {
            if (e.target === e.currentTarget) setUpdateMenuOpen(false);
          }}
          onClick={() => setUpdateMenuOpen(false)}
        >
          <div
            className="fixed z-[460] w-80 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl overflow-hidden animate-scale-in"
            style={{
              top: `${updateAnchor.top}px`,
              right: `${updateAnchor.right}px`,
              ...getSegmentStyle(segments.modalSurface),
            }}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative overflow-hidden p-4">
              <VisualOverlay
                grain={segments.modalSurface?.grain || globalFilter.grain}
                tintColor={segments.modalSurface?.tintColor || globalFilter.tintColor || (globalFilter.preset === 'cyber-cyan' ? '#06b6d4' : '')}
                tintOpacity={segments.modalSurface?.tintOpacity || globalFilter.tintOpacity}
                bgImage={segments.modalSurface?.bgImage}
                bgImageOpacity={segments.modalSurface?.bgImageOpacity}
                bgImageBlur={segments.modalSurface?.bgImageBlur}
                bgImageFit={segments.modalSurface?.bgImageFit}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Download className={cn(
                      'w-4 h-4',
                      updateInfo.status === 'downloaded' ? 'text-emerald-400' : 'text-[rgb(var(--color-accent-ink))]'
                    )} />
                    <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">EXCO Updates</h3>
                  </div>
                  <span className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))]">
                    v{updateInfo.currentVersion}
                  </span>
                </div>

                {updateInfo.status === 'downloaded' ? (
                  <div className="space-y-3">
                    <p className="text-xs text-[rgb(var(--color-foreground))] leading-relaxed">
                      Version <span className="font-semibold text-emerald-400">v{updateInfo.availableVersion}</span> has finished downloading. Restart EXCO whenever you&apos;re ready to apply it.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.exco?.updater?.installAndRestart?.()}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Restart &amp; Apply Update</span>
                    </button>
                  </div>
                ) : updateInfo.status === 'downloading' || updateInfo.status === 'available' ? (
                  <div className="space-y-2">
                    <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                      Downloading update v{updateInfo.availableVersion || ''} in the background ({updateInfo.progress || 0}%)...
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-[rgb(var(--color-surface-hover))] overflow-hidden">
                      <div
                        className="h-full bg-sky-500 transition-all duration-300"
                        style={{ width: `${updateInfo.progress || 10}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
                      EXCO will not restart until you press Restart.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-foreground-muted))]">
                      {updateInfo.status === 'up-to-date' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                      <span>
                        {updateInfo.status === 'checking'
                          ? 'Checking GitHub Releases for updates...'
                          : updateInfo.status === 'error'
                          ? `Update check error: ${updateInfo.error || 'Offline'}`
                          : 'Updates download automatically in the background and wait for your restart.'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.exco?.updater?.check?.()}
                      disabled={updateInfo.status === 'checking'}
                      className="w-full py-1.5 px-3 rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw className={cn('w-3.5 h-3.5', updateInfo.status === 'checking' && 'animate-spin')} />
                      <span>{updateInfo.status === 'checking' ? 'Checking...' : 'Check for Updates'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;