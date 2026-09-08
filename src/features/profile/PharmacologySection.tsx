import { useState } from 'react';
import type { PharmacologyClaim, Substance } from '../../domain/content';
import { Action, AppText, Surface } from '../../components/ui';
import { Section } from './ProfileSections';
import { EvidenceDetails } from './EvidenceDetails';

function Claim({ claim }: { claim: PharmacologyClaim }) {
  return (
    <Surface>
      <AppText>{claim.certainty.toUpperCase()}</AppText>
      <AppText>{claim.body}</AppText>
      {claim.evidence?.uncertainty && <AppText>{claim.evidence.uncertainty}</AppText>}
      {claim.evidence?.limitations?.map((item) => (
        <AppText key={item}>{item}</AppText>
      ))}
      {claim.evidence?.conflict?.summary && <AppText>{claim.evidence.conflict.summary}</AppText>}
      <EvidenceDetails
        label={claim.id}
        references={claim.sourceReferences}
        evidence={claim.evidence}
      />
    </Surface>
  );
}

export function PharmacologySection({ claims }: { claims: Substance['rabbitHole'] }) {
  const [expanded, setExpanded] = useState(false);
  if (!claims) return null;
  const plain = claims.filter((claim) => claim.level === 'plain');
  const deeper = ['mechanism', 'deep'].flatMap((level) =>
    claims.filter((claim) => claim.level === level),
  );
  return (
    <Section title="Pharmacology">
      {plain.length ? (
        plain.map((claim) => <Claim key={claim.id} claim={claim} />)
      ) : (
        <AppText>Plain-language overview is not available.</AppText>
      )}
      {deeper.length > 0 && (
        <>
          <Action accessibilityState={{ expanded }} onPress={() => setExpanded(!expanded)}>
            {expanded ? 'Hide mechanism details' : 'Show mechanism details'}
          </Action>
          {expanded && deeper.map((claim) => <Claim key={claim.id} claim={claim} />)}
        </>
      )}
    </Section>
  );
}
