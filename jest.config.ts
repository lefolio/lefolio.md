import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/lib/**/*.test.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lefolio-active-template$': '<rootDir>/src/lib/templates/no-external.ts',
  },
};

export default createJestConfig(config);
