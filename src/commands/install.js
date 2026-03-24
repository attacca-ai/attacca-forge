// =============================================================================
// attacca-forge install — Install as a Claude Code marketplace + plugin
//
// Registration approach (same pattern as nirbound-marketplace):
//   1. Build marketplace structure at ~/.claude/plugins/local/attacca-forge/
//   2. Register in settings.json (extraKnownMarketplaces + enabledPlugins)
//   3. Register in known_marketplaces.json
//   4. Register in installed_plugins.json + populate cache
// =============================================================================

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getClaudeDir, isClaudeInstalled } from '../utils/detect-claude.js';

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

// Step 1: Build marketplace directory structure
function buildMarketplaceStructure(rootDir, targetDir, version) {
  // Create marketplace root
  mkdirSync(targetDir, { recursive: true });

  // Write marketplace.json at marketplace root
  const marketplaceJsonDir = join(targetDir, '.claude-plugin');
  mkdirSync(marketplaceJsonDir, { recursive: true });
  writeJsonFile(join(marketplaceJsonDir, 'marketplace.json'), {
    $schema: 'https://anthropic.com/claude-code/marketplace.schema.json',
    name: MARKETPLACE_NAME,
    description:
      'Spec-driven AI development toolkit — design, evaluate, stress-test, and certify autonomous agents',
    owner: { name: 'Attacca' },
    plugins: [
      {
        name: PLUGIN_NAME,
        description:
          'AI agent development methodology — design, evaluate, and align autonomous agents',
        version,
        author: { name: 'Attacca' },
        source: `./plugins/${PLUGIN_NAME}`,
        category: 'development',
      },
    ],
  });

  // Create plugin subdirectory: plugins/attacca-forge/
  const pluginDir = join(targetDir, 'plugins', PLUGIN_NAME);
  mkdirSync(pluginDir, { recursive: true });

  // Copy plugin.json
  const pluginJsonDir = join(pluginDir, '.claude-plugin');
  mkdirSync(pluginJsonDir, { recursive: true });
  const sourcePluginJson = join(rootDir, '.claude-plugin', 'plugin.json');
  if (existsSync(sourcePluginJson)) {
    cpSync(sourcePluginJson, join(pluginJsonDir, 'plugin.json'), { force: true });
  }

  // Copy skills into the plugin subdirectory
  const sourceSkills = join(rootDir, 'skills');
  const targetSkills = join(pluginDir, 'skills');
  if (existsSync(sourceSkills)) {
    cpSync(sourceSkills, targetSkills, { recursive: true, force: true });
  }

  return pluginDir;
}

// Step 2: Register in settings.json
function registerInSettings(claudeDir, targetDir) {
  const settingsPath = join(claudeDir, 'settings.json');
  const settings = readJsonFile(settingsPath) || {};

  let changed = false;

  // Add to extraKnownMarketplaces
  if (!settings.extraKnownMarketplaces) settings.extraKnownMarketplaces = {};
  if (!settings.extraKnownMarketplaces[MARKETPLACE_NAME]) {
    settings.extraKnownMarketplaces[MARKETPLACE_NAME] = {
      source: {
        source: 'directory',
        path: targetDir,
      },
    };
    changed = true;
  }

  // Add to enabledPlugins
  if (!settings.enabledPlugins) settings.enabledPlugins = {};
  const pluginKey = `${PLUGIN_NAME}@${MARKETPLACE_NAME}`;
  if (settings.enabledPlugins[pluginKey] === undefined) {
    settings.enabledPlugins[pluginKey] = true;
    changed = true;
  }

  if (changed) {
    writeJsonFile(settingsPath, settings);
  }

  return changed;
}

// Step 3: Register in known_marketplaces.json
function registerMarketplace(claudeDir, targetDir) {
  const marketplacesPath = join(claudeDir, 'plugins', 'known_marketplaces.json');
  const marketplaces = readJsonFile(marketplacesPath) || {};

  marketplaces[MARKETPLACE_NAME] = {
    source: {
      source: 'directory',
      path: targetDir,
    },
    installLocation: targetDir,
    lastUpdated: new Date().toISOString(),
  };

  writeJsonFile(marketplacesPath, marketplaces);
}

// Step 4: Register in installed_plugins.json + populate cache
function registerPlugin(claudeDir, pluginDir, version) {
  const installedPath = join(claudeDir, 'plugins', 'installed_plugins.json');
  const installed = readJsonFile(installedPath) || { version: 2, plugins: {} };

  if (!installed.version) installed.version = 2;
  if (!installed.plugins) installed.plugins = {};

  const pluginKey = `${PLUGIN_NAME}@${MARKETPLACE_NAME}`;
  const now = new Date().toISOString();

  // Copy to cache
  const cachePath = join(claudeDir, 'plugins', 'cache', MARKETPLACE_NAME, PLUGIN_NAME, version);
  mkdirSync(cachePath, { recursive: true });

  const sourcePluginJsonDir = join(pluginDir, '.claude-plugin');
  const cachePluginJsonDir = join(cachePath, '.claude-plugin');
  mkdirSync(cachePluginJsonDir, { recursive: true });
  if (existsSync(join(sourcePluginJsonDir, 'plugin.json'))) {
    cpSync(join(sourcePluginJsonDir, 'plugin.json'), join(cachePluginJsonDir, 'plugin.json'), {
      force: true,
    });
  }

  const sourceSkills = join(pluginDir, 'skills');
  const cacheSkills = join(cachePath, 'skills');
  if (existsSync(sourceSkills)) {
    cpSync(sourceSkills, cacheSkills, { recursive: true, force: true });
  }

  // Register
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

  // Verify source skills exist
  const sourceSkills = join(rootDir, 'skills');
  if (!existsSync(sourceSkills)) {
    console.error('  ✗ Skills directory not found. Package may be corrupted.');
    process.exit(1);
  }

  // Read version from package.json
  const pkg = readJsonFile(join(rootDir, 'package.json'));
  const version = pkg?.version || '0.6.0';

  const claudeDir = getClaudeDir();
  const targetDir = join(claudeDir, 'plugins', 'local', MARKETPLACE_NAME);
  const pluginsDir = join(claudeDir, 'plugins');
  if (!existsSync(pluginsDir)) mkdirSync(pluginsDir, { recursive: true });

  // Step 1: Build marketplace structure
  const pluginDir = buildMarketplaceStructure(rootDir, targetDir, version);

  // Count skills
  const { readdirSync } = await import('node:fs');
  const skillsDir = join(pluginDir, 'skills');
  let skillCount = 0;
  if (existsSync(skillsDir)) {
    skillCount = readdirSync(skillsDir).filter((f) => {
      return existsSync(join(skillsDir, f, 'SKILL.md'));
    }).length;
  }

  console.log(`  ✓ Installed ${skillCount} skills`);
  console.log(`    Marketplace: ${targetDir}`);

  // Step 2: Register in settings.json
  const settingsChanged = registerInSettings(claudeDir, targetDir);
  console.log(`  ✓ Settings ${settingsChanged ? 'updated' : 'already configured'}`);

  // Step 3: Register in known_marketplaces.json
  registerMarketplace(claudeDir, targetDir);
  console.log('  ✓ Marketplace registered');

  // Step 4: Register plugin + populate cache
  registerPlugin(claudeDir, pluginDir, version);
  console.log('  ✓ Plugin registered');

  console.log('');
  console.log('  Restart Claude Code to load the new skills.');
  console.log('');
}
