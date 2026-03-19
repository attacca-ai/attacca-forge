# Trust Tiers

A classification system that scales evaluation rigor to the stakes of the system being built.

## The Four Tiers

### Tier 1 — Deterministic
**Worst case**: Annoyance, user retries
**Examples**: Internal tooling, dev utilities, content formatters
**Eval depth**: 7 base behavioral scenarios (3 happy, 2 error, 2 edge). No contextual variations required.
**Autonomy**: Full auto-execute. Agent acts without review.

### Tier 2 — Constrained
**Worst case**: Wasted time or resources (recoverable)
**Examples**: SaaS features, reporting dashboards, workflow automation
**Eval depth**: Base scenarios + at least 2 contextual variations per scenario. Structural edge cases mandatory (near-miss to extreme, tool failure, contradictory data).
**Autonomy**: Auto-execute with logging. Agent acts, results logged for sampling.

### Tier 3 — Open
**Worst case**: Financial or reputational damage (painful but survivable)
**Examples**: Customer-facing products, financial tools, recommendation systems
**Eval depth**: Base scenarios + at least 3 variations per scenario (social pressure, framing, structural mandatory). Deterministic validation rules for key outputs. Ground truth and failure mode targets defined.
**Autonomy**: Human oversight. Agent recommends, human approves critical decisions.

### Tier 4 — High-Stakes
**Worst case**: Legal liability, safety risk, irreversible harm
**Examples**: Healthcare systems, compliance tools, safety-critical operations, financial trading
**Eval depth**: Base scenarios + at least 5 variations per scenario (all categories + mandatory reasoning-output alignment checks). Deterministic validation rules for ALL outputs. Full failure mode coverage map. Domain expert review required.
**Autonomy**: Human mandatory. Agent processes, human decides. Shadow mode for new deployments.

## How to Classify

Ask: **"What's the worst realistic outcome if this system gets it wrong?"**

The answer maps directly to a tier. When in doubt, classify one tier higher — it's cheaper to over-evaluate than to miss a critical failure.

## What the Tier Determines

| Aspect | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|--------|--------|--------|--------|--------|
| Scenarios | 7 base | + 2 variations each | + 3 variations each | + 5 variations each |
| Validation rules | Optional | Optional | Required (key outputs) | Required (all outputs) |
| Failure mode mapping | No | No | Recommended | Required |
| Domain expert review | No | No | No | Required |
| Shadow mode | No | No | No | Required for new deploy |
| Evaluation thresholds | None | Variation stability | + Reasoning alignment | + Anchoring susceptibility |

## Origin

The trust tier system derives from research on LLM hallucination patterns. The core finding: over-compliance (the model trying too hard to give an answer) is the root cause of most failures. Tier classification ensures that the systems most vulnerable to over-compliance get the most rigorous evaluation.

The four failure modes (FM-1 through FM-4) that the evaluation framework tests for were identified in a landmark factorial design study on AI triage by the Mount Sinai Health System (Nature Medicine, 2026).
