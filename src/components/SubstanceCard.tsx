import { Pressable, StyleSheet, View } from 'react-native';
import type { Substance } from '../domain/content';
import { colors, radius, spacing } from '../design/tokens';
import { AppText, Heading } from './ui';
export function SubstanceCard({
  substance,
  compact = false,
  onPress,
}: {
  substance: Substance;
  compact?: boolean;
  onPress: () => void;
}) {
  const flags = substance.safetyClaims.slice(0, 2);
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${substance.name} profile`}
      onPress={onPress}
      style={styles.card}
    >
      <View style={[styles.art, { borderColor: colors[substance.visual.color] }]}>
        <AppText style={styles.symbol}>{substance.visual.symbol}</AppText>
      </View>
      <View style={styles.copy}>
        <Heading>{substance.name}</Heading>
        {!compact && (
          <>
            <AppText style={styles.aliases}>
              {substance.aliases
                .filter((x) => x.display)
                .slice(0, 3)
                .map((x) => x.text)
                .join(' · ')}
            </AppText>
            <AppText>{substance.identity}</AppText>
            {flags.map((flag) => (
              <AppText key={flag.id} style={styles[flag.priority]}>
                {flag.priority.toUpperCase()} — {flag.title}
              </AppText>
            ))}
          </>
        )}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 88,
  },
  art: {
    width: 64,
    height: 64,
    borderWidth: 2,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: { fontSize: 23, fontWeight: '800' },
  copy: { flex: 1, gap: spacing.sm },
  aliases: { color: colors.muted },
  context: { color: colors.muted, fontWeight: '700' },
  important: { color: colors.important, fontWeight: '700' },
  critical: { color: colors.critical, fontWeight: '800' },
});
