# Attacca Forge

**Spec-driven AI development toolkit. Your spec is the source of truth — not the model, not the prompt, not the vibes.**

```bash
npx attacca-forge init
npx attacca-forge install
```

AI agents don't ask clarifying questions — they make assumptions. The quality gap between Level 3 and Level 5 AI-assisted development isn't model intelligence. It's specification quality.

Attacca Forge gives you an 8-phase pipeline from idea to production, 26 skills for Claude Code, and a methodology that scales evaluation rigor to the stakes of what you're building.

## Quick Start

### Option A: npx (recommended)

```bash
# Initialize your project (interactive setup)
npx attacca-forge init

# Install skills into Claude Code
npx attacca-forge install
```

Restart Claude Code. Then say what you want to build:

```
I want to build a notification system that alerts users when their subscription is about to expire
```

### Option B: Manual install

```bash
git clone https://github.com/attacca-ai/attacca-forge.git
cd attacca-forge
./install.sh        # macOS / Linux / WSL
# or
./install.ps1       # Windows PowerShell
```

## The Pipeline

```
IDEA → DISCOVER → SPEC → BUILD → TEST → CERTIFY → DEPLOY → MAINTAIN
```

Every project starts at IDEA. The pipeline guides you phase by phase. Trust tiers (1-4) scale the rigor at every step — a hobby project moves fast, a safety-critical system gets full evaluation.

```bash
npx attacca-forge status    # See where you are
```

```
  Pipeline:

  ✓ IDEA       Capture your idea and classify risk
  ✓ SPEC       Write behavioral specification with intent contract
  ▸ BUILD      Execute implementation on deterministic rails
    TEST       Run factorial stress testing against scenarios
    CERTIFY    Human sign-off (tier-appropriate review)
    DEPLOY     Production deployment with gates
    MAINTAIN   Continuous flywheel + drift detection
```

## Skills

### Core Pipeline (9 skills)

| Skill | Phase | What It Does |
|-------|-------|-------------|
| `forge-start` | IDEA | Capture intent, classify trust tier, route to next phase |
| `forge-help` | Any | "What should I do next?" — phase-aware navigation |
| `codebase-discovery` | DISCOVER | Brownfield behavioral snapshot (6-layer exploration) |
| `spec-architect` | SPEC | Full spec with intent contracts, eval scenarios, trust tier classification |
| `spec-writer` | SPEC | Streamlined spec — no intent layer, faster for Tier 1-2 |
| `stress-test` | TEST | Factorial stress testing — 22 variation types, 4 failure modes |
| `intent-spec` | SPEC | Agent intent specification — value hierarchies, decision boundaries, drift detection |
| `intent-audit` | Any | Organizational AI maturity audit — three-layer assessment |
| `build-orchestrator` | BUILD | Spec-tests-code pipeline with 4-layer eval stack |

### Extended Skills (17 skills)

| Skill | Category | What It Does |
|-------|----------|-------------|
| `intent-gap-diagnostic` | Intent | 10-min rapid diagnostic — find your biggest AI intent gap |
| `personal-intent-layer-builder` | Intent | Build a reusable personal intent document for AI collaboration |
| `ai-workflow-capability-map` | Intent | Map team workflows into agent-ready / augmented / human-only |
| `insight-to-action-compression-map` | Analysis | Map bottlenecks, redesign compressed workflows |
| `harness-simulator` | Analysis | Planner-Worker-Judge multi-pass decomposition with self-critique |
| `ai-difficulty-rapid-audit` | Analysis | 10-min audit — map work across difficulty axes |
| `problem-difficulty-decomposition` | Analysis | Deep decomposition into 7 difficulty axes |
| `ai-workflow-optimizer` | Analysis | Evaluate AI usage against difficulty profile |
| `agent-stack-opportunity-mapper` | Analysis | Map business against 5-layer agent infrastructure stack |
| `agent-readiness-audit` | Analysis | Technical audit of agent-readiness (content, discovery, API, security) |
| `agent-economics-analyzer` | Analysis | Evaluate task viability for agent automation |
| `ai-dev-level-assessment` | Organization | Diagnose team's AI-assisted dev maturity (Level 0-5) |
| `ai-native-org-redesign` | Organization | Redesign engineering org for AI-native development |
| `legacy-migration-roadmap` | Organization | Phased brownfield modernization plan |
| `ai-dev-talent-strategy` | Organization | Career/talent strategy for the AI-native era |
| `web-fork-strategic-briefing` | Strategy | Strategic briefing on agent web fork impact |
| `ai-output-taste-builder` | Quality | Build domain-specific "taste" for evaluating AI output |

**26 skills total.** Each loads only when invoked — zero context window bloat.

## Trust Tiers

Every project gets a trust tier. The tier scales everything downstream.

| Tier | Risk Level | Example | Eval Rigor |
|------|-----------|---------|------------|
| 1 | Nothing bad happens | Hobby project, prototype | Base scenarios only |
| 2 | Time or money lost | SaaS, client work | 2 variations/scenario + intent recommended |
| 3 | Legal/financial/reputation risk | Compliance, finance | 3 variations + intent required + domain review |
| 4 | Irreversible harm | Healthcare, safety-critical | 5 variations + all eval layers + expert sign-off |

## The Methodology

Attacca Forge encodes a development methodology, not just prompts:

- **[Spec-Driven Development](docs/methodology/spec-driven-development.md)** — The Spec-Tests-Code triangle
- **[Trust Tiers](docs/methodology/trust-tiers.md)** — Classify by risk, scale evaluation to stakes
- **[Factorial Stress Testing](docs/methodology/factorial-stress-testing.md)** — 22 variation types expose hidden failures
- **[The Four Failure Modes](docs/methodology/failure-modes.md)** — Inverted U, reasoning-output disconnect, anchoring bias, guardrail inversion
- **[Intent Engineering](docs/methodology/intent-engineering.md)** — Encode organizational judgment into machine-actionable specs
- **[Progressive Autonomy](docs/methodology/progressive-autonomy.md)** — Shadow mode to full autonomy, earned through evaluation

## Example Output

- [Tier 2 SaaS Notification System](examples/tier-2-saas-spec.md) — Complete spec with behavioral scenarios, variations, and intent contract
- [Stress Test Matrix](examples/stress-test-matrix.md) — Factorial test with 16 variations across 3 scenarios

## CLI Commands

```bash
npx attacca-forge init       # Interactive project setup
npx attacca-forge install    # Install skills to Claude Code
npx attacca-forge status     # Pipeline phase + next steps
npx attacca-forge help       # Full command reference
```

## The Attacca Ecosystem

**Attacca Forge** designs and evaluates agents. *What should this agent do? How do we know it works?*

**[Attacca Claw](https://github.com/attacca-ai/attacca-claw-desktop)** executes agents. *How does a non-technical user interact with an autonomous agent safely?*

Independent tools that work together.

## Attribution

Built on frameworks by:
- **Nate Jones** — Spec-driven development methodology and intent engineering
- **Drew Breunig** — Spec-Tests-Code triangle
- **Mount Sinai Health System** — Failure mode taxonomy from factorial design study (Nature Medicine, 2026)

## License

MIT — see [LICENSE](LICENSE)
