# Phase 0 / Phase 1 implementation checklist

Audit date: 2026-09-04. The repository contained only the planning document and
placeholder README; there were no later ADRs, specifications, schemas, or agent
instructions. The plan's Phase 2 placement of the complete emergency/profile
experience is stale because the approved brief explicitly moves those items into
Phase 1. Clinical sign-off remains an external release gate, but does not block
clearly marked draft seed content and the technical slice.

## Phase 0

- [x] Expo Router application, strict TypeScript, pinned dependencies and CI
- [x] lint, format, typecheck, tests, content validation/generation and build smoke scripts
- [x] presentation/application/domain/infrastructure boundaries and interfaces
- [x] stable IDs, runtime schemas, deterministic local content bundle and indexes
- [x] versioned persistence adapter and privacy-safe logging policy
- [x] architecture, editorial, testing, and decision documentation

## Phase 1

- [x] four deliberately uneven substance records, with complete MDMA fixture
- [x] category and A–Z Library, deterministic forgiving search and two card forms
- [x] progressive, sparse-aware profiles and stack-preserving stable-ID routes
- [x] capped, deduplicated, on-device Recently Viewed
- [x] globally available, offline emergency shell for known and unknown cases
- [x] meaningful domain/search/persistence/content and smoke-flow tests

## External release blockers

- Named clinical/editorial reviewers must approve all safety, dose, testing, and
  emergency copy before a public release.
- Launch markets must approve emergency calling configuration. Phase 1 therefore
  uses the device dialer with a configurable, locale-aware fallback rather than
  claiming worldwide coverage.
