# Testing and release gates

`npm test` exercises invalid identifiers, broken references, missing sources,
invalid dose/route/priority values, deterministic generation, normalization,
aliases, fuzzy matching, ambiguity, score order, and recent ordering/caps/corruption.
`e2e/core-flow.yaml` covers launch → search molly → MDMA → emergency → back → Recent.

CI installs from the lockfile and gates validation, generated diffs, formatting,
lint, strict types, tests, and two-platform Expo export. Before release, manually
repeat the smoke path offline on current iOS and Android; test VoiceOver/TalkBack,
200% text, narrow/tablet layouts, focus order, reduced motion, device back behavior,
and dialing fallback without completing a call. Clinical/editorial and launch-market
approval are mandatory external gates.
