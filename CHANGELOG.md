# Changelog

All notable changes to Attacca Forge will be documented in this file.

## [0.5.0] - 2026-03-23

### Added
- **CLI distribution** — `npx attacca-forge init` interactive project setup wizard
- **CLI commands** — `init`, `install`, `status`, `help` with npx support
- **Project context system** — `.attacca/config.yaml` + `.attacca/context.md` track pipeline phase, trust tier, and artifacts
- **`forge-start` skill** — IDEA phase onboarding (capture intent, classify risk, route to next phase)
- **`forge-help` skill** — Phase-aware navigation ("what should I do next?")
- **17 extended skills** — Converted from prompts library: intent gap diagnostic, personal intent builder, workflow capability map, insight-to-action compression, harness simulator (Planner-Worker-Judge), difficulty rapid audit, problem difficulty decomposition, workflow optimizer, agent stack mapper, agent readiness audit, agent economics analyzer, dev level assessment, AI-native org redesign, legacy migration roadmap, talent strategy, web fork strategic briefing, AI output taste builder
- **Context loading** on all 7 original skills — skills auto-read `.attacca/` config for trust tier, project type, and experience level
- **npm package** — `attacca-forge` on npm with dual bin entry (`attacca-forge` + `forge`)

### Changed
- README rewritten for npx-first onboarding
- Getting started guide rewritten for CLI workflow
- Pipeline visualization in `status` command (shows current phase, completed phases, next step)

### Totals
- 26 skills (9 core pipeline + 17 extended)
- 4 CLI commands
- Zero dependencies

## [0.4.0] - 2026-03-19

### Added
- `build-orchestrator` skill — Complete spec-tests-code pipeline with four-layer evaluation stack (progressive autonomy, deterministic validation, continuous flywheel, factorial stress testing), deployment gates checklist, model change protocol, anti-patterns guide, and 3-week bootstrapping timeline
- Architecture doc — full pipeline visualization (Spec Studio → Eval Gate → Intent Layer → Build Floor → Delivery), ecosystem diagram with breadcrumbs, layer dependency map

### Changed
- README updated with complete Layer 4 section and architecture link

## [0.3.0] - 2026-03-19

### Added
- `intent-spec` skill — Agent intent specification generator with value hierarchies, decision boundary matrix (including shadow mode and promotion criteria), Klarna checklist, feedback loop design, and drift detection signals
- `intent-audit` skill — Organizational intent gap audit with three-layer maturity assessment, Klarna test, risk map, and investment roadmap
- Methodology docs: intent engineering, progressive autonomy (5 modes from shadow to full auto)

### Changed
- README updated with Layer 3 section and methodology links

## [0.2.0] - 2026-03-19

### Added
- `stress-test` skill — Factorial stress testing with 22 variation types across 5 categories, scenario scoring templates, and aggregate metrics
- Methodology docs: factorial stress testing, the four failure modes (FM-1 through FM-4)
- Example: stress test matrix for a customer support triage agent (3 scenarios × 16 variations)

### Changed
- README updated with Layer 2 section and methodology links

## [0.1.0] - 2026-03-19

### Added
- `spec-architect` skill — Full specification writer with trust tier classification, behavioral scenarios with contextual variations, intent contracts, and evaluation thresholds
- `spec-writer` skill — Streamlined specification writer for quick implementation specs
- Methodology docs: spec-driven development, trust tiers
- Getting started guide
- Example: Tier 2 SaaS notification system spec
- Install scripts for macOS/Linux/WSL and Windows PowerShell
