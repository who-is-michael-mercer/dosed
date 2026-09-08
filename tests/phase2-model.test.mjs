import test from 'node:test';
import assert from 'node:assert/strict';
import { loadContent, validateContent } from '../scripts/lib/content.mjs';
import { reviewSchema, substanceSchema, emergencyContentSchema } from '../src/domain/content.ts';
import { releaseErrors, releaseConfigSchema } from '../src/domain/release.ts';
import { selectSafety } from '../src/application/profile/selectSafety.ts';
import { getTestingContext } from '../src/application/testing/getTestingContext.ts';

const graph = () => loadContent();
const mdma = (content) => content.substances.find(({ id }) => id === 'substance.mdma');
test('emergency schema can represent deferred assessments without silently changing draft review', () => {
  const emergency = graph().emergency;
  const result = emergencyContentSchema.parse({
    ...emergency,
    evidence: {
      basis: ['official_guidance'],
      assessedAt: '2026-09-07',
      conflict: { status: 'not_assessed' },
    },
  });
  assert.deepEqual(result.review, emergency.review);
  assert.equal(result.evidence.assessedAt, '2026-09-07');
});
test('safety links reject missing, duplicate, cross-profile actions and duplicate authored order', () => {
  for (const mutate of [
    (s) => {
      s.safetyClaims[0].actionIds = [];
    },
    (s) => {
      s.safetyClaims[0].actionIds = ['action.2cb.uncertainty'];
    },
    (s) => {
      s.safetyClaims[0].actionIds.push(s.safetyClaims[0].actionIds[0]);
    },
    (s) => {
      s.safetyClaims[1].order = s.safetyClaims[0].order;
    },
  ]) {
    const content = graph();
    mutate(mdma(content));
    assert.ok(validateContent(content).errors.length);
  }
});
test('risks may share actions or carry a dated editorial exception', () => {
  const content = graph();
  const s = mdma(content);
  s.safetyClaims[1].actionIds = [...s.safetyClaims[0].actionIds, ...s.safetyClaims[1].actionIds];
  assert.deepEqual(validateContent(content).errors, []);
  s.safetyClaims[0].actionIds = [];
  s.safetyClaims[0].editorialException = {
    reason: 'Synthetic exception fixture',
    reviewedBy: 'Fixture editor',
    reviewedAt: '2026-09-07',
    artifact: 'fixture-only',
  };
  assert.deepEqual(validateContent(content).errors, []);
});
test('snapshot uses authored priority/order, bounds summary, preserves all claims and never mutates canonical data', () => {
  const s = mdma(graph());
  s.safetyClaims = Array.from({ length: 8 }, (_, i) => ({
    ...s.safetyClaims[1],
    id: `claim.fixture.item-${i}`,
    order: i,
    priority: i === 7 ? 'critical' : 'context',
  }));
  const before = structuredClone(s);
  const result = selectSafety(s, 'claim.fixture.item-5');
  assert.deepEqual(
    result.claims.slice(0, 2).map(({ id }) => id),
    ['claim.fixture.item-5', 'claim.fixture.item-7'],
  );
  assert.equal(result.snapshot.length, 3);
  assert.equal(result.claims.length, 8);
  assert.deepEqual(s, before);
  assert.equal(selectSafety(s, 'claim.stale').focusedId, undefined);
});
test('unknown timeline phases require explicit unknown state; missing bounds cannot turn into zero', () => {
  const s = mdma(graph());
  s.timelines[0].phases.push({
    kind: 'residual',
    label: 'Residual timing',
    availability: 'unknown',
    detail: 'Fixture timing unavailable',
  });
  assert.equal(substanceSchema.safeParse(s).success, true);
  s.timelines[0].phases[0].max = undefined;
  assert.equal(substanceSchema.safeParse(s).success, false);
});
test('unavailable dose record carries route, context and sources, with no numeric default', () => {
  const s = mdma(graph());
  const d = s.doseReferences[0];
  s.doseReferences = [
    {
      id: d.id,
      route: d.route,
      availability: 'unavailable',
      context: 'Fixture unavailable',
      sourceReferences: d.sourceReferences,
    },
  ];
  assert.equal(substanceSchema.safeParse(s).success, true);
  s.doseReferences[0].min = 0;
  assert.equal(substanceSchema.safeParse(s).success, false);
});
test('review lifecycle distinguishes draft, assessment, approval and withdrawal and enforces evidence dates', () => {
  assert.equal(reviewSchema.safeParse({ status: 'draft' }).success, true);
  assert.equal(reviewSchema.safeParse({ status: 'clinically_approved' }).success, false);
  assert.equal(reviewSchema.safeParse({ status: 'withdrawn' }).success, false);
  const review = {
    status: 'clinically_approved',
    author: 'Fixture author',
    authoredAt: '2026-09-01',
    assessment: {
      assessor: 'Fixture assessor',
      assessedAt: '2026-09-02',
      artifact: 'assessment-fixture',
    },
    approval: {
      approver: 'Fixture clinician',
      qualification: 'Fixture qualification',
      approvedAt: '2026-09-03',
      reviewDue: '2026-12-01',
      artifact: 'approval-fixture',
      editorialApprover: 'Fixture editor',
    },
  };
  assert.equal(reviewSchema.safeParse(review).success, true);
  assert.equal(reviewSchema.safeParse({ ...review, status: 'draft' }).success, false);
  assert.equal(
    reviewSchema.safeParse({
      ...review,
      approval: { ...review.approval, editorialApprover: review.approval.approver },
    }).success,
    false,
  );
  assert.equal(
    reviewSchema.safeParse({ ...review, approval: { ...review.approval, reviewDue: '2026-09-01' } })
      .success,
    false,
  );
});
test('release policy rejects drafts publicly and withdrawn content in every channel', () => {
  const content = graph();
  assert.deepEqual(releaseErrors(content, { channel: 'internal_alpha' }, '2026-09-07'), []);
  assert.ok(
    releaseErrors(content, { channel: 'public' }, '2026-09-07').some((e) =>
      e.includes('clinical approval'),
    ),
  );
  mdma(content).review = {
    status: 'withdrawn',
    withdrawal: { reason: 'Fixture', effectiveAt: '2026-09-07' },
  };
  assert.ok(
    releaseErrors(content, { channel: 'internal_alpha' }, '2026-09-07').some((e) =>
      e.includes('withdrawn'),
    ),
  );
  assert.equal(releaseConfigSchema.safeParse({ channel: 'unreviewed_public' }).success, false);
});
test('testing handoff retains only stable preview context and is absent for sparse profiles', () => {
  const content = graph();
  const s = mdma(content);
  assert.deepEqual(getTestingContext(s), {
    substanceId: s.id,
    testingPreviewId: s.testing.id,
    origin: 'profile',
  });
  assert.equal(
    getTestingContext(content.substances.find(({ id }) => id === 'substance.2cb')),
    undefined,
  );
});
