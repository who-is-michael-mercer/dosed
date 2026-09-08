import test from 'node:test';
import assert from 'node:assert/strict';
import { getProfileEffectSections } from '../src/features/profile/profileEffectSections.ts';

const group = (id, ...items) => ({ id, items });

test('profile effects remain separated and follow the approved hierarchy', () => {
  const sections = getProfileEffectSections({
    variability: group('effect.example.variability', 'Setting can change the experience'),
    unwanted: group('effect.example.unwanted', 'Nausea'),
    common: group('effect.example.common', 'Altered perception'),
  });

  assert.deepEqual(
    sections.map(({ id, title }) => ({ id, title })),
    [
      { id: 'effect.example.common', title: 'Expected effects' },
      { id: 'effect.example.unwanted', title: 'Unwanted effects' },
      {
        id: 'effect.example.variability',
        title: 'What can change the experience',
      },
    ],
  );
  assert.deepEqual(
    sections.map(({ items }) => items),
    [['Altered perception'], ['Nausea'], ['Setting can change the experience']],
  );
});

test('profile effects omit unavailable groups without placeholders', () => {
  const sections = getProfileEffectSections({
    unwanted: group('effect.example.unwanted', 'Anxiety'),
  });

  assert.deepEqual(sections, [
    {
      id: 'effect.example.unwanted',
      title: 'Unwanted effects',
      items: ['Anxiety'],
    },
  ]);
});
