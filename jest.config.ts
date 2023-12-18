/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  // moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    // "/node_modules/(?!(ky))": "babel-jest",
  },
  testEnvironment: "jsdom",
  // transformIgnorePatterns: ["/node_modules/(?!(ky))"],
};

export default createJestConfig(config);
