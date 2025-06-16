/**
 * getTestData - Utility function to load test data from an Excel file.
 * 
 * - Reads configuration from a shared testConfig resource (Excel file name and default sheet).
 * - Resolves the Excel file path relative to the project structure.
 * - Validates that the Excel file exists before reading.
 * - Uses a reusable Excel reading helper (readExcelData) to parse data from the specified sheet.
 * - Returns the parsed test data for use in tests.
 * 
 * @param sheetName Optional name of the Excel sheet to read; falls back to default if not provided.
 * @throws Throws an error if the Excel file cannot be found.
 */

import path from "path";
import fs from "fs";
import { readExcelData } from "../utils/excelReader";
import { testConfig } from "../resources/testConfig";

export function getTestData(sheetName?: string): any {
  const excelPath = path.join(
    __dirname,
    "../data",
    testConfig.excelFileName
  );
  const sheetToRead = sheetName || testConfig.defaultSheet;

  if (!fs.existsSync(excelPath)) {
    console.error(`Excel file not found at: ${excelPath}`);
    throw new Error("Test data file missing");
  }

  return readExcelData(excelPath, sheetToRead);
}
