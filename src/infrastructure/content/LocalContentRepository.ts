import generated from '../../../generated/content.json';
import {
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

export class LocalContentRepository implements ContentRepository {
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
