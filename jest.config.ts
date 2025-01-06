import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};

export default config;
