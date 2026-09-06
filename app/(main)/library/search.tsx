import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { searchSubstances } from '../../../src/application/search/searchSubstances';
import { SubstanceCard } from '../../../src/components/SubstanceCard';
import { EmergencyAccess } from '../../../src/components/EmergencyAccess';
import { AppText, Heading } from '../../../src/components/ui';
import { colors, spacing } from '../../../src/design/tokens';
import { contentRepository } from '../../../src/infrastructure/content/LocalContentRepository';
export default function Search() {
  const [query, setQuery] = useState('');
  const results = searchSubstances(contentRepository.listSubstances(), query);
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Heading>Search the field guide</Heading>
        <TextInput
          autoFocus
          accessibilityLabel="Search substances"
          placeholder="MDMA, molly, 2cb…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        {query.length > 0 && results.length === 0 && (
          <AppText>No substance matches that. Try a name or alias.</AppText>
        )}
        {results.map((s) => (
          <SubstanceCard
            key={s.id}
            substance={s}
            onPress={() =>
              router.push({ pathname: '/substance/[substanceId]', params: { substanceId: s.id } })
            }
          />
        ))}
      </ScrollView>
      <View style={styles.emergency}>
        <EmergencyAccess />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 100, gap: spacing.md },
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
