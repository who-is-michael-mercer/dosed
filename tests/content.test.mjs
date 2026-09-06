import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContentBundle,
  buildSearchIndex,
  compareCodePoints,
  loadContent,
  search,
  serializeContentBundle,
  validateContent,
} from '../scripts/lib/content.mjs';

const content = loadContent();
const cloneContent = () => structuredClone(content);
const findSubstance = (graph, id) => {
  const substance = graph.substances.find((candidate) => candidate.id === id);
  assert.ok(substance, `missing test substance ${id}`);
  return substance;
};
const mdmaFrom = (graph) => findSubstance(graph, 'substance.mdma');
const validationText = (graph) => validateContent(graph).errors.join('\n');
const assertInvalid = (mutate, expected) => {
  const graph = cloneContent();
  mutate(graph);
  let first;
  assert.doesNotThrow(() => {
    first = validateContent(graph);
  });
  assert.ok(first.errors.length > 0, 'expected invalid content to produce an error');
  assert.match(first.errors.join('\n'), expected);
  assert.deepEqual(validateContent(structuredClone(graph)).errors, first.errors);
  assert.deepEqual(
    first.errors,
    [...first.errors].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
  );
};

test('seed content and every authored reference validate', () => {
  const validation = validateContent(content);
  assert.deepEqual(validation.errors, []);
  assert.deepEqual(validation.content, content);
});

test('malformed top-level containers fail without throwing and errors are deterministic', () => {
  for (const malformed of [null, {}, { ...cloneContent(), substances: {} }]) {
    let first;
    assert.doesNotThrow(() => {
      first = validateContent(malformed);
    });
    assert.ok(first.errors.length > 0);
    assert.deepEqual(validateContent(structuredClone(malformed)).errors, first.errors);
  }
});

const malformedDoseCases = [
  ['missing minimum', (range) => delete range.min],
  ['string minimum', (range) => (range.min = '40')],
  ['non-finite minimum', (range) => (range.min = Number.POSITIVE_INFINITY)],
  ['negative minimum', (range) => (range.min = -1)],
  ['zero minimum', (range) => (range.min = 0)],
  ['equal bounds', (range) => (range.min = range.max)],
  ['reversed bounds', (range) => ([range.min, range.max] = [range.max, range.min])],
  ['blank label', (range) => (range.label = '   ')],
];
for (const [name, mutateRange] of malformedDoseCases) {
  test(`malformed dose range fails: ${name}`, () =>
    assertInvalid(
      (graph) => mutateRange(mdmaFrom(graph).doseReferences[0].ranges[0]),
      /ranges\.0/,
    ));
}
test('dose reference rejects an empty range list', () =>
  assertInvalid((graph) => (mdmaFrom(graph).doseReferences[0].ranges = []), /ranges/));
test('dose reference rejects duplicate range labels', () =>
  assertInvalid((graph) => {
    const ranges = mdmaFrom(graph).doseReferences[0].ranges;
    ranges[1].label = ranges[0].label.toUpperCase();
  }, /labels must be unique/));
test('dose reference rejects an unsupported route', () =>
  assertInvalid((graph) => (mdmaFrom(graph).doseReferences[0].route = 'telepathy'), /route/));
test('dose reference rejects an unsupported unit', () =>
  assertInvalid((graph) => (mdmaFrom(graph).doseReferences[0].unit = 'handfuls'), /unit/));

const malformedTimelineCases = [
  ['missing maximum', (phase) => delete phase.max],
  ['string minimum', (phase) => (phase.min = '20')],
  ['non-finite maximum', (phase) => (phase.max = Number.NaN)],
  ['negative minimum', (phase) => (phase.min = -1)],
  ['zero maximum', (phase) => (phase.max = 0)],
  ['equal bounds', (phase) => (phase.min = phase.max)],
  ['reversed bounds', (phase) => ([phase.min, phase.max] = [phase.max, phase.min])],
  ['blank label', (phase) => (phase.label = '   ')],
  ['unsupported unit', (phase) => (phase.unit = 'fortnights')],
];
for (const [name, mutatePhase] of malformedTimelineCases) {
  test(`malformed timeline phase fails: ${name}`, () =>
    assertInvalid((graph) => mutatePhase(mdmaFrom(graph).timelines[0].phases[0]), /phases\.0/));
}
test('timeline rejects an empty phase list', () =>
  assertInvalid((graph) => (mdmaFrom(graph).timelines[0].phases = []), /phases/));
test('timeline rejects duplicate phase labels', () =>
  assertInvalid((graph) => {
    const phases = mdmaFrom(graph).timelines[0].phases;
    phases[1].label = phases[0].label.toUpperCase();
  }, /labels must be unique/));
test('timeline rejects an unsupported route', () =>
  assertInvalid((graph) => (mdmaFrom(graph).timelines[0].route = 'telepathy'), /route/));

const brokenSourceCases = [
  ['substance bibliography', (graph) => mdmaFrom(graph).sourceReferences[0]],
  ['safety claim', (graph) => mdmaFrom(graph).safetyClaims[0].sourceReferences[0]],
  ['dose reference', (graph) => mdmaFrom(graph).doseReferences[0].sourceReferences[0]],
  ['timeline', (graph) => mdmaFrom(graph).timelines[0].sourceReferences[0]],
  ['testing preview', (graph) => mdmaFrom(graph).testing.sourceReferences[0]],
  ['pharmacology claim', (graph) => mdmaFrom(graph).rabbitHole[0].sourceReferences[0]],
  ['emergency content', (graph) => graph.emergency.sourceReferences[0]],
];
for (const [name, getReference] of brokenSourceCases) {
  test(`broken ${name} source reference fails`, () =>
    assertInvalid((graph) => (getReference(graph).sourceId = 'source.missing'), /broken source/));
}

test('broken optional effects, help-sign, and relationship source references fail', () => {
  const graph = cloneContent();
  const mdma = mdmaFrom(graph);
  mdma.effects.common.sourceReferences = [{ sourceId: 'source.missing' }];
  mdma.helpSigns[0].sourceReferences = [{ sourceId: 'source.missing' }];
  mdma.relationships[0].sourceReferences = [{ sourceId: 'source.missing' }];
  const errors = validationText(graph);
  assert.equal(errors.match(/broken source source\.missing/g)?.length, 3);
});

const nestedBibliographyCases = [
  ['safety claim', (mdma) => mdma.safetyClaims[0]],
  ['dose reference', (mdma) => mdma.doseReferences[0]],
  ['timeline', (mdma) => mdma.timelines[0]],
  ['effects group', (mdma) => mdma.effects.common],
  ['testing preview', (mdma) => mdma.testing],
  ['help sign', (mdma) => mdma.helpSigns[0]],
  ['relationship', (mdma) => mdma.relationships[0]],
  ['pharmacology claim', (mdma) => mdma.rabbitHole[0]],
];
for (const [name, getRecord] of nestedBibliographyCases) {
  test(`${name} sources must appear in the substance bibliography`, () =>
    assertInvalid((graph) => {
      getRecord(mdmaFrom(graph)).sourceReferences = [{ sourceId: 'source.nhs.ketamine' }];
    }, /source source\.nhs\.ketamine is missing from substance\.mdma bibliography/));
}

test('a nested source reference is valid when the substance bibliography includes it', () => {
  const graph = cloneContent();
  const mdma = mdmaFrom(graph);
  const sourceReference = { sourceId: 'source.nhs.ketamine' };
  mdma.sourceReferences.push(sourceReference);
  mdma.helpSigns[0].sourceReferences = [sourceReference];
  assert.deepEqual(validateContent(graph).errors, []);
});

test('broken category and substance relationships fail', () => {
  const graph = cloneContent();
  const mdma = mdmaFrom(graph);
  mdma.categoryIds[0] = 'category.missing';
  mdma.relationships[0].substanceId = 'substance.missing';
  const errors = validationText(graph);
  assert.match(errors, /broken category category\.missing/);
  assert.match(errors, /broken substance substance\.missing/);
});

test('substances reject duplicate category references', () =>
  assertInvalid((graph) => {
    const mdma = mdmaFrom(graph);
    mdma.categoryIds.push(mdma.categoryIds[0]);
  }, /duplicate category category\.stimulant/));

test('substances reject relationships to themselves', () =>
  assertInvalid((graph) => {
    const mdma = mdmaFrom(graph);
    mdma.relationships[0].substanceId = mdma.id;
  }, /self relationship substance\.mdma/));

test('duplicate top-level and nested stable IDs fail', () => {
  const graph = cloneContent();
  graph.sources[1].id = graph.sources[0].id;
  const mdma = mdmaFrom(graph);
  mdma.helpSigns[1].id = mdma.helpSigns[0].id;
  const errors = validationText(graph);
  assert.match(errors, /duplicate ID source\./);
  assert.match(errors, /duplicate ID sign\./);
});

test('source references reject invalid IDs, duplicates, blank locators, and invalid roles', () => {
  const mutations = [
    (reference) => (reference.sourceId = 'NO'),
    (reference) => (reference.locator = '   '),
    (reference) => (reference.role = 'proves'),
  ];
  for (const mutate of mutations) {
    assertInvalid(
      (graph) => mutate(mdmaFrom(graph).safetyClaims[0].sourceReferences[0]),
      /sourceReferences/,
    );
  }
  assertInvalid((graph) => {
    const references = mdmaFrom(graph).safetyClaims[0].sourceReferences;
    references.push(structuredClone(references[0]));
  }, /duplicate source reference/);
});

test('the authored 2C-B profile remains valid and genuinely sparse', () => {
  const sparse = findSubstance(content, 'substance.2cb');
  for (const section of [
    'doseReferences',
    'timelines',
    'effects',
    'testing',
    'helpSigns',
    'relationships',
    'rabbitHole',
  ]) {
    assert.equal(Object.hasOwn(sparse, section), false, `${section} should be omitted`);
  }
  assert.deepEqual(validateContent(content).errors, []);
});

test('a sparse profile does not require fabricated aliases', () => {
  const graph = cloneContent();
  findSubstance(graph, 'substance.2cb').aliases = [];
  assert.deepEqual(validateContent(graph).errors, []);
});

test('every optional profile section may be omitted independently', () => {
  for (const section of [
    'doseReferences',
    'timelines',
    'effects',
    'testing',
    'helpSigns',
    'relationships',
    'rabbitHole',
  ]) {
    const graph = cloneContent();
    delete mdmaFrom(graph)[section];
    assert.deepEqual(validateContent(graph).errors, [], `${section} should be optional`);
  }
});

test('optional sections reject null and present-but-empty values', () => {
  for (const section of [
    'doseReferences',
    'timelines',
    'effects',
    'testing',
    'helpSigns',
    'relationships',
    'rabbitHole',
  ]) {
    assertInvalid((graph) => (mdmaFrom(graph)[section] = null), new RegExp(section));
  }
  for (const section of [
    'doseReferences',
    'timelines',
    'helpSigns',
    'relationships',
    'rabbitHole',
  ]) {
    assertInvalid((graph) => (mdmaFrom(graph)[section] = []), new RegExp(section));
  }
  assertInvalid((graph) => (mdmaFrom(graph).effects = {}), /effects/);
  assertInvalid((graph) => (mdmaFrom(graph).testing = {}), /testing/);
});

const fullEvidence = () => ({
  basis: ['official_guidance', 'controlled_human_study'],
  applicability: 'The cited material is applicable to the claim context.',
  limitations: ['The source does not cover every setting or individual response.'],
  uncertainty: 'Product contents and individual response remain uncertain.',
  conflict: {
    status: 'mixed',
    summary: 'The sources use different populations and methods.',
  },
  literatureDepth: 'synthesis',
  assessedAt: '2026-09-06',
});

test('a dense profile accepts evidence metadata on every supported profile record', () => {
  const graph = cloneContent();
  const mdma = mdmaFrom(graph);
  const records = [
    mdma.safetyClaims[0],
    mdma.doseReferences[0],
    mdma.timelines[0],
    mdma.effects.common,
    mdma.testing,
    mdma.helpSigns[0],
    mdma.relationships[0],
    mdma.rabbitHole[0],
  ];
  for (const record of records) {
    record.evidence = fullEvidence();
    record.sourceReferences ??= [{ sourceId: 'source.nida.mdma' }];
    record.sourceReferences[0] = {
      ...record.sourceReferences[0],
      locator: 'Relevant section',
      role: 'supports',
      note: 'Grouped citation context for the claim.',
    };
  }
  Object.assign(
    graph.sources.find(({ id }) => id === 'source.nida.mdma'),
    {
      authors: ['Fixture Author'],
      publication: 'Fixture Journal',
      publishedAt: '2024-01-15',
      identifiers: { doi: '10.1000/dosed.fixture', pmid: '12345678' },
      sourceType: 'government_guidance',
      accessedAt: '2026-09-06',
      review: {
        status: 'reviewed',
        reviewedAt: '2026-09-01',
        reviewDue: '2027-09-01',
      },
      status: 'current',
    },
  );
  assert.deepEqual(validateContent(graph).errors, []);
});

const invalidEvidenceCases = [
  ['empty metadata', () => ({})],
  ['empty basis', () => ({ basis: [] })],
  ['duplicate basis', () => ({ basis: ['official_guidance', 'official_guidance'] })],
  ['unknown basis', () => ({ basis: ['numeric_score'] })],
  ['empty limitations', () => ({ limitations: [] })],
  ['blank limitation', () => ({ limitations: ['   '] })],
  ['blank applicability', () => ({ applicability: '   ' })],
  ['invalid assessed date', () => ({ assessedAt: '2026-02-30' })],
  ['mixed evidence without summary', () => ({ conflict: { status: 'mixed' } })],
  [
    'conflicting evidence with blank summary',
    () => ({ conflict: { status: 'conflicting', summary: ' ' } }),
  ],
  ['unknown literature depth', () => ({ literatureDepth: 'score_4' })],
  ['numeric score field', () => ({ basis: ['official_guidance'], score: 0.8 })],
];
for (const [name, makeEvidence] of invalidEvidenceCases) {
  test(`invalid evidence metadata fails: ${name}`, () =>
    assertInvalid(
      (graph) => (mdmaFrom(graph).safetyClaims[0].evidence = makeEvidence()),
      /evidence/,
    ));
}

test('optional evidence metadata requires source references', () =>
  assertInvalid((graph) => {
    mdmaFrom(graph).helpSigns[0].evidence = { basis: ['official_guidance'] };
  }, /requires source references/));

const invalidSourceCases = [
  ['malformed URL', (source) => (source.url = 'not a URL')],
  ['non-HTTP URL', (source) => (source.url = 'ftp://example.test/source')],
  ['missing creator/publication', (source) => delete source.organization],
  [
    'malformed DOI',
    (source) => {
      delete source.url;
      source.identifiers = { doi: 'doi:fixture' };
    },
  ],
  [
    'malformed PMID',
    (source) => {
      delete source.url;
      source.identifiers = { pmid: '12x' };
    },
  ],
  ['invalid publication date', (source) => (source.publishedAt = '2026-02-30')],
  ['invalid access date', (source) => (source.accessedAt = 'yesterday')],
  ['non-integer year', (source) => (source.year = 2024.5)],
  [
    'publication year mismatch',
    (source) => {
      source.publishedAt = '2024-01-01';
      source.year = 2023;
    },
  ],
  [
    'access before publication',
    (source) => {
      source.publishedAt = '2023-01-01';
      source.accessedAt = '2022-12-31';
    },
  ],
  ['status note without status', (source) => (source.statusNote = 'No status was selected.')],
  ['retracted without status note', (source) => (source.status = 'retracted')],
];
for (const [name, mutateSource] of invalidSourceCases) {
  test(`invalid source metadata fails: ${name}`, () =>
    assertInvalid((graph) => mutateSource(graph.sources[0]), /sources\.0/));
}

test('a fully described source may omit digital locators when they do not apply', () => {
  const graph = cloneContent();
  delete graph.sources[0].url;
  delete graph.sources[0].identifiers;
  assert.deepEqual(validateContent(graph).errors, []);
});

test('generation is pure and byte-for-byte deterministic', () => {
  const first = buildContentBundle(cloneContent());
  const second = buildContentBundle(cloneContent());
  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, 2);
  assert.equal(first.contentVersion, '2026.09.06');
  assert.equal(serializeContentBundle(first), serializeContentBundle(second));
  assert.ok(serializeContentBundle(first).endsWith('\n'));
});

test('search index generation is independent of substance input order', () =>
  assert.deepEqual(
    buildSearchIndex(content.substances),
    buildSearchIndex([...content.substances].reverse()),
  ));

test('deterministic text ordering compares Unicode code points without locale rules', () => {
  assert.ok(compareCodePoints('\uE000', '\u{1F600}') < 0);
  assert.ok(compareCodePoints('a', 'aa') < 0);
  assert.equal(compareCodePoints('same', 'same'), 0);
});

const index = buildSearchIndex(content.substances);
for (const [query, id] of [
  ['MDMA', 'substance.mdma'],
  ['molly', 'substance.mdma'],
  ['2cb', 'substance.2cb'],
  ['2-C B', 'substance.2cb'],
  ['moly', 'substance.mdma'],
]) {
  test(`search ${query}`, () =>
    assert.equal(search(index, content.substances, query)[0]?.substance.id, id));
}

test('scoring is deterministic and exact beats fuzzy', () =>
  assert.ok(
    search(index, content.substances, 'ket')[0].score >
      search(index, content.substances, 'kett')[0].score,
  ));

test('ambiguous aliases remain multiple results', () => {
  const substances = [
    ...content.substances,
    {
      ...findSubstance(content, 'substance.mdma'),
      id: 'substance.fixture',
      name: 'Fixture',
    },
  ];
  const fixtureIndex = buildSearchIndex(substances);
  assert.equal(search(fixtureIndex, substances, 'molly').length, 2);
});
