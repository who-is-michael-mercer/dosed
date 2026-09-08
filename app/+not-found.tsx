import { router } from 'expo-router';
import { Action, AppText, Heading } from '../src/components/ui';
import { ScreenFrame } from '../src/components/ScreenFrame';

export default function NotFound() {
  return (
    <ScreenFrame>
      <Heading>Page unavailable</Heading>
      <AppText>This link does not match a page in the app.</AppText>
      <Action onPress={() => router.replace('/library')}>Open Library</Action>
    </ScreenFrame>
  );
}
