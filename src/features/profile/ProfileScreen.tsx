import { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import type { Substance } from '../../domain/content';
import { recordRecentlyViewed } from '../../application/recent/recordRecentlyViewed';
import { recentRepository } from '../../infrastructure/persistence/RecentlyViewedRepository';
import { contentRepository } from '../../infrastructure/content/LocalContentRepository';
import { colors, spacing } from '../../design/tokens';
import { AppText, Action, Heading, Surface } from '../../components/ui';
import { EmergencyAccess } from '../../components/EmergencyAccess';
import {
  DoseSection,
  EffectsSection,
  SafetySection,
  Section,
  TimelineSection,
} from './ProfileSections';
import { EvidenceDetails } from './EvidenceDetails';
import { PharmacologySection } from './PharmacologySection';
import { TestingSection } from './TestingSection';
import { ReviewDetails } from './ReviewDetails';
import { ScreenFrame } from '../../components/ScreenFrame';
export function ProfileScreen({
  substance,
  focusId,
}: {
  substance: Substance;
  focusId?: string | undefined;
}) {
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(
        () => void recordRecentlyViewed(recentRepository, substance.id),
        750,
      );
      return () => clearTimeout(timer);
    }, [substance.id]),
  );

  return (
    <ScreenFrame substanceId={substance.id}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.category}>
          {contentRepository
            .listCategories()
            .filter((category) => substance.categoryIds.includes(category.id))
            .map((category) => category.label)
            .join(' · ')}
        </AppText>
        <Heading style={styles.display}>{substance.name}</Heading>
        <AppText>
          {substance.review.status === 'clinically_approved'
            ? 'Clinically approved content'
            : `Content status: ${substance.review.status.replaceAll('_', ' ')} · internal development only`}
        </AppText>
        <SafetySection substance={substance} focusId={focusId} />
        <AppText style={styles.aliases}>
          {substance.aliases
            .filter((x) => x.display)
            .map((x) => x.text)
            .join(' · ')}
        </AppText>
        <AppText>{substance.identity}</AppText>
        {[
          ...contentRepository
            .listCategories()
            .filter((item) => substance.categoryIds.includes(item.id))
            .map((item) => ({ ...item, parameter: 'categoryId' })),
          ...contentRepository
            .listSubgroups()
            .filter((item) => substance.subgroupIds?.includes(item.id))
            .map((item) => ({ ...item, parameter: 'subgroupId' })),
          ...contentRepository
            .listTags()
            .filter((item) => substance.tagIds?.includes(item.id))
            .map((item) => ({ ...item, parameter: 'tagId' })),
        ].map((facet) => (
          <Action
            key={facet.id}
            onPress={() =>
              router.push({ pathname: '/library', params: { [facet.parameter]: facet.id } })
            }
          >
            Browse {facet.label}
          </Action>
        ))}
        <DoseSection references={substance.doseReferences} />
        <TimelineSection timelines={substance.timelines} />
        <EffectsSection effects={substance.effects} />
        <TestingSection substance={substance} />
        {substance.helpSigns && (
          <Section title="When to get help">
            {substance.helpSigns.map((sign) => (
              <Surface key={sign.id}>
                <EmergencyAccess substanceId={substance.id} />
                <AppText>• {sign.body}</AppText>
                <EvidenceDetails
                  label={sign.id}
                  references={sign.sourceReferences}
                  evidence={sign.evidence}
                />
              </Surface>
            ))}
          </Section>
        )}
        {substance.relationships && (
          <Section title="Relationships">
            {substance.relationships.map((r) => {
              const target = contentRepository.getSubstance(r.substanceId);
              return target ? (
                <Surface key={r.id}>
                  <Heading>{target.name}</Heading>
                  <AppText>Relationship: {r.type.replaceAll('_', ' ')}</AppText>
                  <AppText>{r.reason}</AppText>
                  <EvidenceDetails
                    label={r.id}
                    references={r.sourceReferences}
                    evidence={r.evidence}
                  />
                  <Action
                    onPress={() =>
                      router.push({
                        pathname: '/substance/[substanceId]',
                        params: { substanceId: target.id },
                      })
                    }
                  >
                    Open relationship
                  </Action>
                </Surface>
              ) : null;
            })}
          </Section>
        )}
        <PharmacologySection claims={substance.rabbitHole} />
        <Section title="Profile sources">
          <EvidenceDetails label={substance.name} references={substance.sourceReferences} />
        </Section>
        <Section title="Content review">
          <ReviewDetails review={substance.review} />
        </Section>
      </ScrollView>
    </ScreenFrame>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  display: { fontSize: 44, lineHeight: 50 },
  category: { color: colors.muted, textTransform: 'uppercase', letterSpacing: 2 },
  aliases: { color: colors.muted },
  global: { padding: spacing.md },
});
