# Phase 2 content authoring and correction workflow

## Development waiver and schema v4

Evidence and clinical approval are deferred for development, never inferred. Preserve
the existing review lifecycle and claim metadata; draft examples may exercise software
without becoming approved claims. Public release remains gated.

Optional `content/taxonomy/subgroups.json` and `tags.json` contain authored stable IDs,
labels, descriptions, and order. Subgroups also specify applicable category IDs.
Profiles may reference `subgroupIds`/`tagIds`; absent files produce empty facets.
Do not invent classifications just to populate the UI. Missing `visual` uses a
decorative initial fallback. After edits, `npm run generate` produces all four
artifacts: `content.json`, `content.ts`, `emergency.json`, and `sources.json`.
Schema v4 requires regeneration with the current app; there is no remote content
upgrade or destructive history migration.

Edit `content/`, never `generated/`, then run `npm run generate` and the complete
validation loop. Substantive records use stable IDs and source references. Safety claims
use authored order, priority, stable action links or a dated reviewed exception. Dose
records are descriptive references; unknown timing and unavailable ranges are explicit.
Effects remain separate common, unwanted, and variability groups. Warning signs use the
emergency action. Testing previews use limitation-first “consistent with” language and
contain no procedure or result interpretation. Pharmacology puts plain language first;
relationships are typed and directional, never recommendations or scores.

Review states are `draft`, `evidence_assessed`, `clinically_approved`, and `withdrawn`.
Authorship, evidence assessment, and clinical approval each need person/date/artifact
records. Critical emergency and dose content requires distinct editorial and clinical
approvers. Internal alpha permits clearly labeled drafts; public release is rejected
until clinical approval, evidence metadata, and critical two-person approval exist.

For an urgent correction, the editorial owner records the reason and source, updates the
stable claim or withdraws it, regenerates the bundle, and runs validation, generated
check, formatting, lint, typecheck, tests, and build smoke. Attach dated human review
before promotion. Automated output never proves clinical, accessibility, device, legal,
or editorial acceptance.
