// =============================================================================
// .factory/ context management — read/write project state
// Migrated from .attacca/ to .factory/ (2026-04-08)
// Backward-compatible: reads from .attacca/ if .factory/ doesn't exist
// =============================================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FACTORY_DIR = '.factory';
const LEGACY_DIR = '.attacca';
const CONFIG_FILE = 'config.yaml';
const CONTEXT_FILE = 'context.md';
const STATUS_FILE = 'status.json';

/**
 * Resolve the active directory: .factory/ preferred, .attacca/ as fallback.
 */
function resolveDir(cwd) {
  if (existsSync(join(cwd, FACTORY_DIR))) return FACTORY_DIR;
  if (existsSync(join(cwd, LEGACY_DIR))) return LEGACY_DIR;
  return FACTORY_DIR; // Default to new standard for new projects
}

export function getAttaccaDir(cwd) {
  return join(cwd, resolveDir(cwd));
}

export function isInitialized(cwd) {
  return existsSync(join(cwd, FACTORY_DIR, CONFIG_FILE))
    || existsSync(join(cwd, LEGACY_DIR, CONFIG_FILE));
}

export function ensureDir(cwd) {
  // Always write to .factory/ (new standard)
  const dir = join(cwd, FACTORY_DIR);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const artifacts = join(dir, 'artifacts');
  if (!existsSync(artifacts)) mkdirSync(artifacts, { recursive: true });
  const progress = join(dir, 'progress');
  if (!existsSync(progress)) mkdirSync(progress, { recursive: true });
  const decisions = join(dir, 'decisions');
  if (!existsSync(decisions)) mkdirSync(decisions, { recursive: true });
  return dir;
}

export function writeConfig(cwd, config) {
  const dir = ensureDir(cwd);
  const yaml = configToYaml(config);
  writeFileSync(join(dir, CONFIG_FILE), yaml, 'utf-8');
}

export function readConfig(cwd) {
  // Try .factory/ first, fall back to .attacca/
  const factoryFile = join(cwd, FACTORY_DIR, CONFIG_FILE);
  if (existsSync(factoryFile)) return yamlToConfig(readFileSync(factoryFile, 'utf-8'));
  const legacyFile = join(cwd, LEGACY_DIR, CONFIG_FILE);
  if (existsSync(legacyFile)) return yamlToConfig(readFileSync(legacyFile, 'utf-8'));
  return null;
}

export function writeContext(cwd, config, phase, completedPhases, artifacts, nextStep) {
  const dir = ensureDir(cwd);
  const now = new Date().toISOString().split('T')[0];

  const phases = completedPhases
    .map((p) => `- [x] ${p.name} (${p.date}) — ${p.summary}`)
    .join('\n');

  const arts = artifacts.length > 0
    ? artifacts.map((a) => `- \`${a.path}\` — ${a.description}`).join('\n')
    : '_None yet_';

  const content = `# Project Context — ${config.project.name}

## Current Phase: ${phase}
## Trust Tier: ${config.project.tier}
## Type: ${config.project.type}
## Experience: ${config.project.level}

## Completed Phases
${phases || '_None yet — run forge-start to begin_'}

## Artifacts Generated
${arts}

## Next Step
${nextStep}
`;

  writeFileSync(join(dir, CONTEXT_FILE), content, 'utf-8');
}

export function readContext(cwd) {
  const factoryFile = join(cwd, FACTORY_DIR, CONTEXT_FILE);
  if (existsSync(factoryFile)) return readFileSync(factoryFile, 'utf-8');
  const legacyFile = join(cwd, LEGACY_DIR, CONTEXT_FILE);
  if (existsSync(legacyFile)) return readFileSync(legacyFile, 'utf-8');
  return null;
}

/**
 * Write status.json for scanner compatibility.
 */
export function writeStatus(cwd, config, phase) {
  const dir = ensureDir(cwd);
  const status = {
    state: phase || config?.project?.phase || 'IDEA',
    health: 'active',
    track: 'software',
    archived: false,
    completion_pct: 0,
    gap_count: 0,
    last_activity: new Date().toISOString(),
  };
  writeFileSync(join(dir, STATUS_FILE), JSON.stringify(status, null, 2), 'utf-8');
}

// Minimal YAML serializer (no dependencies)
function configToYaml(config) {
  const lines = [];
  for (const [section, values] of Object.entries(config)) {
    lines.push(`${section}:`);
    if (typeof values === 'object' && values !== null) {
      for (const [key, val] of Object.entries(values)) {
        if (Array.isArray(val)) {
          lines.push(`  ${key}:`);
          val.forEach((item) => lines.push(`    - ${item}`));
        } else {
          lines.push(`  ${key}: ${val}`);
        }
      }
    } else {
      lines.push(`  ${values}`);
    }
  }
  return lines.join('\n') + '\n';
}

// Minimal YAML parser (handles our flat config only)
function yamlToConfig(yaml) {
  const config = {};
  let currentSection = null;
  let currentKey = null;

  for (const line of yaml.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (!line.startsWith(' ') && line.endsWith(':')) {
      currentSection = line.slice(0, -1).trim();
      config[currentSection] = {};
      currentKey = null;
    } else if (line.startsWith('  ') && !line.startsWith('    ')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (currentKey && currentSection) {
          if (!Array.isArray(config[currentSection][currentKey])) {
            config[currentSection][currentKey] = [];
          }
          config[currentSection][currentKey].push(trimmed.slice(2));
        }
      } else if (trimmed.includes(': ')) {
        const colonIdx = trimmed.indexOf(': ');
        currentKey = trimmed.slice(0, colonIdx);
        const val = trimmed.slice(colonIdx + 2);
        if (currentSection) config[currentSection][currentKey] = val;
      } else if (trimmed.endsWith(':')) {
        currentKey = trimmed.slice(0, -1);
        if (currentSection) config[currentSection][currentKey] = [];
      }
    } else if (line.startsWith('    ') && line.trim().startsWith('- ')) {
      if (currentKey && currentSection) {
        if (!Array.isArray(config[currentSection][currentKey])) {
          config[currentSection][currentKey] = [];
        }
        config[currentSection][currentKey].push(line.trim().slice(2));
      }
    }
  }

  return config;
}
