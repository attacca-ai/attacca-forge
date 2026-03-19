# Progressive Autonomy

> The question isn't "should this agent be autonomous?" It's "how does this agent earn autonomy over time?"

## The Problem with Binary Autonomy

Most agent deployments pick one of two modes: fully autonomous or fully supervised. Both are wrong for high-stakes systems.

- **Fully autonomous**: Fast, cheap, but you discover failures in production (where the cost is highest)
- **Fully supervised**: Safe, slow, expensive, and defeats the purpose of having an agent

Progressive autonomy is the middle path: the agent earns trust through demonstrated performance, measured against evaluation criteria.

## The Five Modes

| Mode | Agent Acts? | Human Involved? | When to Use |
|------|------------|----------------|-------------|
| **Shadow** | Processes, does NOT act | Human does the real work | New deployments, post-model-update, unfamiliar scenario types |
| **Supervised** | Recommends | Human approves/overrides | Edge cases, medium-stakes decisions |
| **Auto with logging** | Acts autonomously | Results logged for sampling | Routine decisions, low-medium stakes |
| **Full auto** | Acts autonomously | No review | High-confidence, low-stakes, proven track record |
| **Escalate** | Flags and stops | Human takes over entirely | Detected anomalies, hard boundary proximity, novel scenarios |

## Shadow Mode: The Key Innovation

Shadow mode is where the agent processes every case but doesn't act. The human does the real work. The agent's output is compared to the human's decision after the fact.

This gives you:
- **Baseline agreement rate**: How often does the agent agree with the human?
- **Failure pattern identification**: Where does it diverge? On what kinds of cases?
- **Risk-free evaluation**: No customer impact, no compliance risk, no damage

Shadow mode should run for a minimum period (typically 30 days or 100 cases, whichever comes first) before any promotion.

## Promotion Criteria

Decisions move between modes based on measurable thresholds:

```
Shadow → Supervised:
  - 90% agreement with human decisions over 30 consecutive cases
  - No hard boundary violations
  - Domain expert sign-off

Supervised → Auto with logging:
  - 95% approval rate (human accepts recommendation) over 50 cases
  - Variation stability > 90% on stress test
  - No escalation-worthy failures missed

Auto with logging → Full auto:
  - 99% accuracy on sampled audits over 90 days
  - Anchoring susceptibility < 5%
  - Reasoning alignment > 95%
```

## Demotion Triggers

Autonomy can be revoked:

- **Model update**: Any model change → restart shadow mode for affected decision types
- **Drift detection**: Alignment metrics drop > 10% from baseline → demote one level
- **Hard boundary violation**: Any violation → immediate escalate mode + investigation
- **New scenario type**: Agent encounters case type not in training distribution → escalate

## Connection to Trust Tiers

| Trust Tier | Starting Mode | Max Autonomous Mode |
|-----------|--------------|-------------------|
| Tier 1 | Auto with logging | Full auto |
| Tier 2 | Auto with logging | Full auto (after baseline) |
| Tier 3 | Supervised | Auto with logging (earned) |
| Tier 4 | Shadow | Supervised (earned, never full auto) |

Tier 4 systems never reach full autonomy. The human stays in the loop permanently. Shadow mode is the starting point, and supervised mode is the ceiling.

## The Continuous Flywheel

Progressive autonomy feeds the evaluation flywheel:

1. Shadow mode generates comparison data (agent vs. human)
2. Disagreements become new stress test scenarios
3. Stress tests validate the agent under contextual pressure
4. Results either confirm promotion or identify training gaps
5. Promoted decisions free human capacity for harder cases
6. Harder cases generate new shadow mode comparisons

The system gets smarter every cycle. The eval library grows from real production data.

## Attribution

- **Nate Jones** — Progressive autonomy architecture, delegation frameworks, and the four-layer evaluation stack
- **Mount Sinai Health System** — Validation of the approach through factorial design methodology
