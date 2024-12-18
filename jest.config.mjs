export default {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['**/__tests__/unit/**/*.test.js'],
      setupFilesAfterEnv: ['./jest.setup.js'], 
    },
    {
      displayName: 'functional',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/functional/**/*.test.mjs'], 
      transform: {
        '^.+\\.mjs$': 'babel-jest', 
      },
    },
  ],
};
