/**
 * EXCO Sidebar Component
 * Navigation sidebar with mode switching and workspace controls
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Code,
  FolderOpen,
  Settings,
  ChevronRight,
  Plus,
  MessageSquare,
  Terminal,
  FileText,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Cpu,
  Key,
  Server,
  Plug,
  Wand2,
  BarChart3,
  FolderPlus,
  FilePlus,
} from 'lucide-react';
import { cn } from '@shared/utils';
import { useWorkspaceStore } from '../stores/workspaceStore';
import { useThemeStore, getSegmentStyle, resolveActiveWallpaper } from '../stores/themeStore';
import { VisualOverlay } from './VisualOverlay';
import type { ConfigToolId } from './ConfigToolDrawer';

interface SidebarProps {
  mode: 'chatbot' | 'work';
  collapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  onModeChange: (mode: 'chatbot' | 'work') => void;
  onWorkspaceSelect: () => void;
  activeConfigTool?: ConfigToolId | null;
  onOpenConfigTool?: (tool: ConfigToolId) => void;
}

export function Sidebar({
  mode,
  collapsed,
  onCollapseChange,
  onModeChange,
  onWorkspaceSelect,
  activeConfigTool,
  onOpenConfigTool,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    projects,
    activeProjectId,
    fileTrees,
    expandedProjects,
    togglePath,
    expandedPaths,
    selectFile,
    selectedFile,
    error: workspaceError,
    createProject,
    switchProject,
    toggleProjectExpanded,
    renameProject,
    deleteProject,
    setProjectConversationId,
    removeProjectConversationId,
    createFileInDir,
    createFolderInDir,
    renameFsEntry,
    deleteFsEntry,
  } = useWorkspaceStore();
  const sidebarSegment = useThemeStore(state => state.segments.sidebar);
  const globalFilter = useThemeStore(state => state.globalFilter);

  const [conversations, setConversations] = useState<any[]>([]);
  const [workConversations, setWorkConversations] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [pendingDeleteConv, setPendingDeleteConv] = useState<{ id: string; title: string } | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState('');
  const [pendingDeleteProject, setPendingDeleteProject] = useState<{ id: string; name: string } | null>(null);
  const [creatingInDir, setCreatingInDir] = useState<{ dirPath: string; kind: 'file' | 'folder' } | null>(null);
  const [newEntryName, setNewEntryName] = useState('');
  const [renamingFsPath, setRenamingFsPath] = useState<string | null>(null);
  const [renameFsValue, setRenameFsValue] = useState('');
  const [pendingDeleteFsEntry, setPendingDeleteFsEntry] = useState<{
    path: string;
    name: string;
    type: 'file' | 'folder';
  } | null>(null);
  const [selectedFsItems, setSelectedFsItems] = useState<Record<string, { path: string; name: string; type: 'file' | 'folder' }>>({});
  const [pendingDeleteFsBatch, setPendingDeleteFsBatch] = useState<Array<{ path: string; name: string; type: 'file' | 'folder' }> | null>(null);
  const [deletingFsEntry, setDeletingFsEntry] = useState(false);

  const toggleFsItemSelected = (item: { path: string; name: string; type: 'file' | 'folder' }, e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    setSelectedFsItems(prev => {
      const next = { ...prev };
      if (next[item.path]) {
        delete next[item.path];
      } else {
        next[item.path] = item;
      }
      return next;
    });
  };
  const selectedFsList = Object.values(selectedFsItems);
  const hasSelectedFsItems = selectedFsList.length > 0;
  const [explorerOpError, setExplorerOpError] = useState<string | null>(null);

  const isChatActive = location.pathname.startsWith('/chat') || location.pathname === '/';
  const isWorkActive = location.pathname.startsWith('/work');

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  const loadConversations = async () => {
    try {
      const convs = await window.exco.chat.listConversations();
      setConversations(
        (convs || []).filter((c: any) => {
          const t = String(c?.title || '');
          return !t.startsWith('[Work] ') && !t.startsWith('Work: ');
        })
      );
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const loadWorkConversations = async () => {
    try {
      if (window.exco.work?.listConversations) {
        const workConvs = await window.exco.work.listConversations();
        setWorkConversations(Array.isArray(workConvs) ? workConvs : []);
        return;
      }
      // Fallback if Electron main/preload has not been restarted yet in dev mode
      const allConvs = await window.exco.chat.listConversations();
      setWorkConversations(
        (allConvs || [])
          .filter((c: any) => {
            const t = String(c?.title || '');
            return t.startsWith('[Work] ') || t.startsWith('Work: ');
          })
          .map((c: any) => ({
            ...c,
            title: String(c.title || '').replace(/^(\[Work\]\s*|Work:\s*)/i, '') || 'Work Chat',
          }))
      );
    } catch (err) {
      console.error('Failed to load workspace conversations:', err);
    }
  };

  useEffect(() => {
    loadConversations();
    loadWorkConversations();
    const handleUpdate = () => loadConversations();
    const handleWorkUpdate = () => loadWorkConversations();
    window.addEventListener('exco:conversations-updated', handleUpdate);
    window.addEventListener('exco:work-conversations-updated', handleWorkUpdate);
    return () => {
      window.removeEventListener('exco:conversations-updated', handleUpdate);
      window.removeEventListener('exco:work-conversations-updated', handleWorkUpdate);
    };
  }, []);

  useEffect(() => {
    if (isWorkActive || mode === 'work') {
      loadWorkConversations();
    }
  }, [isWorkActive, mode, activeProjectId, projects.length]);

  const handleModeClick = (newMode: 'chatbot' | 'work') => {
    onModeChange(newMode);
    navigate(newMode === 'chatbot' ? '/chat' : '/work');
  };

  const handleNewConversation = async () => {
    try {
      const newConv = await window.exco.chat.createConversation({
        title: 'New Conversation',
        modelId: 'default',
        providerId: 'default',
      });
      setConversations(prev => [newConv, ...prev]);
      navigate(`/chat/${newConv.id}`);
      window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
    } catch (err) {
      console.error('Failed to create new conversation:', err);
    }
  };

  const handleStartRename = (conv: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title || '');
  };

  const handleSaveRename = async (convId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    try {
      await window.exco.chat.updateConversation({ id: convId, updates: { title: trimmed } });
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: trimmed } : c));
      setEditingId(null);
      window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  const handleRequestDeleteConversation = (conv: { id: string; title?: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteConv({ id: conv.id, title: conv.title || 'Untitled Chat' });
  };

  const handleConfirmDeleteConversation = async () => {
    if (!pendingDeleteConv) return;
    const convId = pendingDeleteConv.id;
    setPendingDeleteConv(null);
    // Notify ChatbotMode immediately to stop spinners & discard in-flight responses for this chat
    window.dispatchEvent(new CustomEvent('exco:conversation-deleted', { detail: { id: convId } }));
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (location.pathname === `/chat/${convId}`) {
      navigate('/chat');
    }
    try {
      await window.exco.chat.cancelStream(convId).catch(() => {});
      await window.exco.chat.deleteConversation(convId);
      window.dispatchEvent(new CustomEvent('exco:conversations-updated'));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const renderChatbotSidebar = () => (
    <div className="flex-1 overflow-y-auto p-2 flex flex-col min-h-0">
      {/* New Chat Button */}
      <button
        onClick={handleNewConversation}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg mb-3',
          'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 hover:bg-[rgb(var(--color-primary-hover))] backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] font-semibold text-sm',
          'transition-colors shadow-sm',
          collapsed ? 'justify-center' : 'justify-start'
        )}
        title="New Chat"
      >
        <Plus className="w-4 h-4 flex-shrink-0" />
        {!collapsed && <span>New Chat</span>}
      </button>

      {/* Conversation List */}
      {!collapsed ? (
        <div className="flex-1 overflow-y-auto space-y-1">
          <p className="px-2 pb-1.5 text-xs font-semibold text-[rgb(var(--color-foreground-muted))] uppercase tracking-wider">
            Chat History ({conversations.length})
          </p>

          {conversations.length === 0 ? (
            <div className="text-center py-8 text-[rgb(var(--color-foreground-muted))] text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No chat history yet</p>
              <p className="text-xs mt-1">Start a chat to see history</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map(conv => {
                const isActive = location.pathname === `/chat/${conv.id}`;
                const isEditing = editingId === conv.id;

                if (isEditing) {
                  return (
                    <div
                      key={conv.id}
                      className="p-1 rounded-lg bg-[rgb(var(--color-surface-hover))] border border-[rgb(var(--color-primary))]"
                      onClick={e => e.stopPropagation()}
                    >
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleSaveRename(conv.id);
                        }}
                        className="flex items-center gap-1"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          autoFocus
                          className="flex-1 px-2 py-1 text-xs bg-[rgb(var(--color-surface))] rounded border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))]"
                        />
                        <button
                          type="submit"
                          className="p-1 rounded text-green-500 hover:bg-green-500/10"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 rounded text-slate-400 hover:bg-slate-500/10"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  );
                }

                return (
                  <div
                    key={conv.id}
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className={cn(
                      'group flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors text-sm',
                      isActive
                        ? 'bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground))] font-medium border-l-2 border-[rgb(var(--color-primary))]'
                        : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
                    )}
                    title={conv.title}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" />
                      <span className="truncate text-xs font-medium">{conv.title || 'Untitled Chat'}</span>
                    </div>

                    {/* Actions: Rename & Delete */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        type="button"
                        onClick={e => handleStartRename(conv, e)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        title="Rename Chat"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={e => handleRequestDeleteConversation(conv, e)}
                        className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                        title="Permanently Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Collapsed View: icons of recent chats */
        <div className="flex-1 overflow-y-auto space-y-2 flex flex-col items-center">
          {conversations.slice(0, 8).map(conv => {
            const isActive = location.pathname === `/chat/${conv.id}`;
            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/chat/${conv.id}`)}
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                  isActive
                    ? 'bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-accent-ink))] font-semibold'
                    : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
                )}
                title={conv.title || 'Chat'}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderWorkSidebar = () => {
    const handleNewProject = async () => {
      await createProject();
      onModeChange('work');
      navigate('/work');
    };

    const handleSaveProjectRename = async (projId: string, e?: React.FormEvent | React.MouseEvent) => {
      if (e) e.stopPropagation();
      const trimmed = editProjectTitle.trim();
      if (trimmed) {
        await renameProject(projId, trimmed);
      }
      setEditingProjectId(null);
    };

    const handleStartCreateInDir = (dirPath: string, kind: 'file' | 'folder', e: React.MouseEvent) => {
      e.stopPropagation();
      setExplorerOpError(null);
      if (!expandedPaths.has(dirPath)) {
        togglePath(dirPath);
      }
      setCreatingInDir({ dirPath, kind });
      setNewEntryName('');
    };

    const handleConfirmCreateInDir = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!creatingInDir) return;
      const trimmed = newEntryName.trim();
      if (!trimmed) {
        setCreatingInDir(null);
        return;
      }
      try {
        setExplorerOpError(null);
        if (creatingInDir.kind === 'file') {
          await createFileInDir(creatingInDir.dirPath, trimmed);
        } else {
          await createFolderInDir(creatingInDir.dirPath, trimmed);
        }
        setCreatingInDir(null);
        setNewEntryName('');
      } catch (err: any) {
        setExplorerOpError(err?.message || 'Failed to create entry');
      }
    };

    const handleConfirmRenameFs = async (oldPath: string, e?: React.FormEvent | React.MouseEvent) => {
      if (e) e.stopPropagation();
      const trimmed = renameFsValue.trim();
      if (!trimmed) {
        setRenamingFsPath(null);
        return;
      }
      try {
        setExplorerOpError(null);
        await renameFsEntry(oldPath, trimmed);
        setRenamingFsPath(null);
        setRenameFsValue('');
      } catch (err: any) {
        setExplorerOpError(err?.message || 'Failed to rename');
      }
    };

    const renderInlineCreateInput = (dirPath: string) => {
      if (!creatingInDir || creatingInDir.dirPath !== dirPath) return null;
      return (
        <form onSubmit={handleConfirmCreateInDir} className="flex items-center gap-1 px-2 py-1 my-0.5 rounded bg-[rgb(var(--color-surface-hover))]">
          {creatingInDir.kind === 'folder' ? (
            <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
          ) : (
            <FileText className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
          )}
          <input
            type="text"
            value={newEntryName}
            onChange={e => setNewEntryName(e.target.value)}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                setCreatingInDir(null);
                setNewEntryName('');
              }
            }}
            placeholder={creatingInDir.kind === 'folder' ? 'New folder name...' : 'New file name...'}
            autoFocus
            className="flex-1 min-w-0 bg-transparent border-b border-[rgb(var(--color-primary))] text-xs py-0.5 focus:outline-none text-[rgb(var(--color-foreground))]"
          />
          <button
            type="submit"
            className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10"
            title="Create"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCreatingInDir(null);
              setNewEntryName('');
            }}
            className="p-0.5 rounded text-slate-400 hover:bg-slate-500/10"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      );
    };

    const renderTree = (nodes: any[], depth = 0) => (
      <div className="space-y-0.5">
        {nodes.map((node) => {
          const isExpanded = expandedPaths.has(node.path);
          const isSelected = selectedFile?.path === node.path;
          const isRenaming = renamingFsPath === node.path;
          const hasChildren = node.type === 'directory' && Array.isArray(node.children) && node.children.length > 0;

          if (isRenaming) {
            return (
              <div key={node.path} className="flex items-center gap-1 px-2 py-1 rounded bg-[rgb(var(--color-surface-hover))]">
                <form
                  onSubmit={e => handleConfirmRenameFs(node.path, e)}
                  className="flex items-center gap-1 w-full"
                >
                  <input
                    type="text"
                    value={renameFsValue}
                    onChange={e => setRenameFsValue(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setRenamingFsPath(null);
                    }}
                    autoFocus
                    className="flex-1 min-w-0 bg-transparent border-b border-[rgb(var(--color-primary))] text-xs py-0.5 focus:outline-none text-[rgb(var(--color-foreground))]"
                  />
                  <button
                    type="submit"
                    className="p-0.5 rounded text-emerald-500 hover:bg-emerald-500/10"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setRenamingFsPath(null);
                    }}
                    className="p-0.5 rounded text-slate-400 hover:bg-slate-500/10"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            );
          }

          if (node.type === 'directory') {
            const isChecked = Boolean(selectedFsItems[node.path]);
            return (
              <div key={node.path}>
                <div
                  className={cn(
                    'group flex items-center gap-1 rounded-md pr-1 transition-colors',
                    'hover:bg-[rgb(var(--color-surface-hover))]',
                    isChecked && 'bg-amber-500/10 ring-1 ring-amber-500/30',
                    isSelected && !isChecked && 'bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-accent-ink))] font-semibold'
                  )}
                >
                  {!collapsed && (
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => toggleFsItemSelected({ path: node.path, name: node.name, type: 'folder' }, e)}
                      onClick={e => e.stopPropagation()}
                      className={cn(
                        'ml-1.5 w-3.5 h-3.5 rounded accent-amber-500 cursor-pointer flex-shrink-0 transition-opacity p-0',
                        hasSelectedFsItems || isChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      )}
                      title={`Select ${node.name}`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => togglePath(node.path)}
                    className={cn(
                      'flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 rounded-md text-left',
                      collapsed && 'justify-center'
                    )}
                    title={node.path}
                  >
                    {!collapsed && (
                      <ChevronRight
                        className={cn(
                          'w-3.5 h-3.5 flex-shrink-0 text-[rgb(var(--color-foreground-muted))] transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    )}
                    <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                    {!collapsed && <span className="truncate font-medium text-xs">{node.name}</span>}
                  </button>

                  {!collapsed && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        type="button"
                        onClick={e => handleStartCreateInDir(node.path, 'file', e)}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                        title="New File inside folder"
                      >
                        <FilePlus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={e => handleStartCreateInDir(node.path, 'folder', e)}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                        title="New Subfolder"
                      >
                        <FolderPlus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setRenamingFsPath(node.path);
                          setRenameFsValue(node.name);
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                        title="Rename Folder"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setExplorerOpError(null);
                          setPendingDeleteFsEntry({ path: node.path, name: node.name, type: 'folder' });
                        }}
                        className="p-0.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                        title="Delete Folder (Moves to Recycle Bin)"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {isExpanded && !collapsed && (
                  <div className="pl-3 ml-2 border-l border-[rgb(var(--color-border))]/60 space-y-0.5">
                    {renderInlineCreateInput(node.path)}
                    {hasChildren ? (
                      renderTree(node.children!, depth + 1)
                    ) : !creatingInDir || creatingInDir.dirPath !== node.path ? (
                      <p className="px-2 py-1 text-[11px] text-[rgb(var(--color-foreground-muted))] italic">
                        Empty folder
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            );
          } else {
            const IconComp = getFileIcon(node.extension);
            const isChecked = Boolean(selectedFsItems[node.path]);
            return (
              <div
                key={node.path}
                className={cn(
                  'group flex items-center gap-1 rounded-md pr-1 transition-colors',
                  'hover:bg-[rgb(var(--color-surface-hover))]',
                  isChecked && 'bg-amber-500/10 ring-1 ring-amber-500/30',
                  isSelected && !isChecked && 'bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-accent-ink))] font-semibold'
                )}
              >
                {!collapsed && (
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={e => toggleFsItemSelected({ path: node.path, name: node.name, type: 'file' }, e)}
                    onClick={e => e.stopPropagation()}
                    className={cn(
                      'ml-1.5 w-3.5 h-3.5 rounded accent-amber-500 cursor-pointer flex-shrink-0 transition-opacity p-0',
                      hasSelectedFsItems || isChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    )}
                    title={`Select ${node.name}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => selectFile(node)}
                  className={cn(
                    'flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 rounded-md text-left',
                    collapsed && 'justify-center'
                  )}
                  title={node.path}
                >
                  {!collapsed && <div className="w-3.5 h-3.5 flex-shrink-0" />}
                  <IconComp className="w-3.5 h-3.5 flex-shrink-0 text-[rgb(var(--color-foreground-muted))]" />
                  {!collapsed && <span className="truncate text-xs">{node.name}</span>}
                </button>

                {!collapsed && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setRenamingFsPath(node.path);
                        setRenameFsValue(node.name);
                      }}
                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                      title="Rename File"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setExplorerOpError(null);
                        setPendingDeleteFsEntry({ path: node.path, name: node.name, type: 'file' });
                      }}
                      className="p-0.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                      title="Delete File (Moves to Recycle Bin)"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    );

    return (
      <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
        {/* New Project Button Only (Exact counterpart to New Chat) */}
        <button
          type="button"
          onClick={handleNewProject}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg flex-shrink-0',
            'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 hover:bg-[rgb(var(--color-primary-hover))] backdrop-blur-md border border-slate-900/15 dark:border-white/20',
            'text-[rgb(var(--color-primary-foreground))] font-semibold text-sm transition-colors shadow-sm',
            collapsed && 'px-2'
          )}
          title="New Project"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>New Project</span>}
        </button>

        {/* Bulk Multi-Select Delete Bar */}
        {!collapsed && hasSelectedFsItems && (
          <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs flex-shrink-0">
            <span className="font-semibold text-amber-300 truncate">
              {selectedFsList.length} selected
            </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setPendingDeleteFsBatch(selectedFsList)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold"
                title="Move all selected files/folders to Recycle Bin"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFsItems({})}
                className="px-1.5 py-0.5 rounded border border-[rgb(var(--color-border))] text-[11px] text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Saved Projects Tree List (Project -> Folders -> Subfolders -> Files) */}
        {!collapsed ? (
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {(workspaceError || explorerOpError) && (
              <p className="px-2 py-1.5 rounded bg-red-500/10 text-red-400 text-[11px]">
                {explorerOpError || workspaceError}
              </p>
            )}

            {projects.length === 0 ? (
              <div className="text-center py-6 text-[rgb(var(--color-foreground-muted))] text-xs">
                No projects yet — click <strong>New Project</strong> above, then choose a folder in the chat session.
              </div>
            ) : (
              projects.map(proj => {
                const isActive = proj.id === activeProjectId;
                const isProjectOpen = expandedProjects.has(proj.id);
                const isEditing = editingProjectId === proj.id;
                const folders = proj.folders || [];

                return (
                  <div key={proj.id} className="space-y-0.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgb(var(--color-surface-hover))]">
                        <form
                          onSubmit={e => handleSaveProjectRename(proj.id, e)}
                          className="flex items-center gap-1 w-full"
                        >
                          <input
                            type="text"
                            value={editProjectTitle}
                            onChange={e => setEditProjectTitle(e.target.value)}
                            onClick={e => e.stopPropagation()}
                            onKeyDown={e => {
                              if (e.key === 'Escape') setEditingProjectId(null);
                            }}
                            autoFocus
                            className="flex-1 bg-transparent border-b border-[rgb(var(--color-primary))] text-xs py-0.5 focus:outline-none text-[rgb(var(--color-foreground))]"
                          />
                          <button
                            type="button"
                            onClick={e => handleSaveProjectRename(proj.id, e)}
                            className="p-1 rounded text-emerald-500 hover:bg-emerald-500/10"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setEditingProjectId(null);
                            }}
                            className="p-1 rounded text-slate-400 hover:bg-slate-500/10"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'group flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg transition-colors',
                          isActive
                            ? 'bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground))] font-medium border-l-2 border-[rgb(var(--color-primary))]'
                            : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleProjectExpanded(proj.id)}
                          className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex-shrink-0"
                          title={isProjectOpen ? 'Collapse project' : 'Expand project'}
                        >
                          <ChevronRight
                            className={cn(
                              'w-3.5 h-3.5 transition-transform',
                              isProjectOpen && 'rotate-90'
                            )}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchProject(proj.id);
                            onModeChange('work');
                            navigate('/work');
                          }}
                          className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                          title={proj.name}
                        >
                          <Terminal className="w-3.5 h-3.5 flex-shrink-0 text-[rgb(var(--color-primary))]" />
                          <span className="truncate text-xs font-medium">{proj.name}</span>
                        </button>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setEditingProjectId(proj.id);
                              setEditProjectTitle(proj.name);
                            }}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            title="Rename Project in EXCO"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setPendingDeleteProject({ id: proj.id, name: proj.name });
                            }}
                            className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                            title="Delete Project from EXCO (keeps folders on PC)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Collapsible Project Dropdown Content -> Project Chats + Folders Tree */}
                    {isProjectOpen && (() => {
                      const localConvId = typeof window !== 'undefined' ? localStorage.getItem(`exco:work-conv:${proj.id}`) : null;
                      const projConvIdSet = new Set<string>([
                        ...(proj.conversationId ? [proj.conversationId] : []),
                        ...(Array.isArray(proj.conversationIds) ? proj.conversationIds : []),
                        ...(localConvId ? [localConvId] : []),
                      ]);
                      const projWorkConvs = workConversations.filter(c => projConvIdSet.has(c.id));

                      return (
                      <div className="pl-3 ml-2 border-l border-[rgb(var(--color-border))]/70 space-y-1.5 py-0.5">
                        {/* Project Chat History Section (strictly isolated from Chat Mode) */}
                        <div className="space-y-0.5 pb-1 border-b border-[rgb(var(--color-border))]/50">
                          <div className="flex items-center justify-between px-1.5 py-0.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))]">
                              Chats ({projWorkConvs.length})
                            </span>
                            <button
                              type="button"
                              onClick={async e => {
                                e.stopPropagation();
                                localStorage.removeItem(`exco:work-conv:${proj.id}`);
                                await setProjectConversationId(proj.id, undefined);
                                await switchProject(proj.id);
                                onModeChange('work');
                                navigate('/work');
                                window.dispatchEvent(
                                  new CustomEvent('exco:work-select-conversation', {
                                    detail: { projectId: proj.id, conversationId: undefined },
                                  })
                                );
                              }}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))]/10"
                              title="Start a new chat inside this project folder"
                            >
                              <Plus className="w-3 h-3" />
                              <span>New Chat</span>
                            </button>
                          </div>

                          {projWorkConvs.length === 0 ? (
                            <p className="px-2 py-0.5 text-[11px] text-[rgb(var(--color-foreground-muted))] italic">
                              No chats yet in this folder
                            </p>
                          ) : (
                            projWorkConvs.map(wc => {
                              const isCurrentChat = isActive && proj.conversationId === wc.id;
                              return (
                                <div
                                  key={wc.id}
                                  onClick={async e => {
                                    e.stopPropagation();
                                    localStorage.setItem(`exco:work-conv:${proj.id}`, wc.id);
                                    await setProjectConversationId(proj.id, wc.id);
                                    await switchProject(proj.id);
                                    onModeChange('work');
                                    navigate('/work');
                                    window.dispatchEvent(
                                      new CustomEvent('exco:work-select-conversation', {
                                        detail: { projectId: proj.id, conversationId: wc.id },
                                      })
                                    );
                                  }}
                                  className={cn(
                                    'group flex items-center justify-between gap-1 px-2 py-1 rounded-md cursor-pointer text-xs transition-colors',
                                    isCurrentChat
                                      ? 'bg-[rgb(var(--color-primary))]/15 text-[rgb(var(--color-foreground))] font-medium'
                                      : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
                                  )}
                                  title={wc.title}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-75" />
                                    <span className="truncate text-[11px]">{wc.title || 'Work Chat'}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async e => {
                                      e.stopPropagation();
                                      if (localStorage.getItem(`exco:work-conv:${proj.id}`) === wc.id) {
                                        localStorage.removeItem(`exco:work-conv:${proj.id}`);
                                      }
                                      await removeProjectConversationId(proj.id, wc.id);
                                      await window.exco.chat.cancelStream(wc.id).catch(() => {});
                                      await window.exco.chat.deleteConversation(wc.id).catch(() => {});
                                      setWorkConversations(prev => prev.filter(item => item.id !== wc.id));
                                      window.dispatchEvent(
                                        new CustomEvent('exco:work-conv-deleted', { detail: { projectId: proj.id, conversationId: wc.id } })
                                      );
                                      window.dispatchEvent(new CustomEvent('exco:work-conversations-updated'));
                                    }}
                                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                    title="Delete project chat"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {folders.length === 0 ? (
                          <p className="px-2 py-1 text-[11px] text-[rgb(var(--color-foreground-muted))] italic">
                            Use Select Folder in the chat session to attach a folder.
                          </p>
                        ) : (
                          folders.map(folder => {
                            const isFolderOpen = expandedPaths.has(folder.path);
                            const nodes = fileTrees[folder.path] || [];
                            return (
                              <div key={folder.path} className="space-y-0.5">
                                <div className={cn(
                                  'group flex items-center gap-1 rounded-md bg-[rgb(var(--color-primary-light))]/30 hover:bg-[rgb(var(--color-surface-hover))] pr-1 transition-colors',
                                  selectedFsItems[folder.path] && 'ring-1 ring-amber-500/40 bg-amber-500/10'
                                )}>
                                  <input
                                    type="checkbox"
                                    checked={Boolean(selectedFsItems[folder.path])}
                                    onChange={e => toggleFsItemSelected({ path: folder.path, name: folder.name, type: 'folder' }, e)}
                                    onClick={e => e.stopPropagation()}
                                    className={cn(
                                      'ml-1.5 w-3.5 h-3.5 rounded accent-amber-500 cursor-pointer flex-shrink-0 transition-opacity p-0',
                                      hasSelectedFsItems || selectedFsItems[folder.path] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    )}
                                    title={`Select ${folder.name}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => togglePath(folder.path)}
                                    className="flex-1 min-w-0 flex items-center gap-1.5 px-2 py-1 text-left"
                                    title={folder.path}
                                  >
                                      <ChevronRight
                                        className={cn(
                                          'w-3.5 h-3.5 flex-shrink-0 text-[rgb(var(--color-accent-ink))] transition-transform',
                                          isFolderOpen && 'rotate-90'
                                        )}
                                      />
                                      <FolderOpen className="w-3.5 h-3.5 flex-shrink-0 text-[rgb(var(--color-accent-ink))]" />
                                    <span className="truncate font-semibold text-xs text-[rgb(var(--color-foreground))]">
                                      {folder.name}
                                    </span>
                                  </button>

                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                    <button
                                      type="button"
                                      onClick={e => handleStartCreateInDir(folder.path, 'file', e)}
                                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                                      title="New File inside folder"
                                    >
                                      <FilePlus className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={e => handleStartCreateInDir(folder.path, 'folder', e)}
                                      className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-[rgb(var(--color-foreground))]"
                                      title="New Subfolder"
                                    >
                                      <FolderPlus className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={e => {
                                        e.stopPropagation();
                                        setExplorerOpError(null);
                                        setPendingDeleteFsEntry({ path: folder.path, name: folder.name, type: 'folder' });
                                      }}
                                      className="p-0.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-colors"
                                      title="Delete Folder (Moves to Recycle Bin)"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {isFolderOpen && (
                                  <div className="pl-2.5 ml-2 border-l border-[rgb(var(--color-border))]/70 space-y-0.5">
                                    {renderInlineCreateInput(folder.path)}
                                    {nodes.length > 0 ? (
                                      renderTree(nodes)
                                    ) : !creatingInDir || creatingInDir.dirPath !== folder.path ? (
                                      <p className="px-2 py-1 text-[11px] text-[rgb(var(--color-foreground-muted))] italic">
                                        Empty folder
                                      </p>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                      );
                    })()}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 flex flex-col items-center">
            {projects.slice(0, 8).map(proj => {
              const isActive = proj.id === activeProjectId;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    switchProject(proj.id);
                    onModeChange('work');
                    navigate('/work');
                  }}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                    isActive
                      ? 'bg-[rgb(var(--color-primary-light))] text-[rgb(var(--color-primary-hover))] font-semibold'
                      : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
                  )}
                  title={proj.name}
                >
                  <FolderOpen className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const hasGlobalBackdrop = Boolean(resolveActiveWallpaper(globalFilter)) && (globalFilter.bgImageOpacity ?? 0) > 0.005;
  const sidebarHasOwnBg = Boolean(sidebarSegment.bg || sidebarSegment.bgImage);

  return (
    <aside
      className={cn(
        'relative overflow-hidden sidebar h-full flex flex-col flex-shrink-0',
        collapsed ? 'w-16' : 'w-72',
        'border-r border-[rgb(var(--color-border))]',
        !sidebarHasOwnBg
          ? 'ui-translucent'
          : 'bg-[rgb(var(--color-surface))]'
      )}
      style={getSegmentStyle(sidebarSegment)}
    >
      {(sidebarSegment.grain > 0.005 || sidebarSegment.tintOpacity > 0.005 || Boolean(sidebarSegment.bgImage)) && (
        <VisualOverlay
          grain={sidebarSegment.grain}
          tintColor={sidebarSegment.tintColor}
          tintOpacity={sidebarSegment.tintOpacity}
          bgImage={sidebarSegment.bgImage}
          bgImageOpacity={sidebarSegment.bgImageOpacity}
          bgImageBlur={sidebarSegment.bgImageBlur}
          bgImageFit={sidebarSegment.bgImageFit}
        />
      )}
      {/* Top Section - Collapsible Chat / Work Mode Switcher (EXCO moved to full Title Bar) */}
      <div className="relative z-10 flex-shrink-0 p-3 border-b border-[rgb(var(--color-border))]">
        {/* Mode Toggle Buttons */}
        {collapsed ? (
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={() => handleModeClick('chatbot')}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200',
                isChatActive
                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] shadow-md'
                  : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
              )}
              title="Chatbot Mode"
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
            </button>

            <button
              onClick={() => handleModeClick('work')}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200',
                isWorkActive
                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] shadow-md'
                  : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
              )}
              title={activeProject ? `Work Mode (${activeProject.name})` : 'Work Mode'}
            >
              <Terminal className="w-5 h-5 flex-shrink-0" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => handleModeClick('chatbot')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                isChatActive
                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] shadow-md'
                  : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
              )}
              title="Chatbot Mode"
            >
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">Chat</span>
            </button>

            <button
              onClick={() => handleModeClick('work')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                isWorkActive
                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] shadow-md'
                  : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]'
              )}
              title={activeProject ? `Work Mode (${activeProject.name})` : 'Work Mode'}
            >
              <Terminal className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">Work</span>
            </button>
          </div>
        )}
      </div>

      {/* Middle Section - Content */}
      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col min-h-0">
        {isWorkActive || mode === 'work' ? renderWorkSidebar() : renderChatbotSidebar()}
      </div>

      {/* Bottom Section - Sidebar Config Tools + Collapse Toggle */}
      <div className="relative z-10 flex-shrink-0 p-3 border-t border-[rgb(var(--color-border))] space-y-1">
        {(
          [
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'providers', label: 'AI Providers', icon: Cpu },
            { id: 'api-keys', label: 'API Keys', icon: Key },
            { id: 'mcp', label: 'MCP Servers', icon: Server },
            { id: 'plugins', label: 'Plugins', icon: Plug },
            { id: 'skills', label: 'AI Skills', icon: Wand2 },
          ] as Array<{ id: ConfigToolId; label: string; icon: React.ComponentType<{ className?: string }> }>
        ).map(tool => {
          const ToolIcon = tool.icon;
          const isToolActive = activeConfigTool === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => {
                if (onOpenConfigTool) {
                  onOpenConfigTool(tool.id);
                } else {
                  window.dispatchEvent(new CustomEvent('exco:open-sidebar-tool', { detail: { tool: tool.id } }));
                }
              }}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                isToolActive
                  ? 'bg-[rgb(var(--color-primary))] dark:bg-[rgb(var(--color-primary))]/65 backdrop-blur-md border border-slate-900/15 dark:border-white/20 text-[rgb(var(--color-primary-foreground))] font-semibold'
                  : 'text-[rgb(var(--color-foreground-muted))] hover:bg-[rgb(var(--color-surface-hover))] hover:text-[rgb(var(--color-foreground))]',
                collapsed ? 'justify-center' : 'justify-start'
              )}
              title={tool.label}
            >
              <ToolIcon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{tool.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Permanent Delete Warning Modal */}
      {pendingDeleteConv && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPendingDeleteConv(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-red-500/40 bg-[rgb(var(--color-surface))] p-5 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
              Permanently Delete Conversation?
            </h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--color-foreground-muted))] mb-4">
              Deleting <span className="font-semibold text-[rgb(var(--color-foreground))]">&ldquo;{pendingDeleteConv.title}&rdquo;</span> will permanently erase this conversation and all of its messages from your device.{' '}
              <span className="text-red-400 font-semibold">This cannot be undone and there are no recovery options.</span>
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteConv(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
              >
                Cancel
              </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteConversation}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Delete EXCO Project Warning Modal (DB-only — never deletes PC folders) */}
      {pendingDeleteProject && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPendingDeleteProject(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-red-500/40 bg-[rgb(var(--color-surface))] p-5 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
              Delete Project from EXCO?
            </h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--color-foreground-muted))] mb-4">
              Removing <span className="font-semibold text-[rgb(var(--color-foreground))]">&ldquo;{pendingDeleteProject.name}&rdquo;</span> deletes this project and its saved Work session from EXCO&apos;s database only.{' '}
              <span className="text-emerald-400 font-semibold">Your actual folders and files on your PC will not be deleted or modified.</span>
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteProject(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
              >
                Cancel
              </button>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteProject(pendingDeleteProject.id);
                    setPendingDeleteProject(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm"
                >
                  Remove from EXCO
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Workspace File / Folder Recycle Bin Confirmation Modal */}
      {pendingDeleteFsEntry && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !deletingFsEntry && setPendingDeleteFsEntry(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-amber-500/40 bg-[rgb(var(--color-surface))] p-5 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
              Delete {pendingDeleteFsEntry.type === 'folder' ? 'Folder' : 'File'}?
            </h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--color-foreground-muted))] mb-4">
              Deleting <span className="font-semibold text-[rgb(var(--color-foreground))]">&ldquo;{pendingDeleteFsEntry.name}&rdquo;</span> will delete it from both EXCO and its folder on your computer, and move it to your{' '}
              <span className="text-amber-400 font-semibold">Recycle Bin</span> so you can restore it if needed.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deletingFsEntry}
                onClick={() => setPendingDeleteFsEntry(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingFsEntry}
                onClick={async () => {
                  const target = pendingDeleteFsEntry;
                  if (!target) return;
                  setDeletingFsEntry(true);
                  try {
                    setExplorerOpError(null);
                    await deleteFsEntry(target.path);
                    setPendingDeleteFsEntry(null);
                  } catch (err: any) {
                    setExplorerOpError(err?.message || 'Failed to move item to Recycle Bin');
                    setPendingDeleteFsEntry(null);
                  } finally {
                    setDeletingFsEntry(false);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {deletingFsEntry ? 'Deleting...' : 'Delete to Recycle Bin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Multi-Select Recycle Bin Confirmation Modal */}
      {pendingDeleteFsBatch && pendingDeleteFsBatch.length > 0 && (
        <div
          className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !deletingFsEntry && setPendingDeleteFsBatch(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-amber-500/40 bg-[rgb(var(--color-surface))] p-5 shadow-2xl animate-scale-in"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2">
              Delete {pendingDeleteFsBatch.length} Selected {pendingDeleteFsBatch.length === 1 ? 'Item' : 'Items'}?
            </h3>
            <p className="text-xs leading-relaxed text-[rgb(var(--color-foreground-muted))] mb-2">
              Deleting these items will remove them from both EXCO and their folders on your computer, and move them to your{' '}
              <span className="text-amber-400 font-semibold">Recycle Bin</span> so you can restore them anytime.
            </p>
            <div className="max-h-28 overflow-y-auto mb-4 px-2.5 py-1.5 rounded-lg bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] text-[11px] font-mono space-y-0.5">
              {pendingDeleteFsBatch.map(item => (
                <div key={item.path} className="truncate text-[rgb(var(--color-foreground))]">
                  {item.type === 'folder' ? '📁 ' : '📄 '}
                  {item.name}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deletingFsEntry}
                onClick={() => setPendingDeleteFsBatch(null)}
                className="px-3.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingFsEntry}
                onClick={async () => {
                  const batch = pendingDeleteFsBatch;
                  if (!batch?.length) return;
                  setDeletingFsEntry(true);
                  try {
                    setExplorerOpError(null);
                    const sorted = [...batch].sort((a, b) => a.path.length - b.path.length);
                    const rootsToDelete: typeof sorted = [];
                    for (const item of sorted) {
                      const normItem = item.path.replace(/\\/g, '/').toLowerCase();
                      const coveredByParent = rootsToDelete.some(parent => {
                        const normParent = parent.path.replace(/\\/g, '/').toLowerCase().replace(/\/$/, '');
                        return normItem === normParent || normItem.startsWith(normParent + '/');
                      });
                      if (!coveredByParent) rootsToDelete.push(item);
                    }
                    for (const item of rootsToDelete) {
                      await deleteFsEntry(item.path);
                    }
                    setSelectedFsItems({});
                    setPendingDeleteFsBatch(null);
                  } catch (err: any) {
                    setExplorerOpError(err?.message || 'Failed to delete selected items to Recycle Bin');
                    setPendingDeleteFsBatch(null);
                  } finally {
                    setDeletingFsEntry(false);
                  }
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
              >
                {deletingFsEntry ? 'Deleting...' : `Move ${pendingDeleteFsBatch.length} to Recycle Bin`}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function getFileIcon(extension?: string) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    ts: FileText,
    tsx: FileText,
    js: FileText,
    jsx: FileText,
    json: FileText,
    md: FileText,
    txt: FileText,
    py: FileText,
    rs: FileText,
    go: FileText,
    java: FileText,
    html: FileText,
    css: FileText,
    scss: FileText,
    yaml: FileText,
    yml: FileText,
    toml: FileText,
    ini: FileText,
    cfg: FileText,
    conf: FileText,
    sh: FileText,
    bash: FileText,
    zsh: FileText,
    fish: FileText,
    ps1: FileText,
    bat: FileText,
    cmd: FileText,
    dockerfile: FileText,
    gitignore: FileText,
    gitattributes: FileText,
    env: FileText,
    lock: FileText,
    log: FileText,
    sql: FileText,
    graphql: FileText,
    gql: FileText,
    proto: FileText,
    xml: FileText,
    svg: FileText,
  };

  const Icon = icons[extension?.toLowerCase() || ''] || FileText;
  return Icon;
}