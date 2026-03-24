// =============================================================================
// Detect Claude Code installation and plugin directories
// =============================================================================

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export function getClaudeDir() {
  return join(homedir(), '.claude');
}

export function getPluginDir() {
  return join(getClaudeDir(), 'plugins', 'local', 'attacca-forge');
}

export function isClaudeInstalled() {
  return existsSync(getClaudeDir());
}

export function isForgeInstalled() {
  return existsSync(getPluginDir());
}
