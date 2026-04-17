/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');
const { resolve } = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^@tasksphere/db$': resolve(__dirname, '../../packages/db/src/index.ts'),
    '^@tasksphere/db/(.*)$': resolve(__dirname, '../../packages/db/src/$1'),
  },
  modulePaths: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '/custom-test-env.js'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.js'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
