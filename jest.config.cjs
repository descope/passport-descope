module.exports = {
  clearMocks: true,

  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],

  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'lib'],

  testTimeout: 2000,

  roots: ['src'],

  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
};
