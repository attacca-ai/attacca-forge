# Architecture — How the Layers Fit Together

> Design → Evaluate → Align → Orchestrate

## The Full Pipeline

```
Raw Idea
    │
    ▼
┌──────────────────┐
│   SPEC STUDIO     │  spec-architect / spec-writer
│                    │  "What should this system do?"
│   Trust tier       │
│   Behavioral       │
│   contract         │
│   Scenarios with   │
│   variations       │
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│   EVAL GATE       │  stress-test
│                    │  "Does it work under pressure?"
│   Factorial matrix │
│   Failure mode     │
│   coverage         │
│   Aggregate        │
│   metrics          │
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│   INTENT LAYER    │  intent-spec / intent-audit
│                    │  "What should it optimize for?"
│   Value hierarchy  │
│   Decision         │
│   boundaries       │
│   Drift detection  │
└────────┬──────────┘
         │
         ▼
┌──────────────────┐
│   BUILD FLOOR     │  build-orchestrator
│                    │  "How does it earn autonomy?"
│   Progressive      │
│   autonomy         │
│   Deterministic    │
│   validation       │
│   Continuous       │
│   flywheel         │
│   Quality gates    │
└────────┬──────────┘
         │
         ▼
    DELIVERY
```

## The Spec-Tests-Code Triangle

At the core of everything is the triangle. Changes in any node must propagate to the others:

```
         SPEC
        /    \
     TESTS ── CODE
```

- **Spec changes** → tests must be updated → code must be re-verified
- **Test failures** → either the code is wrong or the spec has a gap
- **Code changes** → must be validated against spec and tests

The `spec-architect` skill generates the spec. The `stress-test` skill generates the tests (with factorial variations). The coding agent generates the code. The `build-orchestrator` keeps the triangle in sync.

## Layer Dependencies

Each layer builds on the previous:

```
Layer 1: Spec        → Defines WHAT the system does
Layer 2: Eval        → Validates HOW it handles pressure
Layer 3: Intent      → Encodes WHY it exists (and what to optimize for)
Layer 4: Orchestrate → Governs the full lifecycle (design → deploy → monitor)
```

You can adopt layers incrementally:
- **Layer 1 alone** = better specs, fewer agent assumptions
- **Layers 1+2** = specs validated under contextual stress
- **Layers 1+2+3** = specs + eval + organizational alignment
- **All four layers** = production-grade agent deployment pipeline

## The Ecosystem

```
DESIGN (Forge)              EXECUTE (Claw)              OPERATE (???)
┌────────────────────┐      ┌────────────────────┐      ┌────────────────────┐
│ Spec Studio         │─────→│ Agent Runtime       │─────→│                    │
│ Eval Gate           │      │ Trust Tiers         │      │                    │
│ Intent Layer        │      │ Task Execution      │      │                    │
│ Build Floor         │      │ Human Supervision   │      │                    │
└────────────────────┘      └────────────────────┘      └────────────────────┘

  attacca-forge               attacca-claw-desktop           ???
  (methodology)               (runtime)                     (coming)
```

**Attacca Forge** designs and evaluates agents — the methodology.
**[Attacca Claw](https://github.com/attacca-ai/attacca-claw-desktop)** executes agents — the runtime.
The operate layer completes the cycle.

## What This Architecture Handles

| Challenge | Which Layer Solves It |
|-----------|---------------------|
| Agent makes assumptions | Layer 1 (Spec) — explicit behavioral contracts |
| Agent fails on edge cases | Layer 2 (Eval) — factorial stress testing on distribution tails |
| Agent optimizes for wrong thing | Layer 3 (Intent) — value hierarchy + Klarna checklist |
| Agent's reasoning doesn't match its output | Layer 4 (Orchestrate) — deterministic validation rules |
| Agent degrades after model update | Layer 4 (Orchestrate) — model change protocol |
| New failure pattern in production | Layer 4 (Orchestrate) — continuous flywheel catches and encodes it |
| Agent needs more/less autonomy | Layer 4 (Orchestrate) — progressive autonomy with promotion/demotion |

## What This Architecture Does NOT Handle

This is a methodology toolkit for designing, evaluating, and deploying agents. It does not include:

- **Multi-project orchestration** — managing many agents across many projects simultaneously
- **Client delivery workflows** — intake, billing, handoff, maintenance cycles
- **Team coordination** — assigning work to humans and agents across an organization
- **Knowledge compounding** — learning from one project to improve the next systematically

These are operational challenges that emerge when you run the methodology at scale.
