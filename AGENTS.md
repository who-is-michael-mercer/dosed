# Dosed repository instructions

- Treat safety copy as reviewed content: application code may present priority but must never infer it.
- Never describe a dose as safe, recommended, or personally appropriate.
- Emergency guidance is local, action-first, nonjudgmental, and must not depend on identifying a substance.
- Do not edit `generated/` by hand; run `npm run generate` after editorial changes.
- Domain imports no outer layer; application imports domain only; infrastructure imports domain/application; presentation may compose all layers.
- Viewing history is private, on-device data. Never log it or add it to telemetry.
- Before committing run validation, generated check, formatting, lint, typecheck, tests, and the feasible build smoke checks.
