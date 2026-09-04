import type { RecentRepository, StableId } from '../../domain/content';
export const recordRecentlyViewed=(repository:RecentRepository,substanceId:StableId,now=Date.now())=>repository.record({substanceId,viewedAt:now});
