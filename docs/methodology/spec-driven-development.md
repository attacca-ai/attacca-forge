# Spec-Driven Development

> The bottleneck in AI-assisted development has moved from implementation speed to specification quality.

## The Triangle

```
     SPEC
    /    \
 TESTS ── CODE
```

Changes in any node must propagate to the others. A spec change invalidates tests. A test failure implies a spec gap or a code bug. Code that doesn't match the spec is wrong — even if it works.

## Why This Matters for AI Agents

AI coding agents don't ask clarifying questions — they make assumptions. Every ambiguity in a spec becomes an assumption in the code. The difference between Level 3 ("developer reviews every diff") and Level 5 ("developer evaluates outcomes") is the quality of what goes into the machine.

## Behavioral Scenarios Replace Test Cases

Traditional test cases describe implementation details. Behavioral scenarios describe observable outcomes from an external perspective:

- "When a user submits a form with an invalid email, the system displays an error message within 200ms" (behavioral)
- "The `validateEmail()` function throws a `ValidationError`" (implementation)

Behavioral scenarios cannot be gamed by an agent that reads them. They test what the system does, not how it does it.

## The Spec Architect Process

1. **Capture** the rough idea
2. **Question** systematically (context, behavior, edge cases, evaluation criteria, organizational intent)
3. **Classify** by trust tier (determines rigor of everything downstream)
4. **Produce** the specification (behavioral contract, scenarios with variations, intent contract, ambiguity warnings)
5. **Review** for remaining ambiguities

## Trust Tiers

Every system gets classified by the worst realistic outcome if it fails:

| Tier | Risk Level | Scenario Depth |
|------|-----------|---------------|
| Tier 1 (Deterministic) | Annoyance/retry | 7 base scenarios |
| Tier 2 (Constrained) | Wasted resources | + 2 variations per scenario |
| Tier 3 (Open) | Financial/reputational damage | + 3 variations + validation rules |
| Tier 4 (High-Stakes) | Legal/safety/irreversible harm | + 5 variations + full failure mode coverage |

See [trust-tiers.md](trust-tiers.md) for the full classification system.

## Attribution

- **Drew Breunig** — Spec-Tests-Code triangle concept
- **Nate Jones** — Spec architect methodology and intent engineering integration
