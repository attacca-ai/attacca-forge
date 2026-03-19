# Factorial Stress Testing

> Your agent's accuracy dashboard might say 87%. The inverted U means that number is masking silent failures on the tails of the distribution — precisely where consequential decisions live.

## The Problem

Standard evaluations test each scenario once under clean conditions. This misses three categories of failure that only surface when context varies:

1. **Anchoring bias** — social context shifts the output without changing the facts
2. **Guardrail inversion** — safety mechanisms fire on surface patterns, not actual risk
3. **Inverted U** — performance degrades at extremes where stakes are highest

## The Solution: Factorial Design

Take each behavioral scenario and systematically apply controlled contextual stressors — one at a time. Measure whether the output shifts. If it shifts when it shouldn't, you've found a hidden failure.

This approach was validated in a landmark study where researchers tested an AI health system across 960 variations (60 scenarios × 16 conditions). Standard testing said the system worked. Factorial testing revealed it under-triaged 52% of emergencies and was 12x more likely to inappropriately de-escalate when social pressure was present.

## The Five Stressor Categories

| Category | What It Tests | Example |
|----------|--------------|---------|
| **A: Social/Authority Pressure** | Does someone's opinion shift the output? | "The VP says it's low risk" |
| **B: Framing/Anchoring** | Does language tone shift risk assessment? | Optimistic vs. pessimistic framing of same data |
| **C: Temporal/Access Pressure** | Does urgency or scarcity bypass quality? | "Budget is extremely tight this quarter" |
| **D: Structural Edge Cases** | Does the system handle distribution tails? | Near-miss to extreme, disguised severity |
| **E: Reasoning-Output Alignment** | Does the reasoning match the recommendation? | Agent identifies risk in analysis, recommends ignoring it |

Each category contains 3-6 specific variation types. See the `stress-test` skill for the full library.

## How to Apply

1. Start with your behavioral scenarios (from a spec)
2. Select applicable stressor categories based on trust tier
3. Inject one stressor per variation (never combine — makes failures undiagnosable)
4. For each variation, define whether the correct output should change or remain stable
5. Run the matrix and score with aggregate metrics

## Key Metrics

| Metric | What It Catches |
|--------|----------------|
| **Variation stability** | Overall robustness to contextual pressure |
| **Anchoring susceptibility** | Vulnerability to social/authority influence |
| **Reasoning alignment** | Gap between what the agent thinks and what it does |
| **Guardrail reliability** | Whether safety mechanisms fire on actual risk |
| **Inverted U index** | Performance gap between routine and extreme cases |

## The Continuous Flywheel

Factorial stress testing isn't a one-time event. In production:

1. **LLM-as-judge** evaluates every agent run against the scenario rulebook
2. **Bias toward false positives** — flag more, miss less
3. **Review flagged runs** — true positive → fix; false positive → refine rules
4. **Audit PASSED runs** — the step nobody does. Sample 5-10%. Find what the judge missed.
5. **Feed back** — every real failure becomes a new scenario in the library

The library grows organically from production. Every failure encoded makes the system harder to break.

## Attribution

- **Mount Sinai Health System** — Factorial design methodology (Ramaswamy et al., Nature Medicine, 2026)
- **Nate Jones** — Failure mode analysis and evaluation architecture
