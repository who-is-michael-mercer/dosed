import type { Substance } from '../../domain/content';
import { getTestingContext } from '../../application/testing/getTestingContext';
import { router } from 'expo-router';
import { Action, AppText } from '../../components/ui';
import { Lines, Section } from './ProfileSections';
import { EvidenceDetails } from './EvidenceDetails';

export function TestingSection({
  substance,
  showHandoff = true,
}: {
  substance: Substance;
  showHandoff?: boolean;
}) {
  const context = getTestingContext(substance);
  const testing = substance.testing;
  return (
    <Section title="Substance checking preview">
      {testing && context ? (
        <>
          <AppText>{testing.limitations}</AppText>
          <AppText>{testing.summary}</AppText>
          <Lines items={testing.reactions} />
          <EvidenceDetails
            label={testing.id}
            references={testing.sourceReferences}
            evidence={testing.evidence}
          />
          {showHandoff && (
            <Action onPress={() => router.push({ pathname: '/testing', params: context })}>
              Open testing preview context
            </Action>
          )}
          <AppText>
            Preview for {substance.name}. The full testing workflow is not available.
          </AppText>
        </>
      ) : (
        <AppText>Testing preview is not available for this profile.</AppText>
      )}
    </Section>
  );
}
