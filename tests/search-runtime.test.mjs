import assert from 'node:assert/strict';
import test from 'node:test';
import { searchSubstances } from '../src/application/search/searchSubstances.ts';
import { loadContent } from '../scripts/lib/content.mjs';

const { substances } = loadContent();
for (const [query, id] of [
  ['molly', 'substance.mdma'],
  ['2 c b', 'substance.2cb'],
  ['kétamine', 'substance.ketamine'],
  ['ketamnie', 'substance.ketamine'],
]) {
  test(`runtime search resolves ${query}`, () =>
    assert.equal(searchSubstances(substances, query)[0]?.id, id));
}
test('runtime search preserves ambiguous aliases and supplied repository scope', () => {
  const fixture = {
    ...substances[0],
    id: 'substance.fixture',
    name: 'Fixture',
    aliases: [{ text: 'molly', kind: 'common', display: false }],
    searchTerms: [],
  };
  assert.equal(searchSubstances([...substances, fixture], 'molly').length, 2);
  assert.deepEqual(
    searchSubstances([fixture], 'molly').map((item) => item.id),
    ['substance.fixture'],
  );
});
test('runtime search handles empty, punctuation-only, unknown, and excessive input', () => {
  for (const query of ['', '   ', '---', 'no matching fixture', 'x'.repeat(10000)])
    assert.deepEqual(searchSubstances(substances, query), []);
});
