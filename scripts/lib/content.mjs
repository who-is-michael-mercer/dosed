import fs from 'node:fs';
import path from 'node:path';
import { authoredContentSchema } from '../../src/domain/content.ts';

export const ROOT = path.resolve(import.meta.dirname, '../..');
export const CONTENT_SCHEMA_VERSION = 2;
export const CONTENT_VERSION = '2026.09.06';
export const compareCodePoints = (a, b) => {
  const left = [...a];
  const right = [...b];
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    const difference = left[index].codePointAt(0) - right[index].codePointAt(0);
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
};
export const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${file}: ${message}`, { cause: error });
  }
};
export const normalize = (value) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
export const compact = (value) => normalize(value).replaceAll(' ', '');
export const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const old = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = old;
    }
  }
  return row[b.length];
};
export function loadContent() {
  const categories = readJson('content/taxonomy/categories.json');
  const sources = readJson('content/sources/sources.json');
  const emergency = readJson('content/emergency/core.json');
  const substances = fs
    .readdirSync(path.join(ROOT, 'content/substances'))
    .filter((file) => file.endsWith('.json'))
    .sort(compareCodePoints)
    .map((file) => readJson(`content/substances/${file}`));
  return { categories, sources, emergency, substances };
}

const formatPath = (pathParts) => pathParts.map(String).join('.') || 'content';
const sortUnique = (values) => [...new Set(values)].sort(compareCodePoints);

const walk = (value, pathParts, visit) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, [...pathParts, index], visit));
    return;
  }
  if (value === null || typeof value !== 'object') return;
  visit(value, pathParts);
  for (const [key, child] of Object.entries(value)) walk(child, [...pathParts, key], visit);
};

const buildAmbiguousAliases = (substances) => {
  const aliases = new Map();
  for (const substance of substances) {
    for (const alias of substance.aliases) {
      const key = normalize(alias.text);
      const matches = aliases.get(key) ?? [];
      matches.push(substance.id);
      aliases.set(key, matches);
    }
  }
  return [...aliases]
    .map(([alias, substanceIds]) => ({ alias, substanceIds: sortUnique(substanceIds) }))
    .filter(({ substanceIds }) => substanceIds.length > 1)
    .sort((a, b) => compareCodePoints(a.alias, b.alias));
};

export function validateContent(content = loadContent()) {
  let parsed;
  try {
    parsed = authoredContentSchema.safeParse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      errors: [`content: schema validation failed: ${message}`],
      ambiguousAliases: [],
    };
  }
  if (!parsed.success) {
    return {
      errors: sortUnique(
        parsed.error.issues.map((issue) => `${formatPath(issue.path)}: ${issue.message}`),
      ),
      ambiguousAliases: [],
    };
  }

  const validated = parsed.data;
  const errors = [];
  const categoryIds = new Set(validated.categories.map(({ id }) => id));
  const sourceIds = new Set(validated.sources.map(({ id }) => id));
  const substanceIds = new Set(validated.substances.map(({ id }) => id));
  const ids = new Map();

  walk(validated, [], (value, pathParts) => {
    if (typeof value.id === 'string') {
      const previousPath = ids.get(value.id);
      if (previousPath !== undefined) {
        errors.push(
          `${formatPath([...pathParts, 'id'])}: duplicate ID ${value.id} (first at ${previousPath})`,
        );
      } else {
        ids.set(value.id, formatPath([...pathParts, 'id']));
      }
    }

    if (Array.isArray(value.categoryIds)) {
      value.categoryIds.forEach((categoryId, index) => {
        if (!categoryIds.has(categoryId)) {
          errors.push(
            `${formatPath([...pathParts, 'categoryIds', index])}: broken category ${categoryId}`,
          );
        }
      });
    }

    if (typeof value.substanceId === 'string' && !substanceIds.has(value.substanceId)) {
      errors.push(
        `${formatPath([...pathParts, 'substanceId'])}: broken substance ${value.substanceId}`,
      );
    }

    if (typeof value.sourceId === 'string' && !sourceIds.has(value.sourceId)) {
      errors.push(`${formatPath([...pathParts, 'sourceId'])}: broken source ${value.sourceId}`);
    }
  });

  validated.substances.forEach((substance, substanceIndex) => {
    const substancePath = ['substances', substanceIndex];
    const seenCategoryIds = new Set();
    substance.categoryIds.forEach((categoryId, categoryIndex) => {
      if (seenCategoryIds.has(categoryId)) {
        errors.push(
          `${formatPath([...substancePath, 'categoryIds', categoryIndex])}: duplicate category ${categoryId}`,
        );
      }
      seenCategoryIds.add(categoryId);
    });

    for (const [relationshipIndex, relationship] of (substance.relationships ?? []).entries()) {
      if (relationship.substanceId === substance.id) {
        errors.push(
          `${formatPath([...substancePath, 'relationships', relationshipIndex, 'substanceId'])}: self relationship ${substance.id}`,
        );
      }
    }

    const bibliographySourceIds = new Set(
      substance.sourceReferences.map(({ sourceId }) => sourceId),
    );
    for (const [key, child] of Object.entries(substance)) {
      if (key === 'sourceReferences') continue;
      walk(child, [...substancePath, key], (value, pathParts) => {
        if (typeof value.sourceId === 'string' && !bibliographySourceIds.has(value.sourceId)) {
          errors.push(
            `${formatPath([...pathParts, 'sourceId'])}: source ${value.sourceId} is missing from ${substance.id} bibliography`,
          );
        }
      });
    }
  });

  return {
    errors: sortUnique(errors),
    ambiguousAliases: buildAmbiguousAliases(validated.substances),
    content: validated,
  };
}

export function buildSearchIndex(substances) {
  return substances
    .flatMap((s) => [
      {
        substanceId: s.id,
        term: normalize(s.name),
        compact: compact(s.name),
        kind: 'name',
        weight: 100,
      },
      ...(s.aliases ?? []).map((a) => ({
        substanceId: s.id,
        term: normalize(a.text),
        compact: compact(a.text),
        kind: 'alias',
        weight: 80,
      })),
      ...(s.searchTerms ?? []).map((term) => ({
        substanceId: s.id,
        term: normalize(term),
        compact: compact(term),
        kind: 'curated',
        weight: 60,
      })),
    ])
    .sort(
      (a, b) =>
        compareCodePoints(a.term, b.term) ||
        compareCodePoints(a.substanceId, b.substanceId) ||
        b.weight - a.weight ||
        compareCodePoints(a.kind, b.kind) ||
        compareCodePoints(a.compact, b.compact),
    );
}

export function buildContentBundle(content) {
  const validation = validateContent(content);
  if (validation.errors.length > 0 || validation.content === undefined) {
    throw new Error(validation.errors.join('\n'));
  }
  return {
    schemaVersion: CONTENT_SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    ...validation.content,
    searchIndex: buildSearchIndex(validation.content.substances),
    ambiguousAliases: validation.ambiguousAliases,
  };
}

export const serializeContentBundle = (bundle) => `${JSON.stringify(bundle, null, 2)}\n`;

export function search(index, substances, query) {
  const q = normalize(query),
    qc = compact(query);
  if (!q) return [];
  const scores = new Map();
  for (const item of index) {
    let score = 0;
    if (item.term === q || item.compact === qc) score = item.weight + 100;
    else if (item.term.startsWith(q) || item.compact.startsWith(qc))
      score = item.weight + 60 - q.length;
    else {
      const d = distance(qc, item.compact);
      const bound = qc.length >= 5 ? 2 : 1;
      if (d <= bound) score = item.weight + 30 - d * 10;
    }
    if (score > 0) scores.set(item.substanceId, Math.max(scores.get(item.substanceId) ?? 0, score));
  }
  return [...scores]
    .map(([id, score]) => ({ substance: substances.find((s) => s.id === id), score }))
    .filter((x) => x.substance)
    .sort((a, b) => b.score - a.score || compareCodePoints(a.substance.name, b.substance.name));
}
