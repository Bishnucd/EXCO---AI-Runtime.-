import * as fsSync from 'fs';
import * as path from 'path';

/**
 * Root-anchored files that tools, package managers, or runtimes strictly expect at project root.
 */
const ROOT_ANCHOR_FILES = new Set([
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'bun.lockb',
  '.gitignore',
  '.gitattributes',
  '.npmrc',
  '.nvmrc',
  '.node-version',
  '.python-version',
  'tsconfig.json',
  'jsconfig.json',
  'index.html',
  'readme.md',
  'changelog.md',
  'contributing.md',
  'license',
  'license.md',
  'skill.md',
  'cargo.toml',
  'cargo.lock',
  'pyproject.toml',
  'requirements.txt',
  'poetry.lock',
  'go.mod',
  'go.sum',
  'gemfile',
  'composer.json',
  'makefile',
  'favicon.ico',
  'robots.txt',
  '.env',
  '.env.local',
  '.env.example',
]);

const CONFIG_BASENAME_PATTERNS: RegExp[] = [
  /\.config\.(js|cjs|mjs|ts|mts|cts|json|yaml|yml)$/i,
  /^tsconfig\..+\.json$/i,
  /^jsconfig\..+\.json$/i,
  /^\.(eslintrc|prettierrc|stylelintrc|babelrc|swcrc|lintstagedrc|commitlintrc)(\.(js|cjs|mjs|json|yaml|yml))?$/i,
  /^(eslint|prettier|stylelint|tailwind|postcss|vitest|vite|jest|playwright|cypress|webpack|rollup|tsup|esbuild|babel|drizzle|prisma|commitlint|lint-staged|nodemon)\b.*\.(js|cjs|mjs|ts|json|yaml|yml)$/i,
  /^(config|configuration|settings|appsettings|theme\.config)\.(json|yaml|yml|toml|ini|ts|js)$/i,
  /^.*[-_.](config|settings)\.(json|yaml|yml|toml|ini)$/i,
  /^docker-compose(\..+)?\.(ya?ml)$/i,
  /^\.editorconfig$/i,
];

const DATA_EXTENSIONS = new Set(['.csv', '.tsv', '.parquet', '.sql', '.ndjson', '.jsonl']);

const ASSET_DOWNLOAD_EXTENSIONS = new Set([
  '.pdf',
  '.zip',
  '.tar',
  '.gz',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.bmp',
  '.ico',
  '.mp3',
  '.wav',
  '.ogg',
  '.m4a',
  '.mp4',
  '.webm',
  '.docx',
  '.xlsx',
  '.pptx',
]);

const JSON_FORMATTED_EXTENSIONS = new Set(['.json', '.prettierrc', '.eslintrc', '.stylelintrc', '.babelrc']);

const CLEAN_TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.less',
  '.html',
  '.htm',
  '.xml',
  '.svg',
  '.yml',
  '.yaml',
  '.toml',
  '.ini',
  '.env',
  '.py',
  '.sh',
  '.ps1',
  '.sql',
  '.md',
  '.txt',
]);

export const WORKSPACE_ORGANIZATION_PROMPT = [
  'CLEAN WORKSPACE & FOLDER TREE ARCHITECTURE RULES (APPLIES TO ALL MODELS & WORKFLOWS):',
  '- Maintain one neat, structured folder tree inside the workspace. Never dump loose configs, scripts, docs, or downloads randomly across root.',
  '- Keep project root strictly minimal: only root-required entrypoints such as package.json, tsconfig.json, index.html, .gitignore, README.md, and .env.',
  '- Store all tool/secondary config files (vite/vitest/playwright/tailwind/postcss/eslint/prettier/jest/tsconfig.* configs, app settings, docker-compose, etc.) inside ONE dedicated "config/" folder (e.g. "config/vite.config.ts", "config/tsconfig.app.json", "config/eslint.config.js") and wire scripts or tsconfig "extends" cleanly to "./config/...".',
  '- Organize generated and downloaded files into clean folders by role: "src/" (application code), "config/" (configurations), "docs/" (markdown docs/reports), "scripts/" (utility scripts), "data/" (datasets/SQL/CSV), "assets/" (media/downloads/PDFs), and "tests/" (tests).',
  '- Always store every file cleanly formatted with consistent 2-space indentation, clean spacing, LF line endings, and a trailing newline.',
].join('\n');

export function classifyRootOrganizationFolder(fileName: string): 'config' | 'docs' | 'data' | 'assets' | null {
  const lower = fileName.trim().toLowerCase();
  if (!lower || ROOT_ANCHOR_FILES.has(lower)) return null;

  if (CONFIG_BASENAME_PATTERNS.some(re => re.test(lower))) {
    return 'config';
  }

  const ext = path.extname(lower);
  if (ext === '.md') return 'docs';
  if (DATA_EXTENSIONS.has(ext)) return 'data';
  if (ASSET_DOWNLOAD_EXTENSIONS.has(ext)) return 'assets';
  return null;
}

export interface CleanPathResolution {
  resolvedPath: string;
  redirectedFolder: 'config' | 'docs' | 'data' | 'assets' | null;
  relativeToRoot: string;
}

/**
 * Resolves a workspace write path and cleanly groups loose root-level secondary
 * config, doc, data, and asset files into a structured tree (`config/`, `docs/`,
 * `data/`, `assets/`) unless that file already exists at the workspace root.
 */
export function resolveCleanWorkspaceWritePath(
  resolvedExactPath: string,
  workspaceRoot: string
): CleanPathResolution {
  const rel = path.relative(workspaceRoot, resolvedExactPath).replace(/\\/g, '/');
  const dirPart = path.dirname(rel).replace(/\\/g, '/');
  const baseName = path.basename(resolvedExactPath);

  if (dirPart !== '.' || fsSync.existsSync(resolvedExactPath)) {
    return {
      resolvedPath: resolvedExactPath,
      redirectedFolder: null,
      relativeToRoot: rel || baseName,
    };
  }

  const targetFolder = classifyRootOrganizationFolder(baseName);
  if (!targetFolder) {
    return {
      resolvedPath: resolvedExactPath,
      redirectedFolder: null,
      relativeToRoot: rel || baseName,
    };
  }

  return {
    resolvedPath: path.join(workspaceRoot, targetFolder, baseName),
    redirectedFolder: targetFolder,
    relativeToRoot: `${targetFolder}/${baseName}`,
  };
}

/**
 * When follow-up read/edit/delete calls target a root path that was previously
 * organized into `config/`, `docs/`, `data/`, or `assets/`, transparently find it.
 */
export function findOrganizedFallbackPath(
  resolvedExactPath: string,
  allowedRoots: string[],
  primaryRoot: string
): string {
  if (fsSync.existsSync(resolvedExactPath)) return resolvedExactPath;
  const matchedRoot = allowedRoots.find(root => {
    const rel = path.relative(root, resolvedExactPath);
    return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
  }) || primaryRoot;

  const rel = path.relative(matchedRoot, resolvedExactPath).replace(/\\/g, '/');
  if (path.dirname(rel).replace(/\\/g, '/') !== '.') return resolvedExactPath;

  const folder = classifyRootOrganizationFolder(path.basename(resolvedExactPath));
  if (!folder) return resolvedExactPath;

  const organizedCandidate = path.join(matchedRoot, folder, path.basename(resolvedExactPath));
  return fsSync.existsSync(organizedCandidate) ? organizedCandidate : resolvedExactPath;
}

/**
 * Formats file contents consistently before persisting to disk so every generated
 * config, markup, script, or source file is stored in a clean, readable structure.
 */
export function formatWorkspaceFileContent(targetPath: string, rawContent: string): string {
  if (!rawContent) return rawContent;
  const base = path.basename(targetPath).toLowerCase();
  const ext = path.extname(base);

  if (JSON_FORMATTED_EXTENSIONS.has(ext) || JSON_FORMATTED_EXTENSIONS.has(base)) {
    if (rawContent.length <= 512 * 1024) {
      try {
        const parsed = JSON.parse(rawContent);
        return `${JSON.stringify(parsed, null, 2)}\n`;
      } catch {
        // Preserve JSONC with comments safely via text normalization below
      }
    }
  }

  if (!CLEAN_TEXT_EXTENSIONS.has(ext) && !CLEAN_TEXT_EXTENSIONS.has(base) && !base.startsWith('.env')) {
    return rawContent;
  }

  const normalized = rawContent.replace(/\r\n?/g, '\n');
  const isMarkdown = ext === '.md';
  const cleanedLines = normalized.split('\n').map(line => {
    if (isMarkdown && / {2}$/.test(line)) {
      return `${line.slice(0, -2).replace(/[ \t]+$/, '')}  `;
    }
    return line.replace(/[ \t]+$/, '');
  });

  const compacted: string[] = [];
  let consecutiveBlank = 0;
  for (const line of cleanedLines) {
    if (line === '') {
      consecutiveBlank += 1;
      if (consecutiveBlank <= 1) compacted.push(line);
    } else {
      consecutiveBlank = 0;
      compacted.push(line);
    }
  }

  const joined = compacted.join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
  return joined ? `${joined}\n` : '';
}
