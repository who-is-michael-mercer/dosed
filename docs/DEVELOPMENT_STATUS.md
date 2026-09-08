# Development status — 2026-09-07

This is the current software inventory, superseding earlier blanket completion
claims. Work remains uncommitted; pre-existing edits were preserved. The user's
temporary waiver allows draft-content development, not clinical approval or public
release. No substance, dose, interaction, testing result, or emergency copy was
approved by this pass.

## Software implementation

| Area                 | Implemented and locally exercised                                                                                                                                                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Expo                 | SDK 57.0.20, React 19.2.3, RN 0.86.3; Expo-compatible Router, native peers, Jest and TypeScript 6; regenerated lockfile after stale native-peer resolution blocked incremental installation.                                                                                                                       |
| Library              | Authored category labels/order/descriptions, category-first and A–Z, virtualized sections, optional subgroup/tag filters, profile taxonomy links, empty filter handling, missing-art fallback. Four existing profiles retained; no classifications invented.                                                       |
| Search               | Repository-scoped runtime search, normalized names/aliases/curated terms, partial and bounded fuzzy matches, ambiguous results, input length guard, deferred result rendering, virtualized results, clear/empty/no-result states. Tests exercise the production scorer.                                            |
| Profiles             | Existing dense/sparse renderer, bounded authored Safety Snapshot, risk→action links, dose/timeline unavailable and uncertainty states, separate effects, evidence disclosures, progressive pharmacology, explicit relationships and testing preview retained. Taxonomy links now use validated data.               |
| Navigation           | Real Router tests cover search → profile → emergency → back with query restoration, stale deep-link recovery, category links, A–Z/filter clearing. Invalid testing IDs are checked against the actual profile; testing cannot recursively open itself. Missing routes and profiles retain Library/emergency exits. |
| Privacy              | History writes require 750ms of focused profile visibility and cancel on blur. Existing serialized storage/corruption/stale-ID tests retained. Library exposes local history clearing; no logging, telemetry, account, or sync added.                                                                              |
| Emergency            | Pure application dialer port with Expo adapter; actual capability/open assertions repair previously ineffective mocks. Unknown context always works. Independent generated urgent bundle excludes profile/search payloads. Return navigation and failure fallback remain available.                                |
| Accessibility/layout | Shared safe-area footer occupies layout space instead of covering content; Library includes top inset. Filters expose selection; lists remain usable with wrapping text. Decorative art is hidden from assistive technologies. Emergency-button contrast improved from 3.68:1 to 5.02:1 with automated regression. |
| Content pipeline     | Schema v4 supports optional authored many-to-many subgroups/tags, checks references/category applicability, allows art fallback, and deterministically generates/checks separate emergency/source artifacts. Draft and evidence metadata preserved.                                                                |

## Validation

Local environment: Linux, Node 26.7.0. CI remains Node 22 (SDK 57 requires
22.13+ on that line). The gate commands are:

```sh
npm ci
npm run validate:content
npm run check:generated
npm run format
npm run lint
npm run typecheck
npm test
npm run build:smoke
npx expo install --check
npx expo-doctor
```

Validation passed: clean `npm ci`, content validation, deterministic generated checks,
Prettier, ESLint, TypeScript, all 8 Node unit-test files, and all 30 component/Router
tests in 8 Jest suites. iOS, Android, and web production exports passed. Expo dependency
compatibility passed and Expo Doctor reported 21/21 checks passed. `git diff --check`
passed. Node 26 reports the unit files as top-level tests; this is not a claim that
there are only eight individual unit assertions. Automated tests are not physical-device
acceptance.

The final robustness audit also added a root error fallback that renders local
emergency guidance without navigating through a failed screen or displaying private
error details. Emergency now accepts optional assessment metadata required by the
existing release validator, without changing authored draft states. Keyboard avoidance
keeps the global footer in the iOS layout when entering search text; real-device
keyboard/reflow acceptance remains pending.

`npm audit --omit=dev` reports 13 moderate transitive findings rooted in
`decode-uri-component`/Router and `uuid`/Expo tooling. npm proposes incompatible
Expo/Router downgrades; no forced audit fix or unrelated dependency upgrade was
applied. Track compatible upstream corrections before release.

## Expo and device testing

The dependency graph and exports target SDK 57; physical iPhone execution is still
unverified. Stop any old SDK 54 Metro process, run `npx expo start --clear --go`,
then scan the QR code using current SDK 57 Expo Go on the same network.

This environment has no `maestro`, `adb`, or `xcrun` executable and no attached
iPhone/Android capability. Therefore Maestro, native installation, VoiceOver,
TalkBack, real Dynamic Type/reflow, low-memory/offline relaunch drills, real dialer
behavior, and D7 physical-device latency budgets remain unrun. Export success does
not prove them. The Maestro journey was corrected but is not claimed as passed.
No in-app browser connector is available for visual web QA in this session.

## Remaining software and product decisions

- Combination Checker: pair-vs-multi selection and outcome vocabulary remain
  unresolved in the master plan. A result engine or selector contract would require
  guessing those decisions. No interaction verdicts were fabricated.
- Full reagent guide: reagent scope, reaction representation, interpretation rules,
  and later-phase workflow remain unresolved. The locked D6 preview/handoff is
  implemented; no verification engine was invented.
- Catalog breadth: the specified four-profile development slice is retained.
  Additional authored profiles/classifications can use the pipeline; choosing
  memberships and new substantive copy is editorial work, not a missing UI blocker.
- Remote delivery/CMS/accounts/sync and broader release packaging are outside the
  locked local-first scope. Do not add services or credentials merely to fill a gap.
- Actual device/E2E findings may require further software fixes. Manual acceptance
  remains explicitly pending rather than hidden by unit-test results.

## Evidence / clinical review — deferred separately

- Existing profiles and emergency content remain draft; no assessment, approver,
  citation completeness, reviewer credential, or public approval was manufactured.
- Missing claim-level references, source classifications, evidence assessments,
  original authorship, and clinical review remain editorial/review work.
- Historical E1/E3/E4/E5 records name a different build/commit and absent attachments;
  they do not certify this working tree. See the existing evidence audit. Its code
  hashes predate this pass and are not an attestation of SDK 57 changes.
- Clinical/editorial, legal/privacy/store, and current-build device sign-off remain
  public-release requirements. The waiver changes none of these release gates.
