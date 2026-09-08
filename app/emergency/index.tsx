import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import content from '../../generated/emergency.json';
import { emergencyContentSchema, substanceIdSchema } from '../../src/domain/content';
import { colors, spacing } from '../../src/design/tokens';
import { Action, AppText, Heading, Surface } from '../../src/components/ui';
import {
  callEmergencyServices,
  emergencyCallConfig,
} from '../../src/infrastructure/emergency/DeviceDialer';
import { EvidenceDetails } from '../../src/features/profile/EvidenceDetails';
import { SafeAreaView } from 'react-native-safe-area-context';
const emergency = emergencyContentSchema.parse(content.emergency);
const Band = ({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'expected' | 'attention' | 'help';
}) => (
  <Surface
    style={[styles.band, tone === 'help' && styles.help]}
    accessibilityLabel={`${title}. ${items.join(' ')}`}
  >
    <Heading>
      {tone === 'help' ? '! ' : ''}
      {title}
    </Heading>
    {items.map((x) => (
      <AppText key={x}>• {x}</AppText>
    ))}
  </Surface>
);
export default function Emergency() {
  const { substanceId } = useLocalSearchParams<{ substanceId?: string }>();
  const parsed = substanceIdSchema.safeParse(substanceId);
  const substance = parsed.success
    ? content.contexts.find((context) => context.id === parsed.data)
    : undefined;
  const [dialerUnavailable, setDialerUnavailable] = useState(false);
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Heading style={styles.title}>Something feels wrong?</Heading>
        <Band title="Get emergency help now" tone="help" items={content.emergency.getHelp} />
        <Action
          accessibilityLabel="Call emergency services using the device dialer"
          onPress={() =>
            void callEmergencyServices().then((result) =>
              setDialerUnavailable(result === 'unavailable'),
            )
          }
        >
          Call emergency services
        </Action>
        <AppText style={styles.fallback}>
          {emergencyCallConfig.fallbackLabel} is configured for {emergencyCallConfig.locale}. If
          calling is unavailable, use that number or your local emergency number.
        </AppText>
        {dialerUnavailable && (
          <Surface accessible accessibilityRole="alert">
            <Heading>Calling is unavailable</Heading>
            <AppText>
              Keep the urgent instructions on this screen visible and call{' '}
              {emergencyCallConfig.fallbackLabel} using another phone if you can.
            </AppText>
          </Surface>
        )}
        <AppText>Act on what you can see. You do not need a confirmed substance or dose.</AppText>
        <Band title="Expected" tone="expected" items={content.emergency.expected} />
        <Band title="Pay attention" tone="attention" items={content.emergency.payAttention} />
        <Surface>
          <Heading>Not sure what was taken?</Heading>
          <AppText>{content.emergency.unknown}</AppText>
          <AppText>
            Multiple substances or adulteration may be involved. Say that clearly to responders.
          </AppText>
        </Surface>
        {substance && (
          <Surface>
            <Heading>Profile context: {substance.name}</Heading>
            <AppText>
              This optional context may help responders. General guidance above remains primary; you
              can still use this page without knowing what was taken.
            </AppText>
          </Surface>
        )}
        <EvidenceDetails
          label="emergency.core"
          references={emergency.sourceReferences}
          evidence={emergency.evidence}
        />
        <AppText>Content status: {content.emergency.review.status.replaceAll('_', ' ')}</AppText>
        <Action onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}>
          Back to browsing
        </Action>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  title: { fontSize: 38, lineHeight: 44 },
  band: { gap: spacing.md },
  help: { borderWidth: 3, borderColor: colors.emergency },
  fallback: { color: colors.muted },
});
