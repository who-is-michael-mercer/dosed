import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadContent,
  validateContent,
  buildContentBundle,
  buildEmergencyBundle,
} from '../scripts/lib/content.mjs';

const fixture = () => {
  const content = loadContent();
  content.subgroups = [
    {
      id: 'subgroup.fixture',
      label: 'Fixture subgroup',
      description: 'Synthetic test taxonomy; not a substance classification.',
      categoryIds: [content.substances[0].categoryIds[0]],
      order: 0,
    },
  ];
  content.tags = [
    { id: 'tag.fixture', label: 'Fixture tag', description: 'Synthetic test tag.', order: 0 },
  ];
  content.substances[0].subgroupIds = ['subgroup.fixture'];
  content.substances[0].tagIds = ['tag.fixture'];
  return content;
};
test('optional many-to-many browse facets validate without manufacturing classifications', () => {
  assert.deepEqual(validateContent(fixture()).errors, []);
  assert.deepEqual(validateContent(loadContent()).errors, []);
});
test('broken subgroup/tag and incompatible category references fail validation', () => {
  for (const field of ['subgroupIds', 'tagIds']) {
    const content = fixture();
    content.substances[0][field] = [field === 'tagIds' ? 'tag.missing' : 'subgroup.missing'];
    assert.ok(
      validateContent(content).errors.some((error) => error.includes('broken taxonomy reference')),
    );
  }
  const content = fixture();
  content.subgroups[0].categoryIds = [
    content.categories.find((category) => !content.substances[0].categoryIds.includes(category.id))
      .id,
  ];
  assert.ok(
    validateContent(content).errors.some((error) => error.includes('no applicable category')),
  );
});
test('missing artwork has a valid fallback contract', () => {
  const content = fixture();
  delete content.substances[0].visual;
  assert.deepEqual(validateContent(content).errors, []);
});
test('emergency artifact retains review metadata and excludes large profile/search payloads', () => {
  const bundle = buildContentBundle(loadContent());
  const urgent = buildEmergencyBundle(bundle);
  assert.deepEqual(urgent.emergency, bundle.emergency);
  assert.deepEqual(
    urgent.contexts.map((item) => item.id),
    bundle.substances.map((item) => item.id),
  );
  assert.equal('searchIndex' in urgent, false);
  assert.equal('substances' in urgent, false);
  assert.ok(JSON.stringify(urgent).length < JSON.stringify(bundle).length / 2);
});
