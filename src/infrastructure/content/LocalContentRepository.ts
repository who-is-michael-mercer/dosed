import generated from '../../../generated/content.json';
import {
  substanceSchema,
  type ContentRepository,
  type StableId,
  type Substance,
} from '../../domain/content';
const substances = generated.substances.map((value) => substanceSchema.parse(value));
export class LocalContentRepository implements ContentRepository {
  listSubstances(): readonly Substance[] {
    return substances;
  }
  getSubstance(id: StableId): Substance | undefined {
    return substances.find((item) => item.id === id);
  }
}
export const contentRepository = new LocalContentRepository();
