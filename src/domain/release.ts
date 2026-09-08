import { z } from 'zod';
import type { AuthoredContent, Review } from './content';

export const releaseConfigSchema = z.strictObject({
  channel: z.enum(['development', 'internal_alpha', 'public_beta', 'public']),
});
export type ReleaseConfig = z.infer<typeof releaseConfigSchema>;

/** A machine gate checks artifact references; human sign-off verifies their contents. */
export function releaseErrors(content: AuthoredContent, config: ReleaseConfig, date: string) {
  const errors: string[] = [];
  const isPublic = ['public_beta', 'public'].includes(config.channel);
  function visit(value: unknown, path: string, inheritedReview?: Review) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${path}.${index}`, inheritedReview));
      return;
    }
    const record = value as Record<string, unknown>;
    const review = (record.review as Review | undefined) ?? inheritedReview;
    if (record.review && review?.status === 'withdrawn')
      errors.push(`${path}: withdrawn content must not ship`);
    const substantive =
      typeof record.id === 'string' &&
      /^(substance|claim|action|dose|timeline|testing|sign|effect|relationship|pharmacology|emergency)\./.test(
        record.id,
      );
    if (isPublic && substantive) {
      if (review?.status !== 'clinically_approved')
        errors.push(`${path}: clinical approval required for public release`);
      if (review?.approval && review.approval.reviewDue < date)
        errors.push(`${path}: clinical review is overdue`);
      if (!Array.isArray(record.sourceReferences) || !record.sourceReferences.length)
        errors.push(`${path}: claim-level references required for public release`);
      if (/^(dose|emergency)\./.test(String(record.id)) || record.priority === 'critical') {
        if (
          !review?.approval?.editorialApprover ||
          review.approval.editorialApprover === review.approval.approver
        )
          errors.push(`${path}: two-person critical approval required`);
      }
      const evidence = record.evidence as Record<string, unknown> | undefined;
      if (
        !String(record.id).startsWith('substance.') &&
        (!evidence?.basis || !evidence.assessedAt || !evidence.conflict)
      )
        errors.push(`${path}: evidence basis, assessment date, and conflict assessment required`);
    }
    for (const [key, child] of Object.entries(record))
      if (key !== 'review') visit(child, `${path}.${key}`, review);
  }
  visit(content, 'content');
  return errors;
}
