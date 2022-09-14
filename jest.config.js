module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom', // overridden based on the type of package we build - `jsdom` or `node`
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverage: true,
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  projects: ['<rootDir>'],
  coverageDirectory: '<rootDir>/coverage/',
  verbose: true,
  moduleNameMapper: {
    '.+\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '.+\\.(svg|ico|png|webp|gif|jpe?g)$': '<rootDir>/__mocks__/fileMock.js',
    '@client/(.*)': '<rootDir>/src/$1',
    '@static/(.*)': '<rootDir>/src/static/$1',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@pages/(.*)': '<rootDir>/src/pages/$1',
    '@services/(.*)': '<rootDir>/src/services/$1',
  },
  coverageThreshold: {
    '*/**': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ['text', 'json', 'lcov', 'html'],
  // This config is set for the global execution
  // Package specific alteration is done on the inherited config
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!node_modules/'],
  coverageProvider: 'v8',
  resetMocks: true,
};
