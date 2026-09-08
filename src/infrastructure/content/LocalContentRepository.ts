import generated from '../../../generated/content.json';
import {
  categorySchema,
  subgroupSchema,
  tagSchema,
  sourceSchema,
  substanceSchema,
  type ContentRepository,
  type Source,
  type SourceId,
  type Substance,
  type SubstanceId,
} from '../../domain/content';

const substances = generated.substances.map((value) => substanceSchema.parse(value));
const sources = generated.sources.map((value) => sourceSchema.parse(value));
const categories = generated.categories
  .map((value) => categorySchema.parse(value))
  .sort((a, b) => a.order - b.order);

export class LocalContentRepository implements ContentRepository {
  listSubgroups() {
    return generated.subgroups
      .map((value) => subgroupSchema.parse(value))
      .sort((a, b) => a.order - b.order);
  }
  listTags() {
    return generated.tags.map((value) => tagSchema.parse(value)).sort((a, b) => a.order - b.order);
  }
  listCategories() {
    return categories;
  }
  listSubstances(): readonly Substance[] {
    return substances;
  }

  getSubstance(id: SubstanceId): Substance | undefined {
    return substances.find((item) => item.id === id);
  }

  listSources(): readonly Source[] {
    return sources;
  }

  getSource(id: SourceId): Source | undefined {
    return sources.find((item) => item.id === id);
  }
}

export const contentRepository = new LocalContentRepository();
