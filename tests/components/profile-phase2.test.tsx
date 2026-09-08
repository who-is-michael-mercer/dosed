import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ProfileScreen } from '../../src/features/profile/ProfileScreen';
import { contentRepository } from '../../src/infrastructure/content/LocalContentRepository';
import { substanceIdSchema, substanceSchema } from '../../src/domain/content';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (effect: () => void) =>
    jest.requireActual<typeof import('react')>('react').useEffect(effect, [effect]),
}));
jest.mock('../../src/infrastructure/persistence/RecentlyViewedRepository', () => ({
  recentRepository: { record: jest.fn().mockResolvedValue(undefined) },
}));
const mdma = contentRepository.getSubstance(substanceIdSchema.parse('substance.mdma'))!;
beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('Safety Snapshot leads the hierarchy and contextual entry shows the exact authored claim first', () => {
  render(<ProfileScreen substance={mdma} focusId="claim.mdma.interactions" />);
  const headings = screen.getAllByRole('header').map((node) => node.props.children);
  expect(headings[1]).toBe('Safety Snapshot');
  const focused = screen.getByTestId('claim.mdma.interactions');
  expect(within(focused).getByText('Selected safety context')).toBeOnTheScreen();
  expect(
    within(focused).getByRole('header', { name: 'IMPORTANT — Interactions can be serious' }),
  ).toBeOnTheScreen();
  expect(
    within(focused).getByText(`DO THIS — ${mdma.harmReductionActions[1].body}`),
  ).toBeOnTheScreen();
});

test('offline citations expose source metadata and honest unassessed states without opening a browser', () => {
  render(<ProfileScreen substance={mdma} />);
  const button = screen.getByRole('button', {
    name: 'Evidence and sources: claim.mdma.temperature',
  });
  expect(button).toHaveProp('accessibilityState', { expanded: false });
  fireEvent.press(button);
  expect(button).toHaveProp('accessibilityState', { expanded: true });
  expect(screen.getByRole('header', { name: 'MDMA (Ecstasy/Molly) DrugFacts' })).toBeOnTheScreen();
  expect(
    screen.getByText('https://nida.nih.gov/publications/drugfacts/mdma-ecstasymolly'),
  ).toBeOnTheScreen();
  expect(screen.getByText('Last evidence assessment: not recorded')).toBeOnTheScreen();
  expect(screen.getByText('Source type: not recorded')).toBeOnTheScreen();
  fireEvent.press(button);
  expect(screen.queryByRole('header', { name: 'MDMA (Ecstasy/Molly) DrugFacts' })).toBeNull();
});

test('plain pharmacology is visible before opt-in mechanism disclosure', () => {
  render(<ProfileScreen substance={mdma} />);
  expect(screen.getByText(mdma.rabbitHole![0].body)).toBeOnTheScreen();
  expect(screen.queryByText(mdma.rabbitHole![1].body)).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Show mechanism details' }));
  expect(screen.getByText(mdma.rabbitHole![1].body)).toBeOnTheScreen();
  expect(screen.getByText('INFERENCE')).toBeOnTheScreen();
  fireEvent.press(screen.getByRole('button', { name: 'Hide mechanism details' }));
  expect(screen.queryByText(mdma.rabbitHole![1].body)).toBeNull();
});

test('testing preview places authored limits first and has no procedural workflow action', () => {
  render(<ProfileScreen substance={mdma} />);
  const textNodes = screen.UNSAFE_getAllByType(Text);
  const limit = textNodes.findIndex((node) => node.props.children === mdma.testing!.limitations);
  const summary = textNodes.findIndex((node) => node.props.children === mdma.testing!.summary);
  expect(limit).toBeGreaterThan(-1);
  expect(limit).toBeLessThan(summary);
  expect(
    screen.getByText('Preview for MDMA. The full testing workflow is not available.'),
  ).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Open testing preview context' })).toBeOnTheScreen();
});

test('unknown, long-name, qualified and conflicting fixtures pass the same validated production renderer', () => {
  const fixture = JSON.parse(JSON.stringify(mdma));
  fixture.name = 'Fixture long name '.repeat(20);
  fixture.aliases = [{ text: 'Fixture long alias '.repeat(40), kind: 'common', display: true }];
  fixture.doseReferences[0].ranges[0].qualifier = 'Fixture approximate range';
  fixture.doseReferences[0].potencyNotes = 'Fixture potency limitation';
  fixture.doseReferences[0].uncertainty = 'Fixture uncertainty '.repeat(60);
  fixture.timelines[0].phases.push({
    label: 'Residual timing',
    kind: 'residual',
    availability: 'unknown',
    detail: 'Fixture: no estimate',
  });
  fixture.rabbitHole[0].evidence = {
    basis: ['mechanistic'],
    applicability: 'Fixture indirect model',
    limitations: ['Fixture evidence limitation'],
    conflict: { status: 'conflicting', summary: 'Fixture conflicting explanations' },
    assessedAt: '2026-09-07',
  };
  const validated = substanceSchema.parse(fixture);
  render(<ProfileScreen substance={validated} />);
  expect(screen.getByRole('header', { name: fixture.name.trim() })).toBeOnTheScreen();
  expect(screen.getByText('Residual timing: Unknown · Fixture: no estimate')).toBeOnTheScreen();
  expect(screen.getByText(/Fixture approximate range/)).toBeOnTheScreen();
  expect(screen.getByText('Fixture potency limitation')).toBeOnTheScreen();
  expect(screen.getByText('Fixture evidence limitation')).toBeOnTheScreen();
  expect(screen.getByText('Fixture conflicting explanations')).toBeOnTheScreen();
  expect(screen.getByText('Clinical approval has not been recorded.')).toBeOnTheScreen();
  expect(screen.queryByText(/Review recorded:/)).toBeNull();
});
