import type { Review } from '../../domain/content';
import { AppText } from '../../components/ui';

export function ReviewDetails({ review }: { review: Review }) {
  return (
    <>
      <AppText>Status: {review.status.replaceAll('_', ' ')}</AppText>
      <AppText>
        {review.author
          ? `Authored by ${review.author} on ${review.authoredAt}`
          : 'Authorship and authored date not recorded.'}
      </AppText>
      {review.assessment && (
        <AppText>
          Evidence assessed by {review.assessment.assessor} on {review.assessment.assessedAt}.
          Record: {review.assessment.artifact}
        </AppText>
      )}
      {review.approval ? (
        <AppText>
          Clinically approved by {review.approval.approver} ({review.approval.qualification}) on{' '}
          {review.approval.approvedAt}. Review due {review.approval.reviewDue}. Record:{' '}
          {review.approval.artifact}
        </AppText>
      ) : (
        <AppText>Clinical approval has not been recorded.</AppText>
      )}
      {review.withdrawal && (
        <AppText>
          Withdrawn {review.withdrawal.effectiveAt}: {review.withdrawal.reason}
        </AppText>
      )}
    </>
  );
}
