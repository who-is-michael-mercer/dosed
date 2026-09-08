# Codex goal: continued development under temporary review waiver

## Current user override — 2026-09-07

Continue specified implementation across Phase 1/2 and any independent later work.
Evidence sourcing, incomplete citations, clinical review, and approval status are
deferred work, not development blockers. Preserve draft/unverified states and all
public-release gates; the waiver approves no content. Upgrade SDK 54 to SDK 57 for
current iPhone Expo Go. Preserve existing work. Do not invent unresolved Combo or
reagent product behavior. The current software/review split is recorded in
[`DEVELOPMENT_STATUS.md`](./DEVELOPMENT_STATUS.md).

The historical checkpoint and stopping claims below describe earlier passes, not
current completeness. This override supersedes their evidence-related pause rules.

## Activate

From the repository root, start the durable run with:

```text
/goal Implement docs/CODEX_GOAL.md without stopping until its stopping condition is true or a documented pause condition is reached.
```

## Objective

Bring Dosed Phase 2 to **implementation complete, pending only explicitly external
acceptance**. Implement every safe, locally verifiable requirement in
`docs/IMPLEMENTATION_CHECKLIST.md`, preserve the safety and privacy constraints in
`AGENTS.md`, and keep `docs/PHASE_2_EXECUTION_PLAN.md` synchronized with actual evidence.

Do not stop after producing a plan. Continue checkpoint by checkpoint until the stopping
condition below is true or a documented pause condition is reached.

## Read first

1. `AGENTS.md`
2. `docs/IMPLEMENTATION_CHECKLIST.md`
3. `docs/PHASE_2_EXECUTION_PLAN.md`
4. `docs/OWNER_DECISIONS.md`
5. `docs/ARCHITECTURE.md`
6. `docs/TESTING.md`
7. Existing working-tree changes; preserve and build on them.

## Target state

1. Every Phase 2 deliverable that can be completed in code, authored fixtures,
   documentation, or automated tests is implemented.
2. Each remaining incomplete item is classified only as:
   - **Decision:** blocked by an unanswered item in `docs/OWNER_DECISIONS.md`; or
   - **External proof:** requires clinical, editorial, legal, accessibility, or physical
     device evidence that cannot be produced honestly in the repository alone.
3. The dense MDMA profile and sparse 2C-B profile use the same production renderer and
   have automated coverage for ordering, omission, uncertainty, long content, direct
   links, and relevant navigation behavior.
4. Emergency behavior is offline and action-first, supports absent or uncertain
   substance context, uses validated configuration rather than a hardcoded market, and
   has a safe dialer failure path. Market-specific behavior remains blocked until the
   owner records a launch-market decision.
5. Content review state distinguishes authorship, evidence assessment, and clinical
   approval without presenting draft content as approved.
6. The checklist and evidence ledger describe reality and link to the strongest proof.
7. The full repository gate set passes from a clean install-compatible checkout.

## Checkpoints

Work in this order. Finish and verify a checkpoint before moving on unless independent
work can safely proceed without hiding a failure.

### 0. Truth and test harness

- Preserve the checklist/status reconciliation already in the working tree.
- Extract oversized profile presentation into focused sections or selectors.
- Add the smallest established React Native component-testing setup that provides
  meaningful rendering and accessibility assertions; justify any dependency added.
- Add tests for the existing and newly separated effects groups.
- Fix any repository-owned CI failure encountered.

### 1. Complete one dense profile vertically

- Implement a deterministic Safety Snapshot with authored priority and non-color-only
  semantics; do not calculate a risk score.
- Model safety risks and linked harm-reduction actions or explicit editorial exceptions,
  then validate the invariant.
- Complete dose and timeline uncertainty semantics and accessible text presentation.
- Keep expected effects, unwanted effects, and variability separate.
- Make warning signs action-first and preserve optional substance context into emergency.
- Render offline citations and source details for substantive claims.
- Present plain-language pharmacology before collapsed deeper material while preserving
  uncertainty and evidence limitations.
- Implement only the bounded testing preview/handoff recorded in the owner decisions.

### 2. Prove sparse, uncertain, and navigation behavior

- Add sparse, uncertain, long-copy, long-name, and critical-priority fixtures without
  adding catalog breadth.
- Prove honest omission and unavailable states through production-renderer tests.
- Add typed, directional relationships and stack-preserving navigation coverage.
- Add contextual safety focus and safe direct-link recovery.
- Implement Recently Viewed invalid-ID cleanup and regression coverage without adding
  telemetry or sync.

### 3. Harden emergency and release evidence

- Put urgent actions before lower-urgency explanation.
- Replace hardcoded substance branching with validated content lookup.
- Introduce validated emergency-call configuration and capability/failure handling,
  stopping short of market-specific behavior until the owner decision exists.
- Add automated coverage for offline content, unknown/multiple-substance entry,
  large-content isolation, and dialer failure.
- Create a manual acceptance record for the approved device/accessibility matrix. Mark
  unrun checks as pending; never fabricate results.
- Update architecture, authoring, testing, and correction-workflow documentation.

## Validation loop

After each focused change, run the narrowest relevant tests. Before declaring any
checkpoint complete, run:

```text
npm run validate:content
npm run check:generated
npm run format
npm run lint
npm run typecheck
npm test
npm run build:smoke
```

If a gate fails, diagnose and fix repository-owned failures before continuing. Do not
silence, skip, or weaken a gate to obtain a pass.

## Progress contract

- Maintain a short checkpoint log at the end of this file containing the date, checklist
  IDs changed, proof added, full-gate result, and blockers.
- Update `docs/PHASE_2_EXECUTION_PLAN.md` whenever evidence changes.
- Use **Implemented**, **Partial**, **Missing**, **Decision**, and **External proof** with
  their existing definitions. Never use **complete** for unproven external acceptance.
- Keep changes reviewable and avoid mixing unrelated cleanup into a checkpoint.

## Pause conditions

Pause only when the next material step requires one of the following:

- writing or substantively changing safety, dose, emergency, or clinical claims;
- choosing a launch market, emergency number, evidence policy, review authority, or
  public-release policy not recorded in `docs/OWNER_DECISIONS.md`;
- claiming clinical, legal, editorial, accessibility, or device approval without an
  attached human-produced artifact;
- publishing, pushing, opening a pull request, deploying, or contacting an external
  person or service without explicit authorization;
- a destructive migration or architectural expansion beyond Phase 2.

When paused, finish all other independent safe work first, leave the repository passing,
record the exact decision or evidence needed, and name the next unblocked change.

## Non-goals

- Do not add substances for catalog breadth.
- Do not build Combination Checker, a full reagent workflow, accounts, cloud sync,
  telemetry, a CMS, remote content delivery, recommendations, a danger score, or
  personalized dose guidance.
- Do not replace the current stack or relax offline-first behavior.
- Do not rewrite reviewed safety copy merely to improve tone.
- Do not mark manual or external gates passed based on automated inference.

## Stopping condition

Stop when all locally implementable Phase 2 requirements are implemented with linked
automated proof, every remaining requirement is tied to a specific unresolved owner
decision or external acceptance artifact, the evidence ledger matches the code, and the
entire validation loop passes. Report what shipped, what remains externally blocked, and
the smallest next owner action.

## Checkpoint log

- 2026-09-07 — Owner locked the recommended Phase 2 defaults: USA launch market, `911`
  dialer behavior and fallback, review lifecycle and two-person critical approval,
  internal-alpha-first release policy, non-scored evidence presentation, bounded testing
  preview, and initial performance budgets. Reviewers and devices are arranged; dated
  external proof remains pending.
- 2026-09-07 — Reconciled the checklist and evidence ledger. Separated expected,
  unwanted, and variability effects through a sparse-aware selector. Added two selector
  tests. Full gate set passed with 95 tests and successful web/iOS/Android exports.
- 2026-09-07 — Checkpoint 0: extracted safety/dose/timeline/effects sections and added
  five React Native production-renderer tests. Evidence improved for 1.4, 5.1, 5.3,
  6.3, 7.3, 11.2, 13.1, and 14.5. Full validation loop passed, including all three
  Expo exports. External device/clinical proof remains pending; no checkpoint blocker.
- 2026-09-07 — Checkpoint 1 implementation and automated evidence: 1.1–1.4, 2.1–2.4,
  3.1–3.4, 4.1–4.4, 5.1–5.3, 6.1–6.4, 8.1–8.4, 9.1–9.4, and 10.1–10.6 now have
  production presentation/model seams. Added eight model tests and five rendering
  tests (10 component tests total). All seven gates passed with web/iOS/Android exports.
  Missing seed citations, evidence assessments, source types, original authorship,
  and clinical approval remain external editorial evidence; none was inferred.
  Testing preview wording still needs editorial reconciliation against D6. Independent
  navigation, persistence, and emergency implementation continues before any pause.
- 2026-09-07 — Checkpoint 2: added validated USA `911` emergency configuration with
  capability/failure fallback, moved urgent guidance first, removed MDMA-specific
  branching, added emergency tests, and hardened Recently Viewed stale-ID cleanup,
  serialized writes, and storage-failure handling. Added typed relationships, authoring,
  architecture, and correction-workflow documentation. Full gate set passed with 17
  component tests (22 tests total including the unit suite) and web/iOS/Android exports. Clinical, accessibility/device, editorial, legal,
  and store artifacts remain external proof; no pause condition was reached.
- 2026-09-07 — Added `docs/PHASE_2_ACCEPTANCE_MATRIX.md` with all manual device,
  accessibility, performance, and dialer checks explicitly Pending. This is the required
  human acceptance record; no external result was fabricated.
- 2026-09-07 — Stopping condition reached for local implementation: all locally
  verifiable profile, testing, evidence, emergency, navigation, persistence, privacy,
  and documentation seams have linked automated proof; the complete validation loop
  passes. Remaining work is explicitly External proof in the execution plan and the
  acceptance matrix: human clinical/editorial/source, accessibility/device/performance,
  legal/privacy, and store artifacts. Smallest next owner action: attach those dated
  artifacts and run the Pending manual matrix before public promotion.
- 2026-09-07 — Resume audit imported E1–E5 evidence. E2 establishes current editorial
  policy, but E1/E3/E4/E5 apply to version 0.4.2, build 118, and unresolved commit
  `31d2abc`; they name reviewed files and attachments absent from this checkout.
  Preserved draft runtime states, linked the historical evidence in the matrix, and
  recorded current content hashes plus the smallest revalidation request in
  `docs/evidence/CURRENT-CHECKOUT-AUDIT-2026-09-07.md`.
