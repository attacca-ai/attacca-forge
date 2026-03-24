# Getting Started with Attacca Forge

## Installation

### Option A: npx (recommended)

```bash
# Set up your project
npx attacca-forge init

# Install skills into Claude Code
npx attacca-forge install
```

Restart Claude Code after installation.

### Option B: Manual install

```bash
git clone https://github.com/attacca-ai/attacca-forge.git
cd attacca-forge
./install.sh        # macOS/Linux/WSL
# or
./install.ps1       # Windows PowerShell
```

Restart Claude Code after installation.

## Your First Project

### 1. Initialize

```bash
npx attacca-forge init
```

The setup wizard asks 4 questions:
- **Project name** — what you're building
- **Greenfield or brownfield** — new code or modifying existing
- **Trust tier** — what happens if it's wrong (1=nothing, 4=irreversible harm)
- **Experience level** — calibrates how much the skills explain

This creates `.attacca/config.yaml` and `.attacca/context.md` in your project root.

### 2. Start the Pipeline

In Claude Code, say:

```
help me start
```

The `forge-start` skill captures your idea and routes you to the next phase:
- **Greenfield** → SPEC phase (write behavioral specification)
- **Brownfield** → DISCOVER phase (map existing codebase first)

### 3. Follow the Pipeline

```bash
npx attacca-forge status
```

Shows where you are and what to do next:

```
  Pipeline:

  ✓ IDEA       Capture your idea and classify risk
  ▸ SPEC       Write behavioral specification with intent contract
    BUILD      Execute implementation on deterministic rails
    TEST       Run factorial stress testing against scenarios
    CERTIFY    Human sign-off (tier-appropriate review)
    DEPLOY     Production deployment with gates
    MAINTAIN   Continuous flywheel + drift detection

  Next: /spec-architect
        Write behavioral specification with intent contract
```

At any point, say "what should I do next" in Claude Code to invoke `forge-help`.

## Choosing Between Spec Skills

| Skill | When to Use | Output |
|-------|------------|--------|
| `spec-architect` | Full spec with organizational alignment + eval (17 questions) | Behavioral Contract + Intent Contract + Eval Thresholds |
| `spec-writer` | Quick implementation spec (13 questions) | Behavioral Contract + Ambiguity Warnings |

**Rule of thumb**: Use `spec-architect` for anything Tier 2+ or any system involving autonomous decisions. Use `spec-writer` for Tier 1 features where you just need a clean spec fast.

## Trust Tiers

Your trust tier (set during init) scales everything automatically:

| Tier | What It Means | Spec Rigor | Stress Test | Intent | Sign-Off |
|------|--------------|-----------|-------------|--------|----------|
| 1 | Nothing bad happens | 7 scenarios | Skip | Skip | Deploy only |
| 2 | Time/money lost | 7 scenarios + 2 variations each | Required | Recommended | Spec + deploy |
| 3 | Legal/financial risk | 7+ scenarios + 3 variations | Required | Required | Spec + intent + test + deploy |
| 4 | Irreversible harm | 7+ scenarios + 5 variations | Required | Required | Full review + domain expert |

## All Skills

### Core Pipeline
- `/forge-start` — IDEA phase onboarding
- `/forge-help` — Phase-aware "what's next?"
- `/codebase-discovery` — Brownfield behavioral snapshot
- `/spec-architect` — Full behavioral spec with intent
- `/spec-writer` — Streamlined spec (no intent)
- `/stress-test` — Factorial stress testing
- `/intent-spec` — Agent intent specification
- `/intent-audit` — Organizational AI maturity audit
- `/build-orchestrator` — Build pipeline with eval stack

### Extended (17 skills)
Intent engineering, analysis, organizational design, and quality evaluation skills. Run `/forge-help` or `npx attacca-forge help` for the full list.

## Trigger Keywords

Skills activate on natural language. Just say what you need:

- "spec this out" → `spec-architect`
- "quick spec" → `spec-writer`
- "stress test my scenarios" → `stress-test`
- "what should I do next" → `forge-help`
- "discover this codebase" → `codebase-discovery`
- "help me start" → `forge-start`

## CLI Reference

```bash
npx attacca-forge init       # Interactive project setup
npx attacca-forge install    # Install skills to Claude Code
npx attacca-forge status     # Pipeline phase + next steps
npx attacca-forge help       # Full command reference
npx attacca-forge --version  # Show version
```
