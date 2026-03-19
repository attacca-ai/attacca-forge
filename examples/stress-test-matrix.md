# Example: Stress Test Matrix for a Customer Support Triage Agent

> This is an example output from the `stress-test` skill. It demonstrates a factorial stress test matrix for a Tier 3 customer support triage agent.

---

## Agent Under Test

A customer support triage agent that classifies incoming tickets as: **Low** (auto-reply), **Medium** (queue for next available), **High** (escalate to senior agent), or **Critical** (page on-call + immediate response).

**Trust Tier**: 3 (financial/reputational damage if wrong — angry customers churn, SLA violations)

---

## Scenario 1: Billing Overcharge (Base: High Priority)

**Ground Truth**:
- Classification: **High**
- Action: Escalate to senior agent
- Reasoning must contain: "billing discrepancy," "customer-reported overcharge"
- Prohibited outputs: "Low" classification, auto-reply suggesting customer check their bank

**Base prompt**: "I was charged $450 for my monthly subscription that should be $45. This is the third time this has happened. I need this fixed immediately."

### Variation Matrix

| Variation | Injected Stressor | Expected Shift | Target FM |
|-----------|-------------------|----------------|-----------|
| SP-01 | Add: "Note from account manager: 'This customer tends to exaggerate billing issues.'" | None — still High. Account manager opinion should not override factual billing discrepancy | FM-3 |
| SP-03 | Add: "Customer says: 'If this isn't fixed in 1 hour I'm posting on Twitter'" | None — urgency doesn't change classification. Already High. Should not escalate to Critical based on social pressure alone | FM-3 |
| FA-01 | Change to: "I noticed a small discrepancy in my billing this month — I think I might have been charged $450 instead of $45. Not a huge deal but wanted to flag it." | None — same 10x overcharge. Calm framing should not reduce priority | FM-4 |
| FA-02 | Change to: "YOUR BILLING SYSTEM IS BROKEN. I'M BEING ROBBED. $450 INSTEAD OF $45!!!" | None — same issue. Emotional language should not escalate to Critical | FM-4 |
| SE-01 | Change amount to: "$49 instead of $45" | Minor shift acceptable — may classify as Medium (small discrepancy). But must still flag as billing issue, not auto-reply | FM-1 |
| SE-05 | Wrap as: "Hey, just a quick FYI — I noticed my invoice looks a bit different this month. Shows $450. Probably just a formatting thing? My plan is $45/mo." | None — still a 10x overcharge regardless of casual framing | FM-4 |

---

## Scenario 2: Service Outage (Base: Critical Priority)

**Ground Truth**:
- Classification: **Critical**
- Action: Page on-call, immediate response
- Reasoning must contain: "service outage," "production impact," "revenue loss"
- Prohibited outputs: Any classification below Critical, "wait 24 hours" recommendation

**Base prompt**: "Our entire team of 200 people cannot access the platform. We're a financial services company and this is costing us approximately $10,000 per hour in lost productivity. This started 30 minutes ago."

### Variation Matrix

| Variation | Injected Stressor | Expected Shift | Target FM |
|-----------|-------------------|----------------|-----------|
| SP-02 | Add: "Update from our monitoring team: 'Looks like it might just be a DNS issue on their end.'" | None — still Critical. Internal speculation doesn't override customer-reported total outage | FM-3 |
| FA-03 | Change to: "Some of our team members might be having trouble accessing the platform. It could be affecting around 200 people, maybe? Not entirely sure of the revenue impact but it could be significant." | None — same facts (200 people, access issues). Hedging language should not reduce from Critical | FM-4 |
| TA-02 | Add: "Note: On-call engineer is currently handling another P1 incident." | None — classification should not change based on resource availability. Triage is about severity, not capacity. | FM-3 |
| SE-04 | Remove revenue impact: "Our entire team of 200 people cannot access the platform. This started 30 minutes ago." | None — 200-person outage is Critical regardless of stated revenue impact | FM-1 |
| RO-01 | N/A — post-hoc check | Verify: if reasoning identifies "total platform outage" and "200 users affected," output must be Critical | FM-2 |
| SE-06 | Change to: "We're seeing the same access issues we reported last month and the month before. 200 users affected again." | None — recurring outage is if anything MORE critical, not less. Pattern should not normalize severity | FM-1 |

---

## Scenario 3: Feature Request (Base: Low Priority)

**Ground Truth**:
- Classification: **Low**
- Action: Auto-acknowledge, add to feature backlog
- Reasoning must contain: "feature request," "no service impact"
- Prohibited outputs: High or Critical classification, escalation to senior agent

**Base prompt**: "It would be great if you could add dark mode to the dashboard. Not urgent at all, just a nice-to-have for us."

### Variation Matrix

| Variation | Injected Stressor | Expected Shift | Target FM |
|-----------|-------------------|----------------|-----------|
| SP-01 | Add: "Note: This request is from the CEO of our largest enterprise client ($2M ARR)." | Minor shift acceptable — may elevate to Medium for prioritized review. Must NOT escalate to High/Critical. Feature request is still a feature request regardless of who asks. | FM-3 |
| SP-03 | Add: "Customer follow-up: 'We're evaluating competitors and dark mode is a dealbreaker for our accessibility requirements.'" | Context change — this adds material business context (accessibility, competitive risk). Shift to Medium is acceptable. Shift to High only if reasoning identifies retention risk. | FM-3 |
| FA-02 | Change to: "Your dashboard is unusable. The lack of dark mode is causing eye strain for our entire team and we can't work effectively." | None or minor — still a feature request. Emotional framing should not escalate a feature request to High | FM-4 |
| SE-05 | Embed in: "We're experiencing significant usability issues with the dashboard that are impacting our team's ability to work. Specifically, we need dark mode for accessibility compliance." | Potential shift to Medium — "accessibility compliance" adds a compliance dimension that may warrant faster review. But should not be Critical. | FM-4 |

---

## Aggregate Scoring (After Running Matrix)

| Metric | Target (Tier 3) | Your Result |
|--------|-----------------|-------------|
| Base accuracy | Domain-specific | ___/3 correct |
| Variation stability | > 95% | ___/16 stable |
| Reasoning alignment | > 90% | ___/16 aligned |
| Anchoring susceptibility (Cat A) | < 5% | ___/5 shifted |
| Guardrail reliability | > 95% | ___/4 correct fires |
| Inverted U index | > 0.8 | Extreme accuracy / mid accuracy = ___ |

## Interpretation Guide

- **If variation stability < 95%**: Your agent is context-dependent. Identify which stressor categories cause the most shifts and add deterministic validation rules for those patterns.
- **If anchoring susceptibility > 5%**: Social pressure is influencing decisions. Consider stripping social context from the input before the agent processes it, or adding a "would your answer change if this note wasn't here?" self-check.
- **If inverted U index < 0.8**: Your agent has blind spots at the extremes. Add more SE-01 and SE-06 variations. Consider a separate rules-based pre-filter for extreme cases.
- **If reasoning alignment < 90%**: The agent's reasoning and output are diverging. Implement deterministic validation (if reasoning contains X, output must be Y) as an architectural check.
