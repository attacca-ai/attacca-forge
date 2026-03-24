// =============================================================================
// attacca-forge install — Install skills into Claude Code plugin directory
// =============================================================================

import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { getClaudeDir, getPluginDir, isClaudeInstalled } from '../utils/detect-claude.js';

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

  // Source plugin directory (shipped with this package)
  const sourcePlugin = join(rootDir, 'plugins', 'attacca-forge');
  if (!existsSync(sourcePlugin)) {
    console.error('  ✗ Plugin source not found. Package may be corrupted.');
    process.exit(1);
  }

  // Target plugin directory
  const targetDir = getPluginDir();
  const localDir = join(getClaudeDir(), 'plugins', 'local');

  // Create directories
  if (!existsSync(localDir)) mkdirSync(localDir, { recursive: true });

  // Copy plugin files
  const existed = existsSync(targetDir);
  cpSync(sourcePlugin, targetDir, { recursive: true, force: true });

  // Also copy root marketplace plugin.json
  const rootPluginJson = join(rootDir, '.claude-plugin');
  const targetRootPlugin = join(getClaudeDir(), 'plugins', 'local', 'attacca-forge-root', '.claude-plugin');
  if (existsSync(rootPluginJson)) {
    mkdirSync(join(getClaudeDir(), 'plugins', 'local', 'attacca-forge-root'), { recursive: true });
    cpSync(rootPluginJson, targetRootPlugin, { recursive: true, force: true });
  }

  // Count skills
  const skillsDir = join(targetDir, 'skills');
  let skillCount = 0;
  if (existsSync(skillsDir)) {
    const { readdirSync } = await import('node:fs');
    skillCount = readdirSync(skillsDir).filter((f) => {
      return existsSync(join(skillsDir, f, 'SKILL.md'));
    }).length;
  }

  console.log(`  ✓ ${existed ? 'Updated' : 'Installed'} ${skillCount} skills to Claude Code`);
  console.log(`    Location: ${targetDir}`);
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
