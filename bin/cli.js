#!/usr/bin/env node

// =============================================================================
// Attacca Forge CLI
// Spec-driven AI development toolkit
// Usage: npx attacca-forge <command> [options]
// =============================================================================

import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// npx runs from a temp directory — resolve back to the user's CWD
const userCwd = process.env.INIT_CWD || process.cwd();

const COMMANDS = {
  init: () => import('../src/commands/init.js'),
  install: () => import('../src/commands/install.js'),
  status: () => import('../src/commands/status.js'),
  help: () => import('../src/commands/help.js'),
};

const HELP = `
  attacca-forge — Spec-driven AI development toolkit

  Usage:
    npx attacca-forge <command> [options]

  Commands:
    init        Initialize a new project with Attacca Forge
    install     Install skills into Claude Code plugin directory
    status      Show current pipeline phase and next steps
    help        Show this help message

  Examples:
    npx attacca-forge init
    npx attacca-forge init my-project
    npx attacca-forge install
    npx attacca-forge status

  Documentation:
    https://github.com/attacca-ai/attacca-forge
`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    process.exit(0);
  }

  if (command === '--version' || command === '-v') {
    const pkg = JSON.parse(
      (await import('node:fs')).readFileSync(resolve(__dirname, '..', 'package.json'), 'utf-8')
    );
    console.log(`attacca-forge v${pkg.version}`);
    process.exit(0);
  }

  if (!COMMANDS[command]) {
    console.error(`\n  Unknown command: ${command}\n`);
    console.log(HELP);
    process.exit(1);
  }

  try {
    const mod = await COMMANDS[command]();
    await mod.default({ args: args.slice(1), cwd: userCwd, rootDir: resolve(__dirname, '..') });
  } catch (err) {
    console.error(`\n  Error: ${err.message}\n`);
    process.exit(1);
  }
}

main();
