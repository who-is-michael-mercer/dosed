import test from 'node:test';
import assert from 'node:assert/strict';
import { contentRepository } from '../src/infrastructure/content/LocalContentRepository.ts';

test('local content repository resolves source metadata for claim references', () => {
  const source = contentRepository.getSource('source.nida.mdma');

  assert.equal(source?.title, 'MDMA (Ecstasy/Molly) DrugFacts');
  assert.ok(contentRepository.listSources().some(({ id }) => id === source?.id));
});
