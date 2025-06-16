/**
 * Centralized Import Aggregator for Test Framework
 * 
 * Purpose:
 *  - Consolidates and re-exports all major utilities, helpers, APIs, and Playwright dependencies.
 *  - Simplifies imports across the test suite by exposing a single import point.
 * 
 * Exports:
 *  - Node.js core modules: `path`, `fs`
 *  - Playwright modules: `expect`, `test`
 *  - Test utilities: 
 *      - `readExcelData` (Excel reader)
 *      - `generateEmailWithEpoch` (Email generator)
 *      - `EmailHelper` (Gmail verification link extraction)
 *      - `SalesforceApiHelper` (Salesforce API utilities)
 *      - `RailcardApiHelper` (Railcard API utilities)
 *      - `OrderProcessingService` (Order management API)
 *      - `PromocodeHelper` (Promo code generation & validation)
 *      - `getTestData` (Test data loader)
 *  - Page Object Model: 
 *      - `Pages` (all page objects grouped)
 *      - `RegistrationInput` (registration data typing)
 * 
 * Benefits:
 *  - Cleaner imports across test files: 
 *      `import { test, expect, Pages, readExcelData } from './helpers/imports';`
 *  - Easier maintenance of shared dependencies.
 */

import path from "path";
import fs from "fs";
import { expect, test } from "@playwright/test";
import { readExcelData } from "./excelReader";
import { generateEmailWithEpoch } from "./emailGenerator";
import { EmailHelper } from "./emailHelper";
import { SalesforceApiHelper } from "./salesforceApiHelper";
import { RailcardApiHelper } from "./railcardApiHelper";
import { OrderProcessingService } from "./orderProcessingService";
import { PromocodeHelper } from "./promocodeHelper";
import { getTestData } from "./testDataLoader";
import { Pages } from "../pages/pages";
import type { RegistrationInput } from "../pages/RegistrationPage";

// Export all of them from this file
export {
  path,
  fs,
  expect,
  test,
  readExcelData,
  generateEmailWithEpoch,
  EmailHelper,
  SalesforceApiHelper,
  RailcardApiHelper,
  OrderProcessingService,
  PromocodeHelper,
  getTestData,
  Pages,
  RegistrationInput,
};
