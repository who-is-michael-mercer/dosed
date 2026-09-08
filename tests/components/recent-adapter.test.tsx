import { expect, jest, test } from '@jest/globals';
import { OnDeviceRecentlyViewedRepository } from '../../src/infrastructure/persistence/RecentlyViewedRepository';
import { substanceIdSchema } from '../../src/domain/content';
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
const id = (value: string) => substanceIdSchema.parse(`substance.${value}`);
function store(initial: string | null = null) {
  let raw = initial;
  return {
    getItem: async () => raw,
    setItem: async (_key: string, value: string) => {
      raw = value;
    },
    removeItem: async () => {
      raw = null;
    },
  };
}
test('adapter removes stale/malformed IDs and duplicates from on-device data, including across a new adapter instance', async () => {
  const storage = store(
    JSON.stringify([
      { substanceId: id('mdma'), viewedAt: 2 },
      { substanceId: id('stale'), viewedAt: 4 },
      { substanceId: id('mdma'), viewedAt: 1 },
      { substanceId: 'bad', viewedAt: 3 },
    ]),
  );
  const repository = new OnDeviceRecentlyViewedRepository(storage);
  expect(await repository.list()).toEqual([{ substanceId: id('mdma'), viewedAt: 2 }]);
  expect(JSON.parse((await storage.getItem())!)).toEqual([
    { substanceId: id('mdma'), viewedAt: 2 },
  ]);
  expect(await new OnDeviceRecentlyViewedRepository(storage).list()).toEqual(
    await repository.list(),
  );
});
test('serialized concurrent records retain entries, cap at 12, deduplicate and clear', async () => {
  const storage = store();
  const repository = new OnDeviceRecentlyViewedRepository(storage, () => true);
  await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      repository.record({ substanceId: id(`fixture-${i}`), viewedAt: i }),
    ),
  );
  expect(await repository.list()).toHaveLength(12);
  await repository.record({ substanceId: id('fixture-19'), viewedAt: 30 });
  expect(await repository.list()).toHaveLength(12);
  expect((await repository.list())[0]).toEqual({ substanceId: id('fixture-19'), viewedAt: 30 });
  await repository.clear();
  expect(await repository.list()).toEqual([]);
  expect(await new OnDeviceRecentlyViewedRepository(store()).list()).toEqual([]);
});
test('corruption is cleaned and platform storage failures do not escape', async () => {
  const storage = store('{broken');
  const repository = new OnDeviceRecentlyViewedRepository(storage);
  expect(await repository.list()).toEqual([]);
  expect(await storage.getItem()).toBe('[]');
  const reject = async () => {
    throw new Error('Fixture storage failure');
  };
  const failing = new OnDeviceRecentlyViewedRepository({
    getItem: reject,
    setItem: reject,
    removeItem: reject,
  });
  await expect(failing.list()).resolves.toEqual([]);
  await expect(failing.record({ substanceId: id('mdma'), viewedAt: 5 })).resolves.toBeUndefined();
  await expect(failing.clear()).resolves.toBeUndefined();
});
test('production adapter refuses unknown IDs and writes only the private v1 record shape', async () => {
  const storage = store();
  const repository = new OnDeviceRecentlyViewedRepository(storage);
  await repository.record({ substanceId: id('stale'), viewedAt: 1 });
  expect(await storage.getItem()).toBeNull();
  await repository.record({ substanceId: id('mdma'), viewedAt: 2 });
  expect(await storage.getItem()).toBe('[{"substanceId":"substance.mdma","viewedAt":2}]');
});
