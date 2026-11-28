/**
 * EXCO Info Page
 * Generic setup and usage guide for EXCO
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  Key,
  Globe,
  Network,
  HardDrive,
  MessageSquare,
  Terminal,
  Palette,
  Download,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { ExcoLogo } from '../components/ExcoLogo';
import { VisualOverlay } from '../components/VisualOverlay';
import { useThemeStore, getSegmentStyle, resolveActiveWallpaper } from '../stores/themeStore';

export function InfoPage() {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const mainCanvas = useThemeStore(state => state.segments.mainCanvas);
  const globalFilter = useThemeStore(state => state.globalFilter);

  const copyValue = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(prev => (prev === text ? null : prev)), 1500);
  };

  const openSidebarTool = (tool: 'providers' | 'api-keys' | 'mcp' | 'plugins') => {
    window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool } }));
  };

  const openSettingsTab = (tab: 'general' | 'appearance') => {
    window.dispatchEvent(new CustomEvent('exco:open-settings', { detail: { tab } }));
  };

  const CopyBadge = ({ value }: { value: string }) => (
    <button
      type="button"
      onClick={() => copyValue(value)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgb(var(--color-code-bg))] border border-[rgb(var(--color-border))] font-mono text-xs hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
      title="Copy to clipboard"
    >
      <span>{value}</span>
      {copiedText === value ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
    </button>
  );

  return (
    <div
      className="relative h-full overflow-y-auto bg-transparent px-6 md:px-10 py-8"
      style={getSegmentStyle(mainCanvas)}
    >
      {(mainCanvas?.grain > 0.005 || mainCanvas?.tintOpacity > 0.005 || Boolean(mainCanvas?.bgImage)) && (
        <VisualOverlay
          grain={mainCanvas?.grain}
          tintColor={mainCanvas?.tintColor}
          tintOpacity={mainCanvas?.tintOpacity}
          bgImage={mainCanvas?.bgImage}
          bgImageOpacity={mainCanvas?.bgImageOpacity}
          bgImageBlur={mainCanvas?.bgImageBlur}
          bgImageFit={mainCanvas?.bgImageFit}
        />
      )}

      <div className="relative z-[1] max-w-5xl mx-auto space-y-8 pb-12">
        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgb(var(--color-border))]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] flex items-center justify-center shadow-sm">
              <ExcoLogo className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[rgb(var(--color-foreground))] tracking-tight">EXCO Info Page</h1>
                <span className="badge badge-primary text-xs">Setup Guide</span>
              </div>
              <p className="text-sm text-[rgb(var(--color-foreground-muted))] mt-0.5">
                General guide to configuring EXCO, adding API keys, selecting models, and customizing your workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="px-4 py-2 rounded-xl bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-medium inline-flex items-center gap-2 self-start sm:self-auto shadow-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Back to Chat</span>
          </button>
        </div>

        {/* 3-Step Quick Start */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[rgb(var(--color-foreground))] flex items-center gap-2">
            <Info className="w-4 h-4 text-[rgb(var(--color-accent-ink))]" />
            <span>Quick Start in 3 Steps</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-accent-ink))]">Step 1</span>
              <h3 className="font-semibold text-sm">Add Your API Key</h3>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Click <strong>API Keys → Add Key</strong> directly in the <strong>Sidebar</strong> (above Collapse), give your key a recognizable name (such as <em>Personal Key</em>), and paste your secret API key.
              </p>
              <button
                type="button"
                onClick={() => openSidebarTool('api-keys')}
                className="text-xs font-medium text-[rgb(var(--color-accent-ink))] inline-flex items-center gap-1 hover:underline pt-1"
              >
                <span>Open API Keys</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-accent-ink))]">Step 2 (Optional Endpoints)</span>
              <h3 className="font-semibold text-sm">Configure AI Providers</h3>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Standard cloud API keys connect directly. If you use a custom endpoint, OpenRouter, or a local Ollama server, add its Base URL under <strong>Sidebar → AI Providers</strong>.
              </p>
              <button
                type="button"
                onClick={() => openSidebarTool('providers')}
                className="text-xs font-medium text-[rgb(var(--color-accent-ink))] inline-flex items-center gap-1 hover:underline pt-1"
              >
                <span>Open AI Providers</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-accent-ink))]">Step 3</span>
              <h3 className="font-semibold text-sm">Select Key, Model &amp; Chat</h3>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Use the bottom-right Workflow pill to choose <strong>Turbo</strong>, <strong>Standard</strong>, or <strong>Deep Thought</strong>, pick a specific model or <strong>Best in Category</strong> on the left, type your message, and press <strong>Enter</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Generic Endpoint Guide */}
        <section className="p-5 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-500 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[rgb(var(--color-foreground))]">Connecting Custom or Unified Endpoints</h2>
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Connect any REST chat endpoint or local model router alongside your direct API keys.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openSidebarTool('providers')}
              className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-[rgb(var(--color-primary-foreground))] text-xs font-medium transition-colors"
            >
              Manage Providers
            </button>
          </div>

          <ol className="space-y-2.5 text-xs text-[rgb(var(--color-foreground))] list-decimal pl-5 leading-relaxed">
            <li>
              Click <strong>Sidebar → AI Providers → Add Provider</strong>, choose <strong>Custom Endpoint</strong>, enter a display name, and paste the service&apos;s Base URL (for example, from your provider&apos;s API documentation).
            </li>
            <li>
              Click <strong>Sidebar → API Keys → Add Key</strong>, give it a clear label, paste your API key, and click <strong>Add Key</strong>. EXCO stores keys strictly locally.
            </li>
            <li>
              In the Chat bar, choose <strong>Turbo</strong>, <strong>Standard</strong>, or <strong>Deep Thought</strong>, and click the <strong>Model</strong> pill to use the top-scoring Overview model or pick any specific model from your provider.
            </li>
          </ol>
        </section>

        {/* Supported Connection Types */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[rgb(var(--color-foreground))]">Supported Connection Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">OpenRouter</h3>
                  <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Multi-model cloud gateway</p>
                </div>
              </div>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Select <strong>OpenRouter</strong> in AI Providers, use the endpoint below, and save your OpenRouter key in <strong>API Keys</strong>.
              </p>
              <CopyBadge value="https://openrouter.ai/api" />
            </div>

            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-500 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Ollama (Local)</h3>
                  <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Offline local models</p>
                </div>
              </div>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Run Ollama on your computer, select <strong>Ollama (Local)</strong> in AI Providers, and point it to your local Ollama address.
              </p>
              <CopyBadge value="http://localhost:11434" />
            </div>

            <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-500 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Direct Cloud Keys</h3>
                  <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">Automatic prefix detection</p>
                </div>
              </div>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
                Standard cloud API keys added in <strong>API Keys</strong> automatically route to their provider endpoints and support cross-provider failover if a rate limit is reached.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2 md:col-span-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 text-[rgb(var(--color-accent-ink))]" />
              <span>Model Preferences, Token Tracking &amp; Tiers</span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
              Choose <strong>Turbo</strong>, <strong>Standard</strong>, or <strong>Deep Thought</strong> in the Workflow pill, then click the <strong>Model</strong> selector to use the highest-scoring Overview model in that tier or pick any available model. Each entry shows concise <strong>Used / Capacity</strong> token numbers and <strong>Free</strong> / <strong>Paid</strong> tier badges, with <strong>Fallback</strong> switching across API keys and next-best models if a rate limit is hit.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Local Security &amp; Storage</span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
              Your API keys, endpoints, and chat history stay strictly local on your machine in encrypted storage and your local SQLite database. Nothing is uploaded to external sync services.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4 text-[rgb(var(--color-accent-ink))]" />
              <span>Full Appearance Customization</span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
              Open <strong>Settings → Appearance</strong> for one-click presets, global color filters and grain sliders, divider line controls, and per-segment styling for the Title Bar, Sidebar, Canvas, Prompt Box, and User Chat pills.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[rgb(var(--color-accent-ink))]" />
              <span>Work Mode</span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
              Switch to <strong>Work</strong> in the sidebar to open a local project folder with a file explorer, code editor, and integrated terminal.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Manual-Restart Updates</span>
            </h3>
            <p className="text-xs text-[rgb(var(--color-foreground-muted))] leading-relaxed">
              The top-right <strong>Updates</strong> button downloads new official releases in the background and highlights when ready, applying only when you click <strong>Restart &amp; Apply Update</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default InfoPage;
