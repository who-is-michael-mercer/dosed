# Architecture

Dosed uses Expo-managed React Native with Expo Router and strict TypeScript. The
dependency direction is presentation → application → domain. Infrastructure
implements domain-owned ports and is composed by presentation. ESLint boundaries
prevent domain/application code from reaching screens or adapters.

Editorial JSON is validated before a deterministic generator emits one immutable,
committed runtime JSON bundle and search index. Startup performs no network request.
A content repository hides bundle layout from features; future delivery mechanisms
must preserve this interface and the last valid local emergency bundle.

Stable human-readable opaque IDs (`substance.mdma`) are route and reference keys;
labels are never identity. Native stack pushes preserve actual search/library state
and related profile links push rather than replace. Optional profile fields are
omitted, not rendered as empty cards.

Recently Viewed is a versioned local adapter storing only `{substanceId, viewedAt}`.
It writes after 750ms of profile visibility, deduplicates, sorts newest first, caps
at 12, and safely treats corrupt data as empty. No observability boundary accepts
substance IDs or viewing history.

Semantic safety colors are separate from family colors. Priority remains canonical
claim data; UI never computes a substance score. Controls scale text and meet a
minimum 44-point target. Emergency is a root modal, available from every Phase 1
screen, with bundled general guidance primary over optional substance context.
