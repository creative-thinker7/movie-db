import type { Config } from "jest";

import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",

  moduleNameMapper: {
    "^@/components$": "<rootDir>/app/_components",
    "^@/types$": "<rootDir>/app/_types",
    "^@/libs/(.*)$": "<rootDir>/app/_libs/$1",
    "^@/libs$": "<rootDir>/app/_libs",
    "^@/api$": "<rootDir>/app/_api",
    "^@/(.*)$": "<rootDir>/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  testEnvironment: "jsdom",
};

export default createJestConfig(config);
