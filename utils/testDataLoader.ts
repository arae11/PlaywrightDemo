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
