import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { contentRepository } from '../../infrastructure/content/LocalContentRepository';
import { recentRepository } from '../../infrastructure/persistence/RecentlyViewedRepository';
import type { RecentEntry, StableId } from '../../domain/content';
import { colors, spacing } from '../../design/tokens';
import { AppText, Action, Heading } from '../../components/ui';
import { SubstanceCard } from '../../components/SubstanceCard';
import { EmergencyAccess } from '../../components/EmergencyAccess';
const substances = contentRepository.listSubstances();
export function LibraryScreen() {
  const [mode, setMode] = useState<'category' | 'az'>('category');
  const [recent, setRecent] = useState<readonly RecentEntry[]>([]);
  const refresh = useCallback(() => {
    recentRepository.list().then(setRecent);
  }, []);
  useEffect(refresh, [refresh]);
  useFocusEffect(refresh);
  const open = (id: StableId) =>
    router.push({ pathname: '/substance/[substanceId]', params: { substanceId: id } });
  const recentItems = recent
    .map((x) => contentRepository.getSubstance(x.substanceId))
    .filter((x) => x !== undefined);
  const categories =
    mode === 'category'
      ? ['category.stimulant', 'category.dissociative', 'category.psychedelic']
      : [];
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText style={styles.kicker}>KNOW MORE. GUESS LESS.</AppText>
        <Heading style={styles.display}>The substance field guide.</Heading>
        <Action onPress={() => router.push('/library/search')}>Search substances</Action>
        {recentItems.length > 0 && (
          <View>
            <Heading>Recently viewed</Heading>
            <ScrollView horizontal contentContainerStyle={styles.row}>
              {recentItems.map((s) => (
                <View key={s.id} style={styles.compact}>
                  <SubstanceCard compact substance={s} onPress={() => open(s.id)} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.row}>
          <Action onPress={() => setMode('category')}>Categories</Action>
          <Action onPress={() => setMode('az')}>A–Z</Action>
        </View>
        {mode === 'az' ? (
          <>
            {[...substances]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((s) => (
                <SubstanceCard key={s.id} substance={s} onPress={() => open(s.id)} />
              ))}
          </>
        ) : (
          categories.map((id) => {
            const members = substances.filter((s) => s.categoryIds.includes(id));
            return (
              <View key={id}>
                <Heading>
                  {id.split('.')[1]![0]!.toUpperCase() + id.split('.')[1]!.slice(1)}s
                </Heading>
                {members.map((s) => (
                  <SubstanceCard key={s.id} substance={s} onPress={() => open(s.id)} />
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={styles.emergency}>
        <EmergencyAccess />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 110, gap: spacing.lg },
  kicker: { color: colors.coral, fontWeight: '800', letterSpacing: 2 },
  display: { fontSize: 38, lineHeight: 43 },
  row: { flexDirection: 'row', gap: spacing.sm },
  compact: { width: 250 },
  emergency: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
});
