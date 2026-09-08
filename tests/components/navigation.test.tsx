import { expect, test } from '@jest/globals';
import {
  act,
  renderRouter,
  screen,
  fireEvent,
  testRouter,
  waitFor,
} from 'expo-router/testing-library';
import Root from '../../app/_layout';
import Main from '../../app/(main)/_layout';
import Index from '../../app/(main)/index';
import Library from '../../app/(main)/library';
import Search from '../../app/(main)/library/search';
import Profile from '../../app/substance/[substanceId]';
import Emergency from '../../app/emergency';
import Testing from '../../app/testing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const routes = {
  _layout: Root,
  '(main)/_layout': Main,
  '(main)/index': Index,
  '(main)/library/index': Library,
  '(main)/library/search': Search,
  'substance/[substanceId]': Profile,
  'emergency/index': Emergency,
  testing: Testing,
};
test('Recently Viewed is local, conditional, and can be cleared from Library', async () => {
  await AsyncStorage.setItem(
    'dosed.recent.v1',
    JSON.stringify([{ substanceId: 'substance.mdma', viewedAt: Date.now() }]),
  );
  renderRouter(routes, { initialUrl: '/library' });
  await waitFor(() =>
    expect(screen.getByRole('header', { name: 'Recently viewed' })).toBeOnTheScreen(),
  );
  fireEvent.press(screen.getByRole('button', { name: 'Clear recently viewed' }));
  await waitFor(() => expect(screen.queryByRole('header', { name: 'Recently viewed' })).toBeNull());
  expect(await AsyncStorage.getItem('dosed.recent.v1')).toBeNull();
});
test('real Router preserves search query through profile and emergency navigation', async () => {
  renderRouter(routes, { initialUrl: '/library' });
  fireEvent.press(screen.getByRole('button', { name: 'Search substances' }));
  fireEvent.changeText(screen.getByLabelText('Search substances'), 'molly');
  fireEvent.press(screen.getByRole('link', { name: 'Open MDMA profile' }));
  expect(screen.getByRole('header', { name: 'MDMA' })).toBeOnTheScreen();
  fireEvent.press(
    screen.getAllByRole('button', { name: 'Something feels wrong? Open emergency guidance' })[0],
  );
  expect(screen.getByText('Something feels wrong?')).toBeOnTheScreen();
  fireEvent.press(screen.getByRole('button', { name: 'Back to browsing' }));
  expect(screen.getByRole('header', { name: 'MDMA' })).toBeOnTheScreen();
  testRouter.back('/library/search');
  await waitFor(() =>
    expect(screen.getByLabelText('Search substances')).toHaveProp('value', 'molly'),
  );
});
test('direct stale profile opens Library without an origin stack', async () => {
  renderRouter(routes, { initialUrl: '/substance/substance.missing' });
  fireEvent.press(screen.getByRole('button', { name: 'Open Library' }));
  expect(screen.getByText('The substance field guide.')).toBeOnTheScreen();
  await act(async () => {});
});

test('category deep links filter the Library, and A–Z and clearing retain usable navigation', async () => {
  renderRouter(routes, { initialUrl: '/library?categoryId=category.dissociative' });
  expect(screen.getByRole('link', { name: 'Open Ketamine profile' })).toBeOnTheScreen();
  expect(screen.queryByRole('link', { name: 'Open MDMA profile' })).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'A–Z' }));
  expect(screen.getByRole('button', { name: 'A–Z' })).toHaveProp('accessibilityState', {
    selected: true,
  });
  fireEvent.press(screen.getByRole('button', { name: 'All profiles' }));
  expect(screen.getByRole('link', { name: 'Open MDMA profile' })).toBeOnTheScreen();
  await act(async () => {});
});
