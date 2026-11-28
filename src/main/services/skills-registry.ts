import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

export interface RegistrySkillItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  content: string;
  builtIn: boolean;
  sourceRepo?: string;
}

interface SkillOverrides {
  customSkills: RegistrySkillItem[];
  deletedIds: string[];
  disabledIds: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'agent-technologies': 'Agent Technologies',
  'api-development': 'API Development',
  'app-development': 'App Development',
  'automation-workflows': 'Automation & Workflows',
  'business-productivity': 'Business Productivity',
  'cloud-devops': 'Cloud & DevOps',
  'communication-integrations': 'Communication Integrations',
  'cybersecurity': 'Cybersecurity',
  'data-analytics': 'Data Analytics',
  'data-engineering': 'Data Engineering',
  'database-technologies': 'Database Technologies',
  'ml-ai': 'ML & AI',
  'multimedia-and-creative': 'Multimedia & Creative',
  'product-management': 'Product Management',
  'qa-testing': 'QA & Testing',
  'search-research': 'Search & Research',
  'software-engineering': 'Software Engineering',
  'technical-writing': 'Technical Writing',
  'ui-ux-design': 'UI/UX Design',
  'website-development': 'Website Development',
};

let cachedBuiltInSkills: RegistrySkillItem[] | null = null;
let cachedOverrides: SkillOverrides | null = null;

function resolveSkillsDir(): string | null {
  const candidates = [
    path.resolve(__dirname, '../../../skills'),
    path.resolve(__dirname, '../../skills'),
    path.join(process.resourcesPath || '', 'skills'),
    path.join(process.cwd(), 'skills'),
  ];
  return candidates.find(dir => dir && fs.existsSync(dir)) || null;
}

function getOverridesPath(): string {
  try {
    return path.join(app.getPath('userData'), 'exco-skills-overrides.json');
  } catch {
    return path.join(process.cwd(), 'exco-skills-overrides.json');
  }
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw.trim() };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kv) {
      meta[kv[1].toLowerCase()] = kv[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return { meta, body: match[2].trim() };
}

function loadBuiltInSkills(): RegistrySkillItem[] {
  if (cachedBuiltInSkills) return cachedBuiltInSkills;

  const skillsDir = resolveSkillsDir();
  if (!skillsDir) {
    cachedBuiltInSkills = [];
    return cachedBuiltInSkills;
  }

  const found: RegistrySkillItem[] = [];
  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name.toLowerCase() === 'skill.md') {
        const rel = path.relative(skillsDir, full).replace(/\\/g, '/');
        const parts = rel.split('/');
        const categorySlug = parts[0] || 'general';
        const subcategory = parts.length >= 3 ? parts[1] : '';
        const slugName = parts.length >= 2 ? parts[parts.length - 2] : path.basename(full, '.md');
        const raw = fs.readFileSync(full, 'utf8');
        const { meta, body } = parseFrontmatter(raw);
        found.push({
          id: rel.replace(/\/SKILL\.md$/i, ''),
          name: meta.name || slugName,
          categorySlug,
          category: CATEGORY_LABELS[categorySlug] || categorySlug,
          subcategory,
          description: meta.description || '',
          content: body || raw,
          builtIn: true,
        });
      }
    }
  };

  try {
    walk(skillsDir);
  } catch (err) {
    console.warn('[SkillsRegistry] Failed to load skills directory:', err);
  }

  cachedBuiltInSkills = found;
  return found;
}

function loadOverrides(): SkillOverrides {
  if (cachedOverrides) return cachedOverrides;
  try {
    const file = getOverridesPath();
    if (fs.existsSync(file)) {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      cachedOverrides = {
        customSkills: Array.isArray(parsed.customSkills) ? parsed.customSkills : [],
        deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
        disabledIds: Array.isArray(parsed.disabledIds) ? parsed.disabledIds : [],
      };
      return cachedOverrides;
    }
  } catch {}
  cachedOverrides = { customSkills: [], deletedIds: [], disabledIds: [] };
  return cachedOverrides;
}

export function syncSkillOverrides(overrides: Partial<SkillOverrides>): { totalActive: number } {
  const next: SkillOverrides = {
    customSkills: Array.isArray(overrides.customSkills) ? overrides.customSkills : [],
    deletedIds: Array.isArray(overrides.deletedIds) ? overrides.deletedIds : [],
    disabledIds: Array.isArray(overrides.disabledIds) ? overrides.disabledIds : [],
  };
  cachedOverrides = next;
  try {
    const file = getOverridesPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(next), 'utf8');
  } catch {}
  return { totalActive: getActiveSkills().length };
}

export function getActiveSkills(): RegistrySkillItem[] {
  const builtIns = loadBuiltInSkills();
  const overrides = loadOverrides();
  const deleted = new Set(overrides.deletedIds);
  const disabled = new Set(overrides.disabledIds);
  return [...overrides.customSkills, ...builtIns].filter(s => !deleted.has(s.id) && !disabled.has(s.id));
}

export function searchActiveSkills(query: string, category?: string, limit = 12): RegistrySkillItem[] {
  const skills = getActiveSkills();
  const q = (query || '').trim().toLowerCase();
  const catFilter = (category || '').trim().toLowerCase();

  const pool = catFilter
    ? skills.filter(s => s.category.toLowerCase().includes(catFilter) || s.categorySlug.toLowerCase().includes(catFilter))
    : skills;

  if (!q) return pool.slice(0, limit);

  const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'into', 'what', 'how', 'can', 'you', 'are', 'was', 'were', 'who', 'why', 'when', 'where', 'hear', 'talk', 'tell', 'say', 'yes', 'hey', 'please', 'help', 'make', 'create', 'build']);
  const tokens = q
    .split(/[^a-z0-9+.#-]+/)
    .filter(tok => tok.length >= 3 && !stopWords.has(tok));
  const scored: Array<{ skill: RegistrySkillItem; score: number }> = [];

  for (const s of pool) {
    const nameL = s.name.toLowerCase();
    const descL = s.description.toLowerCase();
    const catL = `${s.category} ${s.subcategory}`.toLowerCase();
    let score = 0;
    if (nameL === q) score += 20;
    else if (q.length >= 4 && nameL.includes(q)) score += 10;
    for (const tok of tokens) {
      const wordRe = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordRe.test(nameL)) score += 6;
      if (wordRe.test(catL)) score += 3;
      if (wordRe.test(descL)) score += 2;
    }
    if (score >= 4) scored.push({ skill: s, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.skill);
}

export function loadActiveSkill(idOrName: string): RegistrySkillItem | null {
  const needle = (idOrName || '').trim().toLowerCase();
  if (!needle) return null;
  const active = getActiveSkills();
  return (
    active.find(s => s.id.toLowerCase() === needle) ||
    active.find(s => s.name.toLowerCase() === needle) ||
    active.find(s => s.id.toLowerCase().endsWith(`/${needle}`) || s.name.toLowerCase().includes(needle)) ||
    null
  );
}

export function buildUniversalSkillsPrompt(userQuery: string, rendererSkillContext?: string): string | undefined {
  const active = getActiveSkills();
  if (active.length === 0 && !rendererSkillContext) return undefined;

  const categories = Array.from(new Set(active.map(s => s.category))).sort();
  const matched = searchActiveSkills(userQuery, undefined, 3);

  const lines: string[] = [
    `[EXCO AI Skills System — ${active.length} active SKILL.md workflows enabled across ${categories.length} categories: ${categories.join(', ')}]`,
    'Use the applicable AI Skill instructions below whenever relevant to structure accurate, production-grade answers.',
  ];

  if (matched.length > 0) {
    lines.push('\nRelevant Active AI Skills Matched for This Task:');
    for (const s of matched) {
      const snippet = s.content.slice(0, 1500).trim();
      lines.push(`\n### Skill: ${s.name} (${s.category})\nID: ${s.id}\nSummary: ${s.description}\n${snippet}`);
    }
  } else if (rendererSkillContext) {
    lines.push(`\n${rendererSkillContext}`);
  } else {
    // Also surface custom user skills if only a few exist so user-added skills always apply
    const customOnly = active.filter(s => !s.builtIn).slice(0, 3);
    for (const s of customOnly) {
      lines.push(`\n### Custom Skill: ${s.name} (${s.category})\nSummary: ${s.description}\n${s.content.slice(0, 1000).trim()}`);
    }
  }

  return lines.join('\n');
}
