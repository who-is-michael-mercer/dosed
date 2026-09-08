# Evidence index

This is the repository's evidence ledger. Implementation status belongs in
[`PHASE_2_EXECUTION_PLAN.md`](../PHASE_2_EXECUTION_PLAN.md); this file links the
dated evidence that supports those statuses.

| ID    | Artifact                                                                                         | Scope                                                                                       | Status                                           | Supports                            |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| E1    | [Clinical review — 2026-09-07](E1-clinical-review-2026-09-07.md)                                 | Clinical, dose-reference, testing, warning-sign, pharmacology, emergency, and source review | Approved for build 118 / commit `31d2abc`        | G1, content review claims           |
| E2    | [Editorial and source policy — 2026-09-07](E2-editorial-source-policy-2026-09-07.md)             | Source hierarchy, community-source limits, correction and withdrawal workflow               | Policy approved                                  | G2, editorial governance            |
| E3    | [Legal, privacy, and store review — 2026-09-07](E3-legal-privacy-store-review-2026-09-07.md)     | Internal-alpha legal, privacy, positioning, age, jurisdiction, and store scope              | Approved for internal alpha only                 | G5, internal-alpha release scope    |
| E4    | [Device and accessibility test — 2026-09-07](E4-device-accessibility-test-2026-09-07.md)         | Physical iOS/Android, VoiceOver, TalkBack, display, and defect retests                      | Passed for build 118 / commit `31d2abc`          | G4, device/accessibility proof      |
| E5    | [Internal-alpha release approval — 2026-09-07](E5-internal-alpha-release-approval-2026-09-07.md) | Release gate review and promotion authorization                                             | Internal alpha approved; public release excluded | C4, internal-alpha release decision |
| Audit | [Current-checkout applicability audit](CURRENT-CHECKOUT-AUDIT-2026-09-07.md)                     | Version/path/commit reconciliation and current content hashes                               | E1/E3/E4/E5 do not yet certify this checkout     | Current release boundary            |

## Missing repository artifacts

The following evidence is referenced by the implementation plan or acceptance
matrix but has not been imported into this repository:

- the supporting E1/E3 PDFs, E4 screenshots and recordings, and E4 issue-record
  attachments named by the imported notes;
- test or performance session records that measure the Phase 2 timing budgets;
- a revalidation record for the current checkout after the reviewed commit.

The imported records approve build 118 at commit `31d2abc`. The current checkout
is at a different commit and contains uncommitted changes, so those approvals do
not automatically certify the current checkout. Keep `Pending` in the
acceptance matrix until an artifact records the specific observed result.
