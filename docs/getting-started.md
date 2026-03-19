# Getting Started with Attacca Forge

## Installation

### Automatic (recommended)

```bash
git clone https://github.com/attacca-ai/attacca-forge.git
cd attacca-forge
./install.sh        # macOS/Linux/WSL
# or
./install.ps1       # Windows PowerShell
```

Restart Claude Code after installation.

### Manual

1. Copy the `plugins/attacca-forge/` directory to `~/.claude/plugins/local/attacca-forge/plugins/attacca-forge/`
2. Copy the `.claude-plugin/` directory to `~/.claude/plugins/local/attacca-forge/.claude-plugin/`
3. Restart Claude Code

## Your First Spec

Once installed, just tell Claude Code what you want to build:

```
I want to build a notification system that alerts users when their subscription is about to expire
```

Claude will automatically invoke the `spec-architect` skill and walk you through:

1. **Context** — who it's for, what it connects to, trust tier
2. **Behavior** — primary use case, non-negotiables, explicit non-behaviors
3. **Edge cases** — failure modes, dependency failures, business rule exceptions, social context risks
4. **Evaluation** — human evaluation criteria, subtle failures, performance, reasoning verification
5. **Intent** — organizational goal, trade-offs, hard boundaries, delegation framework, drift detection

The output is a complete specification document ready to hand to any AI coding agent.

## Choosing Between Skills

| Skill | When to Use | Groups | Output |
|-------|------------|--------|--------|
| `spec-architect` | Full spec with organizational alignment + eval | A-E (17 questions) | Behavioral Contract + Intent Contract + Eval Thresholds |
| `spec-writer` | Quick implementation spec | A-D (13 questions) | Behavioral Contract + Ambiguity Warnings |

**Rule of thumb**: Use `spec-architect` for anything Tier 3+ or any system involving autonomous decisions. Use `spec-writer` for Tier 1-2 features where you just need a clean spec fast.

## Trigger Keywords

You can invoke the skills by including these phrases naturally in your message:

- **spec-architect**: "spec this out", "write a spec", "create a specification", "I want to build..."
- **spec-writer**: "quick spec", "fast spec", "lean spec", "just the spec"

## What's Next

Attacca Forge is a layered toolkit. The spec layer (v0.1) gives you the foundation. Future releases add:

- **Eval layer** — Factorial stress testing to validate your specs against hidden failure modes
- **Intent layer** — Deep organizational alignment for autonomous agents
- **Orchestration layer** — The full spec-tests-code pipeline

Each layer builds on the previous one. You can adopt them incrementally.
