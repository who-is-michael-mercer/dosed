import { useEffect } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { StableId, Substance } from '../../domain/content';
import { recordRecentlyViewed } from '../../application/recent/recordRecentlyViewed';
import { recentRepository } from '../../infrastructure/persistence/RecentlyViewedRepository';
import { contentRepository } from '../../infrastructure/content/LocalContentRepository';
import { colors, spacing } from '../../design/tokens';
import { AppText, Action, Heading, Surface } from '../../components/ui';
import { EmergencyAccess } from '../../components/EmergencyAccess';
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Heading>{title}</Heading>
    {children}
  </View>
);
const Lines = ({ items }: { items: string[] }) => (
  <>
    {items.map((x) => (
      <AppText key={x}>• {x}</AppText>
    ))}
  </>
);
export function ProfileScreen({ substance }: { substance: Substance }) {
  useEffect(() => {
    const timer = setTimeout(() => void recordRecentlyViewed(recentRepository, substance.id), 750);
    return () => clearTimeout(timer);
  }, [substance.id]);
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={styles.category}>
          {substance.categoryIds.map((x) => x.split('.')[1]).join(' · ')}
        </AppText>
        <Heading style={styles.display}>{substance.name}</Heading>
        <AppText style={styles.aliases}>
          {substance.aliases
            .filter((x) => x.display)
            .map((x) => x.text)
            .join(' · ')}
        </AppText>
        <AppText>{substance.identity}</AppText>
        <Section title="First, the important bits">
          {substance.safetyClaims.map((c) => (
            <Surface
              key={c.id}
              style={c.priority === 'critical' ? styles.critical : styles.important}
            >
              <AppText style={styles.priority}>
                {c.priority.toUpperCase()} — {c.title}
              </AppText>
              <AppText>{c.body}</AppText>
              <AppText style={styles.action}>DO THIS — {c.action}</AppText>
            </Surface>
          ))}
        </Section>
        {substance.doseReferences && (
          <Section title="Before you take it">
            {substance.doseReferences.map((d: any) => (
              <Surface key={d.id}>
                <AppText style={styles.priority}>
                  {d.route.toUpperCase()} · DESCRIPTIVE REFERENCE
                </AppText>
                {d.ranges.map((r: any) => (
                  <AppText key={r.label}>
                    {r.label}: {r.min}–{r.max} {d.unit}
                  </AppText>
                ))}
                <AppText>{d.context}</AppText>
                {d.redosing && <AppText>{d.redosing}</AppText>}
              </Surface>
            ))}
          </Section>
        )}
        {substance.timelines && (
          <Section title="What to expect">
            {substance.timelines.map((t: any) => (
              <Surface key={t.id}>
                <AppText style={styles.priority}>
                  {t.route.toUpperCase()} · TYPICAL, NOT GUARANTEED
                </AppText>
                {t.phases.map((p: any) => (
                  <AppText key={p.label}>
                    {p.label}: {p.min}–{p.max} {p.unit}
                  </AppText>
                ))}
                <AppText>{t.uncertainty}</AppText>
              </Surface>
            ))}
            {substance.effects && (
              <>
                <Heading>Effects and variability</Heading>
                <Lines
                  items={[
                    ...substance.effects.common,
                    ...substance.effects.unwanted,
                    ...substance.effects.variability,
                  ]}
                />
              </>
            )}
          </Section>
        )}
        {substance.testing && (
          <Section title="Know what you have">
            <AppText>{substance.testing.summary}</AppText>
            <Lines items={substance.testing.reactions} />
            <AppText>{substance.testing.limitations}</AppText>
          </Section>
        )}
        {substance.helpSigns && (
          <Section title="When to get help">
            <Lines items={substance.helpSigns} />
            <EmergencyAccess substanceId={substance.id} />
          </Section>
        )}
        {substance.relationships && (
          <Section title="Relationships">
            {substance.relationships.map((r) => {
              const target = contentRepository.getSubstance(r.substanceId as StableId);
              return target ? (
                <Surface key={r.substanceId}>
                  <Heading>{target.name}</Heading>
                  <AppText>{r.reason}</AppText>
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
        {substance.rabbitHole && (
          <Section title="Rabbit hole">
            {substance.rabbitHole.map((r: any, i: number) => (
              <Surface key={i}>
                <AppText style={styles.priority}>
                  {r.level.toUpperCase()} · {r.certainty}
                </AppText>
                <AppText>{r.body}</AppText>
                <AppText style={styles.sources}>Sources: {r.sourceIds.join(', ')}</AppText>
              </Surface>
            ))}
          </Section>
        )}
        <Section title="Evidence and review">
          <AppText>Status: {substance.review.status.replaceAll('_', ' ')}</AppText>
          <AppText>
            Reviewed: {substance.review.reviewedAt} · due {substance.review.reviewDue}
          </AppText>
          <AppText style={styles.sources}>Source IDs: {substance.sourceIds.join(', ')}</AppText>
        </Section>
      </ScrollView>
      <View style={styles.global}>
        <EmergencyAccess substanceId={substance.id} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 110, gap: spacing.lg },
  display: { fontSize: 44, lineHeight: 50 },
  category: { color: colors.muted, textTransform: 'uppercase', letterSpacing: 2 },
  aliases: { color: colors.muted },
  section: { gap: spacing.md },
  critical: { borderLeftWidth: 5, borderLeftColor: colors.critical, gap: spacing.sm },
  important: { borderLeftWidth: 5, borderLeftColor: colors.important, gap: spacing.sm },
  priority: { fontWeight: '800' },
  action: { fontWeight: '700' },
  sources: { color: colors.muted, fontSize: 14 },
  global: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
});
