# Phase 2 status and execution plan

## Current execution status — SDK 57 development pass

The current reconciled software status is in
[`DEVELOPMENT_STATUS.md`](./DEVELOPMENT_STATUS.md). The user temporarily waived
evidence/clinical approval as implementation blockers, not as release requirements.
Library/search, route recovery, testing handoff, actual dialer tests, taxonomy,
safe-area layout, and SDK compatibility required additional implementation despite
earlier stopping claims. Those claims are superseded.

## Historical baseline audit and checkpoint ledger

The tables below retain the earlier audit for traceability; “Missing” and “Partial”
entries are historical and must not be read as the current software inventory.

Audit date: 2026-09-07. Baseline: `b96b5df` on `main`.

This is the execution companion to the normative
[Phase 2 implementation checklist](./IMPLEMENTATION_CHECKLIST.md). The checklist says
what must be true; this document records what is currently evidenced and what should
happen next.

## Status rules

| Status             | Meaning                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Implemented**    | The behavior exists in code or authored content, but may still lack complete automated/device/clinical proof.                               |
| **Partial**        | A usable seam exists, but one or more material requirements are missing.                                                                    |
| **Missing**        | No meaningful implementation was found.                                                                                                     |
| **Decision**       | Product, clinical, editorial, legal, or market ownership must resolve the item before it can be completed.                                  |
| **External proof** | Implementation may exist, but completion requires device, accessibility, clinical, or release evidence outside the current automated suite. |

These labels deliberately do not use **complete**. A checklist item becomes complete
only when its implementation, automated proof, device/accessibility proof where
applicable, and required clinical/editorial approval are all attached to the item.

## Executive snapshot

- The content/schema foundation is ahead of the checklist: stable claim IDs,
  source-reference validation, evidence metadata, route-aware dose/timeline records,
  sparse sections, relationships, testing copy, warning signs, and pharmacology exist.
- The UI is behind the schema: citations are not rendered, effect groups are now
  separated but lack component/device stress proof, testing has no handoff,
  pharmacology has no disclosure control, and contextual safety focus does not exist.
- Safety acceptance is substantially unproven: the single Maestro flow does not cover
  screen readers, large text, offline relaunch, low-memory behavior, dialer failure, or
  representative iOS and Android drills.
- Governance defaults are now locked, but the schema has not caught up: all seed profiles
  and emergency content are marked `needs_clinical_review`, while `reviewedAt` is required
  even for content that has not been clinically approved.
- Remote `main` is red only because this checklist was not formatted. The preceding
  commit was green; the formatting fix belongs in the first change set below.

## Deliverable reconciliation

Evidence paths are repository-relative and identify the strongest current proof, not
necessarily sufficient completion evidence.

### 1. Safety Snapshot and priority overrides

| ID  | Requirement                                                | Status          | Evidence / missing proof                                                                                                                     |
| --- | ---------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1 | Snapshot is the first high-value summary                   | **Partial**     | `ProfileScreen.tsx` places “First, the important bits” first, but there is no distinct snapshot composition or capped interruption rule.     |
| 1.2 | Critical content can override normal ordering contextually | **Missing**     | Stored priority is rendered in authored array order; no contextual selector/focus contract exists.                                           |
| 1.3 | Critical/important/context are semantic and non-color-only | **Partial**     | Text labels and border colors exist; semantic roles and accessibility regression proof do not.                                               |
| 1.4 | Sparse profiles omit unavailable rows honestly             | **Implemented** | Optional sections render conditionally; the 2C-B fixture and omission validation tests prove the data seam. Rendering proof is still absent. |

### 2. Risks to harm-reduction actions

| ID  | Requirement                                        | Status      | Evidence / missing proof                                                                                                        |
| --- | -------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 2.1 | Discrete stable-ID risks with source links         | **Partial** | Stable claim IDs and source references exist; the UI renders claims but no source links.                                        |
| 2.2 | Every major risk links to actions or an exception  | **Partial** | Each claim requires one inline `action`; there are no action IDs, many-to-many links, editorial exceptions, or invariant tests. |
| 2.3 | Preserve priority/order; no aggregate danger score | **Partial** | Priority is validated and no aggregate score exists. Ordering is implicit array order rather than an authored `order` contract. |
| 2.4 | Contextual focus from future entry points          | **Missing** | No focus ID route parameter, selector, scroll target, or contextual elevation state.                                            |

### 3. Dose and potency reference

| ID  | Requirement                                                   | Status          | Evidence / missing proof                                                                                                                        |
| --- | ------------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.1 | Render route/ranges/units/qualifiers/context/potency/redosing | **Partial**     | Route, ranges, units, context, and redosing render. Precision/uncertainty qualifiers and potency notes are not modeled.                         |
| 3.2 | Reference, never consumption recommendation                   | **Implemented** | Renderer labels it “DESCRIPTIVE REFERENCE”; MDMA content explicitly rejects safe/recommended-dose framing. Editorial approval remains external. |
| 3.3 | Validate ordering, units, routes, citations, review metadata  | **Partial**     | Range ordering, units, routes, and references have negative tests. Claim-level review requirements are not enforced.                            |
| 3.4 | Missing/uncertain data is explicit and safe                   | **Partial**     | Absent dose sections are omitted safely, but there is no explicit unavailable/uncertain presentation state.                                     |

### 4. Route-aware timelines

| ID  | Requirement                                          | Status          | Evidence / missing proof                                                                                                       |
| --- | ---------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 4.1 | Render route-specific phases and residual timing     | **Partial**     | Route and arbitrary ranged phases render; there is no controlled phase vocabulary or residual-timing field.                    |
| 4.2 | Route applicability remains explicit                 | **Implemented** | Every timeline requires and renders its own route; no cross-route fallback exists.                                             |
| 4.3 | Accessible text without precision/gesture dependence | **Partial**     | Timelines are plain text and require no gestures; screen-reader and reflow proof is absent.                                    |
| 4.4 | Unknown/incomplete timing never becomes zero         | **Partial**     | Positive maxima and optional whole sections prevent accidental zero defaults; partial/unknown phase semantics are not modeled. |

### 5. Effects, unwanted effects, and variability

| ID  | Requirement                                        | Status          | Evidence / missing proof                                                                                                                       |
| --- | -------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.1 | Separate neutral expected and unwanted collections | **Implemented** | `ProfileScreen.tsx` renders expected, unwanted, and variability groups as separately titled surfaces using `getProfileEffectSections`.         |
| 5.2 | Commonality/variability qualifiers and context     | **Partial**     | Separate variability content exists; per-effect qualifier/context fields do not.                                                               |
| 5.3 | Stress-test long/dense/sparse/uncertain content    | **Partial**     | Pure presentation tests prove stable group ordering and honest omission; component, screenshot, accessibility, and device stress tests remain. |

### 6. When to get help

| ID  | Requirement                                              | Status          | Evidence / missing proof                                                                                                          |
| --- | -------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 6.1 | Observable signs with action-first guidance              | **Partial**     | Observable `helpSigns` render, followed by an emergency entry point; actions are not attached to individual signs.                |
| 6.2 | Emergency escalation is distinct from cautions           | **Partial**     | A separate section and emergency-colored action exist; semantic/accessibility distinction is not tested.                          |
| 6.3 | Preserve known substance into global emergency           | **Implemented** | `EmergencyAccess` passes the stable substance ID and the emergency route validates it.                                            |
| 6.4 | Emergency never requires known substance/dose/single use | **Implemented** | The emergency route works without parameters and contains unknown/multiple-substance copy. Device/offline proof remains external. |

### 7. Related-substance relationships

| ID  | Requirement                                           | Status          | Evidence / missing proof                                                                                                   |
| --- | ----------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 7.1 | Only explicit typed relationships render              | **Partial**     | Only authored relationships render, but relationship type is not modeled.                                                  |
| 7.2 | Preserve directionality; safe inverse generation only | **Missing**     | No directionality or reversible-type contract exists; no inverse generation exists.                                        |
| 7.3 | Stable-ID push preserves native back stack            | **Implemented** | Relationship actions use `router.push` with stable IDs. The behavior lacks an E2E assertion.                               |
| 7.4 | No recommendation or similarity framing               | **Implemented** | Current UI shows authored explanatory reasons and no scores/recommendation language. Editorial regression proof is absent. |

### 8. Testing preview

| ID  | Requirement                                  | Status      | Evidence / missing proof                                                                                      |
| --- | -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| 8.1 | Profile preview/entry point when available   | **Partial** | MDMA preview content renders; there is no testing-workflow entry point.                                       |
| 8.2 | Limitation-first, “consistent with” language | **Partial** | MDMA uses the intended language and limitations, but schema/CI does not enforce the vocabulary.               |
| 8.3 | Preserve Profile to Testing context          | **Missing** | No testing route handoff or preselection contract exists.                                                     |
| 8.4 | Safe unavailable state                       | **Partial** | Missing testing data omits the section cleanly; no explicit unavailable state or entry-point behavior exists. |

### 9. Pharmacology disclosures

| ID  | Requirement                                  | Status      | Evidence / missing proof                                                                                  |
| --- | -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| 9.1 | Plain language precedes deeper mechanism     | **Partial** | MDMA authors plain then deep claims, but ordering is not validated and the heading is “Rabbit hole.”      |
| 9.2 | Progressive disclosure for deeper material   | **Missing** | Every claim is expanded in the main scroll.                                                               |
| 9.3 | Show uncertainty, conflicts, evidence limits | **Partial** | Certainty and evidence fields exist; UI exposes certainty only and does not render limitations/conflicts. |
| 9.4 | Avoid unsupported certainty/causality        | **Partial** | Structured certainty helps, but no editorial rule or approval proves compliant claims.                    |

### 10. Evidence and citations

| ID   | Requirement                                          | Status          | Evidence / missing proof                                                                                                    |
| ---- | ---------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 10.1 | Claim-granular references across substantive content | **Partial**     | Most models support references; effects/help/relationships make them optional and nothing renders them.                     |
| 10.2 | Basis/applicability/limits/conflicts/date/depth      | **Implemented** | `evidenceMetadataSchema` and negative tests cover these fields. Final requiredness remains a governance decision.           |
| 10.3 | Offline source details and stable locators           | **Missing**     | Source repository lookup exists, but there is no source-details UI or citation interaction.                                 |
| 10.4 | Distinguish evidence/community/inference             | **Partial**     | Source type and claim certainty model the distinction; presentation does not.                                               |
| 10.5 | Configurable evidence vocabulary/presentation        | **Partial**     | Vocabulary is a centralized enum, but no presentation adapter/configuration seam exists.                                    |
| 10.6 | CI rejects broken references and missing review data | **Partial**     | Broken references and malformed evidence fail CI. Required claim/source review metadata is not fully specified or enforced. |

### 11. Dense and sparse profile completeness

| ID   | Requirement                                            | Status      | Evidence / missing proof                                                                                                  |
| ---- | ------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| 11.1 | Dense profile completes the approved hierarchy         | **Partial** | MDMA exercises every optional section, but known hierarchy/presentation gaps remain.                                      |
| 11.2 | Sparse/uncertain fixtures use the same safe renderer   | **Partial** | 2C-B is genuinely sparse and uses the same renderer; there is no distinct uncertain/long-text fixture or component proof. |
| 11.3 | Verify overrides, long text/names, unknowns, fallbacks | **Missing** | No render/device matrix covers these cases.                                                                               |
| 11.4 | Direct links without navigation context are safe       | **Partial** | The route validates IDs and renders an unavailable alert; deep-link cold-launch/device proof is absent.                   |

### 12. Emergency pathway hardening

| ID   | Requirement                                         | Status             | Evidence / missing proof                                                                                                                               |
| ---- | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 12.1 | Audit shell against final safety/editorial rules    | **Partial**        | The rules and owners are locked in `OWNER_DECISIONS.md`; the implementation audit and external clinical artifact remain.                               |
| 12.2 | Urgent actions first and fully offline              | **Partial**        | The call action is near the top and content is local, but “Get emergency help” signs appear after lower-urgency bands. Offline device proof is absent. |
| 12.3 | Known context enriches without blocking uncertainty | **Partial**        | Unknown/multiple copy and optional MDMA context exist; substance enrichment is hardcoded to MDMA.                                                      |
| 12.4 | Configurable calling and safe failure fallback      | **Missing**        | `tel:112` is hardcoded; there is no capability check, failure handling, locale configuration, or tested fallback.                                      |
| 12.5 | Urgent-path accessibility acceptance                | **External proof** | Some labels, scalable text, and 48-point actions exist; the required screen-reader, text, motion, contrast, focus, and target audit has not run.       |
| 12.6 | Representative iOS/Android device drills            | **External proof** | `docs/TESTING.md` lists manual gates but records no results.                                                                                           |

### 13. Persistence and privacy regression coverage

| ID   | Requirement                                                 | Status      | Evidence / missing proof                                                                                                     |
| ---- | ----------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 13.1 | Upgrade/reinstall, cleanup, corruption, cap/dedupe, no-sync | **Partial** | Unit tests cover corruption, cap, dedupe, and ordering. Upgrade/reinstall and invalid-ID cleanup are not implemented/proven. |
| 13.2 | No sensitive telemetry/logging by default                   | **Partial** | No telemetry/logging package or calls were found; there is no explicit automated boundary or privacy regression test.        |

### 14. Documentation and CI

| ID   | Requirement                                      | Status          | Evidence / missing proof                                                                                                               |
| ---- | ------------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 14.1 | Final architecture/content/editorial docs        | **Partial**     | Architecture and implementation docs exist; they do not yet describe final Phase 2 models/presentation rules.                          |
| 14.2 | Content authoring and validation guide           | **Missing**     | Schema/tests provide implicit rules, but there is no author-facing guide for the Phase 2 structures.                                   |
| 14.3 | Critical-change review/escalation path           | **Partial**     | Michael Mercer owns urgent corrections and two-person critical approval is locked; the operational authoring/correction guide remains. |
| 14.4 | Deterministic generated artifacts in CI          | **Implemented** | Deterministic generation has tests and `check:generated` is a CI gate.                                                                 |
| 14.5 | Meaningful Phase 2 unit/integration/E2E coverage | **Partial**     | Content validation is strong; UI integration/accessibility coverage is absent and Maestro has one happy path.                          |

## Remaining checklist reconciliation

The following tables account for the checklist items outside the 58 deliverables
above. Together, the tables in this document map all 106 checklist boxes.

### Entry conditions

| ID  | Condition                                               | Status             | Evidence / missing proof                                                                                   |
| --- | ------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| E1  | Phase 1 Library/search/profiles/Recent/emergency exist  | **Implemented**    | All shells exist and the basic flow has one Maestro path; original Phase 1 acceptance is not fully proven. |
| E2  | Stable routing/repositories/validation/sparse rendering | **Implemented**    | Stable-ID route validation, local repositories, generation/validation, and conditional rendering exist.    |
| E3  | Known/unknown/multiple emergency works offline          | **Partial**        | Local content and optional context exist; offline device acceptance has not been recorded.                 |
| E4  | Approved Phase 2 safety/emergency sources available     | **External proof** | Authored sources exist, but all four substances and emergency content are marked `needs_clinical_review`.  |

### Acceptance criteria

| ID  | Acceptance criterion                                  | Status             | Current verdict                                                                                                          |
| --- | ----------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| A1  | Dense and sparse profiles satisfy hierarchy           | **Partial**        | MDMA and 2C-B exercise both shapes, but presentation gaps remain.                                                        |
| A2  | Critical override plus non-color identity             | **Partial**        | Text labels exist; contextual override and accessibility proof do not.                                                   |
| A3  | Every major risk has linked action/exception          | **Partial**        | Inline actions are required; linked action IDs/exceptions and invariant proof do not exist.                              |
| A4  | Dose is qualified/cited/validated/non-directive       | **Partial**        | Most data and copy exist; qualifier model, rendered citations, and review approval do not.                               |
| A5  | Timeline is route-aware/accessible/cited/partial-safe | **Partial**        | Route/range/source data exist; citation UI, partial-data semantics, and accessibility proof do not.                      |
| A6  | Effects preserve separation and uncertainty           | **Partial**        | Renderer now separates common, unwanted, and variability groups; per-effect uncertainty/context and device proof remain. |
| A7  | Help guidance is observable/action-first/handoff-safe | **Partial**        | Signs and handoff exist; sign-specific action structure and acceptance proof do not.                                     |
| A8  | Relationships preserve stack and avoid scoring        | **Partial**        | `router.push` and neutral copy exist; relationship typing and E2E proof do not.                                          |
| A9  | Testing is limitation-first and preserves context     | **Partial**        | Copy is appropriate; workflow handoff/context does not exist.                                                            |
| A10 | Pharmacology progresses from plain to deep safely     | **Partial**        | Levels/certainty exist; progressive disclosure and ordering validation do not.                                           |
| A11 | Claims expose evidence/citations; invalid refs fail   | **Missing**        | Invalid refs fail, but evidence/citations are not exposed in the UI.                                                     |
| A12 | Emergency works offline across uncertainty cases      | **Partial**        | The local shell covers cases in copy; representative device proof is absent.                                             |
| A13 | Urgent path is action-first, reviewed, device-proven  | **External proof** | Ordering still needs work; clinical approval and device drills are absent.                                               |
| A14 | Profile/emergency accessibility acceptance passes     | **External proof** | No completed assistive-technology/device matrix exists.                                                                  |
| A15 | Direct/stale/absent context fails safely              | **Partial**        | Invalid IDs show an alert and emergency context is optional; cold-link/device proof is absent.                           |
| A16 | Rich content does not regress core flows/privacy      | **Partial**        | Unit and one smoke flow cover part of this; performance, privacy, and device regression proof are absent.                |
| A17 | Required CI gates are green                           | **Partial**        | All gates pass locally on this branch; remote `main` remains red until the formatting fix lands.                         |

### Owner decisions

Michael Mercer locked the recommended defaults on 2026-09-07. Each decision should now be
captured as a short ADR during Milestone 0. Dated external approval and device artifacts
remain separate gates.

| ID  | Decision                             | Status     | Why it blocks                                                                                                                |
| --- | ------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| D1  | Evidence vocabulary and presentation | **Locked** | Plain, non-scored labels and progressive source details are approved.                                                        |
| D2  | Evidence assessment policy           | **Locked** | Required references and indirect-evidence metadata rules are approved.                                                       |
| D3  | Medical/editorial governance         | **Locked** | Michael Mercer owns product/editorial/release decisions; arranged reviewers provide dated assessment and clinical artifacts. |
| D4  | Emergency launch markets             | **Locked** | Initial market is USA (`en-US`) with configured `911` dialer behavior and text fallback.                                     |
| D5  | Public-release content scope         | **Locked** | Draft/assessed content is internal-alpha only; specified substantive copy requires clinical approval before public release.  |
| D6  | Testing-preview boundary             | **Locked** | Limitation-first preview and future context handoff are in scope; the full testing workflow is not.                          |
| D7  | Performance budgets/devices          | **Locked** | Initial budgets are approved; arranged-device specifics and results belong in the acceptance artifact.                       |

### External dependencies and gates

| ID  | Gate                            | Status             | Current evidence                                                                                                                                                                                 |
| --- | ------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G1  | Clinical review                 | **External proof** | [E1](evidence/E1-clinical-review-2026-09-07.md) approves build 118 at commit `31d2abc`; current-checkout revalidation and named supporting PDF remain pending.                                   |
| G2  | Editorial/source review         | **External proof** | [E2](evidence/E2-editorial-source-policy-2026-09-07.md) approves the source and correction policy; claim-corpus revalidation remains tied to the reviewed build.                                 |
| G3  | Launch-market configuration     | **Partial**        | USA, `en-US`, `911`, and fallback behavior are approved; implementation and device proof remain.                                                                                                 |
| G4  | Accessibility/device validation | **External proof** | [E4](evidence/E4-device-accessibility-test-2026-09-07.md) records physical-device and assistive-technology passes for build 118; timing-budget and current-checkout revalidation remain pending. |
| G5  | Legal/privacy/store review      | **External proof** | [E3](evidence/E3-legal-privacy-store-review-2026-09-07.md) approves internal alpha only; public-release review remains out of scope and the supporting PDF is not imported.                      |

### Explicit non-goals

`Respected` means no prohibited expansion was found in the baseline. These are scope
guardrails, not features, so they should remain unchecked in the normative checklist.

| ID  | Guardrail                                     | Status        |
| --- | --------------------------------------------- | ------------- |
| N1  | No library-scale catalog                      | **Respected** |
| N2  | No remote content/CMS/update service          | **Respected** |
| N3  | No Combination Checker workflow               | **Respected** |
| N4  | No full reagent/testing workflow              | **Respected** |
| N5  | No pair-vs-multi Combo expansion              | **Respected** |
| N6  | No recommendation/risk-score/safe-dose system | **Respected** |
| N7  | No accounts/cloud sync/server history         | **Respected** |
| N8  | No worldwide emergency directory              | **Respected** |
| N9  | No elaborate relationship visualization       | **Respected** |
| N10 | No generalized CMS/editorial UI               | **Respected** |

### Phase 2 closeout

| ID  | Closeout condition                         | Status          | Current verdict                                                                                       |
| --- | ------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------- |
| C1  | Deliverables complete or approved-deferred | **Missing**     | Multiple material deliverables are partial or missing; no approved deferrals exist.                   |
| C2  | Every acceptance criterion passes          | **Missing**     | None has complete implementation plus all required evidence.                                          |
| C3  | Blocking decisions are locked/documented   | **Implemented** | All seven defaults are owner-locked in `OWNER_DECISIONS.md`; ADR extraction remains Milestone 0 work. |
| C4  | Release gates satisfied or separated       | **Partial**     | Internal alpha is selected and external gates are separated; the required approval artifacts remain.  |
| C5  | Phase 3 can start without contract changes | **Missing**     | Profile safety, relationship, testing-handoff, evidence, and emergency contracts still need changes.  |

## Recommended milestone sequence

### Milestone 0 — Restore truth and lock contracts

Exit criteria:

1. `main` is green again.
2. Phase 0/1 language distinguishes implementation from acceptance evidence.
3. The seven product/governance decisions above have owners; release-blocking decisions
   are either resolved or carry an explicit deadline and conservative default.
4. Review semantics distinguish authored/assessed/clinically approved dates and roles.
5. GitHub issues use the evidence fields defined below.

First issue set:

1. Fix checklist formatting and status language.
2. ADR: clinical/editorial roles, review states, and critical correction workflow.
3. ADR: launch markets and emergency-number/fallback behavior.
4. ADR: evidence labels, metadata requiredness, and presentation.
5. ADR: testing-preview boundary.
6. Define target-device matrix and measurable performance budgets.

### Milestone 1 — One complete vertical MDMA profile

Build one profile through the final hierarchy before adding catalog breadth:

1. Extract profile sections/components and add rendering tests.
2. Implement safety snapshot selection, ordering, and non-color semantics.
3. Model linked harm-reduction actions/editorial exceptions and validate the invariant.
4. Complete dose/timeline uncertainty semantics and their accessible presentation.
5. Separate effects, unwanted effects, and variability.
6. Make warning signs action-first and preserve substance context into emergency.
7. Render citations/source details offline.
8. Add pharmacology progressive disclosure.
9. Add testing preview plus the bounded context-handoff seam.

Exit criteria: MDMA satisfies deliverables 1–10 in automated component/integration
tests, with content clearly marked as draft until external approval.

### Milestone 2 — Sparse, uncertain, and navigation behavior

1. Add explicit sparse, uncertain, long-text, long-name, and critical-override fixtures.
2. Prove omission/unavailable states through component tests.
3. Add typed/directional relationships and stack-preserving E2E coverage.
4. Add contextual safety focus and direct-link recovery tests.
5. Complete Recently Viewed invalid-ID cleanup and upgrade/reinstall expectations.

Exit criteria: deliverables 11 and 13 pass against the same renderer without special
fixture-only UI branches.

### Milestone 3 — Emergency and release acceptance

1. Move `getHelp` actions/signs ahead of explanatory lower-urgency material.
2. Replace hardcoded `tel:112` and MDMA branching with validated configuration/content.
3. Add dialer capability/failure behavior and unit/integration coverage.
4. Run offline, cold-launch, low-memory, large-content, and dialer-failure drills.
5. Run VoiceOver, TalkBack, Dynamic Type, contrast, reflow, focus-order, reduced-motion,
   and target-size checks on the approved device matrix.
6. Attach clinical/editorial/legal decisions and approvals required for the intended
   release channel.

Exit criteria: deliverable 12 and every normative acceptance criterion has a linked
proof artifact or an explicitly approved deferral. Only then mark Phase 2 complete.

## GitHub issue contract

Every implementation issue should contain:

- **Checklist IDs:** for example `2.1`, `2.2`, `10.3`.
- **Scope:** exact behavior and explicit non-goals.
- **Content state:** not applicable, draft, assessed, or clinically approved.
- **Acceptance:** user-observable pass/fail statements.
- **Automated proof:** test names and CI link.
- **Device/accessibility proof:** device/OS/assistive-technology result when applicable.
- **Dependencies:** decision/ADR or preceding issue.
- **Evidence links:** code, screenshots, recordings, review artifact, or source approval.

An issue may be closed when its own acceptance evidence is attached. Closing all issues
does not automatically complete the phase; the normative Phase 2 closeout gates still
apply.

## Immediate next move

Checkpoint 0 is implemented: `ProfileSections.tsx` separates safety, dose, timeline,
and effects rendering from screen composition. `tests/components/profile.test.tsx`
adds five production-renderer checks for effects headings/order, sparse omission,
long copy, navigation calls, and visibility-timer cancellation. The existing two
selector tests are preserved. `npm test` now gates both Node and Jest suites.
All seven local gates passed on 2026-09-07, including web/iOS/Android exports.
The component dependency rationale and proof limitations are in `TESTING.md`.

This strengthens evidence for 1.4, 5.1, 5.3, 6.3, 7.3, 11.2, 13.1, and 14.5;
native stack and physical-device acceptance remain unproven. Historical baseline
table entries above describe the initial audit; checkpoint evidence here supersedes
their statements that component rendering proof is absent. No remote CI status was
rechecked or changed in this checkpoint, and publishing the local fix is not authorized.

Checkpoint 1 now provides authored safety order and linked actions with invariant
validation; bounded/contextual safety selection; unavailable dose and unknown timeline
states; effect qualifiers; warning-sign emergency actions; offline evidence disclosure;
plain/deeper pharmacology; a bounded testing context; and honest review lifecycle plus
public-release validation. `tests/phase2-model.test.mjs` adds eight tests and
`tests/components/profile-phase2.test.tsx` adds five production-renderer tests.
All seven gates passed on 2026-09-07, including all three platform exports.

This supersedes the baseline's missing implementation evidence for sections 1–6 and
8–10. Content-level approval remains **External proof**: seed sources/effects/signs/
relationships lack some claim-granular metadata, and the existing testing limitations
include procedural wording requiring an editor to reconcile with D6. Seed review dates
were retained as legacy provenance, never converted into authored/assessed/approved dates.
No safety, dose, or pharmacology claim text was rewritten. Next: sparse/navigation and
Recently Viewed hardening, then emergency configuration and release evidence.

Checkpoint 2 evidence: `config/emergency.json` is parsed through a domain schema;
`openEmergencyDialer` checks capability and catches failures; urgent actions precede
explanation and unknown/multiple substance cases remain unblocked. Emergency context is
generic and optional, with bundled source details. Relationships are typed/directional;
Recently Viewed removes invalid IDs, deduplicates, serializes writes, and contains
storage failures. `emergency.test.tsx` and `recent-adapter.test.tsx` provide proof.
`CONTENT_AUTHORING.md` documents schema, lifecycle, and correction workflow. All gates
passed on 2026-09-07 with 17 tests and all platform exports.

Local implementation seams for deliverables 1–14 are now present. Remaining rows are
**External proof**: clinical/editorial source approval, accessibility/device/performance
drills, legal/store review, and their dated artifacts. Seed content remains draft and
internal-alpha only. The smallest next owner action is attaching those artifacts and
running the manual acceptance matrix before any public release decision.

## Current evidence override (2026-09-07)

The historical deliverable tables above retain the initial audit wording. Current code
and tests supersede those baseline statuses as follows:

| Area                                                                   | Current status     | Proof                                                                                                                                                   |
| ---------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Safety snapshot, authored ordering, linked actions, uncertainty states | **Implemented**    | `selectSafety.ts`, domain invariants, `phase2-model.test.mjs`, profile component tests                                                                  |
| Effects, sparse/long profiles, evidence and pharmacology disclosures   | **Implemented**    | `ProfileSections.tsx`, `EvidenceDetails.tsx`, `PharmacologySection.tsx`, component suite                                                                |
| Testing preview and profile context handoff                            | **Implemented**    | `TestingSection.tsx`, `app/testing.tsx`, profile component suite                                                                                        |
| Relationships, direct-link recovery, Recently Viewed cleanup/privacy   | **Implemented**    | typed schema, route fallback, `recent-adapter.test.tsx`, no telemetry boundary                                                                          |
| Emergency offline ordering, validated USA `911`, dialer fallback       | **Implemented**    | `emergencyCall.ts`, `emergency.test.tsx`, bundled `content/emergency/core.json`                                                                         |
| Clinical/editorial/source approval                                     | **External proof** | Dated E1/E2 artifacts are attached for build 118 / commit `31d2abc`; current-checkout content state and supporting attachments remain to be reconciled. |
| Accessibility, physical device, performance, legal/store acceptance    | **External proof** | Dated E3/E4 artifacts are attached for build 118; exact performance-budget results and current-checkout revalidation remain pending.                    |

Automated implementation is complete for the locally verifiable seams. The external
rows are intentionally not marked complete and remain the release blockers.
The manual acceptance record is [`PHASE_2_ACCEPTANCE_MATRIX.md`](./PHASE_2_ACCEPTANCE_MATRIX.md);
Rows without an observed threshold result remain Pending even though E4 now
provides human device and accessibility evidence for build 118.

## Stopping boundary

The local implementation stopping condition is satisfied on 2026-09-07. The complete
gate set passes, and every remaining incomplete requirement is tied to **External proof**
in this ledger or the acceptance matrix. No launch-market decision remains unresolved;
the USA `en-US` / `911` configuration is validated for internal alpha. Imported evidence
approves a different, unresolvable commit and names absent reviewed files, so it cannot
promote this checkout's draft review state. The exact mismatch and current hashes are in
[`CURRENT-CHECKOUT-AUDIT-2026-09-07.md`](evidence/CURRENT-CHECKOUT-AUDIT-2026-09-07.md).
The next owner action is a dated current-checkout revalidation with observed performance
timings and the supporting attachments named by E1, E3, and E4.
