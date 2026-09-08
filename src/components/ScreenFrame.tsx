import type { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { SubstanceId } from '../domain/content';
import { EmergencyAccess } from './EmergencyAccess';
import { colors, spacing } from '../design/tokens';

export function ScreenFrame({
  children,
  substanceId,
  includeTopInset = false,
}: PropsWithChildren<{ substanceId?: SubstanceId | undefined; includeTopInset?: boolean }>) {
  return (
    <SafeAreaView
      edges={includeTopInset ? ['top', 'left', 'right', 'bottom'] : ['left', 'right', 'bottom']}
      style={styles.page}
    >
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.body}>{children}</View>
        <View style={styles.footer}>
          <EmergencyAccess {...(substanceId ? { substanceId } : {})} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  body: { flex: 1 },
  footer: { padding: spacing.md },
});
