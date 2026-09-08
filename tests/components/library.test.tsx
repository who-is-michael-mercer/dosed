import { afterEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { LibraryScreen } from '../../src/features/library/LibraryScreen';
import { contentRepository } from '../../src/infrastructure/content/LocalContentRepository';
import { subgroupSchema, tagSchema, substanceSchema } from '../../src/domain/content';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  useFocusEffect: (effect: () => void) =>
    jest.requireActual<typeof import('react')>('react').useEffect(effect, [effect]),
  router: { push: jest.fn() },
}));
afterEach(() => jest.restoreAllMocks());
test('authored optional subgroup/tag filters use real Library rendering without new catalog claims', async () => {
  const seed = contentRepository.listSubstances()[0]!;
  const subgroup = subgroupSchema.parse({
    id: 'subgroup.fixture',
    label: 'Fixture subgroup',
    description: 'Synthetic classification for UI testing only.',
    categoryIds: seed.categoryIds,
    order: 0,
  });
  const tag = tagSchema.parse({
    id: 'tag.fixture',
    label: 'Fixture tag',
    description: 'Synthetic tag for UI testing only.',
    order: 0,
  });
  const fixture = substanceSchema.parse({
    ...seed,
    name: 'Fixture profile',
    subgroupIds: [subgroup.id],
    tagIds: [tag.id],
    visual: undefined,
  });
  jest.spyOn(contentRepository, 'listSubgroups').mockReturnValue([subgroup]);
  jest.spyOn(contentRepository, 'listTags').mockReturnValue([tag]);
  jest.spyOn(contentRepository, 'listSubstances').mockReturnValue([fixture]);
  render(<LibraryScreen />);
  for (const label of [subgroup.label, tag.label]) {
    fireEvent.press(screen.getByRole('button', { name: label }));
    expect(screen.getByRole('button', { name: label })).toHaveProp('accessibilityState', {
      selected: true,
    });
    expect(screen.getByRole('link', { name: 'Open Fixture profile profile' })).toBeOnTheScreen();
  }
  await act(async () => {});
});
test('an empty repository still provides search and emergency entry', async () => {
  jest.spyOn(contentRepository, 'listSubstances').mockReturnValue([]);
  render(<LibraryScreen />);
  expect(screen.getByRole('button', { name: 'Search substances' })).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'Something feels wrong? Open emergency guidance' }),
  ).toBeOnTheScreen();
  expect(screen.queryAllByRole('link')).toHaveLength(0);
  await act(async () => {});
});
