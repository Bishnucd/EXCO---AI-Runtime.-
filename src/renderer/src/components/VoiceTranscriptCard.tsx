/**
 * EXCO Collapsible Voice Transcript Card
 * Renders an entire ended voice chat session as ONE collapsible dropdown inside the chat thread.
 */

import React, { useState, useMemo } from 'react';
import {
  AudioLines,
  ChevronDown,
  Copy,
  Check,
  Search,
  X,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { marked } from 'marked';
import { cn, formatRelativeTime, formatVoiceDuration } from '@shared/utils';
import type { VoiceSessionPayload } from '@shared/types';
import { sanitizeHtml } from '../utils/sanitizeHtml';

interface VoiceTranscriptCardProps {
  session: VoiceSessionPayload;
  createdAt: number;
  bubbleStyle?: React.CSSProperties;
}

export const VoiceTranscriptCard: React.FC<VoiceTranscriptCardProps> = ({
  session,
  createdAt,
  bubbleStyle,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return session.entries;
    return session.entries.filter(
      (entry) =>
        entry.text.toLowerCase().includes(q) ||
        (entry.modelId && entry.modelId.toLowerCase().includes(q)) ||
        (entry.role === 'user' ? 'you' : 'exco').includes(q)
    );
  }, [session.entries, searchQuery]);

  const handleCopyTranscript = (e: React.MouseEvent) => {
    e.stopPropagation();
    const lines = session.entries.map((entry) => {
      const who = entry.role === 'user' ? 'You' : `EXCO${entry.modelId ? ` (${entry.modelId})` : ''}`;
      return `[${new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${who}: ${entry.text}`;
    });
    navigator.clipboard.writeText(lines.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const durationText = formatVoiceDuration(session.durationSec);
  const turnsCount = session.entries.length;
  const modelsSummary =
    session.modelsUsed && session.modelsUsed.length > 0
      ? session.modelsUsed.slice(0, 2).join(', ') + (session.modelsUsed.length > 2 ? ` +${session.modelsUsed.length - 2}` : '')
      : '';

  return (
    <div
      className="w-full rounded-2xl border border-[rgb(var(--color-border))] ui-translucent shadow-sm overflow-hidden transition-all"
      style={bubbleStyle}
    >
      {/* Collapsed / Header Summary Bar */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-[rgb(var(--color-surface-hover))]/60 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-sky-500/15 border border-sky-400/30 flex items-center justify-center flex-shrink-0 text-sky-400">
            <AudioLines className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[rgb(var(--color-foreground))]">
                Voice Chat Transcript
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]">
                <Clock className="w-3 h-3" />
                {durationText}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]">
                <MessageSquare className="w-3 h-3" />
                {turnsCount} {turnsCount === 1 ? 'entry' : 'entries'}
              </span>
              {modelsSummary && (
                <span className="text-[11px] font-mono text-[rgb(var(--color-foreground-muted))] truncate max-w-[200px]">
                  · {modelsSummary}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[rgb(var(--color-foreground-muted))] mt-0.5 truncate">
              {formatRelativeTime(createdAt)} · Click to {expanded ? 'collapse' : 'expand'} full spoken conversation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            role="button"
            tabIndex={0}
            onClick={handleCopyTranscript}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCopyTranscript(e as any);
              }
            }}
            className="p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))] transition-colors"
            title="Copy full voice transcript"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]/70 text-[rgb(var(--color-foreground-muted))]">
            <span>{expanded ? 'Hide' : 'Transcript'}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', expanded && 'rotate-180')} />
          </span>
        </div>
      </button>

      {/* Expanded Dropdown Content */}
      {expanded && (
        <div className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/40 animate-fade-in">
          {/* Search Bar inside Transcript */}
          {session.entries.length > 0 && (
            <div className="px-4 py-2 border-b border-[rgb(var(--color-border))]/60 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[rgb(var(--color-foreground-muted))] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inside voice transcript..."
                  className="w-full pl-8 pr-7 py-1 text-xs rounded-lg bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] focus:outline-none focus:border-sky-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scrollable Transcript Entries */}
          <div className="max-h-[420px] overflow-y-auto px-4 py-3 space-y-3">
            {filteredEntries.length === 0 ? (
              <p className="text-xs text-center text-[rgb(var(--color-foreground-muted))] py-4">
                {session.entries.length === 0
                  ? 'No spoken turns recorded in this session.'
                  : 'No transcript lines match your search.'}
              </p>
            ) : (
              filteredEntries.map((entry) => {
                const isUser = entry.role === 'user';
                const timeStr = new Date(entry.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'rounded-xl px-3.5 py-2.5 border text-sm',
                      isUser
                        ? 'bg-[rgb(var(--color-surface))]/80 border-[rgb(var(--color-border))] ml-6'
                        : 'bg-[rgb(var(--color-background))]/70 border-[rgb(var(--color-border))]/70 mr-6'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[11px] font-semibold uppercase tracking-wider',
                            isUser ? 'text-sky-400' : 'text-emerald-400'
                          )}
                        >
                          {isUser ? 'You' : 'EXCO'}
                        </span>
                        {!isUser && entry.modelId && (
                          <span className="px-1.5 py-0.5 rounded bg-[rgb(var(--color-surface-hover))] text-[10px] font-mono text-[rgb(var(--color-foreground-muted))]">
                            {entry.modelId}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[rgb(var(--color-foreground-muted))]">
                        {timeStr}
                      </span>
                    </div>
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed text-[rgb(var(--color-foreground))]"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(marked.parse(entry.text) as string),
                      }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
