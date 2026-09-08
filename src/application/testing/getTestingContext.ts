import type { Substance } from '../../domain/content';

/** A future workflow may consume this context; Phase 2 performs no testing procedure. */
export function getTestingContext(substance: Substance) {
  return substance.testing
    ? {
        substanceId: substance.id,
        testingPreviewId: substance.testing.id,
        origin: 'profile' as const,
      }
    : undefined;
}
