import XLSX from "xlsx";
import path from "path";
import fs from "fs";

/**
 * Interface defining the shape of test data from Excel
 * Customize this to match your actual Excel columns
 */
export interface TestDataRow {
  TestCaseID: string;
  Railcard: string;
  Fulfilment: string;
  Duration: string;
  SKU: string;
  Promocode: string;
  PurchaseType: string;
  Title: string;
  FirstName: string;
  LastName: string;
  BOBTitle?: string;
  BOBFirstName?: string;
  BOBLastName?: string;
  BOBEmail?: string;
  DOBDay: string;
  DOBMonth: string;
  DOBYear: string;
  BrailleSticker: string;
  EligibilityMethod?: string;
  NIC?: string;
  Passport?: string;
  DrivingLicence?: string;
  DeliveryType?: string;
  EvidenceDocument?: string;
  PhotoFile: string;
  LoginEmail: string;
  LoginPassword: string;
  BillingAddressLine1?: string;
  BillingAddressLine2?: string;
  BillingAddressLine3?: string;
  BillingAddressTownCity?: string;
  BillingAddressPostcode?: string;
  CreditCardNumber?: string;
  CardExpiry?: string;
  CardCVC?: string;
  CardHolder?: string;
  CountryPrefix?: string;
  PhoneNumber: string;
  CountryID?: string;
  SameAsBillingAddress?: boolean;
  DeliveryAddressLine1?: string;
  DeliveryAddressLine2?: string;
  DeliveryAddressLine3?: string;
  DeliveryAddressTownCity?: string;
  DeliveryAddressPostcode?: string;
  SecondaryHolder?: string;
  TitlePrimary: string;
  FirstNamePrimary: string;
  LastNamePrimary: string;
  TitleSecondary: string;
  FirstNameSecondary: string;
  LastNameSecondary: string;
  PhotoPrimary: string;
  PhotoSecondary: string;
  DisabilityType: string;

  Password?: string;
  ExpectedResult: "success" | "failure";
  [key: string]: any; // For dynamic properties
}

/**
 * Reads data from an Excel file
 * @param filePath Relative or absolute path to Excel file
 * @param sheetName Optional sheet name (defaults to first sheet)
 * @returns Array of test data rows
 * @throws Error if file not found or invalid
 */
export function readExcelData(
  filePath: string,
  sheetName?: string
): TestDataRow[] {
  try {
    // 1. Resolve to absolute path
    const absolutePath = resolveExcelPath(filePath);

    // 2. Read and parse the file
    const workbook = XLSX.readFile(absolutePath);
    const worksheet = sheetName
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]];

    // 3. Convert to JSON with type safety
    return XLSX.utils.sheet_to_json<TestDataRow>(worksheet);
  } catch (error) {
    if (isErrorWithMessage(error)) {
      throw new Error(`Failed to read Excel file: ${error.message}`);
    }
    throw new Error("Failed to read Excel file: Unknown error");
  }
}

/**
 * Helper function to resolve Excel file path with validation
 */
function resolveExcelPath(filePath: string): string {
  // Handle absolute paths
  if (path.isAbsolute(filePath)) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Absolute path not found: ${filePath}`);
    }
    return filePath;
  }

  // Try resolving from project root (process.cwd())
  const fromRoot = path.resolve(process.cwd(), filePath);
  if (fs.existsSync(fromRoot)) return fromRoot;

  // Try resolving from current file location (__dirname)
  const fromModule = path.resolve(__dirname, filePath);
  if (fs.existsSync(fromModule)) return fromModule;

  // Final fallback attempt
  const fallbackPath = path.resolve(
    process.cwd(),
    "resources",
    path.basename(filePath)
  );
  if (fs.existsSync(fallbackPath)) return fallbackPath;

  throw new Error(
    `Excel file not found at any of these locations:\n` +
      `- ${filePath}\n` +
      `- ${fromRoot}\n` +
      `- ${fromModule}\n` +
      `- ${fallbackPath}\n` +
      `Current working directory: ${process.cwd()}`
  );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error;
}

// Add a type guard for registration data
export function isRegistrationData(
  data: TestDataRow
): data is TestDataRow &
  Required<
    Pick<TestDataRow, "Title" | "FirstName" | "LastName" | "RailcardType">
  > {
  return (
    !!data.Title && !!data.FirstName && !!data.LastName && !!data.RailcardType
  );
}
