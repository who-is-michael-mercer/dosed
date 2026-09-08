# Testing and release gates

`npm test` runs both the Node unit suite and `tests/components/` through Jest.
The component harness uses the SDK 57 `jest-expo` preset for native module transforms
and mocks, and React Native Testing Library 13 for production rendering, accessible
role queries, and interaction assertions. Jest 29 runs this Expo preset; its renderer
peer is pinned to React's exact 19.2.3 version. These are development dependencies only.
This follows the [Expo testing setup](https://docs.expo.dev/develop/unit-testing/)
and [Testing Library 13 setup](https://oss.callstack.com/react-native-testing-library/13.x/docs/start/quick-start).
Native storage and router calls are mocked at the platform boundaries in profile tests;
profile sections, UI controls, and bundled content are real. These assertions do not
prove physical-device layout or screen-reader acceptance. `navigation.test.tsx` uses
the real Expo Router/native-stack components with only platform mocks, verifying
search restoration, emergency returns, category deep links, and stale-link recovery.

Run `npm run test:unit` or `npm run test:components -- --testPathPattern=profile`
for focused feedback. Component tests live outside `app/` so they cannot become routes.

`npm test` exercises invalid identifiers, broken references, missing sources,
invalid dose/route/priority values, deterministic generation, normalization,
aliases, fuzzy matching, ambiguity, score order, and recent ordering/caps/corruption.
`e2e/core-flow.yaml` covers launch → search molly → MDMA → emergency → back → Recent.

CI installs from the lockfile and gates validation, generated diffs, formatting,
lint, strict types, tests, and three-platform Expo export. Before release, manually
repeat the smoke path offline on current iOS and Android; test VoiceOver/TalkBack,
200% text, narrow/tablet layouts, focus order, reduced motion, device back behavior,
and dialing fallback without completing a call. Clinical/editorial and launch-market
approval are mandatory external gates.

Phase 2 component tests cover snapshot focus/order, linked actions, source disclosure,
progressive pharmacology, testing limits, long/uncertain content, emergency fallback,
stale Recent cleanup, serialized writes, and storage failure containment. They do not
replace dated clinical, editorial, legal, accessibility, device, or performance proof.

The unrun manual matrix is recorded in
[`PHASE_2_ACCEPTANCE_MATRIX.md`](./PHASE_2_ACCEPTANCE_MATRIX.md); every row is
intentionally `Pending` until a tester attaches dated device evidence.
