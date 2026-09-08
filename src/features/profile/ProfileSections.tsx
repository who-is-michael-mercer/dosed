import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Substance } from '../../domain/content';
import { AppText, Heading, Surface } from '../../components/ui';
import { colors, spacing } from '../../design/tokens';
import { getProfileEffectSections } from './profileEffectSections';
import { EvidenceDetails } from './EvidenceDetails';
import { selectSafety } from '../../application/profile/selectSafety';

export function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.section}>
      <Heading>{title}</Heading>
      {children}
    </View>
  );
}

export function Lines({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((item) => (
        <AppText key={item}>• {item}</AppText>
      ))}
    </>
  );
}

export function SafetySection({
  substance,
  focusId,
}: {
  substance: Substance;
  focusId?: string | undefined;
}) {
  const selection = selectSafety(substance, focusId);
  return (
    <>
      <Section title="Safety Snapshot">
        {selection.snapshot.map((claim) => (
          <AppText key={claim.id}>
            {claim.priority.toUpperCase()} — {claim.title}
          </AppText>
        ))}
      </Section>
      <Section title="Safety risks and actions">
        {selection.claims.map((claim) => (
          <Surface
            key={claim.id}
            nativeID={claim.id}
            testID={claim.id}
            style={styles[claim.priority]}
          >
            {selection.focusedId === claim.id && <AppText>Selected safety context</AppText>}
            <Heading style={styles.priority}>
              {claim.priority.toUpperCase()} — {claim.title}
            </Heading>
            <AppText>{claim.body}</AppText>
            {claim.actionIds.map((id) => {
              const action = substance.harmReductionActions.find((item) => item.id === id);
              return action ? (
                <View key={id}>
                  <AppText style={styles.action}>DO THIS — {action.body}</AppText>
                  <EvidenceDetails
                    label={action.id}
                    references={action.sourceReferences}
                    evidence={action.evidence}
                  />
                </View>
              ) : null;
            })}
            {claim.editorialException && (
              <AppText>Editorial exception: {claim.editorialException.reason}</AppText>
            )}
            <EvidenceDetails
              label={claim.id}
              references={claim.sourceReferences}
              evidence={claim.evidence}
            />
          </Surface>
        ))}
      </Section>
    </>
  );
}

export function DoseSection({ references }: { references: Substance['doseReferences'] }) {
  if (!references) return <AppText>Dose reference data is not available.</AppText>;
  return (
    <Section title="Dose reference">
      {references.map((dose) => (
        <Surface key={dose.id}>
          <AppText style={styles.priority}>
            {dose.route.toUpperCase()} · DESCRIPTIVE REFERENCE
          </AppText>
          {'ranges' in dose ? (
            dose.ranges.map((range) => (
              <AppText key={range.label}>
                {range.label}: {range.min}–{range.max} {dose.unit}
                {range.qualifier ? ` · ${range.qualifier}` : ''}
              </AppText>
            ))
          ) : (
            <AppText>Range unavailable</AppText>
          )}
          <AppText>{dose.context}</AppText>
          {'uncertainty' in dose && dose.uncertainty && <AppText>{dose.uncertainty}</AppText>}
          {'potencyNotes' in dose && dose.potencyNotes && <AppText>{dose.potencyNotes}</AppText>}
          {'redosing' in dose && dose.redosing && <AppText>{dose.redosing}</AppText>}
          <EvidenceDetails
            label={dose.id}
            references={dose.sourceReferences}
            evidence={dose.evidence}
          />
        </Surface>
      ))}
    </Section>
  );
}

export function TimelineSection({ timelines }: { timelines: Substance['timelines'] }) {
  if (!timelines) return <AppText>Timeline data is not available.</AppText>;
  return (
    <Section title="What to expect">
      {timelines.map((timeline) => (
        <Surface key={timeline.id}>
          <AppText style={styles.priority}>
            {timeline.route.toUpperCase()} · TYPICAL, NOT GUARANTEED
          </AppText>
          {timeline.phases.map((phase) => (
            <AppText key={phase.label}>
              {phase.label}:{' '}
              {'min' in phase
                ? `${phase.min}–${phase.max} ${phase.unit}${phase.qualifier ? ` · ${phase.qualifier}` : ''}`
                : `Unknown · ${phase.detail}`}
            </AppText>
          ))}
          <AppText>{timeline.uncertainty}</AppText>
          <EvidenceDetails
            label={timeline.id}
            references={timeline.sourceReferences}
            evidence={timeline.evidence}
          />
        </Surface>
      ))}
    </Section>
  );
}

export function EffectsSection({ effects }: { effects: Substance['effects'] }) {
  if (!effects) return null;
  return (
    <Section title="Effects and variability">
      {getProfileEffectSections(effects).map((group) => (
        <Surface key={group.id} testID={group.id} style={styles.section}>
          <Heading>{group.title}</Heading>
          <Lines items={group.items} />
          {group.qualifiers?.map((qualifier) => (
            <View key={qualifier.itemIndex}>
              <AppText>
                {group.items[qualifier.itemIndex]}: {qualifier.qualifier}
              </AppText>
              {qualifier.context && <AppText>{qualifier.context}</AppText>}
              <EvidenceDetails
                label={`${group.id}.${qualifier.itemIndex}`}
                references={qualifier.sourceReferences}
                evidence={qualifier.evidence}
              />
            </View>
          ))}
          <EvidenceDetails
            label={group.id}
            references={group.sourceReferences}
            evidence={group.evidence}
          />
        </Surface>
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.md },
  critical: { borderLeftWidth: 5, borderLeftColor: colors.critical, gap: spacing.sm },
  important: { borderLeftWidth: 5, borderLeftColor: colors.important, gap: spacing.sm },
  context: { borderLeftWidth: 5, borderLeftColor: colors.muted, gap: spacing.sm },
  priority: { fontWeight: '800' },
  action: { fontWeight: '700' },
});
