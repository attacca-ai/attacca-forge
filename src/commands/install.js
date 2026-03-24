// =============================================================================
// attacca-forge install — Install skills into Claude Code plugin directory
// =============================================================================

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getClaudeDir, getPluginDir, isClaudeInstalled } from '../utils/detect-claude.js';

const MARKETPLACE_NAME = 'attacca-forge';
const PLUGIN_NAME = 'attacca-forge';

function readJsonFile(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function writeJsonFile(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function registerMarketplace(claudeDir, targetDir) {
  const marketplacesPath = join(claudeDir, 'plugins', 'known_marketplaces.json');
  const marketplaces = readJsonFile(marketplacesPath) || {};

  if (marketplaces[MARKETPLACE_NAME]) {
    marketplaces[MARKETPLACE_NAME].lastUpdated = new Date().toISOString();
  } else {
    marketplaces[MARKETPLACE_NAME] = {
      source: {
        source: 'directory',
        path: targetDir,
      },
      installLocation: targetDir,
      lastUpdated: new Date().toISOString(),
    };
  }

  writeJsonFile(marketplacesPath, marketplaces);
  return true;
}

function registerPlugin(claudeDir, pluginDir, version) {
  const installedPath = join(claudeDir, 'plugins', 'installed_plugins.json');
  const installed = readJsonFile(installedPath) || { version: 2, plugins: {} };

  if (!installed.version) installed.version = 2;
  if (!installed.plugins) installed.plugins = {};

  const pluginKey = `${PLUGIN_NAME}@${MARKETPLACE_NAME}`;
  const now = new Date().toISOString();

  // Set up cache directory and copy skills there
  const cachePath = join(claudeDir, 'plugins', 'cache', MARKETPLACE_NAME, PLUGIN_NAME, version);
  if (!existsSync(cachePath)) mkdirSync(cachePath, { recursive: true });

  const sourceSkills = join(pluginDir, 'skills');
  const cacheSkills = join(cachePath, 'skills');
  if (existsSync(sourceSkills)) {
    cpSync(sourceSkills, cacheSkills, { recursive: true, force: true });
  }

  if (installed.plugins[pluginKey]) {
    installed.plugins[pluginKey][0].version = version;
    installed.plugins[pluginKey][0].installPath = cachePath;
    installed.plugins[pluginKey][0].lastUpdated = now;
  } else {
    installed.plugins[pluginKey] = [
      {
        scope: 'user',
        installPath: cachePath,
        version,
        installedAt: now,
        lastUpdated: now,
      },
    ];
  }

  writeJsonFile(installedPath, installed);
  return true;
}

export default async function install({ args, cwd, rootDir }) {
  console.log('\n  Attacca Forge — Install Skills');
  console.log('  ===============================\n');

  // Check Claude Code
  if (!isClaudeInstalled()) {
    console.log('  ✗ Claude Code not found (~/.claude directory missing)');
    console.log('');
    console.log('  Install Claude Code first: https://claude.ai/claude-code');
    console.log('  Then run this command again.');
    console.log('');
    process.exit(1);
  }

  console.log('  ✓ Claude Code detected');

  // Source directories (shipped with this package)
  // Repo layout (flat):
  //   .claude-plugin/plugin.json   ← plugin descriptor
  //   skills/                      ← all skill definitions
  const sourcePluginJson = join(rootDir, '.claude-plugin', 'plugin.json');
  const sourceSkills = join(rootDir, 'skills');

  if (!existsSync(sourceSkills)) {
    console.error('  ✗ Skills directory not found. Package may be corrupted.');
    process.exit(1);
  }

  // Read version from package.json
  const pkg = readJsonFile(join(rootDir, 'package.json'));
  const version = pkg?.version || '0.5.2';

  // Target: ~/.claude/plugins/local/attacca-forge/
  // Installed layout (flat):
  //   .claude-plugin/plugin.json
  //   skills/
  const claudeDir = getClaudeDir();
  const targetDir = getPluginDir();

  const existed = existsSync(targetDir);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });

  // 1. Copy plugin.json to target
  const targetPluginDir = join(targetDir, '.claude-plugin');
  if (!existsSync(targetPluginDir)) mkdirSync(targetPluginDir, { recursive: true });
  cpSync(sourcePluginJson, join(targetPluginDir, 'plugin.json'), { force: true });

  // 2. Copy skills to target root
  const targetSkillsDir = join(targetDir, 'skills');
  cpSync(sourceSkills, targetSkillsDir, { recursive: true, force: true });

  // Count skills
  let skillCount = 0;
  if (existsSync(targetSkillsDir)) {
    skillCount = readdirSync(targetSkillsDir).filter((f) => {
      return existsSync(join(targetSkillsDir, f, 'SKILL.md'));
    }).length;
  }

  console.log(`  ✓ ${existed ? 'Updated' : 'Installed'} ${skillCount} skills to Claude Code`);
  console.log(`    Location: ${targetDir}`);

  // 3. Register marketplace in known_marketplaces.json
  const pluginsDir = join(claudeDir, 'plugins');
  if (!existsSync(pluginsDir)) mkdirSync(pluginsDir, { recursive: true });

  registerMarketplace(claudeDir, targetDir);
  console.log('  ✓ Marketplace registered');

  // 4. Register plugin in installed_plugins.json + populate cache
  registerPlugin(claudeDir, targetDir, version);
  console.log('  ✓ Plugin registered');

  console.log('');
  console.log('  Restart Claude Code to load the new skills.');
  console.log('');
  console.log('  Available skills:');
  console.log('    /spec-architect      Full behavioral spec with intent contracts');
  console.log('    /spec-writer         Streamlined spec (no intent layer)');
  console.log('    /stress-test         Factorial stress testing (22 variation types)');
  console.log('    /intent-spec         Agent intent specification');
  console.log('    /intent-audit        Organizational AI maturity audit');
  console.log('    /codebase-discovery  Brownfield codebase discovery');
  console.log('    /build-orchestrator  Build pipeline with 4-layer eval stack');
  console.log('    /forge-help          Phase-aware guidance ("what\'s next?")');
  console.log('    /forge-start         IDEA phase onboarding');
  console.log('');
}
