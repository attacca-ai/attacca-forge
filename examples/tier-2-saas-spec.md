# Example: Tier 2 SaaS Notification System Spec

> This is an example output from the `spec-architect` skill. It demonstrates what a complete specification looks like for a Tier 2 (Constrained) system.

---

## System Overview

A subscription expiration notification system that alerts users via email and in-app banner when their SaaS subscription is approaching renewal or expiration. Serves end users of a B2B project management tool. Exists to reduce involuntary churn from expired payment methods and lapsed renewals.

## Behavioral Contract

**Primary flows:**
- When a subscription is within 30 days of expiration, the system sends an email notification to the account owner and displays an in-app banner on next login
- When a subscription is within 7 days of expiration, the system sends a second email with increased urgency and maintains the in-app banner
- When the user clicks "Renew Now" in either email or banner, the system redirects to the billing page with the subscription pre-selected

**Error flows:**
- When the email delivery fails (bounce, invalid address), the system logs the failure and escalates to in-app notification only
- When the billing system is unavailable, the "Renew Now" link displays a "temporarily unavailable" message and retries on next page load

**Boundary conditions:**
- When a user has already renewed before the notification fires, the system suppresses the notification
- When multiple subscriptions exist on one account, notifications are sent per-subscription, not batched
- When a trial subscription expires, notifications use trial-specific language (not renewal language)

## Explicit Non-Behaviors

- The system must not auto-renew subscriptions because the billing team requires explicit user action for compliance reasons
- The system must not send notifications to users who have opted out of email communications because this violates the existing email preference system
- The system must not display pricing in notifications because pricing is dynamic and managed by the billing service

## Integration Boundaries

**Email service (SendGrid):**
- Outbound: recipient, template ID, merge variables (user name, subscription name, expiry date, renewal URL)
- Expected: 202 Accepted response
- Failure: Queue for retry (max 3 attempts, exponential backoff). After 3 failures, log and escalate to in-app only.
- Development: Use SendGrid sandbox mode

**Billing API (internal):**
- Inbound: subscription status, expiry date, renewal URL
- Expected: JSON response with `{status, expires_at, renewal_url}`
- Failure: Cache last known state for up to 24 hours. Display "contact support" if cache expired.
- Development: Use mock API with seeded test data

**User preferences service (internal):**
- Inbound: email opt-in status per user
- Expected: Boolean `email_notifications_enabled`
- Failure: Default to NOT sending (fail safe — don't spam)

## Behavioral Scenarios

### Happy Path 1: Standard 30-day notification
**Setup**: User has active subscription expiring in 30 days, email enabled
**Action**: Daily cron job runs subscription check
**Expected**: Email sent with 30-day template. In-app banner appears on next login. Both contain correct expiry date and renewal link.
**Ground truth**: Email delivered, banner rendered, dates accurate, link resolves to billing page
**Variation (SE-01 — near-miss to extreme)**: Subscription expires in 31 days (just outside window) → no notification sent
**Variation (SE-04 — missing field)**: Billing API returns subscription without `renewal_url` → email sent without renewal link, includes "contact support" fallback
**Failure mode target**: FM-1 (boundary precision at the 30-day edge)

### Happy Path 2: 7-day urgency escalation
**Setup**: User received 30-day email, subscription now 7 days from expiry, has not renewed
**Action**: Daily cron job runs
**Expected**: Second email with urgency template. Banner updates to urgent styling.
**Ground truth**: Urgency template used (not standard), banner color/copy changes
**Variation (FA-01 — positive framing)**: User has auto-pay enabled on a different subscription → system still sends notification for THIS subscription (no false confidence from adjacent subscription state)
**Failure mode target**: FM-4 (guardrail shouldn't suppress based on unrelated subscription state)

### Happy Path 3: User renews before notification
**Setup**: User renews subscription 35 days before expiry
**Action**: Daily cron job runs at 30-day mark
**Expected**: No notification sent. No banner displayed.
**Ground truth**: Zero emails, zero banners for this subscription

### Error 1: Email delivery failure
**Setup**: User's email bounces (invalid address)
**Action**: SendGrid returns 400 error
**Expected**: Failure logged with user ID and error. In-app banner still appears. No retry to same invalid address.

### Error 2: Billing API unavailable
**Setup**: Billing API returns 503 for 6 hours
**Action**: System attempts to check subscriptions
**Expected**: Uses cached subscription data (< 24hr old). Notifications fire based on cached dates. Logs warning about stale data.
**Variation (TA-01 — time pressure)**: Billing API has been down for 25 hours (cache expired) → system skips notification cycle and logs critical alert, does NOT send with stale data
**Failure mode target**: FM-1 (behavior at cache expiry boundary)

### Edge 1: Trial subscription expiry
**Setup**: User on 14-day free trial, day 12
**Action**: Daily cron job runs
**Expected**: Trial-specific email template used. No mention of "renewal" — instead "upgrade" language. Different banner styling.

### Edge 2: Multiple subscriptions, mixed states
**Setup**: User has 3 subscriptions — one expiring in 5 days, one active (90 days), one already expired
**Action**: Daily cron job runs
**Expected**: One 7-day urgency notification for the expiring sub. No notification for active sub. No notification for already-expired sub (handled by separate lapsed-subscription flow).

## Intent Contract

**Organizational objective**: Reduce involuntary churn from lapsed subscriptions by ensuring users are aware and have easy access to renew.

**Success signals**: Renewal rate within 30-day window increases; involuntary churn (expired without user action) decreases; support tickets about "surprise" expirations decrease.

**Trade-off matrix**:
- When notification timing conflicts with user experience (too many emails), favor fewer notifications over coverage — users who feel spammed churn intentionally, which is worse than involuntary churn
- When data freshness conflicts with notification reliability (billing API down), favor skipping a cycle over sending with stale data — incorrect expiry dates destroy trust

**Delegation framework**:

| Decision | Tier |
|----------|------|
| Send scheduled notification | Autonomous |
| Suppress notification (user opted out, already renewed) | Autonomous |
| Retry failed email delivery | Autonomous (max 3) |
| Send notification with cached data > 24hr | Escalate (log critical, skip) |
| Modify notification templates or timing | Supervised (requires product approval) |

**Hard boundaries**:
- The system must NEVER send renewal notifications to users who have opted out of email regardless of churn risk because violating email preferences has legal implications (CAN-SPAM, GDPR)
- The system must NEVER auto-renew or imply auto-renewal because the billing team requires explicit user consent

**Alignment drift detection**: If notification open rates drop below 10% while send volume stays constant, the system may be creating notification fatigue. If renewal rates don't improve despite high open rates, the renewal UX (not notifications) may be the problem — don't increase notification frequency as a response.

## Ambiguity Warnings

1. **Timezone handling**: Unclear whether "30 days before expiry" is calculated in UTC or user's local timezone. Agent would likely assume UTC. **Resolve**: Define which timezone.
2. **Notification frequency cap**: No mention of maximum notifications per user per week across all subscriptions. Agent would likely send one per subscription with no cap. **Resolve**: Define a cap or confirm no cap needed.
3. **Already-expired subscriptions**: The spec says "handled by separate flow" but doesn't define the boundary. Agent might create overlap. **Resolve**: Define when a subscription transitions from "expiring" to "expired" (at midnight UTC on expiry date?).

## Evaluation Thresholds

- **Variation stability**: > 90% of scenarios produce correct output regardless of stressor (Tier 2 target)
- **Reasoning alignment**: > 85% (applicable if system explains notification decisions in logs)
- **Anchoring susceptibility**: < 10% (notification decisions should not shift based on unrelated subscription states)
- **Guardrail reliability**: > 90% (opt-out suppression, cache expiry handling must fire correctly)

## Implementation Constraints

- Must integrate with existing SendGrid account (do not create new email provider)
- Cron job must run on existing job scheduler (do not introduce new scheduling infrastructure)
- In-app banner must use existing notification component library
