import React, { useState, useMemo, useRef } from 'react';
import {
  Wand2,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Trash2,
  Upload,
  Globe,
  FileCode2,
  FolderPlus,
  RotateCcw,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@shared/utils';
import {
  loadPersistedSkillsState,
  savePersistedSkillsState,
  getResolvedSkills,
  getBuiltInSkillCategories,
  parseSkillMarkdown,
  type SkillItem,
  type CustomList,
} from '../stores/skillsStore';
import { CustomListsAccordion, type ListCandidateItem } from './CustomListsBlock';

const SKILL_TEMPLATES = [
  {
    id: 'claude',
    label: 'Claude Skill (.md)',
    desc: 'YAML frontmatter + trigger condition + step-by-step instructions (Anthropic SKILL.md standard)',
    name: 'code-review-architect',
    triggers: 'code review, pull request, architecture, refactor',
    description: 'Use when reviewing code changes, pull requests, or refactoring modules cleanly.',
    content: `---
name: code-review-architect
description: Use when reviewing code changes, pull requests, or refactoring modules cleanly.
license: MIT
---

# Workflow
1. Inspect modified files and summarize intent before judging style.
2. Flag correctness, security, and race-condition bugs with exact file & line citations.
3. Suggest minimal, idiomatic fixes without unnecessary rewrites.`,
  },
  {
    id: 'gemini',
    label: 'Gemini Gem (Persona)',
    desc: 'Persona, task goal, context constraints, and structured output rules (Google Gemini Gem style)',
    name: 'system-design-partner',
    triggers: 'system design, architecture diagram, scale, backend',
    description: 'Acts as a principal distributed systems architect producing trade-off matrices and blueprints.',
    content: `# Role & Persona
You are a pragmatic principal systems architect collaborating directly with the engineer.

# Goal & Guardrails
- Always ask or infer latency, throughput, and budget constraints first.
- Compare at least two viable architectures in a concise trade-off table.
- Prefer boring, maintainable primitives before introducing complex distributed queues.`,
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT GPT (Custom)',
    desc: 'Role behavior, rules, and response format template (OpenAI Custom GPT instructions style)',
    name: 'concise-spec-writer',
    triggers: 'spec, prd, documentation, api contract',
    description: 'Turns rough product ideas into actionable technical specs, schemas, and acceptance checklists.',
    content: `# Instructions
Transform user notes into a crisp implementation spec.

# Output Structure
1. Problem & Non-Goals
2. Data & API Contract (exact types/endpoints)
3. Edge Cases & Verification Plan`,
  },
];

const SKILL_BADGE_PALETTE = [
  'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25',
  'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25',
  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
  'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
  'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/25',
  'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
  'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/25',
  'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25',
];

function getSkillIconBadgeClass(categorySlug: string): string {
  const s = (categorySlug || 'custom').toLowerCase();
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return SKILL_BADGE_PALETTE[hash % SKILL_BADGE_PALETTE.length];
}

interface SkillsSectionProps {
  lists: CustomList[];
  onOpenCreateList: () => void;
  onEditList: (list: CustomList) => void;
  onDeleteList: (listId: string) => void;
  confirmTargetId: string | null;
  requestInlineConfirm: (key: string) => boolean;
  showNotice: (type: 'success' | 'error', text: string) => void;
  onSkillsChanged?: (candidates: ListCandidateItem[]) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  lists,
  onOpenCreateList,
  onEditList,
  onDeleteList,
  confirmTargetId,
  requestInlineConfirm,
  showNotice,
}) => {
  const [skillsState, setSkillsState] = useState(() => loadPersistedSkillsState());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedMdId, setExpandedMdId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [addModalTab, setAddModalTab] = useState<'create' | 'upload' | 'github'>('create');
  const [creatingNewCategory, setCreatingNewCategory] = useState(false);
  const [newCategoryDraft, setNewCategoryDraft] = useState('');
  const [importingRepo, setImportingRepo] = useState(false);
  const mdUploadInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Custom',
    triggers: '',
    description: '',
    content: '',
    githubUrl: '',
  });

  const resetSkillForm = () => {
    setEditingSkillId(null);
    setCreatingNewCategory(false);
    setNewCategoryDraft('');
    setAddModalTab('create');
    setForm({ name: '', category: 'Custom', triggers: '', description: '', content: '', githubUrl: '' });
  };

  const updateSkillsState = (updater: (prev: ReturnType<typeof loadPersistedSkillsState>) => ReturnType<typeof loadPersistedSkillsState>) => {
    setSkillsState(prev => {
      const next = updater(prev);
      savePersistedSkillsState(next);
      return next;
    });
  };

  const resolvedSkills = useMemo(() => getResolvedSkills(skillsState), [skillsState]);
  const activeCount = useMemo(() => resolvedSkills.filter(s => s.enabled).length, [resolvedSkills]);
  const builtInCategories = useMemo(() => getBuiltInSkillCategories(), []);

  const customCategoriesList = useMemo(() => {
    const builtInSet = new Set(builtInCategories);
    const set = new Set<string>(['Custom']);
    for (const c of skillsState.customCategories || []) {
      const clean = c.trim();
      if (clean && !builtInSet.has(clean)) set.add(clean);
    }
    for (const s of skillsState.customSkills || []) {
      const clean = (s.category || '').trim();
      if (clean && !builtInSet.has(clean)) set.add(clean);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [builtInCategories, skillsState.customCategories, skillsState.customSkills]);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of builtInCategories) {
      map.set(c, 0);
    }
    const customCatSet = new Set<string>(
      (skillsState.customCategories || []).map((c: string) => c.trim()).filter(Boolean)
    );
    for (const c of customCatSet) {
      if (!map.has(c)) map.set(c, 0);
    }
    for (const skill of resolvedSkills) {
      map.set(skill.category, (map.get(skill.category) || 0) + 1);
    }
    return Array.from(map.entries())
      .filter(([cat, count]) => count > 0 || customCatSet.has(cat))
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [resolvedSkills, builtInCategories, skillsState.customCategories]);

  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resolvedSkills.filter(s => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.subcategory || '').toLowerCase().includes(q)
      );
    });
  }, [resolvedSkills, searchQuery, categoryFilter]);

  const groupedByCategory = useMemo(() => {
    const map = new Map<string, Array<SkillItem & { enabled: boolean }>>();
    for (const skill of filteredSkills) {
      const bucket = map.get(skill.category) || [];
      bucket.push(skill);
      map.set(skill.category, bucket);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredSkills]);

  const toggleSkillEnabled = (id: string, enabled: boolean) => {
    updateSkillsState(prev => ({
      ...prev,
      disabledIds: enabled
        ? prev.disabledIds.filter(x => x !== id)
        : Array.from(new Set([...prev.disabledIds, id])),
    }));
  };

  const handleDeleteSkill = (id: string, name: string) => {
    if (!requestInlineConfirm(`skill:${id}`)) return;
    updateSkillsState(prev => ({
      ...prev,
      customSkills: prev.customSkills.filter(s => s.id !== id),
      deletedIds: Array.from(new Set([...prev.deletedIds, id])),
      disabledIds: prev.disabledIds.filter(x => x !== id),
    }));
    showNotice('success', `Deleted skill "${name}".`);
  };

  const handleRestoreDefaults = () => {
    updateSkillsState(prev => ({
      ...prev,
      deletedIds: [],
    }));
    showNotice('success', 'Restored all built-in AI Skills.');
  };

  const handleCreateCustomCategory = () => {
    const clean = newCategoryDraft.trim();
    if (!clean) return;
    updateSkillsState(prev => ({
      ...prev,
      customCategories: Array.from(new Set([...(prev.customCategories || []), clean])),
    }));
    setForm(prev => ({ ...prev, category: clean }));
    setNewCategoryDraft('');
    setCreatingNewCategory(false);
    showNotice('success', `Created category "${clean}".`);
  };

  const handleCreateManualSkill = () => {
    const cleanName = form.name.trim();
    if (!cleanName) return;
    const cat = (creatingNewCategory && newCategoryDraft.trim() ? newCategoryDraft.trim() : form.category.trim()) || 'Custom';
    const triggerText = form.triggers.trim();
    const baseDesc = form.description.trim() || `Custom AI Skill: ${cleanName}`;
    const fullDescription = triggerText && !baseDesc.toLowerCase().includes(triggerText.toLowerCase())
      ? `${baseDesc} (Triggers: ${triggerText})`
      : baseDesc;
    const builtInSet = new Set(builtInCategories);

    if (editingSkillId) {
      updateSkillsState(prev => ({
        ...prev,
        customCategories:
          cat !== 'Custom' && !builtInSet.has(cat)
            ? Array.from(new Set([...(prev.customCategories || []), cat]))
            : prev.customCategories || [],
        customSkills: prev.customSkills.map(s =>
          s.id === editingSkillId
            ? {
                ...s,
                name: cleanName,
                category: cat,
                categorySlug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: fullDescription,
                content: form.content.trim() || `# ${cleanName}\n\n${fullDescription}`,
              }
            : s
        ),
      }));
      resetSkillForm();
      setShowAddModal(false);
      showNotice('success', `Updated AI Skill "${cleanName}".`);
      return;
    }

    const newSkill: SkillItem = {
      id: `custom:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      category: cat,
      categorySlug: cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: fullDescription,
      license: 'Custom',
      content: form.content.trim() || `# ${cleanName}\n\n${fullDescription}`,
      builtIn: false,
    };
    updateSkillsState(prev => ({
      ...prev,
      customCategories:
        cat !== 'Custom' && !builtInSet.has(cat)
          ? Array.from(new Set([...(prev.customCategories || []), cat]))
          : prev.customCategories || [],
      customSkills: [newSkill, ...prev.customSkills],
    }));
    resetSkillForm();
    setShowAddModal(false);
    showNotice('success', `Added AI Skill "${cleanName}" in "${cat}".`);
  };

  const openEditSkillModal = (skill: SkillItem) => {
    setEditingSkillId(skill.id);
    setCreatingNewCategory(false);
    setNewCategoryDraft('');
    setAddModalTab('create');
    setForm({
      name: skill.name,
      category: skill.category || 'Custom',
      triggers: '',
      description: skill.description || '',
      content: skill.content || '',
      githubUrl: '',
    });
    setShowAddModal(true);
  };

  const handleMdFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const added: SkillItem[] = [];
    for (const file of Array.from(fileList)) {
      const raw = await file.text().catch(() => '');
      if (!raw.trim()) continue;
      const fallback = file.name.replace(/\.(md|markdown|txt)$/i, '');
      const parsed = parseSkillMarkdown(raw, fallback, form.category.trim() || 'Imported');
      added.push({
        id: `upload:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: parsed.name,
        category: parsed.category,
        categorySlug: parsed.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: parsed.description,
        license: parsed.license,
        content: parsed.content,
        builtIn: false,
      });
    }
    if (added.length === 0) {
      showNotice('error', 'No valid Markdown skill content found in selected files.');
      return;
    }
    updateSkillsState(prev => ({
      ...prev,
      customSkills: [...added, ...prev.customSkills],
    }));
    setShowAddModal(false);
    showNotice('success', `Imported ${added.length} skill${added.length > 1 ? 's' : ''} from Markdown.`);
  };

  const handleImportGithubRepo = async () => {
    const rawUrl = form.githubUrl.trim();
    const match = rawUrl.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
    if (!match) {
      showNotice('error', 'Enter a valid GitHub repository URL (e.g. https://github.com/owner/repo).');
      return;
    }
    const owner = match[1];
    const repo = match[2].replace(/\.git$/i, '');
    setImportingRepo(true);
    try {
      let treeData: any = null;
      let branchUsed = 'main';
      for (const branch of ['HEAD', 'main', 'master']) {
        const resp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
        if (resp.ok) {
          treeData = await resp.json();
          branchUsed = branch === 'HEAD' ? 'main' : branch;
          break;
        }
      }
      if (!treeData?.tree || !Array.isArray(treeData.tree)) {
        throw new Error('Could not read repository file tree from GitHub.');
      }

      const mdPaths: string[] = treeData.tree
        .filter((node: any) => node.type === 'blob' && /(^|\/)SKILL\.md$/i.test(node.path))
        .map((node: any) => node.path);

      if (mdPaths.length === 0) {
        throw new Error('No SKILL.md files found inside that repository.');
      }

      const fetched: SkillItem[] = [];
      const batchSize = 20;
      const targets = mdPaths.slice(0, 200);
      for (let i = 0; i < targets.length; i += batchSize) {
        const chunk = targets.slice(i, i + batchSize);
        const results = await Promise.all(
          chunk.map(async (relPath) => {
            const rawResp = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branchUsed}/${relPath}`);
            if (!rawResp.ok) return null;
            const rawText = await rawResp.text();
            const parts = relPath.split('/');
            const fallbackName = parts.length >= 2 ? parts[parts.length - 2] : repo;
            const cat = parts.length >= 3 && parts[0].toLowerCase() === 'skills' ? parts[1] : `GitHub: ${repo}`;
            const parsed = parseSkillMarkdown(rawText, fallbackName, cat);
            return {
              id: `gh:${owner}/${repo}/${relPath}`,
              name: parsed.name,
              category: parsed.category,
              categorySlug: parsed.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: parsed.description,
              license: parsed.license,
              content: parsed.content,
              sourceRepo: `${owner}/${repo}`,
              builtIn: false,
            } as SkillItem;
          })
        );
        results.forEach(item => {
          if (item) fetched.push(item);
        });
      }

      if (fetched.length === 0) {
        throw new Error('Failed to download SKILL.md contents from GitHub.');
      }

      updateSkillsState(prev => {
        const existingIds = new Set(prev.customSkills.map(s => s.id));
        const deletedSet = new Set(prev.deletedIds);
        const mergedNew = fetched.filter(f => !existingIds.has(f.id));
        return {
          ...prev,
          customSkills: [...mergedNew, ...prev.customSkills],
          deletedIds: prev.deletedIds.filter(id => !deletedSet.has(id) || !fetched.some(f => f.id === id)),
        };
      });

      setForm(f => ({ ...f, githubUrl: '' }));
      setShowAddModal(false);
      showNotice('success', `Imported ${fetched.length} skills from ${owner}/${repo}.`);
    } catch (err: any) {
      showNotice('error', err?.message || 'GitHub import failed.');
    } finally {
      setImportingRepo(false);
    }
  };

  const renderSkillCard = (skill: SkillItem & { enabled: boolean }) => {
    const isExpanded = expandedMdId === skill.id;
    return (
      <div
        key={skill.id}
        className="p-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] space-y-2"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border', getSkillIconBadgeClass(skill.categorySlug))}>
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-medium text-sm text-[rgb(var(--color-foreground))] truncate">{skill.name}</p>
                {skill.subcategory && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-500/15 text-sky-500 dark:text-sky-400">
                    {skill.subcategory}
                  </span>
                )}
                {!skill.builtIn && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-500 dark:text-emerald-400">
                    {skill.sourceRepo ? skill.sourceRepo : 'Custom'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[rgb(var(--color-foreground-muted))] line-clamp-2 mt-0.5">
                {skill.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {!skill.builtIn && (
              <button
                type="button"
                onClick={() => openEditSkillModal(skill)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[rgb(var(--color-border))] text-[11px] font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
                title="Edit custom AI Skill"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpandedMdId(isExpanded ? null : skill.id)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[rgb(var(--color-border))] text-[11px] font-medium text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
              title="Inspect SKILL.md instructions"
            >
              <FileCode2 className="w-3 h-3" />
              <span>{isExpanded ? 'Hide .md' : 'View .md'}</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0" title={skill.enabled ? 'Enabled for agents' : 'Disabled'}>
              <input
                type="checkbox"
                checked={skill.enabled}
                onChange={e => toggleSkillEnabled(skill.id, e.target.checked)}
                className="sr-only peer"
              />
              <div className={cn(
                'w-10 h-5 bg-slate-300 dark:bg-zinc-800 border border-slate-400/60 dark:border-zinc-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:shadow-sm after:transition-all',
                'peer-checked:bg-emerald-500 peer-checked:border-emerald-400'
              )} />
            </label>

            <button
              type="button"
              onClick={() => handleDeleteSkill(skill.id, skill.name)}
              className={cn(
                'inline-flex items-center justify-center rounded transition-colors whitespace-nowrap flex-shrink-0',
                confirmTargetId === `skill:${skill.id}`
                  ? 'bg-red-500 text-white px-2 py-1 text-xs font-medium'
                  : 'p-1.5 text-[rgb(var(--color-error))] hover:bg-[rgb(var(--color-error))]/10'
              )}
              title={confirmTargetId === `skill:${skill.id}` ? 'Click again to delete skill' : 'Delete skill'}
            >
              {confirmTargetId === `skill:${skill.id}` ? 'Confirm' : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <pre className="p-3 rounded-lg bg-[rgb(var(--color-code-bg))] border border-[rgb(var(--color-border))] text-[11px] font-mono text-[rgb(var(--color-foreground))] overflow-x-auto max-h-60 whitespace-pre-wrap">
            {skill.content}
          </pre>
        )}
      </div>
    );
  };

  const skillCardMap = useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    for (const s of resolvedSkills) {
      map.set(s.id, renderSkillCard(s));
    }
    return map;
  }, [resolvedSkills, expandedMdId, confirmTargetId]);

  const showFlatSearch = Boolean(searchQuery.trim());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[rgb(var(--color-foreground))]">AI Skills Library</h3>
            <span className="badge badge-success text-xs whitespace-nowrap">{activeCount} Active</span>
          </div>
          <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
            Built-in from Bishnucd/free-ai-skills + custom SKILL.md workflows — toggle or delete any skill anytime.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {skillsState.deletedIds.length > 0 && (
            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
              title="Restore deleted built-in skills"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore ({skillsState.deletedIds.length})</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenCreateList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-surface-hover))]"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Create List</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetSkillForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Search + Category Dropdown */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-foreground-muted))]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, topic, or capability..."
            className="w-full pl-8 pr-3 py-1.5 text-xs"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]"
        >
          <option value="all">All Categories ({resolvedSkills.length})</option>
          {categories.map(([cat, count]) => (
            <option key={cat} value={cat}>
              {cat} ({count})
            </option>
          ))}
        </select>
      </div>

      {/* User Custom Skill Lists */}
      <CustomListsAccordion
        lists={lists}
        itemsById={skillCardMap}
        onEditList={onEditList}
        onDeleteList={onDeleteList}
      />

      {/* Skills by Category Accordion OR Search Results */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-8 text-[rgb(var(--color-foreground-muted))]">
          <Wand2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No matching AI skills</p>
        </div>
      ) : showFlatSearch ? (
        <div className="space-y-2">
          <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
            Showing {Math.min(80, filteredSkills.length)} of {filteredSkills.length} matching skills
          </p>
          {filteredSkills.slice(0, 80).map(renderSkillCard)}
        </div>
      ) : (
        <div className="space-y-2">
          {groupedByCategory.map(([catName, catSkills]) => {
            const isOpen = categoryFilter !== 'all' || Boolean(expandedCategories[catName]);
            return (
              <div
                key={catName}
                className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCategories(prev => ({ ...prev, [catName]: !prev[catName] }))}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-[rgb(var(--color-surface-hover))] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-[rgb(var(--color-foreground-muted))] flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[rgb(var(--color-foreground-muted))] flex-shrink-0" />
                    )}
                    <span className="text-sm font-semibold text-[rgb(var(--color-foreground))] truncate">{catName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[rgb(var(--color-surface-hover))] text-[rgb(var(--color-foreground-muted))]">
                    {catSkills.length}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-2.5 space-y-2 border-t border-[rgb(var(--color-border))]">
                    {catSkills.map(renderSkillCard)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Upload / Import GitHub Skill Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); resetSkillForm(); }}>
          <div
            className="modal-content p-6 w-full max-w-xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
                  {editingSkillId ? 'Edit AI Skill' : 'Add AI Skill'}
                </h3>
                <p className="text-xs text-[rgb(var(--color-foreground-muted))]">
                  Supports Claude SKILL.md workflows, Gemini Gem personas, and ChatGPT custom instructions
                </p>
              </div>
              {!editingSkillId && (
                <div className="flex items-center gap-1 rounded-lg bg-[rgb(var(--color-surface-hover))] p-1 border border-[rgb(var(--color-border))]">
                  {[
                    { id: 'create' as const, label: 'Create' },
                    { id: 'upload' as const, label: 'Upload .md' },
                    { id: 'github' as const, label: 'GitHub Repo' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAddModalTab(tab.id)}
                      className={cn(
                        'px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                        addModalTab === tab.id
                          ? 'bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]'
                          : 'text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Shared Category Selector Dropdown + Create Custom Category */}
              {addModalTab !== 'github' && (
                <div className="p-3 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]/25 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="exco-skill-category-select" className="block text-xs font-semibold text-[rgb(var(--color-foreground))]">
                      Category ({builtInCategories.length} pre-built + custom)
                    </label>
                    <button
                      type="button"
                      onClick={() => setCreatingNewCategory(prev => !prev)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[rgb(var(--color-accent-ink))] hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{creatingNewCategory ? 'Choose existing' : 'New Custom Category'}</span>
                    </button>
                  </div>

                  <select
                    id="exco-skill-category-select"
                    value={creatingNewCategory ? '__create_new__' : form.category}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '__create_new__') {
                        setCreatingNewCategory(true);
                      } else {
                        setCreatingNewCategory(false);
                        setForm(prev => ({ ...prev, category: val }));
                      }
                    }}
                    className="w-full text-xs px-2.5 py-2 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                  >
                    <optgroup label="Custom Categories">
                      {customCategoriesList.map(c => (
                        <option key={`custom:${c}`} value={c}>{c}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Pre-Built Categories">
                      {builtInCategories.map(c => (
                        <option key={`builtin:${c}`} value={c}>{c}</option>
                      ))}
                    </optgroup>
                    <option value="__create_new__">+ Create New Category...</option>
                  </select>

                  {creatingNewCategory && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newCategoryDraft}
                        onChange={e => setNewCategoryDraft(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateCustomCategory();
                          }
                        }}
                        placeholder="Enter new custom category name (e.g. DevOps Pipelines)"
                        autoFocus
                        className="flex-1 text-xs"
                      />
                      <button
                        type="button"
                        disabled={!newCategoryDraft.trim()}
                        onClick={handleCreateCustomCategory}
                        className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs font-medium hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 whitespace-nowrap"
                      >
                        Create Category
                      </button>
                    </div>
                  )}
                </div>
              )}

              {addModalTab === 'upload' && !editingSkillId && (
                <div className="p-4 rounded-lg border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]/40 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[rgb(var(--color-foreground))]">Upload Markdown / SKILL.md Files</p>
                    <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
                      Reads YAML frontmatter (`name`, `category`, `description`) or assigns selected category above.
                    </p>
                  </div>
                  <input
                    ref={mdUploadInputRef}
                    type="file"
                    multiple
                    accept=".md,.markdown,.txt"
                    className="hidden"
                    onChange={async e => {
                      await handleMdFileUpload(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => mdUploadInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs font-medium hover:bg-[rgb(var(--color-primary-hover))] flex-shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose .md</span>
                  </button>
                </div>
              )}

              {addModalTab === 'github' && !editingSkillId && (
                <div className="p-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface-hover))]/30 space-y-2.5">
                  <label className="text-xs font-semibold text-[rgb(var(--color-foreground))] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Extract SKILL.md from GitHub Repository</span>
                  </label>
                  <p className="text-[11px] text-[rgb(var(--color-foreground-muted))]">
                    Discovers every SKILL.md inside any public GitHub repo (e.g. Anthropics Skills, Awesome Claude Skills, or your own repo).
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.githubUrl}
                      onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                      placeholder="https://github.com/owner/skills-repo"
                      className="flex-1 text-xs font-mono"
                    />
                    <button
                      type="button"
                      disabled={importingRepo || !form.githubUrl.trim()}
                      onClick={handleImportGithubRepo}
                      className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] text-xs font-medium hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50 whitespace-nowrap"
                    >
                      {importingRepo ? 'Extracting...' : 'Import Repo'}
                    </button>
                  </div>
                </div>
              )}

              {(addModalTab === 'create' || editingSkillId) && (
                <div className="space-y-3">
                  {!editingSkillId && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--color-foreground-muted))] mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Quick Starter Templates</span>
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {SKILL_TEMPLATES.map(tpl => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() =>
                              setForm(prev => ({
                                ...prev,
                                name: prev.name || tpl.name,
                                triggers: prev.triggers || tpl.triggers,
                                description: tpl.description,
                                content: tpl.content,
                              }))
                            }
                            title={tpl.desc}
                            className="px-2.5 py-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] hover:bg-[rgb(var(--color-surface-hover))] text-left transition-colors"
                          >
                            <div className="text-[11px] font-semibold text-[rgb(var(--color-foreground))] truncate">{tpl.label}</div>
                            <div className="text-[10px] text-[rgb(var(--color-foreground-muted))] truncate">{tpl.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Skill Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. rust-async-debugger"
                        className="w-full text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Activation Triggers (optional)</label>
                      <input
                        type="text"
                        value={form.triggers}
                        onChange={e => setForm({ ...form, triggers: e.target.value })}
                        placeholder="e.g. rust, tokio, deadlock, async"
                        className="w-full text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">When to Use / Short Description</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="When AI models should activate and apply this skill"
                      className="w-full text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Skill Instructions (Markdown / SKILL.md)</label>
                    <textarea
                      rows={6}
                      value={form.content}
                      onChange={e => {
                        const raw = e.target.value;
                        if (!form.name && raw.startsWith('---\n')) {
                          const parsed = parseSkillMarkdown(raw, '', form.category);
                          setForm(prev => ({
                            ...prev,
                            content: raw,
                            name: parsed.name || prev.name,
                            description: parsed.description || prev.description,
                          }));
                        } else {
                          setForm(prev => ({ ...prev, content: raw }));
                        }
                      }}
                      placeholder="# Role & Workflow&#10;1. Step one...&#10;&#10;(Tip: You can also paste a full Claude SKILL.md with YAML frontmatter.)"
                      className="w-full font-mono text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  resetSkillForm();
                }}
                className="px-4 py-2 text-sm text-[rgb(var(--color-foreground-muted))] hover:text-[rgb(var(--color-foreground))]"
              >
                Cancel
              </button>
              {(addModalTab === 'create' || editingSkillId) && (
                <button
                  type="button"
                  disabled={!form.name.trim()}
                  onClick={handleCreateManualSkill}
                  className="px-4 py-2 text-sm bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] disabled:opacity-50"
                >
                  {editingSkillId ? 'Save Changes' : 'Save Skill'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
