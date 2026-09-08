import type { Substance } from '../../domain/content';

/** Priority and order are authored. Context changes presentation only. */
export function selectSafety(substance: Substance, focusId?: string) {
  const canonical = [...substance.safetyClaims].sort((a, b) => a.order - b.order);
  const focused = canonical.find((claim) => claim.id === focusId);
  const critical = canonical.filter((claim) => claim.priority === 'critical');
  const promoted = [...(focused ? [focused] : []), ...critical, ...canonical];
  const ordered = promoted.filter(
    (claim, index) => promoted.findIndex((item) => item.id === claim.id) === index,
  );
  // The snapshot is bounded; the full list always retains every claim.
  return { snapshot: ordered.slice(0, 3), claims: ordered, focusedId: focused?.id };
}
