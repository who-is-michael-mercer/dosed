import data from '../../../generated/sources.json';
import { sourceSchema, type SourceId } from '../../domain/content';

const sources = data.map((source) => sourceSchema.parse(source));
export const sourceRepository = {
  getSource: (id: SourceId) => sources.find((source) => source.id === id),
};
