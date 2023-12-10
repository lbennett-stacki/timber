import { JestConfigWithTsJest, pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: JestConfigWithTsJest = {
  transform: {
    "\\.ts?$": "ts-jest",
  },
  testRegex: ".*\\.spec\\.ts?$",
  collectCoverageFrom: ["./src/**/*.{js,ts}"],
  coveragePathIgnorePatterns: ["node_modules\\/", "\\/__snapshots__\\/"],
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths /*, { prefix: '<rootDir>/' } */,
  ),
};

export default config;
