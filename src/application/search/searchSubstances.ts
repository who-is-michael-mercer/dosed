import type { Substance } from '../../domain/content';
const normalize = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
const compact = (v: string) => normalize(v).replaceAll(' ', '');
const distance = (a: string, b: string) => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = old;
    }
  }
  return row[b.length]!;
};
export function rankSubstances(
  substances: readonly Substance[],
  query: string,
): { substance: Substance; score: number }[] {
  const q = normalize(query),
    qc = compact(query);
  if (!q || qc.length > 100) return [];
  const scores = new Map<string, number>();
  const index = substances.flatMap((substance) =>
    [
      { text: substance.name, weight: 100 },
      ...substance.aliases.map((alias) => ({ text: alias.text, weight: 80 })),
      ...(substance.searchTerms ?? []).map((text) => ({ text, weight: 60 })),
    ].map(({ text, weight }) => ({
      substanceId: substance.id,
      term: normalize(text),
      compact: compact(text),
      weight,
    })),
  );
  for (const item of index) {
    let score = 0;
    if (item.term === q || item.compact === qc) score = item.weight + 100;
    else if (item.term.startsWith(q) || item.compact.startsWith(qc))
      score = item.weight + 60 - q.length;
    else if (qc.length >= 3 && item.compact.includes(qc)) score = item.weight + 35;
    else if (qc.length >= 3 && Math.abs(qc.length - item.compact.length) <= 2) {
      const d = distance(qc, item.compact);
      if (d <= (qc.length >= 5 ? 2 : 1)) score = item.weight + 30 - d * 10;
    }
    if (score) scores.set(item.substanceId, Math.max(scores.get(item.substanceId) ?? 0, score));
  }
  return [...substances]
    .filter((x) => scores.has(x.id))
    .map((substance) => ({ substance, score: scores.get(substance.id)! }))
    .sort((a, b) => b.score - a.score || a.substance.name.localeCompare(b.substance.name));
}
export function searchSubstances(substances: readonly Substance[], query: string): Substance[] {
  return rankSubstances(substances, query).map((result) => result.substance);
}
