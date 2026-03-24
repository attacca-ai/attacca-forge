// =============================================================================
// attacca-forge help — CLI help (delegates to forge-help skill in Claude Code)
// =============================================================================

export default async function help({ cwd }) {
  console.log(`
  Attacca Forge — Spec-Driven AI Development Toolkit
  ====================================================

  Commands:
    init        Set up a new project (.attacca/ config + context)
    install     Install skills into Claude Code plugin directory
    status      Show current pipeline phase, artifacts, and next steps
    help        Show this help message

  The 8-Phase Pipeline:
    IDEA        Capture intent, classify trust tier
    DISCOVER    Map existing codebase (brownfield only)
    SPEC        Write behavioral specification + intent contract
    BUILD       Execute implementation on deterministic rails
    TEST        Factorial stress testing against scenarios
    CERTIFY     Human sign-off (tier-appropriate)
    DEPLOY      Production deployment with gates
    MAINTAIN    Continuous flywheel + drift detection

  Core Skills (invoke in Claude Code):
    /spec-architect       Full spec with intent contracts + eval scenarios
    /spec-writer          Streamlined spec (no intent, faster)
    /stress-test          22 variation types × 4 failure modes
    /intent-spec          Agent intent specification + Klarna checklist
    /intent-audit         Organizational AI maturity audit
    /codebase-discovery   Brownfield behavioral snapshot
    /build-orchestrator   Build pipeline with 4-layer eval stack
    /forge-help           "What should I do next?" (phase-aware)
    /forge-start          IDEA phase onboarding

  Getting Started:
    1. npx attacca-forge init          Set up your project
    2. npx attacca-forge install       Install skills to Claude Code
    3. Open Claude Code and say:       "help me start"

  Docs: https://github.com/attacca-ai/attacca-forge
`);
}
