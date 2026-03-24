// =============================================================================
// attacca-forge init — Interactive project setup wizard
// =============================================================================

import { basename } from 'node:path';
import { ask, choose } from '../utils/prompt.js';
import { isInitialized, writeConfig, writeContext } from '../utils/context.js';

export default async function init({ args, cwd }) {
  console.log('\n  Attacca Forge — Project Setup');
  console.log('  ==============================\n');

  // Check if already initialized
  if (isInitialized(cwd)) {
    const proceed = await ask('Project already initialized. Reinitialize? (y/N)', 'N');
    if (proceed.toLowerCase() !== 'y') {
      console.log('\n  Aborted.\n');
      return;
    }
  }

  // 1. Project name
  const defaultName = args[0] || basename(cwd);
  const name = await ask('Project name', defaultName);

  // 2. Greenfield or Brownfield
  const type = await choose('What kind of project?', [
    {
      label: 'Greenfield — building from scratch',
      hint: 'No existing codebase. Starting from an idea.',
      value: 'greenfield',
    },
    {
      label: 'Brownfield — changing existing code',
      hint: 'There is a codebase. You need to modify or extend it.',
      value: 'brownfield',
    },
  ]);

  // 3. Trust Tier
  const tier = await choose('What happens if this system gets it wrong?', [
    {
      label: 'Tier 1 — Nothing bad happens',
      hint: 'Hobby project, internal tool, prototype. Errors are annoying, not harmful.',
      value: '1',
    },
    {
      label: 'Tier 2 — We lose time or money',
      hint: 'SaaS product, client deliverable, business tool. Errors cost real resources.',
      value: '2',
    },
    {
      label: 'Tier 3 — Legal, financial, or reputational risk',
      hint: 'Compliance, financial decisions, public-facing. Errors have serious consequences.',
      value: '3',
    },
    {
      label: 'Tier 4 — Irreversible harm',
      hint: 'Healthcare, safety-critical, regulatory. Errors can cause physical or legal harm.',
      value: '4',
    },
  ]);

  // 4. Experience level
  const level = await choose('Your experience with AI-assisted development?', [
    {
      label: 'New — explain everything',
      hint: 'First time using AI for development. Show me the ropes.',
      value: 'new',
    },
    {
      label: 'Comfortable — explain decisions, not basics',
      hint: 'Used AI tools before. Know the workflow. Want methodology guidance.',
      value: 'comfortable',
    },
    {
      label: 'Expert — terse, just the framework',
      hint: 'Deep experience. Skip explanations. Give me the structure.',
      value: 'expert',
    },
  ]);

  // Write config
  const now = new Date().toISOString().split('T')[0];
  const config = {
    project: { name, type, tier, level, created: now },
    phase: { current: 'IDEA' },
    artifacts: { completed: [] },
  };

  writeConfig(cwd, config);

  // Write initial context
  const nextStep = type === 'brownfield'
    ? 'Start with codebase discovery to map the existing system.\nInvoke: "discover this codebase" or /codebase-discovery'
    : 'Start with the IDEA phase to capture your intent.\nInvoke: "help me start" or /forge-start';

  writeContext(cwd, config, 'IDEA', [], [], nextStep);

  // Summary
  console.log('\n  ✓ Project initialized\n');
  console.log(`    Name:       ${name}`);
  console.log(`    Type:       ${type}`);
  console.log(`    Trust Tier: ${tier}`);
  console.log(`    Level:      ${level}`);
  console.log(`    Config:     .attacca/config.yaml`);
  console.log(`    Context:    .attacca/context.md`);
  console.log('');

  if (type === 'brownfield') {
    console.log('  Next step: Run codebase discovery');
    console.log('  In Claude Code, say: "discover this codebase" or /codebase-discovery');
  } else {
    console.log('  Next step: Capture your idea');
    console.log('  In Claude Code, say: "help me start" or /forge-start');
  }

  console.log('');
  console.log('  Run `attacca-forge status` anytime to see where you are.');
  console.log('');
}
