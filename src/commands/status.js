// =============================================================================
// attacca-forge status — Show current pipeline phase and next steps
// =============================================================================

import { readConfig, readContext, isInitialized } from '../utils/context.js';

const PIPELINE = ['IDEA', 'DISCOVER', 'SPEC', 'BUILD', 'TEST', 'CERTIFY', 'DEPLOY', 'MAINTAIN'];

const PHASE_SKILLS = {
  IDEA: { skill: 'forge-start', desc: 'Capture your idea and classify risk' },
  DISCOVER: { skill: 'codebase-discovery', desc: 'Map the existing codebase (brownfield only)' },
  SPEC: { skill: 'spec-architect', desc: 'Write behavioral specification with intent contract' },
  BUILD: { skill: 'build-orchestrator', desc: 'Execute implementation on deterministic rails' },
  TEST: { skill: 'stress-test', desc: 'Run factorial stress testing against scenarios' },
  CERTIFY: { skill: null, desc: 'Human sign-off (tier-appropriate review)' },
  DEPLOY: { skill: 'build-orchestrator', desc: 'Production deployment with gates' },
  MAINTAIN: { skill: null, desc: 'Continuous flywheel + drift detection' },
};

export default async function status({ cwd }) {
  console.log('\n  Attacca Forge — Project Status');
  console.log('  ===============================\n');

  if (!isInitialized(cwd)) {
    console.log('  No project initialized in this directory.');
    console.log('  Run: npx attacca-forge init\n');
    return;
  }

  const config = readConfig(cwd);
  if (!config) {
    console.log('  Config file corrupted. Reinitialize with: npx attacca-forge init\n');
    return;
  }

  const { project, phase, artifacts } = config;
  const currentPhase = phase?.current || 'IDEA';
  const currentIdx = PIPELINE.indexOf(currentPhase);

  console.log(`  Project:    ${project.name}`);
  console.log(`  Type:       ${project.type}`);
  console.log(`  Trust Tier: ${project.tier}`);
  console.log(`  Level:      ${project.level}`);
  console.log('');

  // Pipeline visualization
  console.log('  Pipeline:');
  console.log('');
  for (let i = 0; i < PIPELINE.length; i++) {
    const p = PIPELINE[i];
    const info = PHASE_SKILLS[p];

    // Skip DISCOVER for greenfield
    if (p === 'DISCOVER' && project.type === 'greenfield') continue;

    let marker;
    if (i < currentIdx) marker = '  ✓';
    else if (i === currentIdx) marker = '  ▸';
    else marker = '   ';

    const line = `${marker} ${p.padEnd(10)} ${info.desc}`;
    console.log(line);
  }

  console.log('');

  // Next step
  const phaseInfo = PHASE_SKILLS[currentPhase];
  if (phaseInfo?.skill) {
    console.log(`  Next: /${phaseInfo.skill}`);
    console.log(`        ${phaseInfo.desc}`);
  } else if (currentPhase === 'CERTIFY') {
    console.log(`  Next: Human review required (Tier ${project.tier})`);
  } else if (currentPhase === 'MAINTAIN') {
    console.log('  System is in production. Monitoring for drift.');
  }

  // Artifacts
  const completed = artifacts?.completed || [];
  if (completed.length > 0) {
    console.log('');
    console.log('  Artifacts:');
    completed.forEach((a) => console.log(`    - ${a}`));
  }

  console.log('');
}
