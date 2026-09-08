import type { EffectGroup, Effects } from '../../domain/content';

const effectSectionDefinitions = [
  { key: 'common', title: 'Expected effects' },
  { key: 'unwanted', title: 'Unwanted effects' },
  { key: 'variability', title: 'What can change the experience' },
] as const;

export type ProfileEffectSection = EffectGroup & {
  title: string;
};

export const getProfileEffectSections = (effects: Effects): readonly ProfileEffectSection[] =>
  effectSectionDefinitions.flatMap(({ key, title }) => {
    const group = effects[key];
    return group ? [{ ...group, title }] : [];
  });
