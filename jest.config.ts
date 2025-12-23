import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',

  moduleFileExtensions: ['ts', 'js', 'json'],

  testMatch: ['**/*.spec.ts'],

  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.{ts,js}',
    '!src/**/*.test.{ts,js}',
    '!src/**/index.{ts,js}',
  ],

  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
