# 1. Repository Status

The repository is effectively greenfield. At audit time it contains one tracked file, `README.md`, whose entire content is the heading `# dosed`. There are no application sources, package manifests, lockfiles, assets, tests, CI workflows, editor settings, or existing product/architecture documents. Git has one initial commit on branch `work`, no configured remote, and a clean working tree before this document was added. No `AGENTS.md` exists in the repository or its parent workspace.

This document is planning only. It does not scaffold, install, or implement the application.

# 2. Executive Summary

Build the MVP as an offline-first Expo/React Native application in strict TypeScript. Use Expo Router for native stack/tab navigation and route parameters, Zustand only for small cross-flow session state, and an explicit repository layer over generated, validated local content assets. Keep editorial source data separate from generated runtime bundles.

The first slice should prove the permanent architecture with four deliberately different substances (MDMA, ketamine, psilocybin mushrooms, and 2C-B), category-first browsing, forgiving substance-only search, one complete MDMA profile, contextual navigation, and on-device Recently Viewed. Emergency should be designed and implemented early—before deep profile content—because it is a safety-critical global escape path, not an appendix.

Content correctness is a release dependency. Schemas, stable IDs, referential checks, claim-level citations, review metadata, and editorial review gates should precede library-scale content entry. No backend, account system, recommendation engine, or generalized CMS is justified for MVP.

# 3. Recommended Technical Stack

| Concern | Recommendation | Rationale |
|---|---|---|
| Mobile | Expo-managed React Native + strict TypeScript | Mature cross-platform delivery, accessible native controls, over-the-air-capable asset strategy, and lower operational cost than two native apps. Escape to custom native modules remains possible. |
| Routing | Expo Router over React Navigation primitives | Typed/file-based routes, native stacks, natural origin-aware back behavior, URL/deep-link readiness, and nested Library/Combos/Testing flows. Do not encode taxonomy as mandatory route nesting. |
| Client state | Local component state + Zustand for small transient cross-flow context | Keep profile origin, selected combo substances, testing selection, and contextual warning focus explicit without a large event/state framework. Persist only designated data. |
| Persistence | `expo-sqlite/kv-store`-compatible key/value adapter (or AsyncStorage if SDK constraints require it) | Recently Viewed is small, local, and account-free. Hide the implementation behind a versioned storage interface. SQLite remains available if offline preferences later grow. |
| Content | Authored YAML/JSON documents, validated with Zod at build/test time, compiled to normalized JSON/index assets | Human-reviewable diffs plus typed, fast, offline runtime data. A generator can build search and reference indexes without shipping authoring overhead. |
| Search | In-memory normalized index with deterministic scoring; bounded edit-distance/fuzzy matching (Fuse.js only if bundle/performance tests justify it) | Dataset is local and substance-only. A small explicit scorer makes priority and ambiguity behavior testable. Normalize Unicode, punctuation, spacing, hyphens, and known search terms. |
| UI | React Native `StyleSheet`, semantic design tokens, local font/illustration assets, Reanimated only where motion adds value | Avoid premature styling frameworks and keep dynamic type, reduced motion, and native semantics visible. |
| Validation/tests | Zod, Vitest/Jest-compatible unit runner selected with the Expo template, React Native Testing Library, Maestro E2E, axe-like/manual accessibility checks | Covers content, ranking, rendering, persistence, navigation, and device-level critical paths. Select exact runner versions during scaffold based on the then-current Expo template. |
| Quality/release | ESLint, Prettier, TypeScript, GitHub Actions, EAS Build/Submit/Update, Sentry after privacy review | Conventional maintenance and reproducible preview/release builds. Crash reporting must collect no substance-view history or sensitive content context by default. |

Flutter is a credible alternative, but React Native/Expo better fits content-heavy TypeScript schemas, generated assets, and common editorial/web tooling. A backend/CMS should wait until update cadence, author roles, and remote-content safety controls are understood.

# 4. Proposed Application Architecture

## Layers and boundaries

1. **Presentation:** route screens and reusable feature components. Screens compose sections; they do not parse raw content or calculate interaction meaning.
2. **Application:** use cases such as `searchSubstances`, `recordRecentlyViewed`, `getInteraction`, and context-handoff builders. This owns deterministic policy and orchestration.
3. **Domain/content:** strict models, enums, invariants, validators, and stable identifiers. Safety priority is a claim property, never a derived substance score.
4. **Infrastructure:** generated local-content repository, search index, persistence adapter, asset resolver, optional telemetry boundary, and platform services.
5. **Editorial pipeline:** source documents → schema validation → semantic/referential lint → generated runtime bundles and search indexes. Generation output is deterministic and reviewed.

Feature folders may import shared domain/design modules but not another feature's screen internals. Repository interfaces prevent screens from depending on whether content is bundled or remotely delivered later.

## Navigation and context

Use a root native stack containing the main app shell and an emergency stack/modal that is reachable from every primary screen. The main shell exposes Library, Combos, and Testing entry points; Profile is pushed from the user's actual current stack, preserving the native back stack, browse filters, search query, list position, and profile scroll position.

Route identity carries stable IDs only. Typed, ephemeral navigation context carries `origin`, `interactionId`, `testingProfileId`, and an optional `focusClaimId`. Thus Profile → Combos preselects the profile substance; Combos → Profile can focus the relevant claim without mutating canonical content; Profile → Testing preselects the testing profile. A direct/deep link lacking context still renders safely. Context is validated and ignored gracefully if stale.

Do not model categories/subgroups as required breadcrumbs. Related-substance taps push a new Profile and retain the previous profile in the stack. Emergency opens immediately, accepts known IDs when available, and always supports unknown substance/dose, adulteration, and polysubstance cases.

## State and persistence

- **URL/route state:** selected entity IDs and stable entry-point context.
- **Screen state:** search query, chips, disclosure expansion, and local UI controls.
- **Session store:** combo draft, testing selection, focus context, and restoration metadata.
- **Persistent local store:** deduplicated, capped Recently Viewed entries (`substanceId`, last-viewed timestamp), schema version, and later only explicit preferences.
- **Content repository:** immutable per app/content version. Missing or broken references fail CI, not at runtime; runtime still has defensive unavailable states.

Recently Viewed is written after a profile becomes meaningfully visible, ordered newest first, and hidden—not replaced with an empty panel—when empty. No health/substance history is sent off-device.

## Offline, loading, and errors

All core MVP reference content, search indexes, emergency guidance, and required illustrations ship locally and work without connectivity. App launch does not require a loading network request. Generated assets are versioned; future remote updates must be signed/checksummed, atomically installed, rollback-capable, and must never remove the last valid emergency bundle. Missing optional art falls back to a category family treatment. Missing optional sections are omitted honestly; missing critical content produces a controlled error and is a release-blocking validation failure.

## Design and accessibility architecture

Semantic tokens separate palette from intent: neutral, informational, important, critical, and emergency. Critical states combine icon, heading, copy, placement, and contrast rather than color alone. Emergency uses a restrained high-urgency theme with action-first copy and minimal brand personality. All primitives support font scaling, reflow, minimum 44×44-point targets, screen-reader order/labels, focus movement, reduced motion, and high contrast. Dense reference tables receive text alternatives and must not require horizontal precision gestures.

# 5. Proposed Repository Structure

```text
/
├── app/                         # Expo Router routes; composition only
│   ├── _layout.tsx
│   ├── (main)/
│   │   ├── library/
│   │   ├── combos/
│   │   └── testing/
│   ├── substance/[substanceId].tsx
│   └── emergency/
├── src/
│   ├── application/             # use cases and context handoffs
│   ├── components/              # shared accessible UI primitives
│   ├── design/                  # tokens, themes, type, motion
│   ├── domain/                  # models, IDs, schemas, invariants
│   ├── features/
│   │   ├── library/
│   │   ├── search/
│   │   ├── profile/
│   │   ├── combos/
│   │   ├── testing/
│   │   └── emergency/
│   ├── infrastructure/          # content, persistence, observability
│   └── test/                    # fixtures and shared harness
├── content/
│   ├── substances/              # editorial source documents
│   ├── taxonomy/
│   ├── interactions/
│   ├── reagents/
│   ├── emergency/
│   └── sources/
├── generated/                   # deterministic runtime content; policy TBD
├── assets/
│   ├── fonts/
│   ├── illustrations/
│   └── icons/
├── scripts/                     # validate/generate/check references
├── e2e/
├── docs/
├── .github/workflows/
├── app.config.ts
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

Generated files should carry a header and be changed only by scripts. Whether they are committed is decided in foundation work; committing a deterministic bundle can make release artifacts easier to audit.

# 6. Proposed Data Architecture

All substantive entities and claims receive opaque, stable, human-readable IDs (for example `substance.mdma`, not display-name-derived routing). Display order is explicit. Localized/display strings never act as keys.

| Model | Shape and ownership | Relationships / evidence / ordering |
|---|---|---|
| **Substance** | Referenced root entity: ID, canonical name, identity sentence, aliases, category IDs, subgroup IDs, visual key, orientation, structured profile sections, content status/review dates. | References taxonomy, routes, relationships, testing profile, claims, and sources. Section order is product-defined; sparse sections may be absent. |
| **Alias** | Embedded value with ID, text, kind (`common`, `slang`, `abbreviation`, `chemical`, `misspelling/search`), display/search flags, reliability note, locale, rank. | An alias can point to multiple substance IDs in the generated reverse index; ambiguity is preserved. Curated display order. |
| **Category / Subgroup** | Referenced taxonomy entities with stable IDs, label, description, visual identity, and order. Subgroups reference applicable categories but remain optional browse facets. | Substance↔category/subgroup is many-to-many. Referential validation prevents an ordinary class becoming an accidental “Weird Shit” fallback. |
| **Route** | Referenced controlled vocabulary (`oral`, `insufflated`, etc.) with neutral display copy; unknown/other is not fabricated. | Reused by dose and timeline records. Route applicability lives on those records. |
| **Dose Reference** | Embedded in Substance: ID, route ID, labeled ranges, units, precision qualifier, context, potency note, redosing note, evidence IDs, source IDs, order. | Never represented as a recommendation. Validator checks units/range ordering without asserting safety. Evidence/citations required. |
| **Timeline** | Embedded route-aware record with ID and ranged phases: onset, come-up, main effects, after-effects; residual notes and uncertainty. | Route reference; explicit units/min/max and display order. Source/evidence attachment required. Absence renders “data unavailable,” not zero. |
| **Effect / Unwanted Effect** | Embedded claims with stable IDs, concise label/body, commonality qualifier where supported, variability factors, evidence/source IDs, order. | Separate collections and semantics; not `good`/`bad`. Claim-level evidence supported. |
| **Safety Claim** | Embedded/referenced claim record: ID, title/body, priority (`critical`, `important`, `context`), trigger/context, observable consequence, action IDs, evidence/source IDs, editorial rationale fields not exposed. | May be shared/referenced where interaction-specific; priority/order required. No substance aggregate. Context may elevate presentation without changing stored priority. |
| **Harm-Reduction Action** | Embedded beside a substance claim unless reusable emergency action: ID, phase (`before/during/after` optional), behavior-first text, linked risk claim IDs, priority/order, evidence/source IDs. | Many actions may address one risk and vice versa. Validator requires actionable major risks to have counterparts or a documented exception. |
| **Interaction** | Referenced canonical unordered set/pair record with ID, participant substance/class IDs, consequence/mechanism, situation qualifiers, priority, actions, uncertainty, evidence/source IDs. | Many-to-many. Canonical participant sorting prevents duplicates. Supports more than two participants structurally, while MVP UI can start with pairs. |
| **Substance Relationship** | Embedded edge or generated referenced edge: ID, from/to IDs, typed relationship, directionality, explanatory text, source/evidence IDs, order. | Explicit only; inverse edges generated only when semantics allow. No recommendation score. |
| **Testing Profile** | Referenced by substance: ID, specimen/context notes, limitations, misrepresentation/adulteration claims, reagent reaction IDs, lab-identification guidance, source/review metadata. | Can map multiple substances to one profile and one substance to variants if necessary. “Consistent with” language is validated editorially. |
| **Reagent Reaction** | Referenced record: ID, substance/test target, reagent ID, time windows, color-transition sequence, caveats/interferences, evidence/source IDs. Reagent itself is controlled vocabulary. | Many-to-many across substances and reagents. Ordered stages; never yields a `verified` boolean. Image alt text/fallback required where visual references exist. |
| **Emergency Sign** | Referenced or embedded sign: ID, observable wording, band (`expected`, `pay_attention`, `get_help`), immediate actions, context/substance IDs, order, source IDs. | General signs cover unknown cases; substance-specific additions merge deterministically. Urgent action precedes explanation. |
| **Pharmacology Claim** | Embedded claim: ID, level (`plain`, `mechanism`, `deep`), body, targets/processes as structured metadata when useful, uncertainty, evidence/source IDs, order. | Plain-language claim must precede linked machinery. Conflicts can reference competing claim IDs. |
| **Evidence Metadata** | Referenced record or embedded evidence assessment: ID, strength label (configurable), basis types, population/applicability, limitations, conflict flag, assessment/review date. | Attaches to claims, never every sentence by requirement. Labels are presentation-configurable because final UX is unresolved. |
| **Source / Citation** | Referenced bibliography entity: ID, title, authors/organization, publication, year/date, DOI/PMID/URL, access date, source type, optional locator and retraction/status metadata. | Many-to-many claim↔source through citation references that can include locators/notes. Sources are deduplicated and link-checked. |

Small profile-local records are embedded to keep one substance auditable. Globally shared entities—taxonomy, routes, interactions, reagents, evidence assessments, sources—are referenced. Generated indexes denormalize for runtime reads; editorial sources remain authoritative.

# 7. Master TODO Backlog

Legend: **Blocks** means the item gates meaningful later work, not merely that another task benefits from it.

## A. Project Foundation

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Record architecture decisions and choose current Expo template/tool versions; prevents foundation drift. | P0 | S | Approval | PARTIALLY DEFINED | Yes |
| Scaffold strict TypeScript Expo app, package scripts, aliases, lint/format/typecheck, and pinned lockfile. | P0 | M | Stack ADR | LOCKED | Yes |
| Add CI for install, generated-file check, validation, lint, typecheck, unit tests, and build smoke test. | P0 | M | Scaffold | LOCKED | Yes |
| Establish environment/config and privacy-safe logging rules; avoid accidental sensitive analytics. | P1 | S | Scaffold, privacy decision | PARTIALLY DEFINED | No |

## B. Application Architecture

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Implement presentation/application/domain/infrastructure boundaries and import rules. | P0 | M | Foundation | LOCKED | Yes |
| Define repository, storage, clock, asset, and observability interfaces with test fakes. | P0 | M | Domain IDs | PARTIALLY DEFINED | Yes |
| Define typed result/error/unavailable states; sparse or stale content must fail safely. | P1 | S | Boundaries | LOCKED | No |
| Add content-version compatibility and migration seams without a remote service. | P1 | M | Schema, persistence | PARTIALLY DEFINED | Yes |

## C. Design System

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Define semantic color, type, spacing, radius, surface, icon, and motion tokens in dark-first themes. | P0 | M | Brand review | PARTIALLY DEFINED | Yes |
| Build accessible Text, Surface, Button, Link, Chip, Card, Divider, Icon, and Section primitives. | P0 | L | Tokens | LOCKED | Yes |
| Build Important/Critical callouts and separate Emergency primitives with non-color cues. | P0 | M | Tokens, safety semantics | LOCKED | Yes |
| Build section headers, metadata rows, disclosure, timeline, evidence indicator, skeleton/error, and illustration fallback primitives. | P1 | L | Core primitives | PARTIALLY DEFINED | No |
| Stress-test long names/aliases, Dynamic Type, narrow screens, dense and sparse content. | P1 | M | Primitives, fixtures | LOCKED | No |

## D. Navigation

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Define typed route contract and native stacks for Library, Profile, Combos, Testing, and Emergency. | P0 | M | Foundation | LOCKED | Yes |
| Preserve actual origin, filter/query/list scroll, and profile scroll on back. | P1 | L | Route contract, screens | LOCKED | Yes |
| Implement validated Profile↔Combos and Profile→Testing context handoffs/focus IDs. | P1 | M | Domain IDs, feature shells | LOCKED | Yes |
| Add direct-link fallback behavior and later-ready deep-link mapping. | P2 | S | Route contract | PARTIALLY DEFINED | No |

## E. Data / Content Models

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Define branded stable IDs, enums, Zod schemas, and inferred TypeScript types for every model in §6. | P0 | XL | Data ADR, evidence decision | PARTIALLY DEFINED | Yes |
| Encode invariants: route-aware ranges, priority on claims, no aggregate risk, citation/review requirements, unique IDs. | P0 | L | Schemas | LOCKED | Yes |
| Validate cross-references, relationship direction, interaction uniqueness, ordering, asset existence, and risk→action links. | P0 | L | Schemas | LOCKED | Yes |
| Create dense, sparse, uncertain, long-text, unknown-data, and critical-override fixtures. | P0 | M | Schemas | LOCKED | Yes |
| Define additive schema versions and content migration policy. | P1 | M | Schemas | PARTIALLY DEFINED | Yes |

## F. Substance Library

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Build Library hierarchy: Search, category-first browse, conditional Recent, and A–Z. | P1 | L | Cards, repository, navigation | LOCKED | No |
| Build category and optional contextual subgroup views/chips without mandatory nesting. | P1 | M | Taxonomy, navigation | LOCKED | No |
| Implement exact Standard/Compact card contracts and visual-family/fallback treatment. | P1 | M | Design primitives, models | LOCKED | Yes |
| Add no-content, missing-art, loading/error, long-list, and large-library virtualization states. | P1 | M | Library screens | LOCKED | No |

## G. Search

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Build normalized index for canonical, alias, abbreviation, chemical, formatting, and misspelling fields. | P0 | M | Content schema | LOCKED | Yes |
| Implement deterministic tiered ranking, prefix/partial and bounded fuzzy scoring. | P1 | L | Index | LOCKED | No |
| Preserve ambiguous slang as multiple results with identifier-reliability guidance. | P1 | M | Ranking, alias model | LOCKED | No |
| Add accessible results, debounce, empty query, no-results, typo, long-query, and performance behavior. | P1 | M | UI, ranking | LOCKED | No |

## H. Recently Viewed

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Implement versioned local repository, dedupe, recency ordering, cap, invalid-ID cleanup, and migration. | P1 | M | Storage interface, IDs | LOCKED | No |
| Record meaningful profile views and render Compact Cards; hide section when empty. | P1 | S | Profile, Library | LOCKED | No |
| Test reinstall/upgrade expectations, corruption fallback, and privacy/no-sync behavior. | P2 | S | Persistence | PARTIALLY DEFINED | No |

## I. Substance Profiles

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Compose five progressive layers with omitted-section and unavailable-data rules. | P1 | XL | Models, primitives | LOCKED | No |
| Build Snapshot with identity, aliases, compact orientation, and at most warranted critical callouts. | P1 | M | Safety selector | LOCKED | Yes |
| Build Before You Take It, What to Expect, Know What You Have, and Rabbit Hole modules. | P1 | XL | Feature models | LOCKED | No |
| Add taxonomy chips, explicit relationships, profile-to-profile stack behavior, and contextual focus. | P1 | M | Relationships, navigation | LOCKED | No |
| Test sparse/dense profiles, long content, cross-reference failure, scroll restoration, and section accessibility. | P1 | L | Profile composition | LOCKED | No |

## J. Safety Priority System

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Encode claim-level Critical/Important/Context semantics and editorial validation; prohibit substance scores. | P0 | M | Safety schema | LOCKED | Yes |
| Implement deterministic placement and maximum Snapshot interruption rules. | P1 | M | Profile, callouts | LOCKED | No |
| Implement ephemeral context elevation that cites interaction context without mutating canonical priority. | P1 | M | Navigation context, interactions | LOCKED | No |
| Add visual/regression/accessibility tests for each priority and multiple-callout edge cases. | P1 | M | UI | LOCKED | No |

## K. Dose / Potency

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Validate route-specific descriptive ranges, units, uncertainty, precision, and citations. | P1 | M | Route/dose schema | LOCKED | No |
| Render reference ranges separately from potency/sensitivity and redosing considerations. | P1 | M | Profile primitives | LOCKED | No |
| Add copy lint against “safe/recommended dose,” universal ranges, calculators, and unsupported precision. | P1 | S | Editorial tooling | LOCKED | No |

## L. Timeline

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Validate route-aware ranged phases and explicit residual/unknown states. | P1 | M | Timeline schema | LOCKED | No |
| Build accessible visual-and-text timeline without false precision or baseline implication. | P1 | L | Design primitives | LOCKED | No |
| Test delayed onset, overlapping routes, long duration, absent phases, and font scaling. | P1 | M | Timeline UI | LOCKED | No |

## M. Effects

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Render Common Effects, Common Unwanted Effects, and substance-specific variability separately from risks. | P1 | M | Effect schemas, profile | LOCKED | No |
| Support evidence-aware qualifiers, ordering, sparse data, and no `good`/`bad` labels. | P1 | S | Evidence interface | LOCKED | No |

## N. Harm Reduction

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Model and render prioritized Risk→Action links, optionally grouped Before/During/After. | P1 | L | Safety/action schema | LOCKED | No |
| Validate every major actionable risk has an action or reviewed exception; reject generic padding. | P0 | M | Content linter | LOCKED | Yes |
| Test missing phase groups, one-to-many links, and action-first screen-reader order. | P1 | S | UI | LOCKED | No |

## O. Combination Checker

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Finalize pair vs multi-select MVP behavior and interaction outcome vocabulary. | P0 | M | Product decision | UNRESOLVED | Yes |
| Build substance selector using search with preselection and duplicate prevention. | P1 | M | Search, navigation context | LOCKED | No |
| Implement canonical interaction lookup, qualifier handling, unknown/no-data distinction, consequence/mechanism, actions, evidence. | P1 | L | Interaction schema/content | PARTIALLY DEFINED | No |
| Link to profiles with focused interaction context and preserve combo draft on back. | P1 | M | Navigation | LOCKED | No |
| Test symmetry, class-vs-substance rules, 3+ cases if supported, missing data, and serious-context elevation. | P1 | L | Logic, fixtures | PARTIALLY DEFINED | No |

## P. Testing / Reagent Guide

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Finalize supported reagents, reaction representation, time/color accessibility, and regional caveats. | P0 | M | Expert/editorial input | UNRESOLVED | Yes |
| Build preselected substance guide explaining capability, “consistent with” result, and limitations before results. | P1 | L | Testing schema, navigation | LOCKED | No |
| Render ordered color/time reactions with text equivalents, interference and adulteration notes, plus lab-identification route. | P1 | L | Reagent data, design | PARTIALLY DEFINED | No |
| Add unknown/unlisted/no-data paths and prohibit confirmed/verified claims. | P1 | M | Editorial lints | LOCKED | No |
| Test color-blind usability, timing ambiguity, multiple reagents, and image fallback. | P1 | M | UI/data | LOCKED | No |

## Q. Emergency Pathway

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Obtain clinical/legal review of universal and substance-specific emergency content and locale behavior. | P0 | L | Target-market decision | UNRESOLVED | Yes |
| Build persistent “Something feels wrong?” access and root emergency route with unknown substance/dose/multiple/adulteration support. | P1 | L | Navigation, reviewed content | LOCKED | No |
| Render action-first observable signs as Expected / Pay attention / Get emergency help, never diagnostic severity labels. | P1 | L | Emergency model/design | LOCKED | No |
| Implement locale-aware emergency calling guidance, safe offline fallback, and confirmation behavior that never delays action. | P1 | M | Market/legal decisions | UNRESOLVED | No |
| Test locked/offline-like conditions, screen reader, large text, one-handed use, orientation, interruption, and known-context merge. | P0 | L | Emergency UI | LOCKED | Yes |

## R. Evidence / Citations

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Define claim-source links, evidence bases, applicability, conflict, review dates, and literature-depth descriptor. | P0 | L | Evidence product decision | PARTIALLY DEFINED | Yes |
| Keep label vocabulary/presentation configurable and show signals only where material. | P1 | M | Evidence model, design | PARTIALLY DEFINED | No |
| Build citations/source details, stable locators, offline metadata, broken-link/retraction checks. | P1 | L | Source corpus | LOCKED | No |
| Clearly distinguish community reports and inferred mechanisms from clinical evidence. | P1 | M | Editorial rules | LOCKED | No |

## S. Content Infrastructure

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Define authoring format/templates, ownership, lifecycle (`draft/reviewed/published/retired`), reviewer, review date. | P0 | M | Schemas, governance | PARTIALLY DEFINED | Yes |
| Build deterministic validate/generate/index pipeline with actionable paths and committed-output policy. | P0 | L | Schemas | LOCKED | Yes |
| Add semantic/editorial lints, orphan/broken reference checks, duplicate alias warnings, asset/alt validation. | P0 | L | Pipeline | LOCKED | Yes |
| Establish medical/editorial two-person review, source acceptance, correction, and urgent-update procedures. | P0 | M | Product ownership | UNRESOLVED | Yes |
| Design—but do not build—signed atomic remote bundle/rollback path when update needs justify it. | P3 | M | Proven cadence | PARTIALLY DEFINED | No |

## T. Accessibility

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Set accessibility baseline: WCAG-informed contrast, 44-point targets, semantic headings/labels, focus, Dynamic Type. | P0 | M | Design tokens | LOCKED | Yes |
| Honor reduced motion; ensure severity, timelines, reactions, and charts have non-color/text equivalents. | P1 | M | Relevant components | LOCKED | No |
| Test VoiceOver/TalkBack, font scaling, narrow/large screens, switch/keyboard where supported, and emergency task completion. | P1 | L | Feature slices | LOCKED | Yes |

## U. Testing / QA

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Establish test pyramid, fixtures/builders, deterministic clocks/storage, coverage expectations, and CI gates. | P0 | M | Foundation | LOCKED | Yes |
| Unit-test schemas, search tiers/fuzziness/ambiguity, interactions, priority selection, generation, and migrations. | P0 | L | Domain/application code | LOCKED | Yes |
| Integration-test Library/Profile sparse+dense rendering, Recent, context handoffs, testing data, and emergency merge. | P1 | L | Features | LOCKED | No |
| Add Maestro smoke paths and real-device matrix for iOS/Android, offline, rotation, memory pressure, and interruptions. | P1 | L | Stable builds | LOCKED | Yes |
| Conduct clinician/editorial safety QA and regression checklist on every content release. | P0 | L | Governance/content | UNRESOLVED | Yes |

## V. Performance

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Set budgets for cold launch, search response, list/profile rendering, bundle/assets, and low-end devices. | P1 | S | Representative slice | PARTIALLY DEFINED | No |
| Prebuild indexes, virtualize A–Z/category lists, memoize selectors, size illustrations, and avoid parsing source YAML at runtime. | P1 | M | Content pipeline/UI | LOCKED | No |
| Profile large-library, dense-profile, low-memory, and offline startup fixtures; prevent emergency path delay. | P1 | M | Expanded fixtures | LOCKED | Yes |

## W. Documentation

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Expand README and add AGENTS, product spec, architecture, data/content models, editorial rules, roadmap, ADRs, testing/release runbooks. | P0 | L | Approval/decisions | PARTIALLY DEFINED | Yes |
| Document content authoring, validation errors, citation policy, critical-change review, and emergency escalation. | P0 | M | Governance | UNRESOLVED | Yes |
| Keep diagrams and generated examples checked by CI to prevent documentation drift. | P2 | S | Pipeline | PARTIALLY DEFINED | No |

## X. Release Readiness

| Task / why | Pri | Size | Dependencies | Status | Blocks |
|---|---:|---:|---|---|---|
| Decide launch countries/languages; complete medical, legal, privacy, accessibility, and app-store policy reviews. | P0 | XL | Product ownership, content | UNRESOLVED | Yes |
| Configure identifiers, signing, EAS profiles, environments, store metadata, privacy disclosures, and support/correction channel. | P1 | L | Market decisions, stable app | PARTIALLY DEFINED | Yes |
| Define content freeze, source/review-date audit, emergency drill, rollback, incident response, and go/no-go checklist. | P0 | L | Governance, builds | UNRESOLVED | Yes |
| Run beta on representative devices/users without collecting sensitive history; triage safety/usability findings. | P1 | L | Feature complete | PARTIALLY DEFINED | Yes |

# 8. Dependency Map

## Foundational chains

```text
Approved stack/ADRs
  → Expo scaffold + CI
  → architecture boundaries + test harness
  → every feature slice

Stable IDs + structured schemas
  → authoring templates + representative content
  → referential/semantic validation
  → generated repository + search index
  → Library/Profile
  → Combos/Testing/Evidence rendering

Brand direction
  → semantic design tokens
  → accessible primitives + safety/emergency states
  → cards and Library
  → profile modules, timelines, reagents

Typed navigation contract
  → Library/Search → Profile
  → origin/scroll restoration
  → Profile ↔ Combos and Profile → Testing
  → contextual claim elevation

Clinical/editorial governance
  → approved safety/evidence/testing/emergency content
  → safety-critical feature completion
  → release audit and store submission
```

## Parallel work

After schemas/tokens stabilize, content authoring, search scoring, storage, navigation shell, illustration exploration, and primitive accessibility tests can proceed independently. Following the Library/Profile slice, Combos interaction logic, reagent guide rendering, emergency UI, and deeper Rabbit Hole modules can proceed in parallel against reviewed fixtures. Documentation and QA automation evolve continuously rather than waiting for feature completion.

## Work that should intentionally wait

- Full-library population waits for schemas, semantic lints, representative content review, and proven profile rendering.
- Full Combos UI waits for outcome vocabulary and pair/multi-select decision.
- Reagent catalog population waits for supported test set, source standard, and accessible reaction representation.
- Localized emergency calling waits for target launch markets and reviewed wording; general emergency architecture need not wait.
- Remote content delivery/CMS, telemetry expansion, and deep-link marketing routes wait for demonstrated MVP need.
- Deep pharmacology visualizations wait until plain-language hierarchy and evidence UX are validated.

# 9. Proposed Implementation Phases

## Phase 0 — Decisions, foundation, and safety governance

- **Goal:** Create a reproducible project and the rules that keep safety-critical content auditable.
- **Deliverables/tasks:** Stack/architecture/content ADRs; Expo scaffold; lint/typecheck/test/build CI; privacy baseline; stable-ID conventions; schema skeleton; content lifecycle; clinical/editorial owners; launch-market decision initiated.
- **Dependencies:** Plan approval and named product/content decision-makers.
- **Definition of done:** Fresh checkout passes documented CI; boundaries are enforced; a sample invalid content file demonstrably fails; critical changes have an accountable review path.
- **Do not build:** Feature screens, full content, backend, CMS, analytics.

## Phase 1 — Real Library/Profile vertical slice

- **Goal:** Produce a small offline product that proves data, visual language, navigation, search, and persistence end to end.
- **Deliverables/tasks:** Core schemas/generator/repository; tokens/primitives; typed navigation; four-substance dataset; category browse, A–Z, search states, cards; complete MDMA profile; skeletal valid profiles for other fixtures; Recently Viewed; persistent emergency entry opening a reviewed interim emergency shell; unit/integration/E2E tests.
- **Dependencies:** Phase 0, first content review, baseline design choices.
- **Definition of done:** On iOS and Android, a user can find MDMA via `MDMA`/`molly`, browse to it, read safety-first content offline, return to exact prior state, and see it in Recent after relaunch. `2cb` finds 2C-B; ambiguity fixtures do not auto-resolve; large text and screen reader paths work.
- **Do not build:** Full combos, reagent workflows, complete library, elaborate Rabbit Hole visualization.

## Phase 2 — Profile breadth and emergency pathway

- **Goal:** Complete safety-first single-substance decision support and the global urgent path before broadening tools.
- **Deliverables/tasks:** Snapshot override, risk→action, dose/potency, route timelines, effects/variability, When to get help, relationships, testing preview, plain/deep pharmacology disclosures, evidence/citations, full emergency flow including unknown/multiple cases.
- **Dependencies:** Phase 1 and approved emergency/safety content.
- **Definition of done:** Dense and sparse representative profiles satisfy hierarchy; every major risk links to action; urgent flow is action-first, offline, clinically reviewed, and passes device/accessibility drills.
- **Do not build:** Library-scale content or remote updates.

## Phase 3 — Combination Checker vertical slice

- **Goal:** Deliver explainable multi-substance decision support with contextual navigation.
- **Deliverables/tasks:** Final interaction vocabulary; selector/preselection; lookup and no-data semantics; consequence/mechanism/actions/evidence; context focus back to Profile; draft restoration; representative high-, uncertain-, and absent-data interactions.
- **Dependencies:** Interaction product decision, reviewed content, search/navigation/safety systems.
- **Definition of done:** Symmetric inputs resolve consistently; absence of data is not presented as safety; selected serious interaction can focus the right profile claim and back restores the combo.
- **Do not build:** Recommendation logic, exhaustive simplistic “never mix” pages, personalized advice.

## Phase 4 — Testing/Reagent Guide vertical slice

- **Goal:** Reduce identity uncertainty without overstating reagent capability.
- **Deliverables/tasks:** Supported reagent set; preselected profile handoff; accessible reaction sequences; limitations/misrepresentation/adulteration; unknown/unlisted paths; source details.
- **Dependencies:** Testing decisions, reviewed data, visual accessibility primitives.
- **Definition of done:** Results always use bounded “consistent with” meaning, never verified identity/purity/dose; time/color information has text equivalents and works offline.
- **Do not build:** Lab marketplace, user result storage, camera/color diagnosis.

## Phase 5 — Content expansion and editorial depth

- **Goal:** Grow a coherent, reviewed library without eroding quality.
- **Deliverables/tasks:** Prioritized MVP substance list; taxonomy edge-case decisions; complete profiles/interactions/testing links; citations/review dates; illustration/fallback assets; content dashboard generated from validation reports.
- **Dependencies:** Proven models/components and staffed review workflow.
- **Definition of done:** Agreed MVP coverage has no broken links, orphan sources, overdue reviews, unsupported precision, or unreviewed critical copy; sparse data is represented honestly.
- **Do not build:** Algorithmic recommendations, universal search, CMS unless authoring evidence demands it.

## Phase 6 — Hardening and release

- **Goal:** Make the complete MVP reliable, accessible, performant, and releasable.
- **Deliverables/tasks:** Full regression/E2E/device matrix; large-dataset profiling; accessibility audit; privacy/legal/clinical reviews; beta; signing/store assets; incident/rollback/correction drills.
- **Dependencies:** Feature/content freeze and target markets.
- **Definition of done:** All P0/P1 gates pass, critical defects are zero, emergency drill succeeds, content bundle is reviewed/versioned, and release checklist has accountable sign-off.
- **Do not build:** Accounts, social, logging, marketplace, AI, personalization, or unrelated growth features.

# 10. First Recommended Vertical Slice

Use four representative substances:

- **MDMA:** aliases (`molly`, `ecstasy`), stimulant/psychedelic taxonomy tension without a separate empathogen top level, critical interaction and hyperthermia context, route-aware timeline, testing data hook, and rich evidence.
- **Ketamine:** short alias (`ket`), dissociative identity, sedation/impairment and combination relevance, different timeline and harm-reduction shape.
- **Psilocybin Mushrooms:** slang (`shrooms`), variable natural material/potency and visual-identification uncertainty, demonstrating that the model is not molecule-only.
- **2C-B:** punctuation-normalization (`2cb`), subgroup browsing, long/alternate chemical naming, potency sensitivity and sparse evidence cases.

Ship one editorially complete MDMA profile across all five layers, while the other three use honest, schema-valid partial profiles designed to test omission and unavailable-data states—not filler copy. Add a deliberately ambiguous alias fixture only in tests unless editors approve a real example.

The user-visible slice contains: category-first Library; Search; conditional Recently Viewed; A–Z; category/subgroup chips; Standard/Compact Cards; Profile Snapshot plus progressive sections; explicit related links; persistent emergency entry to an interim reviewed shell; origin-aware back and scroll restoration. Combos and Testing buttons may route to clearly labeled bounded preview screens only if those screens provide useful limitations/context; otherwise omit the CTA rather than ship dead controls.

Acceptance scenarios include exact/alias/abbreviation/normalized/fuzzy/no-result/ambiguous searches; new-user Recent absence; persistence and stale-ID cleanup; offline relaunch; long text; sparse/dense profiles; critical override; related navigation; screen reader; large type; reduced motion; and iOS/Android smoke runs.

# 11. Recommended First Implementation Batch

After explicit approval, create exactly the foundation and vertical-slice skeleton below before broader feature work:

1. Root/config: `package.json`, lockfile, `app.config.ts`, `eas.json`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.gitignore`, and `.github/workflows/ci.yml`.
2. Routes: `app/_layout.tsx`, `app/(main)/_layout.tsx`, `app/(main)/library/index.tsx`, `app/(main)/library/search.tsx`, `app/(main)/library/category/[categoryId].tsx`, `app/substance/[substanceId].tsx`, and `app/emergency/index.tsx`.
3. Domain: `src/domain/ids.ts`, `taxonomy.ts`, `substance.ts`, `route.ts`, `claims.ts`, `dose.ts`, `timeline.ts`, `interaction.ts`, `testing.ts`, `emergency.ts`, `evidence.ts`, `source.ts`, and `schemas/index.ts`.
4. Infrastructure/application: `src/infrastructure/content/LocalContentRepository.ts`, `src/infrastructure/persistence/RecentlyViewedRepository.ts`, `src/application/search/searchSubstances.ts`, `src/application/recent/recordRecentlyViewed.ts`, and navigation context helpers.
5. Design/components: token files plus `Text`, `Surface`, `Button`, `Chip`, `StandardSubstanceCard`, `CompactSubstanceCard`, `SafetyCallout`, `Section`, `Timeline`, `EvidenceIndicator`, `EmergencyAccess`, and fallback/error components.
6. Features: Library, SearchResults, ProfileScreen with section modules, RecentlyViewed, and reviewed emergency-shell components.
7. Content/tooling: taxonomy/routes/sources and four substance source documents; `scripts/validate-content.ts`, `scripts/generate-content.ts`, generated repository/search index, and representative invalid fixtures.
8. Tests: schema/reference/generation tests; search ranking and ambiguity tests; persistence tests; Library/Profile/context rendering tests; and one Maestro Library→Search→Profile→back→Recent scenario.
9. Documentation: expand `README.md`; add `AGENTS.md`, core docs listed in §13, and initial ADRs for stack/content/navigation.

Do not create any of these until approval of this plan.

# 12. Product Questions / Blockers

## Blocks architecture

- **Launch countries and languages:** emergency numbers, calling affordances, legal wording, source applicability, and localization architecture depend on this. Safest reversible path: locale-aware interfaces with bundled English copy and no hard-coded national number outside reviewed configuration.
- **Content update risk model:** not a blocker for the offline MVP architecture, but required before enabling over-the-air content. Safest path: bundled immutable content now; design version/checksum interfaces only.

## Blocks data model

- **Evidence vocabulary and publication rule:** confirm labels, who assigns them, whether assessments can be shared, and when a UI signal is materially necessary. Safest path: store structured basis/limitations plus configurable label IDs; do not hard-code badge presentation.
- **Interaction scope:** confirm pair-only MVP versus selecting more than two, and approve outcome/priority vocabulary. Safest path: model canonical participant sets and qualifiers, ship a pair UI first only after approval.
- **Reagent scope:** identify supported reagent families, authoritative color/time representation, interference model, and regional kit variations. Safest path: generic ordered reaction stages referencing controlled reagent IDs, with no interpretation engine.

## Blocks a feature

- **Clinical/editorial ownership and sign-off:** named qualified reviewers, source standard, review expiry, corrections, and urgent-update process block publication of Safety, Dose, Testing, Interactions, and Emergency—not neutral UI scaffolding.
- **Emergency action policy:** approve universal action sequence, exact emergency-call behavior, poison-control/medical-service references, and expected/pay-attention/get-help content per market. Use a reviewed minimal shell until approved; never improvise medical copy.
- **Initial MVP content coverage:** approve the launch substance/interactions/reagents list before Phase 5. It does not block the four-entry slice.

## Can safely be decided later

- Final evidence indicator visual treatment, illustration commissioning workflow, exact Recently Viewed cap, motion flourishes, deep-link URL domain, generated-asset commit policy, telemetry vendor, and whether proven editorial scale warrants a CMS. Keep each behind tokens/adapters/configuration.
- Remaining taxonomy edge cases, provided Phase 1 entries receive reviewed category/subgroup assignments and no generic `Other` fallback is introduced.

# 13. Recommended Repo Documentation

- **`README.md`:** promise, safety disclaimer boundaries, current status, prerequisites, commands, project map, content workflow, testing, and release links.
- **`AGENTS.md`:** repository-wide coding/content rules, generated-file policy, safety-copy restrictions, required checks, and PR/review expectations.
- **`docs/PRODUCT_SPEC.md`:** canonical locked scope, principles, hierarchies, navigation behavior, non-goals, and decision log links.
- **`docs/ARCHITECTURE.md`:** layers, dependency rules, route/context/state diagrams, offline strategy, persistence, errors, accessibility, privacy, and evolution seams.
- **`docs/DATA_MODEL.md`:** schemas, stable-ID policy, relationships, invariants, versioning/migrations, generated indexes, and examples.
- **`docs/CONTENT_MODEL.md`:** authoring templates, lifecycle, sparse/unknown conventions, taxonomy/alias rules, assets, validation, and review metadata.
- **`docs/EDITORIAL_RULES.md`:** adult/non-moralizing voice, safety priority rubric, Risk→Action pattern, dose/testing language, evidence distinctions, emergency tone, source acceptance, and prohibited claims.
- **`docs/ROADMAP.md`:** dependency-aware phases, MVP gates, explicit exclusions, risks, and decision checkpoints—not dates or invented estimates.
- **`docs/TESTING.md`:** automated/manual matrices, accessibility and device checks, safety-critical regression cases, fixtures, and release gates.
- **`docs/CONTENT_GOVERNANCE.md`:** author/reviewer roles, medical review, review expiry, corrections/retractions, incident escalation, audit trail, and emergency update policy.
- **`docs/RELEASE.md`:** content freeze, artifact/version verification, privacy/store checks, rollback, and go/no-go owners.
- **`docs/adr/`:** short immutable decision records for framework, navigation/context, local content/generation, persistence, search scoring, and future remote updates.

Implementation should stop here pending explicit approval.
