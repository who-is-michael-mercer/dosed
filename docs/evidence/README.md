# Dosed evidence

This directory contains dated, human-produced evidence that supports Dosed
implementation and release decisions. Evidence is kept separate from generated
runtime content and from the implementation plan.

## File placement

- `E<number>-<kind>-<date>.md` — clinical, editorial, legal, privacy, or source
  review artifacts.
- `T<number>-<kind>-<date>.md` — test, performance, accessibility, or device
  acceptance artifacts.
- `A<number>-<kind>-<date>.md` — release or store acceptance artifacts.
- `INDEX.md` — the evidence ledger and links to the artifacts above.

Use one artifact per review or test session. Preserve the reviewer or tester,
date, exact version or commit, scope, observed result, and unresolved findings.
Do not mark a check as passed from an automated test when the requirement calls
for human, accessibility, clinical, legal, or physical-device evidence.

Obsidian is an authoring source. Copy or export the final note into this
directory before treating it as repository evidence; retain the note's original
date and reviewer attribution.
