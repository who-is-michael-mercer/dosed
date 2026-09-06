# Dosed

**Know more. Guess less. Party accordingly.**

Dosed is a dark-first, offline-first harm-reduction field guide. Phase 1 ships a
four-substance Library/Profile slice, deterministic local search, on-device
Recently Viewed, and an offline emergency path. It does not provide medical
advice, certify substance identity, or recommend a dose.

> **Content status:** seed safety, dose, testing, and emergency copy is marked
> `needs_clinical_review`. The software slice is complete, but public release is
> blocked until named qualified reviewers approve it.

## Prerequisites and commands

Use Node 22 and npm 11.

```sh
npm ci                       # install exact lockfile dependencies
npm run validate:content     # schemas, references, editorial invariants
npm run generate             # regenerate runtime bundle and search index
npm run check:generated      # fail if generated files are stale
npm run format               # formatting check
npm run lint                 # code and import-boundary lint
npm run typecheck            # strict TypeScript
npm test                     # domain/search/persistence/generator tests
npm run build:smoke          # offline iOS and Android Expo export
npm start                    # launch Expo development server
npm run ios                  # launch iOS target
npm run android              # launch Android target
```

Run the Maestro smoke flow with `maestro test e2e/core-flow.yaml` after installing
Maestro and launching a development build/emulator.

## Repository map

- `app/`: Expo Router route composition and native navigation stacks.
- `src/domain`: IDs, Zod schemas, repository contracts, and invariants.
- `src/application`: deterministic search and use cases.
- `src/infrastructure`: bundled-content and on-device persistence adapters.
- `src/components`, `src/design`, `src/features`: accessible visual system and screens.
- `content/`: human-reviewed source JSON; the editorial source of truth.
- `scripts/`: validation and deterministic compilation.
- `generated/`: committed, auditable runtime bundle; never edit manually.
- `tests/`, `e2e/`: critical policy tests and the device smoke journey.
- `docs/`: plan, implementation audit/checklist, architecture, and ADRs.

## Content workflow

Edit source JSON, retain stable IDs, sources, review dates/status, uncertainty,
and explicit ordering. Then run validation and generation. Missing optional profile
sections are intentionally omitted. Missing sources, broken links, invalid ranges,
or missing emergency bands block generation. A qualified second reviewer must
approve safety-critical copy before publication.

## Privacy, accessibility, and offline behavior

All reference and emergency content ships in the generated bundle. Recently
Viewed stores only stable IDs and timestamps in local AsyncStorage, is capped and
deduplicated, and is never logged or synced. Controls use 44-point minimum targets,
text scales, safety meaning includes words rather than color alone, and emergency
bands expose coherent screen-reader labels.

See [architecture](docs/ARCHITECTURE.md), [testing](docs/TESTING.md), and the
[implementation checklist](docs/IMPLEMENTATION_CHECKLIST.md).

## Known limitations and Phase 2

The seed copy is not release-approved; device accessibility/E2E checks require
physical or emulated iOS/Android environments; and emergency calling uses a single
clearly disclosed fallback pending market configuration. Phase 2 should broaden
reviewed profile depth and evidence presentation, complete market-specific emergency
policy, and harden device accessibility. Combination checking, a reagent workflow,
remote content, accounts, recommendations, and personalization remain intentionally
out of scope until their later decision gates are resolved.
