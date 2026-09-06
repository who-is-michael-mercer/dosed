import { useLocalSearchParams } from 'expo-router';
import { ProfileScreen } from '../../src/features/profile/ProfileScreen';
import { contentRepository } from '../../src/infrastructure/content/LocalContentRepository';
import { substanceIdSchema } from '../../src/domain/content';
import { AppText } from '../../src/components/ui';
export default function ProfileRoute() {
  const params = useLocalSearchParams<{ substanceId: string }>();
  const id = substanceIdSchema.safeParse(params.substanceId);
  const substance = id.success ? contentRepository.getSubstance(id.data) : undefined;
  return substance ? (
    <ProfileScreen substance={substance} />
  ) : (
    <AppText accessibilityRole="alert">This profile is unavailable.</AppText>
  );
}
