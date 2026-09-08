import { beforeEach, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Testing from '../../app/testing';
import Profile from '../../app/substance/[substanceId]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({})),
  router: { canGoBack: jest.fn(() => false), replace: jest.fn(), back: jest.fn(), push: jest.fn() },
}));
beforeEach(() => {
  jest.mocked(useLocalSearchParams).mockReturnValue({});
});
test.each([
  {},
  { substanceId: 'broken' },
  { substanceId: 'substance.missing' },
  { substanceId: 'substance.mdma', testingPreviewId: 'testing.wrong' },
])('invalid testing links retain Library and emergency escape paths: %j', (params) => {
  jest.mocked(useLocalSearchParams).mockReturnValue(params);
  render(<Testing />);
  expect(screen.getByRole('alert')).toHaveTextContent(/No testing preview/);
  fireEvent.press(screen.getByRole('button', { name: 'Open Library' }));
  expect(router.replace).toHaveBeenCalledWith('/library');
  expect(
    screen.getByRole('button', { name: 'Something feels wrong? Open emergency guidance' }),
  ).toBeOnTheScreen();
});
test('valid testing links show authored content and do not recurse into the preview', () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ substanceId: 'substance.mdma' });
  render(<Testing />);
  expect(screen.getByRole('header', { name: 'MDMA' })).toBeOnTheScreen();
  expect(screen.queryByText('Open testing preview')).toBeNull();
});
test('unknown profile links retain browsing and emergency escape paths', () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ substanceId: 'substance.missing' });
  render(<Profile />);
  expect(screen.getByRole('alert')).toHaveTextContent(/This profile is unavailable/);
  fireEvent.press(screen.getByRole('button', { name: 'Open Library' }));
  expect(router.replace).toHaveBeenCalledWith('/library');
});
