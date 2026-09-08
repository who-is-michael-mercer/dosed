import { useState } from 'react';
import type { EvidenceMetadata, SourceReference } from '../../domain/content';
import { sourceRepository } from '../../infrastructure/content/LocalSourceRepository';
import { Action, AppText, Heading, Surface } from '../../components/ui';

export const evidenceLabels = {
  basis: 'Evidence basis',
  applicability: 'Applicability',
  limitations: 'Limitations',
  uncertainty: 'Uncertainty',
  conflict: 'Conflicts',
  assessedAt: 'Last evidence assessment',
  literatureDepth: 'Literature coverage',
} as const;
const readable = (value: string) => value.replaceAll('_', ' ');

export function EvidenceDetails({
  references,
  evidence,
  label,
}: {
  references?: readonly SourceReference[] | undefined;
  evidence?: EvidenceMetadata | undefined;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Action
        accessibilityLabel={`Evidence and sources: ${label}`}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide evidence and sources' : 'Evidence and sources'}
      </Action>
      {expanded && (
        <Surface>
          {evidence?.basis ? (
            <AppText>
              {evidenceLabels.basis}: {evidence.basis.map(readable).join(', ')}
            </AppText>
          ) : (
            <AppText>Evidence basis not recorded.</AppText>
          )}
          {evidence?.applicability && (
            <AppText>
              {evidenceLabels.applicability}: {evidence.applicability}
            </AppText>
          )}
          {evidence?.limitations?.map((item) => (
            <AppText key={item}>
              {evidenceLabels.limitations}: {item}
            </AppText>
          ))}
          {evidence?.uncertainty && (
            <AppText>
              {evidenceLabels.uncertainty}: {evidence.uncertainty}
            </AppText>
          )}
          <AppText>
            {evidenceLabels.conflict}:{' '}
            {evidence?.conflict ? readable(evidence.conflict.status) : 'not assessed'}
          </AppText>
          {evidence?.conflict?.summary && <AppText>{evidence.conflict.summary}</AppText>}
          <AppText>
            {evidenceLabels.assessedAt}: {evidence?.assessedAt ?? 'not recorded'}
          </AppText>
          {evidence?.literatureDepth && (
            <AppText>
              {evidenceLabels.literatureDepth}: {readable(evidence.literatureDepth)}
            </AppText>
          )}
          {!references && <AppText>Claim-level sources are not recorded.</AppText>}
          {references?.map((reference, index) => {
            const source = sourceRepository.getSource(reference.sourceId);
            return (
              <Surface key={`${reference.sourceId}.${index}`}>
                <Heading>{source?.title ?? 'Source details unavailable'}</Heading>
                <AppText>Source ID: {reference.sourceId}</AppText>
                {source && (
                  <>
                    <AppText>
                      Source type:{' '}
                      {source.sourceType ? readable(source.sourceType) : 'not recorded'}
                    </AppText>
                    {source.organization && <AppText>{source.organization}</AppText>}
                    {source.authors && <AppText>{source.authors.join(', ')}</AppText>}
                    {source.publication && <AppText>{source.publication}</AppText>}
                    {(source.publishedAt || source.year) && (
                      <AppText>Published: {source.publishedAt ?? source.year}</AppText>
                    )}
                    {source.url && <AppText selectable>{source.url}</AppText>}
                    {source.identifiers?.doi && (
                      <AppText selectable>DOI: {source.identifiers.doi}</AppText>
                    )}
                    {source.identifiers?.pmid && (
                      <AppText selectable>PMID: {source.identifiers.pmid}</AppText>
                    )}
                    {source.accessedAt && <AppText>Accessed: {source.accessedAt}</AppText>}
                    {source.status && <AppText>Source status: {readable(source.status)}</AppText>}
                    {source.statusNote && <AppText>{source.statusNote}</AppText>}
                  </>
                )}
                {reference.locator && <AppText>Locator: {reference.locator}</AppText>}
                {reference.role && <AppText>Relationship to claim: {reference.role}</AppText>}
                {reference.note && <AppText>{reference.note}</AppText>}
              </Surface>
            );
          })}
        </Surface>
      )}
    </>
  );
}
