import { afterEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Emergency from '../../app/emergency';
import content from '../../generated/content.json';
import * as Linking from 'expo-linking';

jest.mock('expo-linking', () => ({ canOpenURL: jest.fn(), openURL: jest.fn() }));
const mockCanOpenURL = jest.mocked(Linking.canOpenURL);
const mockOpenURL = jest.mocked(Linking.openURL);
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({})),
  router: { canGoBack: jest.fn(() => false), back: jest.fn(), replace: jest.fn() },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('emergency guidance is offline, action-first and works with no substance context', async () => {
  mockCanOpenURL.mockResolvedValue(true);
  mockOpenURL.mockResolvedValue(undefined);
  render(<Emergency />);
  const headings = screen.getAllByRole('header').map((node) => node.props.children);
  expect(headings[0]).toBe('Something feels wrong?');
  expect(
    headings.findIndex((heading) => String(heading).includes('Get emergency help now')),
  ).toBeLessThan(headings.findIndex((heading) => String(heading).includes('Expected')));
  expect(screen.getByText(content.emergency.unknown)).toBeOnTheScreen();
  await act(async () => {
    fireEvent.press(
      screen.getByRole('button', { name: 'Call emergency services using the device dialer' }),
    );
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(mockCanOpenURL).toHaveBeenCalledWith('tel:911');
  expect(mockOpenURL).toHaveBeenCalledWith('tel:911');
  expect(screen.queryByText('Calling is unavailable')).toBeNull();
});

test('dialer capability and open failures leave urgent instructions and configured number visible', async () => {
  mockCanOpenURL.mockResolvedValue(false);
  render(<Emergency />);
  await act(async () => {
    fireEvent.press(
      screen.getByRole('button', { name: 'Call emergency services using the device dialer' }),
    );
  });
  expect(screen.getByText('Calling is unavailable')).toBeOnTheScreen();
  expect(mockOpenURL).not.toHaveBeenCalled();
  expect(screen.getByText(/call 911 using another phone/)).toBeOnTheScreen();
  expect(screen.getByText(/Call emergency services now if they are unconscious/)).toBeOnTheScreen();
  mockCanOpenURL.mockResolvedValue(true);
  mockOpenURL.mockRejectedValue(new Error('Fixture dialer failure'));
  render(<Emergency />);
  await act(async () => {
    fireEvent.press(
      screen.getByRole('button', { name: 'Call emergency services using the device dialer' }),
    );
  });
  expect(screen.getByText('Calling is unavailable')).toBeOnTheScreen();
  expect(mockOpenURL).toHaveBeenCalledWith('tel:911');
});

test('multiple or unknown context remains available and known context is generic, never substance-branched', async () => {
  const router = jest.requireMock('expo-router');
  router.useLocalSearchParams.mockReturnValue({ substanceId: 'substance.mdma' });
  render(<Emergency />);
  expect(screen.getByRole('header', { name: 'Profile context: MDMA' })).toBeOnTheScreen();
  expect(screen.queryByText('MDMA context')).toBeNull();
  router.useLocalSearchParams.mockReturnValue({ substanceId: 'substance.unknown' });
  render(<Emergency />);
  expect(screen.getByText(content.emergency.unknown)).toBeOnTheScreen();
});
