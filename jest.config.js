/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"], // Ensures only test files inside __tests__ run
  clearMocks: true,
  verbose: true,
};
