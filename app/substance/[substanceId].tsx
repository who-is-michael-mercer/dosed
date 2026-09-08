import { router, useLocalSearchParams } from 'expo-router';
import { ProfileScreen } from '../../src/features/profile/ProfileScreen';
import { contentRepository } from '../../src/infrastructure/content/LocalContentRepository';
import { substanceIdSchema } from '../../src/domain/content';
import { Action, AppText } from '../../src/components/ui';
import { ScreenFrame } from '../../src/components/ScreenFrame';
export default function ProfileRoute() {
  const params = useLocalSearchParams<{ substanceId: string; focusId?: string }>();
  const id = substanceIdSchema.safeParse(params.substanceId);
  const substance = id.success ? contentRepository.getSubstance(id.data) : undefined;
  return substance ? (
    <ProfileScreen
      key={substance.id}
      substance={substance}
      focusId={typeof params.focusId === 'string' ? params.focusId : undefined}
    />
  ) : (
    <ScreenFrame>
      <AppText accessibilityRole="alert">This profile is unavailable.</AppText>
      <Action onPress={() => router.replace('/library')}>Open Library</Action>
    </ScreenFrame>
  );
}
