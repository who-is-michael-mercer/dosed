import type { RecentRepository, SubstanceId } from '../../domain/content';
export const recordRecentlyViewed = (
  repository: RecentRepository,
  substanceId: SubstanceId,
  now = Date.now(),
) => repository.record({ substanceId, viewedAt: now });
