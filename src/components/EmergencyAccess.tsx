import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '../design/tokens';
import type { SubstanceId } from '../domain/content';
import { Action } from './ui';
export function EmergencyAccess({ substanceId }: { substanceId?: SubstanceId }) {
  return (
    <Action
      accessibilityLabel="Something feels wrong? Open emergency guidance"
      onPress={() =>
        router.push({ pathname: '/emergency', params: substanceId ? { substanceId } : {} })
      }
      style={styles.button}
    >
      Something feels wrong?
    </Action>
  );
}
const styles = StyleSheet.create({ button: { backgroundColor: colors.emergency } });
