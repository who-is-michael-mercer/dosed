import AsyncStorage from '@react-native-async-storage/async-storage';
import { recentEntrySchema, type RecentEntry, type RecentRepository } from '../../domain/content';
import { contentRepository } from '../content/LocalContentRepository';
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
const KEY = 'dosed.recent.v1';
export const RECENT_LIMIT = 12;
export class OnDeviceRecentlyViewedRepository implements RecentRepository {
  private pending: Promise<unknown> = Promise.resolve();
  constructor(
    private readonly storage: KeyValueStorage = AsyncStorage,
    private readonly isKnownId = (id: RecentEntry['substanceId']) =>
      Boolean(contentRepository.getSubstance(id)),
  ) {}
  private serialize<Result>(task: () => Promise<Result>): Promise<Result> {
    const result = this.pending.then(task);
    this.pending = result.catch(() => undefined);
    return result;
  }
  private async read(): Promise<RecentEntry[]> {
    try {
      const raw = await this.storage.getItem(KEY);
      if (!raw) return [];
      let values: unknown;
      try {
        values = JSON.parse(raw);
      } catch {
        values = [];
      }
      const valid = (Array.isArray(values) ? values : [])
        .flatMap((value) => {
          const parsed = recentEntrySchema.safeParse(value);
          return parsed.success && this.isKnownId(parsed.data.substanceId) ? [parsed.data] : [];
        })
        .sort((a, b) => b.viewedAt - a.viewedAt);
      const seen = new Set<string>();
      const entries = valid
        .filter((entry) => {
          if (seen.has(entry.substanceId)) return false;
          seen.add(entry.substanceId);
          return true;
        })
        .slice(0, RECENT_LIMIT);
      const cleaned = JSON.stringify(entries);
      if (cleaned !== raw) await this.storage.setItem(KEY, cleaned).catch(() => undefined);
      return entries;
    } catch {
      return [];
    }
  }
  list(): Promise<readonly RecentEntry[]> {
    return this.serialize(() => this.read());
  }
  async record(entry: RecentEntry) {
    await this.serialize(async () => {
      const parsed = recentEntrySchema.safeParse(entry);
      if (!parsed.success || !this.isKnownId(parsed.data.substanceId)) return;
      const current = await this.read();
      const next = [
        parsed.data,
        ...current.filter((x) => x.substanceId !== parsed.data.substanceId),
      ]
        .sort((a, b) => b.viewedAt - a.viewedAt)
        .slice(0, RECENT_LIMIT);
      await this.storage.setItem(KEY, JSON.stringify(next)).catch(() => undefined);
    });
  }
  async clear() {
    await this.serialize(() => this.storage.removeItem(KEY).catch(() => undefined));
  }
}
export const recentRepository = new OnDeviceRecentlyViewedRepository();
