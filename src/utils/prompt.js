// =============================================================================
// Minimal interactive prompt utility — zero dependencies
// =============================================================================

import { createInterface } from 'node:readline';

const rl = () =>
  createInterface({ input: process.stdin, output: process.stdout });

export async function ask(question, defaultValue) {
  const r = rl();
  const suffix = defaultValue ? ` (${defaultValue})` : '';
  return new Promise((resolve) => {
    r.question(`  ${question}${suffix}: `, (answer) => {
      r.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

export async function choose(question, options) {
  console.log(`\n  ${question}\n`);
  options.forEach((opt, i) => {
    console.log(`    ${i + 1}. ${opt.label}`);
    if (opt.hint) console.log(`       ${opt.hint}`);
  });
  console.log('');

  const r = rl();
  return new Promise((resolve) => {
    const prompt = () => {
      r.question(`  Choose [1-${options.length}]: `, (answer) => {
        const idx = parseInt(answer, 10) - 1;
        if (idx >= 0 && idx < options.length) {
          r.close();
          resolve(options[idx].value);
        } else {
          prompt();
        }
      });
    };
    prompt();
  });
}
