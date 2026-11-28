import builtInSkillsRaw from '../data/builtInSkills.json';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  description: string;
  license?: string;
  content: string;
  builtIn?: boolean;
  sourceRepo?: string;
}

export type CustomListScope = 'api-keys' | 'plugins' | 'skills';

export interface CustomList {
  id: string;
  scope: CustomListScope;
  name: string;
  itemIds: string[];
  createdAt: number;
}

interface PersistedSkillsState {
  customSkills: SkillItem[];
  deletedIds: string[];
  disabledIds: string[];
  customCategories: string[];
}

const SKILLS_STORAGE_KEY = 'exco:skills:state:v1';
const CUSTOM_LISTS_STORAGE_KEY = 'exco:custom-lists:v1';

const BUILT_IN_SKILLS: SkillItem[] = Array.isArray(builtInSkillsRaw)
  ? (builtInSkillsRaw as SkillItem[])
  : [];

export function getBuiltInSkillCategories(): string[] {
  const set = new Set<string>();
  for (const s of BUILT_IN_SKILLS) {
    if (s.category && s.category.trim()) {
      set.add(s.category.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function parseSkillMarkdown(rawMarkdown: string, fallbackName = 'custom-skill', fallbackCategory = 'Custom'): {
  name: string;
  description: string;
  license: string;
  category: string;
  content: string;
} {
  const raw = (rawMarkdown || '').trim();
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  let body = raw;

  if (fmMatch) {
    body = fmMatch[2].trim();
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (kv) {
        meta[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, '').trim();
      }
    }
  }

  let headingTitle = '';
  if (!meta.name) {
    const h1 = body.match(/^#\s+(.+)$/m);
    if (h1) headingTitle = h1[1].trim();
  }

  let inferredDesc = meta.description || '';
  if (!inferredDesc) {
    const lines = body
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#') && !l.startsWith('```'));
    if (lines[0]) inferredDesc = lines[0].slice(0, 220);
  }

  return {
    name: meta.name || headingTitle || fallbackName,
    description: inferredDesc || 'Custom Markdown AI Skill instructions',
    license: meta.license || 'MIT',
    category: meta.category || fallbackCategory,
    content: body || raw,
  };
}

export function loadPersistedSkillsState(): PersistedSkillsState {
  try {
    const raw = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        customSkills: Array.isArray(parsed.customSkills) ? parsed.customSkills : [],
        deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
        disabledIds: Array.isArray(parsed.disabledIds) ? parsed.disabledIds : [],
        customCategories: Array.isArray(parsed.customCategories) ? parsed.customCategories : [],
      };
    }
  } catch {}
  return { customSkills: [], deletedIds: [], disabledIds: [], customCategories: [] };
}

export function syncSkillsToMain(state?: PersistedSkillsState): void {
  const s = state || loadPersistedSkillsState();
  try {
    (window as any).exco?.skills?.syncState?.({
      customSkills: s.customSkills,
      deletedIds: s.deletedIds,
      disabledIds: s.disabledIds,
    });
  } catch {}
}

export function savePersistedSkillsState(state: PersistedSkillsState): void {
  try {
    localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(state));
  } catch {}
  syncSkillsToMain(state);
}

export function getResolvedSkills(state: PersistedSkillsState): Array<SkillItem & { enabled: boolean }> {
  const deletedSet = new Set(state.deletedIds);
  const disabledSet = new Set(state.disabledIds);
  const combined = [...state.customSkills, ...BUILT_IN_SKILLS];
  return combined
    .filter(skill => !deletedSet.has(skill.id))
    .map(skill => ({
      ...skill,
      enabled: !disabledSet.has(skill.id),
    }));
}

export function loadCustomLists(): Record<CustomListScope, CustomList[]> {
  try {
    const raw = localStorage.getItem(CUSTOM_LISTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        'api-keys': Array.isArray(parsed['api-keys']) ? parsed['api-keys'] : [],
        plugins: Array.isArray(parsed.plugins) ? parsed.plugins : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      };
    }
  } catch {}
  return { 'api-keys': [], plugins: [], skills: [] };
}

export function saveCustomLists(lists: Record<CustomListScope, CustomList[]>): void {
  try {
    localStorage.setItem(CUSTOM_LISTS_STORAGE_KEY, JSON.stringify(lists));
  } catch {}
}

/**
 * Selects up to `maxSkills` active skills matching the user's prompt so EXCO AI
 * leverages relevant domain SKILL.md workflows without overflowing context tokens.
 */
export function buildActiveSkillContext(userPrompt: string, maxSkills = 3): string | undefined {
  const trimmed = (userPrompt || '').trim().toLowerCase();
  if (!trimmed || trimmed.length < 3) return undefined;

  const state = loadPersistedSkillsState();
  const activeSkills = getResolvedSkills(state).filter(s => s.enabled);
  if (activeSkills.length === 0) return undefined;

  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'into', 'what', 'how', 'can', 'you', 'are', 'was', 'were', 'who', 'why', 'when', 'where', 'hear', 'talk', 'tell', 'say', 'yes', 'hey', 'please', 'help', 'make', 'create', 'build', 'code', 'file', 'files', 'using', 'used']);
  const tokens = Array.from(
    new Set(
      trimmed
        .split(/[^a-z0-9+.#-]+/)
        .filter(w => w.length >= 3 && !stopWords.has(w))
    )
  );
  if (tokens.length === 0) return undefined;

  const scored: Array<{ skill: SkillItem; score: number }> = [];
  for (const skill of activeSkills) {
    const nameL = skill.name.toLowerCase();
    const descL = skill.description.toLowerCase();
    const catL = `${skill.category} ${skill.subcategory || ''}`.toLowerCase();
    let score = 0;

    for (const tok of tokens) {
      const wordRe = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordRe.test(nameL)) score += 6;
      if (wordRe.test(catL)) score += 3;
      if (wordRe.test(descL)) score += 2;
    }

    if (score >= 4) {
      if (!skill.builtIn) score += 2; // Slightly prioritize user-added custom skills on ties
      scored.push({ skill, score });
    }
  }

  if (scored.length === 0) return undefined;
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, maxSkills);

  return picked
    .map(({ skill }) => {
      const snippet = skill.content.slice(0, 1400).trim();
      return `### Active AI Skill: ${skill.name} (${skill.category})\n${skill.description}\n\n${snippet}`;
    })
    .join('\n\n---\n\n');
}
