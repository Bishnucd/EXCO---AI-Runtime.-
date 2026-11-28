/**
 * EXCO Multi-Project Workspace Store
 * Manages saved Work Projects ("New Project" sessions), collapsible project dropdowns,
 * continuous file/folder tree synchronization (fs.watch + focus + 2s polling),
 * and safe in-explorer manipulation (create file, create folder, rename — never delete PC files).
 */

import type React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Workspace, WorkProject, FileSystemNode, TerminalSession } from '@shared/types';

export interface EffectiveProjectFolder {
  folder: Workspace;
  sourceProjectId: string;
  sourceProjectName: string;
  isSyncedFromOtherProject: boolean;
}

function normPath(p: string): string {
  const cleaned = (p || '').replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
  return /^[a-z]:/i.test(cleaned) ? cleaned.toLowerCase() : cleaned;
}

function joinChildPath(dirPath: string, name: string): string {
  const sep = dirPath.includes('\\') && !dirPath.includes('/') ? '\\' : dirPath.includes('\\') ? '\\' : '/';
  const trimmed = dirPath.replace(/[\\/]+$/, '');
  return `${trimmed}${sep}${name}`;
}

function getParentDir(entryPath: string): string {
  const idx = Math.max(entryPath.lastIndexOf('\\'), entryPath.lastIndexOf('/'));
  return idx > 0 ? entryPath.slice(0, idx) : entryPath;
}

function mergeChildrenAtPath(
  nodes: FileSystemNode[],
  targetDirPath: string,
  children: FileSystemNode[]
): FileSystemNode[] {
  const targetNorm = normPath(targetDirPath);
  return nodes.map(node => {
    if (normPath(node.path) === targetNorm) {
      return { ...node, children };
    }
    if (node.children && node.children.length > 0 && targetNorm.startsWith(normPath(node.path) + '/')) {
      return { ...node, children: mergeChildrenAtPath(node.children, targetDirPath, children) };
    }
    return node;
  });
}

async function buildHierarchicalTree(
  dirPath: string,
  expandedPaths: Set<string>
): Promise<FileSystemNode[]> {
  const nodes = await window.exco.fs.readDir(dirPath);
  const enriched = await Promise.all(
    nodes.map(async node => {
      if (node.type === 'directory' && expandedPaths.has(node.path)) {
        try {
          const children = await buildHierarchicalTree(node.path, expandedPaths);
          return { ...node, children };
        } catch {
          return node;
        }
      }
      return node;
    })
  );
  return enriched;
}

export function computeEffectiveFolders(
  projects: WorkProject[],
  activeProjectId: string | null
): EffectiveProjectFolder[] {
  const active = projects.find(p => p.id === activeProjectId);
  if (!active) return [];

  const seen = new Set<string>();
  const result: EffectiveProjectFolder[] = [];

  for (const folder of active.folders || []) {
    const key = normPath(folder.path);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push({
      folder,
      sourceProjectId: active.id,
      sourceProjectName: active.name,
      isSyncedFromOtherProject: false,
    });
  }

  return result;
}

function getAllProjectFolderPaths(projects: WorkProject[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of projects) {
    for (const f of p.folders || []) {
      const k = normPath(f.path);
      if (k && !seen.has(k)) {
        seen.add(k);
        out.push(f.path);
      }
    }
  }
  return out;
}

let activeFsWatcherUnsub: (() => void) | null = null;
const watchedDirPaths = new Set<string>();
let fsRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let fsPollTimer: ReturnType<typeof setInterval> | null = null;
let windowFocusListenerAttached = false;
let isPollingRefresh = false;

async function syncWatchers(
  allFolderPaths: string[],
  onFsChanged: () => void
): Promise<void> {
  const uniqueTargets = Array.from(new Set(allFolderPaths.filter(Boolean)));
  const targetNormSet = new Set(uniqueTargets.map(normPath));

  // Unwatch paths no longer belonging to any project
  for (const existing of Array.from(watchedDirPaths)) {
    if (!targetNormSet.has(normPath(existing))) {
      await window.exco.fs.unwatch(existing).catch(() => {});
      watchedDirPaths.delete(existing);
    }
  }

  // Register allowed roots with main process so every expanded project dropdown can read/create/rename freely
  await window.exco.workspace.setAllowedPaths(uniqueTargets).catch(() => {});

  // Watch all active & saved project root folders
  for (const dirPath of uniqueTargets) {
    if (!watchedDirPaths.has(dirPath)) {
      try {
        await window.exco.fs.watch(dirPath);
        watchedDirPaths.add(dirPath);
      } catch (err) {
        console.warn('Workspace watcher unavailable for', dirPath, err);
      }
    }
  }

  if (activeFsWatcherUnsub) {
    activeFsWatcherUnsub();
    activeFsWatcherUnsub = null;
  }

  if (fsPollTimer) {
    clearInterval(fsPollTimer);
    fsPollTimer = null;
  }

  if (uniqueTargets.length > 0) {
    activeFsWatcherUnsub = window.exco.fs.onChange(() => {
      if (fsRefreshTimer) clearTimeout(fsRefreshTimer);
      fsRefreshTimer = setTimeout(() => {
        onFsChanged();
      }, 120);
    });

    // Continuous 2-second poll catches any Windows File Explorer creations/renames even when recursive OS events coalesce
    fsPollTimer = setInterval(async () => {
      if (isPollingRefresh) return;
      isPollingRefresh = true;
      try {
        await Promise.resolve(onFsChanged());
      } finally {
        isPollingRefresh = false;
      }
    }, 2000);

    if (!windowFocusListenerAttached && typeof window !== 'undefined') {
      windowFocusListenerAttached = true;
      window.addEventListener('focus', () => {
        onFsChanged();
      });
    }
  }
}

async function persistProjectsToDatabase(projects: WorkProject[]): Promise<void> {
  try {
    await window.exco.workspace.saveProjects(projects);
  } catch (err) {
    console.warn('Failed to sync projects to database:', err);
  }
}

interface WorkspaceState {
  projects: WorkProject[];
  activeProjectId: string | null;
  workspace: Workspace | null;
  fileTree: FileSystemNode[];
  fileTrees: Record<string, FileSystemNode[]>;
  expandedProjects: Set<string>;
  expandedPaths: Set<string>;
  selectedFile: FileSystemNode | null;
  terminals: TerminalSession[];
  activeTerminalId: string | null;
  loading: boolean;
  error: string | null;

  initializeWorkspace: () => Promise<void>;
  createProject: (name?: string) => Promise<WorkProject>;
  switchProject: (projectId: string) => Promise<void>;
  toggleProjectExpanded: (projectId: string) => Promise<void>;
  renameProject: (projectId: string, name: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setProjectConversationId: (projectId: string, conversationId?: string) => Promise<void>;
  removeProjectConversationId: (projectId: string, conversationId: string) => Promise<void>;

  selectWorkspace: () => Promise<void>;
  removeFolderFromProject: (folderPath: string, projectId?: string) => Promise<void>;
  closeWorkspace: () => Promise<void>;
  loadFileTree: (dirPath?: string) => Promise<void>;
  togglePath: (dirPath: string) => Promise<void>;
  selectFile: (file: FileSystemNode | null) => void;
  getEffectiveFolders: () => EffectiveProjectFolder[];

  // In-explorer manipulation (create, rename, and move to OS Recycle Bin)
  createFileInDir: (dirPath: string, fileName: string) => Promise<FileSystemNode | null>;
  createFolderInDir: (parentDirPath: string, folderName: string) => Promise<void>;
  renameFsEntry: (oldPath: string, newName: string) => Promise<void>;
  deleteFsEntry: (targetPath: string) => Promise<void>;

  createTerminal: (cwd?: string) => Promise<TerminalSession>;
  closeTerminal: (terminalId: string) => Promise<void>;
  setActiveTerminal: (terminalId: string | null) => void;
  writeToTerminal: (terminalId: string, data: string) => void;
  resizeTerminal: (terminalId: string, cols: number, rows: number) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      workspace: null,
      fileTree: [],
      fileTrees: {},
      expandedProjects: new Set(),
      expandedPaths: new Set(),
      selectedFile: null,
      terminals: [],
      activeTerminalId: null,
      loading: false,
      error: null,

      getEffectiveFolders: () => {
        return computeEffectiveFolders(get().projects, get().activeProjectId);
      },

      initializeWorkspace: async () => {
        let projects = get().projects || [];
        let activeProjectId = get().activeProjectId;

        try {
          const dbProjects = await window.exco.workspace.listProjects();
          if (Array.isArray(dbProjects) && dbProjects.length > 0 && projects.length === 0) {
            projects = dbProjects;
          }
        } catch {}

        const legacyWs = get().workspace;
        if (projects.length === 0 && legacyWs?.path) {
          const migrated: WorkProject = {
            id: `proj-${legacyWs.id || Date.now()}`,
            name: legacyWs.name || 'Project 1',
            folders: [legacyWs],
            syncedProjectIds: [],
            createdAt: legacyWs.createdAt || Date.now(),
            updatedAt: Date.now(),
          };
          projects = [migrated];
          activeProjectId = migrated.id;
        }

        if (projects.length > 0 && (!activeProjectId || !projects.some(p => p.id === activeProjectId))) {
          activeProjectId = projects[0].id;
        }

        // Prune any phantom folders that no longer exist on disk before rendering
        const initialAllPaths = getAllProjectFolderPaths(projects);
        if (initialAllPaths.length > 0) {
          await window.exco.workspace.setAllowedPaths(initialAllPaths).catch(() => {});
          const existsEntries = await Promise.all(
            initialAllPaths.map(async p => {
              const res = await window.exco.fs.exists(p).catch(() => ({ exists: false, isDirectory: false }));
              return [normPath(p), Boolean(res?.exists && res?.isDirectory)] as const;
            })
          );
          const existsMap = new Map(existsEntries);
          projects = projects.map(p => ({
            ...p,
            folders: (p.folders || []).filter(f => f?.path && existsMap.get(normPath(f.path))),
          }));
        }

        const activeProj = projects.find(p => p.id === activeProjectId) || null;
        const primaryFolder = activeProj?.folders?.[0] || null;
        const expandedProjects = new Set<string>(get().expandedProjects);
        if (activeProjectId) expandedProjects.add(activeProjectId);

        const expandedPaths = new Set<string>();
        for (const p of projects) {
          for (const f of p.folders || []) {
            expandedPaths.add(f.path);
          }
        }

        set({
          projects,
          activeProjectId,
          workspace: primaryFolder,
          expandedProjects,
          expandedPaths,
        });

        await persistProjectsToDatabase(projects);

        const allPaths = getAllProjectFolderPaths(projects);
        if (allPaths.length > 0) {
          await syncWatchers(allPaths, () => get().loadFileTree());
          await get().loadFileTree();
        }
      },

      createProject: async (name?: string) => {
        const currentProjects = get().projects;
        const nextIndex = currentProjects.length + 1;
        const project: WorkProject = {
          id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: (name || '').trim() || `New Project ${nextIndex}`,
          folders: [],
          syncedProjectIds: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const nextProjects = [project, ...currentProjects];
        const nextExpandedProjects = new Set(get().expandedProjects);
        nextExpandedProjects.add(project.id);

        set({
          projects: nextProjects,
          activeProjectId: project.id,
          workspace: null,
          fileTree: [],
          expandedProjects: nextExpandedProjects,
          selectedFile: null,
          error: null,
        });

        await persistProjectsToDatabase(nextProjects);
        await syncWatchers(getAllProjectFolderPaths(nextProjects), () => get().loadFileTree());
        return project;
      },

      switchProject: async (projectId: string) => {
        const target = get().projects.find(p => p.id === projectId);
        if (!target) return;

        const primaryFolder = target.folders?.[0] || null;
        const nextExpandedProjects = new Set(get().expandedProjects);
        nextExpandedProjects.add(target.id);
        const nextExpandedPaths = new Set(get().expandedPaths);
        for (const f of target.folders || []) {
          nextExpandedPaths.add(f.path);
        }

        set({
          activeProjectId: target.id,
          workspace: primaryFolder,
          expandedProjects: nextExpandedProjects,
          expandedPaths: nextExpandedPaths,
          selectedFile: null,
          error: null,
        });

        await syncWatchers(getAllProjectFolderPaths(get().projects), () => get().loadFileTree());
        await get().loadFileTree();
      },

      toggleProjectExpanded: async (projectId: string) => {
        const nextExpandedProjects = new Set(get().expandedProjects);
        const willOpen = !nextExpandedProjects.has(projectId);
        if (willOpen) {
          nextExpandedProjects.add(projectId);
        } else {
          nextExpandedProjects.delete(projectId);
        }
        set({ expandedProjects: nextExpandedProjects });

        if (willOpen) {
          const proj = get().projects.find(p => p.id === projectId);
          if (proj?.folders?.length) {
            const nextExpandedPaths = new Set(get().expandedPaths);
            for (const f of proj.folders) {
              nextExpandedPaths.add(f.path);
            }
            set({ expandedPaths: nextExpandedPaths });
            await syncWatchers(getAllProjectFolderPaths(get().projects), () => get().loadFileTree());
            await get().loadFileTree();
          }
        }
      },

      renameProject: async (projectId: string, name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const nextProjects = get().projects.map(p =>
          p.id === projectId ? { ...p, name: trimmed, updatedAt: Date.now() } : p
        );
        set({ projects: nextProjects });
        await persistProjectsToDatabase(nextProjects);
      },

      deleteProject: async (projectId: string) => {
        const target = get().projects.find(p => p.id === projectId);
        if (!target) return;

        // Notify WorkMode & main immediately so any active run aborts cleanly before DB cleanup
        const convId = target.conversationId || localStorage.getItem(`exco:work-conv:${projectId}`);
        window.dispatchEvent(
          new CustomEvent('exco:project-deleted', { detail: { projectId, conversationId: convId } })
        );

        // EXCO DB cleanup ONLY — never deletes or modifies actual PC folders/files
        const convIdsToDelete = Array.from(
          new Set([
            ...(target.conversationId ? [target.conversationId] : []),
            ...(Array.isArray(target.conversationIds) ? target.conversationIds : []),
            ...(localStorage.getItem(`exco:work-conv:${projectId}`)
              ? [localStorage.getItem(`exco:work-conv:${projectId}`)!]
              : []),
          ])
        );
        for (const cid of convIdsToDelete) {
          await window.exco.chat.cancelStream(cid).catch(() => {});
          await window.exco.chat.deleteConversation(cid).catch(() => {});
        }
        localStorage.removeItem(`exco:work-conv:${projectId}`);
        window.dispatchEvent(new CustomEvent('exco:work-conversations-updated'));

        const nextProjects = get().projects.filter(p => p.id !== projectId);
        const remainingPaths = new Set(getAllProjectFolderPaths(nextProjects).map(normPath));
        for (const folder of target.folders || []) {
          if (folder.id && !remainingPaths.has(normPath(folder.path))) {
            await window.exco.workspace.deleteDbEntry(folder.id).catch(() => {});
          }
        }

        const nextExpandedProjects = new Set(get().expandedProjects);
        nextExpandedProjects.delete(projectId);

        const wasActive = get().activeProjectId === projectId;
        const nextActiveId = wasActive ? nextProjects[0]?.id || null : get().activeProjectId;
        if (nextActiveId) nextExpandedProjects.add(nextActiveId);
        const nextActiveProj = nextProjects.find(p => p.id === nextActiveId) || null;

        set({
          projects: nextProjects,
          activeProjectId: nextActiveId,
          workspace: nextActiveProj?.folders?.[0] || null,
          expandedProjects: nextExpandedProjects,
          selectedFile: wasActive ? null : get().selectedFile,
        });

        await persistProjectsToDatabase(nextProjects);
        await syncWatchers(getAllProjectFolderPaths(nextProjects), () => get().loadFileTree());
        await get().loadFileTree();
      },

      setProjectConversationId: async (projectId: string, conversationId?: string) => {
        const nextProjects = get().projects.map(p => {
          if (p.id !== projectId) return p;
          const existingList = Array.isArray(p.conversationIds) ? p.conversationIds : [];
          if (!conversationId) {
            return { ...p, conversationId: undefined, updatedAt: Date.now() };
          }
          const nextIds = existingList.includes(conversationId)
            ? existingList
            : [conversationId, ...existingList.filter(Boolean)];
          return { ...p, conversationId, conversationIds: nextIds, updatedAt: Date.now() };
        });
        set({ projects: nextProjects });
        await persistProjectsToDatabase(nextProjects);
      },

      removeProjectConversationId: async (projectId: string, conversationId: string) => {
        const nextProjects = get().projects.map(p => {
          if (p.id !== projectId) return p;
          const nextIds = (Array.isArray(p.conversationIds) ? p.conversationIds : []).filter(id => id !== conversationId);
          const nextActive = p.conversationId === conversationId ? nextIds[0] : p.conversationId;
          return { ...p, conversationId: nextActive, conversationIds: nextIds, updatedAt: Date.now() };
        });
        set({ projects: nextProjects });
        await persistProjectsToDatabase(nextProjects);
      },

      selectWorkspace: async () => {
        set({ loading: true, error: null });
        try {
          const result = await window.exco.workspace.select();
          if (!result || !result.path) {
            set({ loading: false });
            return;
          }

          const opened: Workspace =
            'id' in result && (result as Workspace).id
              ? (result as Workspace)
              : await window.exco.workspace.open(result.path);

          let projects = [...get().projects];
          let activeId = get().activeProjectId;

          if (!activeId || !projects.some(p => p.id === activeId)) {
            const created: WorkProject = {
              id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: opened.name || 'New Project',
              folders: [opened],
              syncedProjectIds: [],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };
            projects = [created, ...projects];
            activeId = created.id;
          } else {
            projects = projects.map(p => {
              if (p.id !== activeId) return p;
              const existingFolders = p.folders || [];
              const alreadyAttached = existingFolders.some(f => normPath(f.path) === normPath(opened.path));
              const nextFolders = alreadyAttached ? existingFolders : [...existingFolders, opened];
              const isGenericName = /^New Project(\s+\d+)?$/i.test(p.name) && existingFolders.length === 0;
              return {
                ...p,
                name: isGenericName ? opened.name || p.name : p.name,
                folders: nextFolders,
                updatedAt: Date.now(),
              };
            });
          }

          const activeProj = projects.find(p => p.id === activeId)!;
          const primaryFolder = activeProj.folders[0] || opened;
          const expandedProjects = new Set(get().expandedProjects);
          expandedProjects.add(activeId);
          const expandedPaths = new Set(get().expandedPaths);
          expandedPaths.add(opened.path);

          set({
            projects,
            activeProjectId: activeId,
            workspace: primaryFolder,
            expandedProjects,
            expandedPaths,
            loading: false,
            error: null,
          });

          await persistProjectsToDatabase(projects);
          await syncWatchers(getAllProjectFolderPaths(projects), () => get().loadFileTree());
          await get().loadFileTree();
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to select folder',
            loading: false,
          });
        }
      },

      removeFolderFromProject: async (folderPath: string, projectId?: string) => {
        const targetId = projectId || get().activeProjectId;
        if (!targetId) return;

        const targetNorm = normPath(folderPath);
        const nextProjects = get().projects.map(p => {
          if (p.id !== targetId) return p;
          return {
            ...p,
            folders: (p.folders || []).filter(f => normPath(f.path) !== targetNorm),
            updatedAt: Date.now(),
          };
        });

        const activeProj = nextProjects.find(p => p.id === get().activeProjectId) || null;
        const primaryFolder = activeProj?.folders?.[0] || null;
        const allPaths = getAllProjectFolderPaths(nextProjects);

        const nextTrees = { ...get().fileTrees };
        if (!allPaths.some(p => normPath(p) === targetNorm)) {
          delete nextTrees[folderPath];
        }

        set({
          projects: nextProjects,
          workspace: primaryFolder,
          fileTrees: nextTrees,
          fileTree: primaryFolder ? nextTrees[primaryFolder.path] || [] : [],
          selectedFile:
            get().selectedFile && normPath(get().selectedFile!.path).startsWith(targetNorm)
              ? null
              : get().selectedFile,
        });

        await persistProjectsToDatabase(nextProjects);
        await syncWatchers(allPaths, () => get().loadFileTree());
        await get().loadFileTree();
      },

      closeWorkspace: async () => {
        try {
          for (const existing of Array.from(watchedDirPaths)) {
            await window.exco.fs.unwatch(existing).catch(() => {});
            watchedDirPaths.delete(existing);
          }
          if (activeFsWatcherUnsub) {
            activeFsWatcherUnsub();
            activeFsWatcherUnsub = null;
          }
          if (fsPollTimer) {
            clearInterval(fsPollTimer);
            fsPollTimer = null;
          }
          await window.exco.workspace.close();
          for (const terminal of get().terminals) {
            await window.exco.terminal.close(terminal.id);
          }
          set({
            workspace: null,
            fileTree: [],
            fileTrees: {},
            expandedPaths: new Set(),
            selectedFile: null,
            terminals: [],
            activeTerminalId: null,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to close workspace' });
        }
      },

      loadFileTree: async (dirPath?: string) => {
        const projects = get().projects;
        const expandedProjects = get().expandedProjects;
        const expandedPaths = get().expandedPaths;

        // Load folder trees for all expanded projects (and active project folders)
        const folderList: string[] = [];
        const seen = new Set<string>();
        for (const proj of projects) {
          if (proj.id === get().activeProjectId || expandedProjects.has(proj.id)) {
            for (const f of proj.folders || []) {
              const k = normPath(f.path);
              if (k && !seen.has(k)) {
                seen.add(k);
                folderList.push(f.path);
              }
            }
          }
        }

        if (folderList.length === 0) {
          set({ fileTree: [], fileTrees: {}, error: null });
          return;
        }

        const targets = dirPath
          ? folderList.filter(p => normPath(p) === normPath(dirPath))
          : folderList;

        const nextTrees: Record<string, FileSystemNode[]> = { ...get().fileTrees };
        const missingPaths = new Set<string>();
        let firstError: string | null = null;

        await Promise.all(
          (targets.length > 0 ? targets : folderList).map(async folderPath => {
            try {
              const status = await window.exco.fs.exists(folderPath).catch(() => ({ exists: true, isDirectory: true }));
              if (!status?.exists || !status?.isDirectory) {
                missingPaths.add(normPath(folderPath));
                delete nextTrees[folderPath];
                return;
              }
              const tree = await buildHierarchicalTree(folderPath, expandedPaths);
              nextTrees[folderPath] = tree;
            } catch (err) {
              const msg = err instanceof Error ? err.message : 'Failed to load directory';
              if (/enoent|no such file|not found/i.test(msg)) {
                missingPaths.add(normPath(folderPath));
                delete nextTrees[folderPath];
              } else {
                firstError = msg;
              }
            }
          })
        );

        let updatedProjects = projects;
        if (missingPaths.size > 0) {
          updatedProjects = projects.map(p => ({
            ...p,
            folders: (p.folders || []).filter(f => !missingPaths.has(normPath(f.path))),
          }));
          const prunedPaths = getAllProjectFolderPaths(updatedProjects);
          await persistProjectsToDatabase(updatedProjects);
          await syncWatchers(prunedPaths, () => get().loadFileTree());
        }

        const activeProj = updatedProjects.find(p => p.id === get().activeProjectId) || null;
        const primaryFolder = activeProj?.folders?.[0] || null;
        const primaryPath = primaryFolder?.path;
        set({
          ...(missingPaths.size > 0 ? { projects: updatedProjects, workspace: primaryFolder } : {}),
          fileTrees: nextTrees,
          fileTree: primaryPath ? nextTrees[primaryPath] || [] : [],
          error: firstError,
        });
      },

      togglePath: async (dirPath: string) => {
        const { expandedPaths, fileTrees, workspace } = get();
        const nextExpanded = new Set(expandedPaths);
        const willExpand = !nextExpanded.has(dirPath);
        if (willExpand) {
          nextExpanded.add(dirPath);
        } else {
          nextExpanded.delete(dirPath);
        }
        set({ expandedPaths: nextExpanded });

        if (willExpand) {
          try {
            const allRoots = getAllProjectFolderPaths(get().projects);
            const isRootFolder = allRoots.some(r => normPath(r) === normPath(dirPath));
            const children = await buildHierarchicalTree(dirPath, nextExpanded);

            const updatedTrees: Record<string, FileSystemNode[]> = { ...fileTrees };
            if (isRootFolder) {
              updatedTrees[dirPath] = children;
            } else {
              for (const rootPath of Object.keys(updatedTrees)) {
                if (normPath(dirPath).startsWith(normPath(rootPath) + '/')) {
                  updatedTrees[rootPath] = mergeChildrenAtPath(updatedTrees[rootPath] || [], dirPath, children);
                }
              }
            }
            const primaryPath = workspace?.path;
            set({
              fileTrees: updatedTrees,
              fileTree: primaryPath ? updatedTrees[primaryPath] || [] : [],
            });
          } catch (error) {
            console.warn('Failed to expand folder:', error);
          }
        }
      },

      selectFile: (file: FileSystemNode | null) => {
        set({ selectedFile: file });
      },

      createFileInDir: async (dirPath: string, fileName: string) => {
        const clean = fileName.trim();
        if (!clean || clean.includes('..')) {
          throw new Error('Invalid file name');
        }
        const targetPath = joinChildPath(dirPath, clean);
        await window.exco.fs.writeFile({ path: targetPath, content: '', encoding: 'utf8' });

        const nextExpanded = new Set(get().expandedPaths);
        nextExpanded.add(dirPath);
        set({ expandedPaths: nextExpanded });

        await get().loadFileTree();
        const newNode: FileSystemNode = {
          path: targetPath,
          name: clean.split(/[\\/]/).pop() || clean,
          type: 'file',
          size: 0,
          modifiedAt: Date.now(),
          createdAt: Date.now(),
          extension: clean.includes('.') ? clean.split('.').pop() : undefined,
        };
        set({ selectedFile: newNode });
        return newNode;
      },

      createFolderInDir: async (parentDirPath: string, folderName: string) => {
        const clean = folderName.trim();
        if (!clean || clean.includes('..')) {
          throw new Error('Invalid folder name');
        }
        const targetPath = joinChildPath(parentDirPath, clean);
        await window.exco.fs.createDir(targetPath);

        const nextExpanded = new Set(get().expandedPaths);
        nextExpanded.add(parentDirPath);
        nextExpanded.add(targetPath);
        set({ expandedPaths: nextExpanded });

        await get().loadFileTree();
      },

      renameFsEntry: async (oldPath: string, newName: string) => {
        const clean = newName.trim();
        if (!clean || clean.includes('/') || clean.includes('\\') || clean === '.' || clean === '..') {
          throw new Error('Invalid name');
        }
        const parent = getParentDir(oldPath);
        const newPath = joinChildPath(parent, clean);
        if (normPath(oldPath) === normPath(newPath)) return;

        await window.exco.fs.rename({ oldPath, newPath });

        const nextExpanded = new Set<string>();
        const oldNorm = normPath(oldPath);
        for (const p of get().expandedPaths) {
          if (normPath(p) === oldNorm) {
            nextExpanded.add(newPath);
          } else if (normPath(p).startsWith(oldNorm + '/')) {
            nextExpanded.add(newPath + p.slice(oldPath.length));
          } else {
            nextExpanded.add(p);
          }
        }
        set({ expandedPaths: nextExpanded });

        if (get().selectedFile && normPath(get().selectedFile!.path) === oldNorm) {
          set({
            selectedFile: {
              ...get().selectedFile!,
              path: newPath,
              name: clean,
              extension: clean.includes('.') ? clean.split('.').pop() : undefined,
            },
          });
        }

        await get().loadFileTree();
      },

      deleteFsEntry: async (targetPath: string) => {
        if (!targetPath) return;
        const targetNorm = normPath(targetPath);

        // Move file or folder to OS Recycle Bin (removes from disk folder cleanly)
        await window.exco.fs.delete(targetPath);

        const nextExpanded = new Set<string>();
        for (const p of get().expandedPaths) {
          const pNorm = normPath(p);
          if (pNorm !== targetNorm && !pNorm.startsWith(targetNorm + '/')) {
            nextExpanded.add(p);
          }
        }

        const currentSelected = get().selectedFile;
        const selectedNorm = currentSelected ? normPath(currentSelected.path) : '';
        const shouldClearSelected =
          Boolean(selectedNorm) && (selectedNorm === targetNorm || selectedNorm.startsWith(targetNorm + '/'));

        // Also remove from any project root folder list if a top-level folder itself was deleted
        const hadRootMatch = get().projects.some(p =>
          (p.folders || []).some(f => normPath(f.path) === targetNorm)
        );
        let nextProjects = get().projects;
        const nextTrees = { ...get().fileTrees };
        delete nextTrees[targetPath];

        if (hadRootMatch) {
          nextProjects = nextProjects.map(p => ({
            ...p,
            folders: (p.folders || []).filter(f => normPath(f.path) !== targetNorm),
            updatedAt: Date.now(),
          }));
          const activeProj = nextProjects.find(p => p.id === get().activeProjectId) || null;
          const primaryFolder = activeProj?.folders?.[0] || null;
          set({
            projects: nextProjects,
            workspace: primaryFolder,
            fileTrees: nextTrees,
            fileTree: primaryFolder ? nextTrees[primaryFolder.path] || [] : [],
            expandedPaths: nextExpanded,
            ...(shouldClearSelected ? { selectedFile: null } : {}),
          });
          await persistProjectsToDatabase(nextProjects);
          await syncWatchers(getAllProjectFolderPaths(nextProjects), () => get().loadFileTree());
        } else {
          set({
            expandedPaths: nextExpanded,
            ...(shouldClearSelected ? { selectedFile: null } : {}),
          });
        }

        await get().loadFileTree();
      },

      createTerminal: async (cwd?: string) => {
        const { workspace } = get();
        if (!workspace) throw new Error('No active workspace');

        const session = await window.exco.terminal.create({
          workspaceId: workspace.id,
          cwd: cwd || workspace.path,
          cols: 120,
          rows: 30,
        });

        set(state => ({
          terminals: [...state.terminals, session],
          activeTerminalId: session.id,
        }));

        return session;
      },

      closeTerminal: async (terminalId: string) => {
        await window.exco.terminal.close(terminalId);
        set(state => {
          const newTerminals = state.terminals.filter(t => t.id !== terminalId);
          let newActive = state.activeTerminalId;
          if (state.activeTerminalId === terminalId) {
            newActive = newTerminals.length > 0 ? newTerminals[0].id : null;
          }
          return { terminals: newTerminals, activeTerminalId: newActive };
        });
      },

      setActiveTerminal: (terminalId: string | null) => {
        set({ activeTerminalId: terminalId });
      },

      writeToTerminal: (terminalId: string, data: string) => {
        window.exco.terminal.write({ sessionId: terminalId, data });
      },

      resizeTerminal: (terminalId: string, cols: number, rows: number) => {
        window.exco.terminal.resize({ sessionId: terminalId, cols, rows });
      },
    }),
    {
      name: 'exco:workspace',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        workspace: state.workspace ? { ...state.workspace, metadata: {} } : null,
      }),
      version: 3,
    }
  )
);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  return children as React.ReactElement;
};
