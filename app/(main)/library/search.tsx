import { useDeferredValue, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { searchSubstances } from '../../../src/application/search/searchSubstances';
import { SubstanceCard } from '../../../src/components/SubstanceCard';
import { ScreenFrame } from '../../../src/components/ScreenFrame';
import { Action, AppText, Heading } from '../../../src/components/ui';
import { colors, spacing } from '../../../src/design/tokens';
import { contentRepository } from '../../../src/infrastructure/content/LocalContentRepository';
export default function Search() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchSubstances(contentRepository.listSubstances(), deferredQuery),
    [deferredQuery],
  );
  return (
    <ScreenFrame>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <SubstanceCard
            substance={item}
            onPress={() =>
              router.push({
                pathname: '/substance/[substanceId]',
                params: { substanceId: item.id },
              })
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Heading>Search the field guide</Heading>
            <TextInput
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              maxLength={100}
              accessibilityLabel="Search substances"
              placeholder="MDMA, molly, 2cb…"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              style={styles.input}
            />
            {query.length > 0 && <Action onPress={() => setQuery('')}>Clear search</Action>}
            {!query.trim() && <AppText>Search by substance name or alias.</AppText>}
            {results.length > 1 && (
              <AppText>
                A name or alias can match multiple profiles. Check each profile's identity details.
              </AppText>
            )}
            {results.length > 0 && (
              <AppText accessibilityLiveRegion="polite">
                {results.length} matching {results.length === 1 ? 'profile' : 'profiles'}
              </AppText>
            )}
            {query.length > 0 && results.length === 0 && (
              <AppText>No substance matches that. Try a name or alias.</AppText>
            )}
          </View>
        }
      />
    </ScreenFrame>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { gap: spacing.md, marginBottom: spacing.md },
  input: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 18,
    padding: spacing.md,
  },
  emergency: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
});
