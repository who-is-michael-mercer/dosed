import type { PropsWithChildren } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { colors, radius, spacing } from '../design/tokens';
export function AppText({ style, ...props }: TextProps) {
  return (
    <Text allowFontScaling maxFontSizeMultiplier={2.5} style={[styles.text, style]} {...props} />
  );
}
export function Heading({ style, ...props }: TextProps) {
  return <AppText accessibilityRole="header" style={[styles.heading, style]} {...props} />;
}
export function Surface({ style, ...props }: ViewProps) {
  return <View style={[styles.surface, style]} {...props} />;
}
export function Action({ children, style, ...props }: PropsWithChildren<PressableProps>) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.action,
        pressed && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...props}
    >
      <AppText style={styles.actionText}>{children}</AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  text: { color: colors.text, fontSize: 17, lineHeight: 25 },
  heading: { fontSize: 25, lineHeight: 32, fontWeight: '700' },
  surface: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md },
  action: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { opacity: 0.75 },
  actionText: { fontWeight: '700', textAlign: 'center' },
});
