import { useCallback, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ScrollView, SectionList, StyleSheet, View } from 'react-native';
import { contentRepository } from '../../infrastructure/content/LocalContentRepository';
import { recentRepository } from '../../infrastructure/persistence/RecentlyViewedRepository';
import { type RecentEntry, type SubstanceId } from '../../domain/content';
import { colors, spacing } from '../../design/tokens';
import { AppText, Action, Heading } from '../../components/ui';
import { SubstanceCard } from '../../components/SubstanceCard';
import { ScreenFrame } from '../../components/ScreenFrame';
export function LibraryScreen() {
  const substances = contentRepository.listSubstances();
  const params = useLocalSearchParams<{
    categoryId?: string;
    subgroupId?: string;
    tagId?: string;
  }>();
  const [filter, setFilter] = useState<string | undefined>(
    params.subgroupId ?? params.tagId ?? params.categoryId,
  );
  const [mode, setMode] = useState<'category' | 'az'>('category');
  const [recent, setRecent] = useState<readonly RecentEntry[]>([]);
  const refresh = useCallback(() => {
    let active = true;
    void recentRepository.list().then((entries) => {
      if (active) setRecent(entries);
    });
    return () => {
      active = false;
    };
  }, []);
  useFocusEffect(refresh);
  const open = (id: SubstanceId) =>
    router.push({ pathname: '/substance/[substanceId]', params: { substanceId: id } });
  const recentItems = recent
    .map((x) => contentRepository.getSubstance(x.substanceId))
    .filter((x) => x !== undefined);
  const categories = contentRepository.listCategories();
  const facets = [
    ...categories,
    ...contentRepository.listSubgroups(),
    ...contentRepository.listTags(),
  ];
  const activeFilter = facets.find((facet) => facet.id === filter);
  const filtered = substances.filter(
    (substance) =>
      !activeFilter ||
      [
        ...substance.categoryIds,
        ...(substance.subgroupIds ?? []),
        ...(substance.tagIds ?? []),
      ].some((id) => id === activeFilter.id),
  );
  const sections =
    mode === 'az'
      ? [
          {
            id: 'az',
            label: 'All substances · A–Z',
            description: '',
            data: [...filtered].sort((a, b) => a.name.localeCompare(b.name)),
          },
        ]
      : categories
          .map((category) => ({
            ...category,
            data: filtered.filter((substance) => substance.categoryIds.includes(category.id)),
          }))
          .filter((section) => !activeFilter || section.data.length > 0);
  return (
    <ScreenFrame includeTopInset>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <SubstanceCard substance={item} onPress={() => open(item.id)} />}
        renderSectionHeader={({ section }) => (
          <View>
            <Heading>{section.label}</Heading>
            {!!section.description && <AppText>{section.description}</AppText>}
            {section.data.length === 0 && <AppText>No profiles in this category yet.</AppText>}
          </View>
        )}
        ListEmptyComponent={<AppText>No profiles match this filter.</AppText>}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText style={styles.kicker}>KNOW MORE. GUESS LESS.</AppText>
            <Heading style={styles.display}>The substance field guide.</Heading>
            <Action onPress={() => router.push('/library/search')}>Search substances</Action>
            {recentItems.length > 0 && (
              <View>
                <Heading>Recently viewed</Heading>
                <AppText>Stored only on this device.</AppText>
                <Action
                  onPress={() => {
                    void recentRepository
                      .clear()
                      .then(() => recentRepository.list())
                      .then(setRecent);
                  }}
                >
                  Clear recently viewed
                </Action>
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
              <Action
                accessibilityState={{ selected: mode === 'category' }}
                onPress={() => setMode('category')}
              >
                Categories
              </Action>
              <Action
                accessibilityState={{ selected: mode === 'az' }}
                onPress={() => setMode('az')}
              >
                A–Z
              </Action>
            </View>
            <Heading>Browse filters</Heading>
            <View style={styles.row}>
              <Action
                accessibilityState={{ selected: !activeFilter }}
                onPress={() => setFilter(undefined)}
              >
                All profiles
              </Action>
              {facets.map((facet) => (
                <Action
                  key={facet.id}
                  accessibilityState={{ selected: activeFilter?.id === facet.id }}
                  onPress={() => setFilter(facet.id)}
                >
                  {facet.label}
                </Action>
              ))}
            </View>
            {activeFilter && <AppText>{activeFilter.description}</AppText>}
          </View>
        }
      />
    </ScreenFrame>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  kicker: { color: colors.coral, fontWeight: '800', letterSpacing: 2 },
  display: { fontSize: 38, lineHeight: 43 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  compact: { width: 250 },
  emergency: { position: 'absolute', left: spacing.md, right: spacing.md, bottom: spacing.md },
});
