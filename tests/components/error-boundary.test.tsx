import { expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { ErrorBoundary } from '../../app/_layout';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  router: { canGoBack: () => false, replace: jest.fn() },
}));
test('error fallback exposes urgent local guidance and retry without private diagnostics', async () => {
  const retry = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  render(<ErrorBoundary error={new Error('PRIVATE route substance.fixture')} retry={retry} />);
  expect(screen.getByText('Something feels wrong?')).toBeOnTheScreen();
  expect(
    screen.getByRole('button', { name: 'Call emergency services using the device dialer' }),
  ).toBeOnTheScreen();
  expect(screen.queryByText(/PRIVATE/)).toBeNull();
  await act(async () => {
    fireEvent.press(screen.getByRole('button', { name: 'Retry screen' }));
  });
  expect(retry).toHaveBeenCalledTimes(1);
});
