module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^expo-modules-core$': require.resolve('expo-modules-core', {
      paths: [require.resolve('expo')],
    }),
    '^expo-modules-core/(.*)$': require
      .resolve('expo-modules-core/package.json', { paths: [require.resolve('expo')] })
      .replace('package.json', '$1'),
  },
  testMatch: ['<rootDir>/tests/components/**/*.test.tsx'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/tests/components/setup.ts'],
};
