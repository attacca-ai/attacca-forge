# Intent Engineering

> The gap between "resolve tickets fast" and "build lasting customer relationships" is the gap that breaks AI deployments.

## The Problem

A spec without intent produces software that is technically correct but organizationally misaligned. When Klarna deployed AI customer service agents, they resolved tickets 3x faster and cut costs dramatically. The agents were technically excellent. They were also destroying customer relationships — optimizing for the measurable metric (resolution speed) while ignoring the unmeasured value (relationship quality).

This is the Klarna pattern: AI succeeding brilliantly at the wrong objective.

## Two Layers of Intent

Intent engineering operates at two levels:

### Layer 1: Organizational Intent

Translate company goals into machine-actionable infrastructure.

**The Cascade of Specificity** — for each organizational goal, answer:
1. What are the context-specific signals? (not vague metrics)
2. Where does the data live?
3. What actions is the agent authorized to take?
4. What trade-offs can it make?
5. What are the hard boundaries?

**The Capability Map** — categorize all workflows as:
- **Agent-Ready**: Fully automatable with current intent encoding
- **Agent-Augmented**: Agent assists, human decides
- **Human-Only**: Requires judgment that can't yet be encoded

### Layer 2: Agent Instruction Intent

Encode safety and behavioral constraints per-agent.

**The Three Critical Questions** (ask for every agent):
1. What should the agent NOT do, even if it accomplishes the goal?
2. Under what circumstances should it STOP and ask?
3. If goal and constraint conflict, which WINS?

**The Value Hierarchy** — explicitly ranked priorities:
```
1. Hard boundaries (NEVER cross)
2. Safety constraints (escalate before violating)
3. Quality standards (meet before optimizing speed)
4. Primary goal (accomplish within above)
5. Efficiency (optimize only after 1-4 satisfied)
```

## The Key Outputs

### Decision Boundary Matrix

For each decision an agent makes, define the full autonomy spectrum:

| Decision | Autonomous | Supervised | Escalate | Shadow Mode | Promotion Criteria |
|----------|-----------|-----------|----------|-------------|-------------------|

Shadow mode is where the agent processes but doesn't act — learning from human decisions. Promotion criteria define the measurable thresholds for granting more autonomy over time.

### The Klarna Checklist

Run regularly on any autonomous agent:
- What is this agent optimizing for?
- Is that what we actually value, or just what's measurable?
- What organizational values are currently unencoded?
- Where could this agent succeed at the wrong thing?

### Drift Detection

Specific, observable signals that the agent is technically performing but strategically drifting. The early warnings that something has gone Klarna-shaped.

## Connection to Evaluation

The intent specification IS the evaluation rulebook. The value hierarchy, prohibited paths, escalation thresholds, and hard boundaries become the ground truth that the `stress-test` skill validates against. Any change to intent requires re-running factorial stress tests.

## Attribution

- **Nate Jones** — Intent engineering framework: organizational intent decomposition, cascade of specificity, the three critical questions, value hierarchies, and the Klarna diagnostic
