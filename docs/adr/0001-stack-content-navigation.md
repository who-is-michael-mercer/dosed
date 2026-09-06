# ADR 0001: Expo, bundled generated content, and native stack routes

Status: accepted — 2026-09-04

## Decision

Use Expo SDK 54, React Native, strict TypeScript, Expo Router native stacks, Zod
runtime schemas, committed deterministic local JSON, and an adapter over
AsyncStorage. Search uses a small explicit scorer instead of Fuse.

## Why

This follows the implementation plan, keeps launch fully offline and auditable,
and makes stable-ID routing, ranking, sparse content, and corruption behavior easy
to test. Committing output makes content review and release artifacts inspectable.

## Alternatives

Flutter would split editorial tooling from TypeScript. Raw authoring JSON at runtime
would increase startup work and ship authoring structure. SQLite is unnecessary for
12 records. Fuse adds opaque tuning and dependency weight at this scale. Replacing
routes would destroy genuine navigation history.

## Consequences

Authors must regenerate after edits; CI enforces this. A larger library may justify
SQLite or a different index behind existing repository interfaces. SDK upgrades
must be deliberate. Future remote bundles require signature, atomic install,
compatibility, and rollback ADRs before implementation.
