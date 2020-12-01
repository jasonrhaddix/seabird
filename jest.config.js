module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/.jest/setup.js'],
  setupFilesAfterEnv: ['jest-extended'],
  coverageDirectory: '<rootDir>/.jest/coverage'
}
