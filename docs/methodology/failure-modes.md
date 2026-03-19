# The Four Failure Modes

> Your agent knows the answer and sometimes it recommends the opposite thing.

These four failure modes were identified through a factorial design study that tested an AI health system across 960 controlled variations. They are domain-general — they apply to any agent system, not just healthcare.

## FM-1: The Inverted U

**Pattern**: The agent performs best on routine, middle-of-distribution cases and worst at the extremes — where stakes are highest.

**Why it happens**: LLMs are trained on distributions where the middle is densely represented and the extremes are sparse. They perform best exactly where performance matters least.

**How to detect**: Compare accuracy on extreme cases vs. mid-range cases (the Inverted U Index). If the ratio is below 0.8, your agent has blind spots at the tails.

**Examples**:
- Accounts payable agent processes routine invoices perfectly, misses the slightly-modified duplicate
- Claims agent handles fender benders but can't detect the third claim from the same address in 14 months
- The health study: 93% accuracy on semi-urgent cases, 48% on emergencies

**Stressors that expose it**: SE-01 (near-miss to extreme), SE-06 (routine packaging of extreme)

## FM-2: Knows But Doesn't Act

**Pattern**: The agent's reasoning correctly identifies a finding, but the output recommendation contradicts it.

**Why it happens**: Research on chain-of-thought faithfulness reveals that reasoning traces and final outputs operate as semi-independent processes. Studies show models fail to update answers after logically significant changes in reasoning more than 50% of the time. The Oxford AI Governance Initiative has argued that chain of thought is "fundamentally unreliable as an explanation of a model's decision process."

**How to detect**: Deterministic validation rules that compare reasoning to output. If the reasoning contains "enhanced due diligence flag" and the output says "standard risk," escalate.

**Examples**:
- Compliance agent identifies elevated risk in analysis, outputs "standard risk" classification
- Customer service agent identifies known billing error pattern, recommends generic 5-7 day review
- The health study: reasoning said "early respiratory failure," output said "wait 24-48 hours"

**Key insight**: If chain-of-thought faithfulness can't be fixed at the model level, the solution must be architectural. External validation, not self-correction.

**Stressors that expose it**: RO-01 (reasoning contradicts output), RO-02 (early-chain anchoring), RO-03 (confidence without basis)

## FM-3: Social Context Hijacks Judgment

**Pattern**: When a stakeholder minimizes severity or applies social pressure, the agent shifts its recommendation — individually defensible but systematically biased.

**Why it happens**: Any agent that processes inputs combining structured data with unstructured human language is vulnerable. The structured data should drive the decision. The unstructured language creates a framing effect that anchors the response.

**How to detect**: Run the same scenario with and without the social context cue. If the output shifts, measure the magnitude. The health study found an odds ratio of 11.7 — roughly 12x more likely to inappropriately de-escalate.

**Examples**:
- Vendor selection shifts when a VP note says "I'm confident this is the right choice"
- Lending risk assessment shifts when employer letter describes applicant as "valued longtime employee"
- The health study: when a family member said "the patient looks fine," triage de-escalated dramatically

**Key insight**: Without controlled variation testing (same scenario ± anchoring input), this bias is invisible on standard evaluations.

**Stressors that expose it**: SP-01 through SP-04 (authority, peer, client, expert), FA-01 through FA-04 (positive, negative, hedging, numerical)

## FM-4: Guardrails Fire on Vibes, Not Risk

**Pattern**: Safety mechanisms match surface-level language patterns (emotional keywords, alarming phrases) rather than actual risk taxonomy. Alerts are inverted relative to actual risk.

**Why it happens**: Guardrails are often trained on surface features (keyword density, emotional tone) rather than structured risk assessment. They test for the appearance of safety, not actual safety.

**How to detect**: Test with disguised severity (critical issue in calm packaging) and surface alarm (benign issue with alarming language). If guardrails fire on the surface alarm but miss the disguised severity, they're inverted.

**Examples**:
- Security agent flags email labeled "confidential financial data" (actually a public press release) but passes 50K customer records exported to personal Dropbox described as "backup"
- The health study: crisis alerts fired more reliably for vague emotional distress than for concrete, detailed self-harm plans

**Key insight**: The system will tell you it's doing well and have grounds for that assessment. You need domain knowledge to override.

**Stressors that expose it**: SE-05 (disguised severity), SE-06 (routine packaging of extreme)

## Using Failure Modes in Practice

Every behavioral scenario in a spec should target at least one failure mode. For Tier 4 systems, all four failure modes must be covered across the scenario set.

The `stress-test` skill generates a complete variation matrix with failure mode mapping for any set of behavioral scenarios.

## Attribution

- **Mount Sinai Health System** — Failure mode identification from their factorial design study (Ramaswamy et al., Nature Medicine, 2026)
- **Nate Jones** — Failure mode generalization to enterprise agent systems
- **Oxford AI Governance Initiative** — Chain-of-thought faithfulness research (FM-2)
