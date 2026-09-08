# Architecture

Dosed uses Expo-managed React Native with Expo Router and strict TypeScript. The
dependency direction is presentation → application → domain. Infrastructure
implements domain-owned ports and is composed by presentation. ESLint boundaries
prevent domain/application code from reaching screens or adapters.

Editorial JSON is validated before a deterministic generator emits immutable,
committed profile/search, emergency, and source JSON bundles. Emergency does not
import the profile repository or search index. Startup performs no network request.
A content repository hides bundle layout from features; future delivery mechanisms
must preserve this interface and the last valid local emergency bundle.

Stable human-readable opaque IDs (`substance.mdma`) are route and reference keys;
labels are never identity. Native stack pushes preserve actual search/library state
and related profile links push rather than replace. Optional profile fields are
omitted, not rendered as empty cards.

Recently Viewed is a versioned local adapter storing only `{substanceId, viewedAt}`.
It writes after 750ms of profile visibility, deduplicates, sorts newest first, caps
at 12, and cancels pending visibility writes on navigation blur. Library offers local
history clearing. It safely treats corrupt data as empty. No observability boundary accepts
substance IDs or viewing history.

Semantic safety colors are separate from family colors. Priority remains canonical
claim data; UI never computes a substance score. Controls scale text and meet a
minimum 44-point target. Emergency is a root modal, available from every Phase 1
screen, with bundled general guidance primary over optional substance context.

Phase 2 composition uses focused safety, dose, timeline, effects, testing, help,
relationship, evidence, review, and pharmacology sections. Safety selection applies
authored priority/order and optional focus IDs without changing canonical claims.
Emergency dialing parses `config/emergency.json`, checks capability, and preserves the
offline fallback on failure. Release policy keeps draft content labeled for internal
alpha and blocks public promotion without the required approval artifacts.

SDK 57 uses React 19.2.3 / React Native 0.86.3 and Expo-compatible native peers.
Schema v4 adds optional authored subgroups/tags and optional artwork; missing art
uses a decorative initial. Taxonomy memberships are many-to-many with referential
and category-applicability checks. No new classifications are inferred. Library and
search use virtualized native lists. Shared safe-area footers reserve actual layout
space for Emergency rather than covering scroll content with an absolute overlay.
