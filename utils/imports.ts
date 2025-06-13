// imports.ts
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

import { orderSummaryLocators } from "../resources/locators";
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
  orderSummaryLocators,
  Pages,
  RegistrationInput,
};
