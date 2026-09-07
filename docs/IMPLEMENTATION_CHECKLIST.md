# Phase 2 implementation checklist

Live checklist updated: 2026-09-06.

Phase 0 and Phase 1 are complete. This file now tracks only the active Phase 2 scope.
The original implementation plan described Phase 2 as “Profile breadth and emergency
pathway,” but ADR 0002 moved the complete offline emergency shell—including unknown
and multiple-substance cases—into Phase 1. Phase 2 therefore expands and hardens the
single-substance profile experience and brings the already-built emergency pathway to
its remaining review, accessibility, and device acceptance gates. It must not rebuild
features already completed in Phase 1.

## Phase 2 goal

Complete safety-first single-substance decision support before broadening into the
Combination Checker, full reagent workflows, or library-scale content.

## Entry conditions

- [x] Phase 1 Library, search, profiles, Recently Viewed, and emergency shell exist.
- [x] Stable-ID routing, local content repository, validation/generation pipeline, and
  sparse-aware profile rendering exist.
- [x] Emergency supports known, unknown, and multiple-substance situations offline.
- [ ] Approved Phase 2 safety/emergency source material is available for content that
  is intended to be treated as reviewed rather than draft.

## Deliverables

### 1. Safety Snapshot and priority overrides

- [ ] Implement/finish the Safety Snapshot as the first high-value profile summary.
- [ ] Allow critical safety content to override normal profile ordering when context
  requires it without creating an aggregate substance “risk score.”
- [ ] Distinguish `critical`, `important`, and contextual information with semantic,
  non-color-only treatment.
- [ ] Ensure sparse profiles omit unavailable snapshot rows honestly rather than
  fabricating defaults or displaying misleading empty values.

### 2. Risks → harm-reduction actions

- [ ] Render major safety risks as discrete claims with stable IDs and source links.
- [ ] Link every actionable major risk to one or more concrete harm-reduction actions,
  or record an explicit editorial exception.
- [ ] Preserve claim priority and ordering from authored content; do not derive a
  whole-substance danger score.
- [ ] Support contextual focus so a future interaction/testing entry point can bring a
  user directly to a relevant safety claim without mutating canonical content.

### 3. Dose and potency reference

- [ ] Render route-aware dose-reference ranges, units, precision/uncertainty qualifiers,
  context, potency notes, and redosing notes where content exists.
- [ ] Present dose information as reference information, never as a recommendation or
  instruction to consume.
- [ ] Validate range ordering, units, route references, evidence/source references, and
  review metadata in CI.
- [ ] Handle missing or uncertain dose data explicitly and safely.

### 4. Route-aware timelines

- [ ] Render route-specific onset, come-up, main-effects, after-effects, and residual
  timing ranges where available.
- [ ] Keep route applicability explicit; never silently reuse one route’s timeline for
  another route.
- [ ] Provide an accessible text representation that does not require visual precision
  or horizontal gestures.
- [ ] Handle unknown or incomplete timing data without interpreting absence as zero.

### 5. Effects, unwanted effects, and variability

- [ ] Render expected effects and unwanted effects as separate neutral collections.
- [ ] Include supported commonality/variability qualifiers and relevant context without
  labeling effects as universally “good” or “bad.”
- [ ] Stress-test long text, dense content, sparse content, and uncertain claims.

### 6. “When to get help” profile section

- [ ] Add observable warning signs and action-first guidance to substance profiles.
- [ ] Keep emergency escalation visually and semantically distinct from ordinary
  cautionary content.
- [ ] Link profile escalation paths into the global emergency experience while
  preserving the substance context when known.
- [ ] Never require a known substance, dose, or single-substance scenario to enter the
  emergency path.

### 7. Related-substance relationships

- [ ] Render only explicit, typed relationships present in validated content.
- [ ] Preserve relationship directionality where semantics require it; generate inverse
  links only when the relationship type is safely reversible.
- [ ] Related-substance taps push another stable-ID profile and preserve the previous
  profile in the native back stack.
- [ ] Relationships must not be framed as recommendations or similarity scores.

### 8. Testing preview

- [ ] Add a profile-level testing preview/entry point when a testing profile exists.
- [ ] Explain the limits of substance checking and use “consistent with” language rather
  than confirmed/verified identity claims.
- [ ] Preserve Profile → Testing preselection/context for the later full workflow.
- [ ] Provide a safe unavailable state when no testing profile exists.

### 9. Pharmacology disclosures

- [ ] Provide a plain-language pharmacology layer before deeper mechanism detail.
- [ ] Add progressive disclosure for mechanism/deep-dive material so safety-critical
  information remains higher in the hierarchy.
- [ ] Represent uncertainty, competing explanations, and evidence limitations honestly.
- [ ] Do not turn mechanism detail into certainty or causal claims unsupported by the
  cited evidence.

### 10. Evidence and citations

- [ ] Attach source references to safety, dose, timeline, testing, pharmacology, and
  other substantive claims at the intended claim granularity.
- [ ] Support evidence metadata for basis/type, applicability, limitations, conflicts,
  assessment/review date, and literature-depth descriptor where used.
- [ ] Build/render source details with stable locators and offline citation metadata.
- [ ] Clearly distinguish clinical evidence, community reports, and inferred mechanisms.
- [ ] Keep evidence-label vocabulary/presentation configurable until the product
  decision below is locked.
- [ ] Validate missing/broken references and required review metadata in CI.

### 11. Dense + sparse profile completeness

- [ ] Bring the representative dense profile through the complete Phase 2 hierarchy.
- [ ] Bring representative sparse/uncertain fixtures through the same renderer without
  blank panels, fake defaults, broken references, or hierarchy collapse.
- [ ] Verify critical overrides, long names/aliases, long copy, unknown-data states, and
  illustration fallbacks.
- [ ] Confirm direct profile links without navigation context still render safely.

### 12. Emergency pathway hardening (not a rebuild)

- [ ] Audit the existing Phase 1 emergency shell against the final Phase 2 safety and
  editorial requirements.
- [ ] Keep urgent actions before explanation and preserve fully offline operation.
- [ ] Verify known-substance context can enrich the flow without blocking unknown,
  adulterated, uncertain-dose, or multiple-substance cases.
- [ ] Verify configurable emergency-call behavior and safe failure/fallback behavior.
- [ ] Complete screen-reader, Dynamic Type, reduced-motion, contrast, focus-order, and
  minimum-target checks for the urgent path.
- [ ] Run representative iOS and Android device drills and confirm the emergency path is
  not delayed by content loading, large profiles, low-memory conditions, or networking.

### 13. Persistence/privacy regression coverage

- [ ] Re-test Recently Viewed upgrade/reinstall expectations, invalid-ID cleanup,
  corruption fallback, cap/deduplication behavior, and no-sync/privacy guarantees after
  the richer profile model lands.
- [ ] Confirm no telemetry/logging contains substance-view history or sensitive profile
  context by default.

### 14. Phase 2 documentation and CI

- [ ] Update architecture/content/editorial docs for the final profile models and
  Phase 2 presentation rules.
- [ ] Document content-authoring and validation expectations for safety, dose, timeline,
  pharmacology, evidence, and emergency changes.
- [ ] Document the critical-change review/escalation path once governance is resolved.
- [ ] Keep generated examples/diagrams deterministic and CI-checked where applicable.
- [ ] Add or expand meaningful unit/integration/E2E coverage for all Phase 2 acceptance
  paths.

## Acceptance criteria / definition of done

Phase 2 is complete only when all of the following are true:

- [ ] A representative dense profile and representative sparse/uncertain profiles all
  satisfy the approved hierarchy without blank or misleading sections.
- [ ] Safety-critical content can override normal ordering and is identifiable without
  relying on color alone.
- [ ] Every major actionable risk has an associated harm-reduction action or an explicit
  reviewed exception.
- [ ] Dose references are route-aware, qualified, cited, validated, and never presented
  as consumption recommendations.
- [ ] Timelines are route-aware, accessible, cited, and safe when data is partial or
  unavailable.
- [ ] Effects/unwanted effects preserve variability and uncertainty rather than implying
  universality.
- [ ] “When to get help” guidance is observable and action-first and hands off cleanly to
  the global emergency pathway.
- [ ] Related-substance navigation preserves the native profile stack and contains no
  recommendation scoring.
- [ ] Testing preview uses limitation-first, non-verification language and correctly
  preserves testing context when available.
- [ ] Plain-language pharmacology precedes deeper mechanism detail; uncertainty and
  conflicting evidence remain visible.
- [ ] Material claims expose the required evidence/citation metadata and broken/missing
  references fail validation.
- [ ] The emergency pathway works fully offline for known, unknown, adulterated,
  uncertain-dose, and multiple-substance situations.
- [ ] The urgent path is action-first, clinically reviewed for release, and passes
  representative iOS/Android device drills.
- [ ] Phase 2 profile and emergency paths pass Dynamic Type, screen-reader, focus-order,
  reduced-motion, contrast, reflow, and 44×44-point target checks.
- [ ] Direct links and stale/absent navigation context fail safely rather than blocking
  access to a profile or emergency guidance.
- [ ] Richer profile content does not regress search, Library navigation, Recently
  Viewed, offline launch, privacy guarantees, or emergency-path latency.
- [ ] Required CI gates are green: format, lint, strict typecheck, tests, content
  validation/generation checks, and build smoke coverage.

## Unresolved decisions

These decisions are intentionally not guessed during implementation. Mark them resolved
only when a product/editorial/clinical owner explicitly locks them.

- [ ] **Evidence vocabulary and presentation:** final user-facing evidence-strength /
  literature-depth labels, when they appear, and how conflicting evidence is surfaced.
- [ ] **Evidence assessment policy:** final required fields/thresholds for evidence basis,
  applicability, limitations, conflict flags, and review cadence.
- [ ] **Medical/editorial governance:** named owners/reviewers, two-person review policy,
  accepted source standards, correction workflow, and urgent safety-update procedure.
- [ ] **Emergency launch-market configuration:** launch countries/locales, emergency-call
  numbers/behavior, and the approved locale fallback policy. A worldwide emergency
  directory is not assumed.
- [ ] **Public-release scope:** which Phase 2 content may remain clearly marked draft in
  development builds versus what must be reviewed before beta/public release.
- [ ] **Testing-preview boundary:** exactly which preview metadata/copy is included in a
  profile before the later full reagent/testing workflow, without accidentally building
  that workflow in Phase 2.
- [ ] **Performance budgets:** final measurable budgets for cold launch, profile render,
  emergency-path opening, bundle/assets, and representative low-end devices.

## External dependencies / gates

- [ ] **Clinical review:** named qualified reviewers must approve all safety, dose,
  testing, “when to get help,” and emergency copy before public release.
- [ ] **Editorial/source review:** Phase 2 substantive claims require an approved source
  corpus, claim-level citations where required, review dates, and correction ownership.
- [ ] **Launch-market decision:** emergency calling behavior cannot be considered
  release-ready until target markets/locales and their approved fallback behavior are
  known.
- [ ] **Accessibility/device validation:** representative iOS and Android device testing,
  including assistive technologies and large text, is required for Phase 2 sign-off.
- [ ] **Legal/privacy/app-store review:** any public release remains gated by the relevant
  safety wording, privacy disclosure, and store-policy review; Phase 2 implementation
  itself may proceed with clearly marked draft content.

## Explicit non-goals

Do **not** expand Phase 2 to include any of the following:

- [ ] No library-scale / complete substance catalog.
- [ ] No remote content service, CMS, signed update delivery, or remote bundle rollout.
- [ ] No full Combination Checker or interaction-result workflow (Phase 3).
- [ ] No full reagent/testing workflow or result engine (later phase); Phase 2 contains
  only the profile testing preview/context handoff.
- [ ] No pair-vs-multi-select Combo product decision work unless needed only to preserve
  the already-defined navigation seam.
- [ ] No recommendation engine, personalized risk score, “safe dose,” or consumption
  recommendation.
- [ ] No account system, cloud sync, or server-side substance/history tracking.
- [ ] No worldwide emergency-number directory; retain configurable locale-aware fallback
  until launch-market scope is approved.
- [ ] No elaborate Rabbit Hole/relationship visualization; only explicit profile-level
  relationships and stack-preserving navigation.
- [ ] No generalized CMS/editorial admin UI.

## Phase 2 closeout

- [ ] All deliverables above are complete or explicitly deferred by an approved scope
  decision recorded in docs/ADR.
- [ ] Every acceptance criterion passes.
- [ ] Every unresolved decision that blocks Phase 2 sign-off is locked and documented.
- [ ] External release gates are either satisfied or clearly distinguished from
  implementation completion where draft/internal builds are concerned.
- [ ] Phase 3 can start without changing Phase 2’s canonical profile/emergency contracts.
