import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { router } from 'expo-router';
import { ProfileScreen } from '../../src/features/profile/ProfileScreen';
import { contentRepository } from '../../src/infrastructure/content/LocalContentRepository';
import { substanceIdSchema } from '../../src/domain/content';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (effect: () => void) =>
    jest.requireActual<typeof import('react')>('react').useEffect(effect, [effect]),
}));
jest.mock('../../src/infrastructure/persistence/RecentlyViewedRepository', () => ({
  recentRepository: { record: jest.fn().mockResolvedValue(undefined) },
}));

const mdma = contentRepository.getSubstance(substanceIdSchema.parse('substance.mdma'))!;
const sparse = contentRepository.getSubstance(substanceIdSchema.parse('substance.2cb'))!;

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('dense production profile keeps expected, unwanted and variability under separate accessible headings', () => {
  render(<ProfileScreen substance={mdma} />);
  const headings = screen.getAllByRole('header').map((node) => node.props.children);
  expect(headings.indexOf('Expected effects')).toBeLessThan(headings.indexOf('Unwanted effects'));
  expect(headings.indexOf('Unwanted effects')).toBeLessThan(
    headings.indexOf('What can change the experience'),
  );
  for (const [title, group] of [
    ['Expected effects', mdma.effects!.common!],
    ['Unwanted effects', mdma.effects!.unwanted!],
    ['What can change the experience', mdma.effects!.variability!],
  ] as const) {
    const heading = screen.getByRole('header', { name: title });
    expect(heading).toHaveProp('allowFontScaling', true);
    for (const item of group.items)
      expect(within(screen.getByTestId(group.id)).getByText(`• ${item}`)).toBeOnTheScreen();
  }
});

test('sparse production profile omits absent sections without blank headings', () => {
  render(<ProfileScreen substance={sparse} />);
  expect(screen.getByRole('header', { name: '2C-B' })).toBeOnTheScreen();
  for (const title of [
    'Effects and variability',
    'Expected effects',
    'Unwanted effects',
    'Before you take it',
    'What to expect',
    'Know what you have',
    'Rabbit hole',
  ]) {
    expect(screen.queryByRole('header', { name: title })).toBeNull();
  }
  expect(
    screen.getByRole('header', { name: 'IMPORTANT — Identity and potency may be uncertain' }),
  ).toBeOnTheScreen();
});

test('partially populated effects and long uncertain copy use the production renderer without merging groups', () => {
  const text = 'Fixture: variability has not been assessed. '.repeat(40);
  render(
    <ProfileScreen
      substance={{
        ...sparse,
        effects: { unwanted: { id: mdma.effects!.unwanted!.id, items: [text] } },
      }}
    />,
  );
  expect(screen.getByRole('header', { name: 'Unwanted effects' })).toBeOnTheScreen();
  expect(screen.getByText(`• ${text}`)).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Expected effects' })).toBeNull();
  expect(screen.queryByRole('header', { name: 'What can change the experience' })).toBeNull();
});

test('emergency actions retain known substance context and related profiles push stable IDs', () => {
  render(<ProfileScreen substance={mdma} />);
  fireEvent.press(
    screen.getAllByRole('button', { name: 'Something feels wrong? Open emergency guidance' })[0],
  );
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/emergency',
    params: { substanceId: mdma.id },
  });
  fireEvent.press(screen.getAllByRole('button', { name: 'Open relationship' })[0]);
  expect(router.push).toHaveBeenLastCalledWith({
    pathname: '/substance/[substanceId]',
    params: { substanceId: 'substance.ketamine' },
  });
});

test('leaving a profile before the visibility delay cancels its history write', async () => {
  const { recentRepository } = jest.requireMock(
    '../../src/infrastructure/persistence/RecentlyViewedRepository',
  );
  const view = render(<ProfileScreen substance={mdma} />);
  view.unmount();
  await act(async () => {
    jest.advanceTimersByTime(1000);
  });
  expect(recentRepository.record).not.toHaveBeenCalled();
});
