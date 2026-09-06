import eslint from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import hooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', 'generated/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        structuredClone: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { boundaries, 'react-hooks': hooks },
    settings: {
      'boundaries/elements': [
        { type: 'presentation', pattern: ['app/**', 'src/components/**', 'src/features/**'] },
        { type: 'application', pattern: 'src/application/**' },
        { type: 'domain', pattern: 'src/domain/**' },
        { type: 'infrastructure', pattern: 'src/infrastructure/**' },
      ],
    },
    rules: {
      ...hooks.configs.recommended.rules,
      'boundaries/element-types': [
        2,
        {
          default: 'allow',
          rules: [
            { from: 'domain', disallow: ['presentation', 'application', 'infrastructure'] },
            { from: 'application', disallow: ['presentation', 'infrastructure'] },
            { from: 'infrastructure', disallow: ['presentation'] },
          ],
        },
      ],
    },
  },
];
