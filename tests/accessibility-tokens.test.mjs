import assert from 'node:assert/strict';
import test from 'node:test';
import { colors } from '../src/design/tokens.ts';
const luminance = (hex) => {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((part) => parseInt(part, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
test('normal text including global emergency action meets 4.5:1 contrast', () => {
  for (const [foreground, background] of [
    [colors.text, colors.emergencySurface],
    [colors.text, colors.surfaceRaised],
    [colors.muted, colors.background],
    [colors.important, colors.surface],
    [colors.critical, colors.surface],
  ]) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `${foreground} on ${background}`);
  }
});
