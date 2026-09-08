import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/design/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, AppText } from '../src/components/ui';
import Emergency from './emergency';

// Never show/log error payloads: they can contain private route/profile context.
// Render bundled guidance directly, even if navigation cannot recover the failed screen.
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <AppText accessibilityRole="alert">
        This screen could not load. Offline emergency guidance is available below.
      </AppText>
      <Action
        onPress={() => {
          void retry();
        }}
      >
        Retry screen
      </Action>
      <Emergency />
    </SafeAreaView>
  );
}
export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="substance/[substanceId]" options={{ title: 'Field note' }} />
        <Stack.Screen
          name="emergency/index"
          options={{ title: 'Get help', presentation: 'modal', headerBackTitle: 'Back' }}
        />
      </Stack>
    </>
  );
}
