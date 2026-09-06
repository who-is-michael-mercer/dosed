import { z } from 'zod';

const nonBlankStringSchema = z
  .string()
  .min(1)
  .refine((value) => value.trim().length > 0, 'must not be blank');

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be an ISO date (YYYY-MM-DD)')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, 'must be a valid calendar date');

const httpUrlSchema = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), 'must use HTTP or HTTPS');

const stableIdValueSchema = z.string().regex(/^[a-z]+(?:\.[a-z0-9][a-z0-9-]*)+$/);
export const stableIdSchema = stableIdValueSchema.brand<'StableId'>();
export type StableId = z.infer<typeof stableIdSchema>;

const namespacedIdSchema = <const Namespace extends string>(namespace: Namespace) =>
  stableIdSchema
    .refine((id) => id.startsWith(`${namespace}.`), `must use the ${namespace} namespace`)
    .brand<`id:${Namespace}`>();

export const categoryIdSchema = namespacedIdSchema('category');
export const sourceIdSchema = namespacedIdSchema('source');
export const substanceIdSchema = namespacedIdSchema('substance');
export const claimIdSchema = namespacedIdSchema('claim');
export const doseReferenceIdSchema = namespacedIdSchema('dose');
export const timelineIdSchema = namespacedIdSchema('timeline');
export const effectsGroupIdSchema = namespacedIdSchema('effect');
export const testingPreviewIdSchema = namespacedIdSchema('testing');
export const helpSignIdSchema = namespacedIdSchema('sign');
export const relationshipIdSchema = namespacedIdSchema('relationship');
export const pharmacologyClaimIdSchema = namespacedIdSchema('pharmacology');
export const emergencyIdSchema = namespacedIdSchema('emergency');

export type CategoryId = z.infer<typeof categoryIdSchema>;
export type SourceId = z.infer<typeof sourceIdSchema>;
export type SubstanceId = z.infer<typeof substanceIdSchema>;

export const reviewSchema = z
  .strictObject({
    status: z.enum(['draft', 'needs_clinical_review', 'reviewed']),
    reviewedAt: isoDateSchema,
    reviewDue: isoDateSchema,
  })
  .refine((review) => review.reviewDue >= review.reviewedAt, {
    message: 'reviewDue must not precede reviewedAt',
    path: ['reviewDue'],
  });
export type Review = z.infer<typeof reviewSchema>;

export const sourceReferenceRoleSchema = z.enum(['supports', 'context', 'contrasts']);
export const sourceReferenceSchema = z.strictObject({
  sourceId: sourceIdSchema,
  locator: nonBlankStringSchema.optional(),
  role: sourceReferenceRoleSchema.optional(),
  note: nonBlankStringSchema.optional(),
});
export const sourceReferencesSchema = z
  .array(sourceReferenceSchema)
  .min(1)
  .superRefine((references, context) => {
    const seen = new Set<string>();
    references.forEach((reference, index) => {
      const key = [reference.sourceId, reference.locator ?? '', reference.role ?? ''].join(
        '\u0000',
      );
      if (seen.has(key)) {
        context.addIssue({
          code: 'custom',
          message: 'duplicate source reference',
          path: [index],
        });
      }
      seen.add(key);
    });
  });
export type SourceReferenceRole = z.infer<typeof sourceReferenceRoleSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;

export const evidenceBasisSchema = z.enum([
  'official_guidance',
  'literature_review',
  'controlled_human_study',
  'observational_human_data',
  'case_report',
  'mechanistic',
  'preclinical',
  'analytical_testing',
  'expert_consensus',
]);
export const literatureDepthSchema = z.enum(['single_source', 'selected_sources', 'synthesis']);
export const evidenceConflictSchema = z
  .strictObject({
    status: z.enum(['not_assessed', 'no_material_conflict_identified', 'mixed', 'conflicting']),
    summary: nonBlankStringSchema.optional(),
  })
  .superRefine((conflict, context) => {
    if (['mixed', 'conflicting'].includes(conflict.status) && !conflict.summary) {
      context.addIssue({
        code: 'custom',
        message: `${conflict.status} evidence requires a summary`,
        path: ['summary'],
      });
    }
  });
export const evidenceMetadataSchema = z
  .strictObject({
    basis: z.array(evidenceBasisSchema).min(1).optional(),
    applicability: nonBlankStringSchema.optional(),
    limitations: z.array(nonBlankStringSchema).min(1).optional(),
    uncertainty: nonBlankStringSchema.optional(),
    conflict: evidenceConflictSchema.optional(),
    literatureDepth: literatureDepthSchema.optional(),
    assessedAt: isoDateSchema.optional(),
  })
  .superRefine((evidence, context) => {
    if (evidence.basis && new Set(evidence.basis).size !== evidence.basis.length) {
      context.addIssue({
        code: 'custom',
        message: 'evidence basis entries must be unique',
        path: ['basis'],
      });
    }
  })
  .refine(
    (evidence) => Object.values(evidence).some((value) => value !== undefined),
    'evidence metadata must not be empty',
  );
export type EvidenceBasis = z.infer<typeof evidenceBasisSchema>;
export type LiteratureDepth = z.infer<typeof literatureDepthSchema>;
export type EvidenceConflict = z.infer<typeof evidenceConflictSchema>;
export type EvidenceMetadata = z.infer<typeof evidenceMetadataSchema>;

export const sourceTypeSchema = z.enum([
  'government_guidance',
  'clinical_guidance',
  'systematic_review',
  'narrative_review',
  'primary_research',
  'reference',
  'community_report',
  'other',
]);
export const sourceStatusSchema = z.enum(['current', 'corrected', 'superseded', 'retracted']);
export const sourceIdentifiersSchema = z
  .strictObject({
    doi: z
      .string()
      .regex(/^10\.\d{4,9}\/\S+$/i, 'must be a DOI such as 10.1000/example')
      .optional(),
    pmid: z
      .string()
      .regex(/^[1-9]\d*$/, 'must be a numeric PMID')
      .optional(),
  })
  .refine((identifiers) => Boolean(identifiers.doi || identifiers.pmid), {
    message: 'at least one source identifier is required',
  });
export const sourceSchema = z
  .strictObject({
    id: sourceIdSchema,
    title: nonBlankStringSchema,
    organization: nonBlankStringSchema.optional(),
    authors: z.array(nonBlankStringSchema).min(1).optional(),
    publication: nonBlankStringSchema.optional(),
    publishedAt: isoDateSchema.optional(),
    year: z.number().int().min(1000).max(9999).optional(),
    url: httpUrlSchema.optional(),
    identifiers: sourceIdentifiersSchema.optional(),
    sourceType: sourceTypeSchema.optional(),
    accessedAt: isoDateSchema.optional(),
    review: reviewSchema.optional(),
    status: sourceStatusSchema.optional(),
    statusNote: nonBlankStringSchema.optional(),
  })
  .superRefine((source, context) => {
    if (!source.organization && !source.authors && !source.publication) {
      context.addIssue({
        code: 'custom',
        message: 'an organization, author list, or publication is required',
      });
    }
    if (
      source.publishedAt &&
      source.year &&
      Number(source.publishedAt.slice(0, 4)) !== source.year
    ) {
      context.addIssue({
        code: 'custom',
        message: 'year must match publishedAt',
        path: ['year'],
      });
    }
    if (source.publishedAt && source.accessedAt && source.accessedAt < source.publishedAt) {
      context.addIssue({
        code: 'custom',
        message: 'accessedAt must not precede publishedAt',
        path: ['accessedAt'],
      });
    }
    if (source.statusNote && !source.status) {
      context.addIssue({
        code: 'custom',
        message: 'statusNote requires a source status',
        path: ['statusNote'],
      });
    }
    if (source.status && source.status !== 'current' && !source.statusNote) {
      context.addIssue({
        code: 'custom',
        message: `${source.status} sources require a status note`,
        path: ['statusNote'],
      });
    }
  });
export type SourceType = z.infer<typeof sourceTypeSchema>;
export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type Source = z.infer<typeof sourceSchema>;

export const contentColorSchema = z.enum(['amber', 'blue', 'coral', 'violet']);
export const categorySchema = z.strictObject({
  id: categoryIdSchema,
  label: nonBlankStringSchema,
  description: nonBlankStringSchema,
  order: z.number().int().nonnegative(),
  color: contentColorSchema,
});
export type ContentColor = z.infer<typeof contentColorSchema>;
export type Category = z.infer<typeof categorySchema>;

export const aliasSchema = z.strictObject({
  text: nonBlankStringSchema,
  kind: z.enum(['common', 'slang', 'abbreviation', 'chemical', 'misspelling', 'search']),
  display: z.boolean(),
});
export type Alias = z.infer<typeof aliasSchema>;

export const prioritySchema = z.enum(['critical', 'important', 'context']);
export const safetyClaimSchema = z.strictObject({
  id: claimIdSchema,
  priority: prioritySchema,
  title: nonBlankStringSchema,
  body: nonBlankStringSchema,
  action: nonBlankStringSchema,
  sourceReferences: sourceReferencesSchema,
  evidence: evidenceMetadataSchema.optional(),
});
export type Priority = z.infer<typeof prioritySchema>;
export type SafetyClaim = z.infer<typeof safetyClaimSchema>;

export const routeSchema = z.enum([
  'oral',
  'sublingual',
  'buccal',
  'insufflated',
  'inhaled',
  'smoked',
  'vaporized',
  'rectal',
  'transdermal',
  'intramuscular',
  'intravenous',
]);
export const doseUnitSchema = z.enum(['mg', 'g', 'mcg', 'µg', 'mL']);
const requireUniqueLabels = <Item extends { label: string }>(
  items: readonly Item[],
  context: z.RefinementCtx,
) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    const label = item.label.trim().toLocaleLowerCase('en-US');
    if (seen.has(label)) {
      context.addIssue({
        code: 'custom',
        message: 'labels must be unique within their parent',
        path: [index, 'label'],
      });
    }
    seen.add(label);
  });
};
export const doseRangeSchema = z
  .strictObject({
    label: nonBlankStringSchema,
    min: z.number().finite().positive(),
    max: z.number().finite().positive(),
  })
  .refine((range) => range.min < range.max, {
    message: 'min must be less than max',
    path: ['max'],
  });
export const doseReferenceSchema = z.strictObject({
  id: doseReferenceIdSchema,
  route: routeSchema,
  unit: doseUnitSchema,
  ranges: z.array(doseRangeSchema).min(1).superRefine(requireUniqueLabels),
  context: nonBlankStringSchema,
  redosing: nonBlankStringSchema.optional(),
  sourceReferences: sourceReferencesSchema,
  evidence: evidenceMetadataSchema.optional(),
});
export type Route = z.infer<typeof routeSchema>;
export type DoseUnit = z.infer<typeof doseUnitSchema>;
export type DoseRange = z.infer<typeof doseRangeSchema>;
export type DoseReference = z.infer<typeof doseReferenceSchema>;

export const timelineUnitSchema = z.enum(['seconds', 'minutes', 'hours', 'days']);
export const timelinePhaseSchema = z
  .strictObject({
    label: nonBlankStringSchema,
    min: z.number().finite().nonnegative(),
    max: z.number().finite().positive(),
    unit: timelineUnitSchema,
  })
  .refine((phase) => phase.min < phase.max, {
    message: 'min must be less than max',
    path: ['max'],
  });
export const timelineSchema = z.strictObject({
  id: timelineIdSchema,
  route: routeSchema,
  phases: z.array(timelinePhaseSchema).min(1).superRefine(requireUniqueLabels),
  uncertainty: nonBlankStringSchema,
  sourceReferences: sourceReferencesSchema,
  evidence: evidenceMetadataSchema.optional(),
});
export type TimelineUnit = z.infer<typeof timelineUnitSchema>;
export type TimelinePhase = z.infer<typeof timelinePhaseSchema>;
export type Timeline = z.infer<typeof timelineSchema>;

const optionalEvidenceSchemaFields = {
  sourceReferences: sourceReferencesSchema.optional(),
  evidence: evidenceMetadataSchema.optional(),
};

const requireSourcesForEvidence = (
  value: {
    sourceReferences?: readonly SourceReference[] | undefined;
    evidence?: EvidenceMetadata | undefined;
  },
  context: z.RefinementCtx,
) => {
  if (value.evidence && !value.sourceReferences) {
    context.addIssue({
      code: 'custom',
      message: 'evidence metadata requires source references',
      path: ['sourceReferences'],
    });
  }
};

export const effectGroupSchema = z
  .strictObject({
    id: effectsGroupIdSchema,
    items: z.array(nonBlankStringSchema).min(1),
    ...optionalEvidenceSchemaFields,
  })
  .superRefine(requireSourcesForEvidence);
export const effectsSchema = z
  .strictObject({
    common: effectGroupSchema.optional(),
    unwanted: effectGroupSchema.optional(),
    variability: effectGroupSchema.optional(),
  })
  .refine((effects) => Boolean(effects.common || effects.unwanted || effects.variability), {
    message: 'at least one effects group is required',
  });
export type EffectGroup = z.infer<typeof effectGroupSchema>;
export type Effects = z.infer<typeof effectsSchema>;

export const testingPreviewSchema = z.strictObject({
  id: testingPreviewIdSchema,
  summary: nonBlankStringSchema,
  reactions: z.array(nonBlankStringSchema).min(1),
  limitations: nonBlankStringSchema,
  sourceReferences: sourceReferencesSchema,
  evidence: evidenceMetadataSchema.optional(),
});
export type TestingPreview = z.infer<typeof testingPreviewSchema>;

export const helpSignSchema = z
  .strictObject({
    id: helpSignIdSchema,
    body: nonBlankStringSchema,
    ...optionalEvidenceSchemaFields,
  })
  .superRefine(requireSourcesForEvidence);
export type HelpSign = z.infer<typeof helpSignSchema>;

export const relationshipSchema = z
  .strictObject({
    id: relationshipIdSchema,
    substanceId: substanceIdSchema,
    reason: nonBlankStringSchema,
    ...optionalEvidenceSchemaFields,
  })
  .superRefine(requireSourcesForEvidence);
export type SubstanceRelationship = z.infer<typeof relationshipSchema>;

export const pharmacologyLevelSchema = z.enum(['plain', 'mechanism', 'deep']);
export const claimCertaintySchema = z.enum([
  'established',
  'inference',
  'uncertain',
  'conflicting',
]);
export const pharmacologyClaimSchema = z.strictObject({
  id: pharmacologyClaimIdSchema,
  level: pharmacologyLevelSchema,
  body: nonBlankStringSchema,
  certainty: claimCertaintySchema,
  sourceReferences: sourceReferencesSchema,
  evidence: evidenceMetadataSchema.optional(),
});
export type PharmacologyLevel = z.infer<typeof pharmacologyLevelSchema>;
export type ClaimCertainty = z.infer<typeof claimCertaintySchema>;
export type PharmacologyClaim = z.infer<typeof pharmacologyClaimSchema>;

export const substanceSchema = z.strictObject({
  id: substanceIdSchema,
  name: nonBlankStringSchema,
  aliases: z.array(aliasSchema),
  searchTerms: z.array(nonBlankStringSchema),
  categoryIds: z.array(categoryIdSchema).min(1),
  visual: z.strictObject({
    symbol: nonBlankStringSchema,
    color: contentColorSchema,
  }),
  identity: nonBlankStringSchema,
  review: reviewSchema,
  safetyClaims: z.array(safetyClaimSchema).min(1),
  doseReferences: z.array(doseReferenceSchema).min(1).optional(),
  timelines: z.array(timelineSchema).min(1).optional(),
  effects: effectsSchema.optional(),
  testing: testingPreviewSchema.optional(),
  helpSigns: z.array(helpSignSchema).min(1).optional(),
  relationships: z.array(relationshipSchema).min(1).optional(),
  rabbitHole: z.array(pharmacologyClaimSchema).min(1).optional(),
  sourceReferences: sourceReferencesSchema,
});
export type Substance = z.infer<typeof substanceSchema>;

export const emergencyContentSchema = z.strictObject({
  id: emergencyIdSchema,
  review: reviewSchema,
  expected: z.array(nonBlankStringSchema).min(1),
  payAttention: z.array(nonBlankStringSchema).min(1),
  getHelp: z.array(nonBlankStringSchema).min(1),
  unknown: nonBlankStringSchema,
  sourceReferences: sourceReferencesSchema,
});
export type EmergencyContent = z.infer<typeof emergencyContentSchema>;

export const authoredContentSchema = z.strictObject({
  categories: z.array(categorySchema).min(1),
  sources: z.array(sourceSchema).min(1),
  emergency: emergencyContentSchema,
  substances: z.array(substanceSchema).min(1),
});
export type AuthoredContent = z.infer<typeof authoredContentSchema>;

export interface ContentRepository {
  listSubstances(): readonly Substance[];
  getSubstance(id: SubstanceId): Substance | undefined;
  listSources(): readonly Source[];
  getSource(id: SourceId): Source | undefined;
}

export const recentEntrySchema = z.strictObject({
  substanceId: substanceIdSchema,
  viewedAt: z.number().finite(),
});
export type RecentEntry = z.infer<typeof recentEntrySchema>;

export interface RecentRepository {
  list(): Promise<readonly RecentEntry[]>;
  record(entry: RecentEntry): Promise<void>;
  clear(): Promise<void>;
}
