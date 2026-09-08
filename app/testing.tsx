import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Action, AppText, Heading } from '../src/components/ui';
import { ScreenFrame } from '../src/components/ScreenFrame';
import { substanceIdSchema } from '../src/domain/content';
import { contentRepository } from '../src/infrastructure/content/LocalContentRepository';
import { TestingSection } from '../src/features/profile/TestingSection';
import { spacing } from '../src/design/tokens';

export default function TestingPreviewRoute() {
  const params = useLocalSearchParams<{ substanceId?: string; testingPreviewId?: string }>();
  const parsed = substanceIdSchema.safeParse(params.substanceId);
  const substance = parsed.success ? contentRepository.getSubstance(parsed.data) : undefined;
  const valid =
    substance?.testing &&
    (!params.testingPreviewId || params.testingPreviewId === substance.testing.id);
  return (
    <ScreenFrame substanceId={substance?.id}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
        <Heading>Substance checking preview</Heading>
        {valid && substance ? (
          <>
            <Heading>{substance.name}</Heading>
            <AppText>Content status: {substance.review.status.replaceAll('_', ' ')}</AppText>
            <TestingSection substance={substance} showHandoff={false} />
          </>
        ) : (
          <AppText accessibilityRole="alert">
            No testing preview is available for this link. Choose a profile from the Library.
          </AppText>
        )}
        <Action onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}>
          {router.canGoBack() ? 'Back' : 'Open Library'}
        </Action>
      </ScrollView>
    </ScreenFrame>
  );
}
