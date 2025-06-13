import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SelectEligibilityPage extends BasePage {
  // Declare locators
  readonly checkPageHeader: Locator;
  readonly selectPassport: Locator;
  readonly selectLicence: Locator;
  readonly selectNIC: Locator;
  readonly enterDocumentNumber: Locator;
  readonly licenceValidationPageHeader: Locator;
  readonly nicValidationPageHeader: Locator;
  readonly passportValidationPageHeader: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.checkPageHeader = page.locator('h1:has-text("Select an eligibility check method")');
    this.selectPassport = page.locator('//label[@for="method-option-0"]');
    this.selectLicence = page.locator('//label[@for="method-option-1"]');
    this.selectNIC = page.locator('//label[@for="method-option-2"]');
    this.enterDocumentNumber = page.locator('#seg1');

    this.licenceValidationPageHeader = page.locator('h1:has-text("Driving licence validation")');
    this.nicValidationPageHeader = page.locator('h1:has-text("Identity card validation")');
    this.passportValidationPageHeader = page.locator('h1:has-text("Passport validation")');
  }

  async verifyEligibilityCheckPage() {
    await expect(this.checkPageHeader).toContainText("Select an eligibility check method");
  }

  async selectPassportMethod() {
    await this.selectPassport.click();
  }

  async selectDrivingLicenceMethod() {
    await this.selectLicence.click();
  }

  async selectNICMethod() {
    await this.selectNIC.click();
  }

  async selectEligibilityCheck(EligibilityMethod: string) {
    await this.verifyEligibilityCheckPage();
    if (EligibilityMethod === "PASSPORT") {
      await this.selectPassportMethod();
    } else if (EligibilityMethod === "DRIVING") {
      await this.selectDrivingLicenceMethod();
    } else if (EligibilityMethod === "NIC") {
      await this.selectNICMethod();
    } else {
      throw new Error(
        `Unsupported eligibility method: ${EligibilityMethod}, please use 'PASSPORT', 'DRIVING' or 'NIC'`
      );
    }
    await this.clickContinue();
  }

  async verifyEligibilityValidationPagePassport() {
    await expect(this.passportValidationPageHeader).toContainText("Passport validation");
  }

  async verifyEligibilityValidationPageLicence() {
    await expect(this.licenceValidationPageHeader).toContainText("Driving licence validation");
  }

  async verifyEligibilityValidationPageNIC() {
    await expect(this.nicValidationPageHeader).toContainText("Identity card validation");
  }

  async enterPassportNumber(passportNumber: string) {
    await this.enterDocumentNumber.waitFor({ state: "visible" });
    await this.enterDocumentNumber.fill(passportNumber);
  }

  async enterDrivingLicenceNumber(drivingLicenceNumber: string) {
    await this.enterDocumentNumber.waitFor({ state: "visible" });
    await this.enterDocumentNumber.fill(drivingLicenceNumber);
  }

  async enterNICNumber(nicNumber: string) {
    await this.enterDocumentNumber.waitFor({ state: "visible" });
    await this.enterDocumentNumber.fill(nicNumber);
  }

  async enterEligibilityNumber(
    eligibilityMethod: string,
    passportNumber?: string,
    drivingLicenceNumber?: string,
    nicNumber?: string
  ) {
    switch (eligibilityMethod.toUpperCase()) {
      case "PASSPORT":
        if (!passportNumber)
          throw new Error("Passport number is empty in test data");
        await this.enterPassportNumber(passportNumber);
        break;
      case "DRIVING":
        if (!drivingLicenceNumber)
          throw new Error("Driving licence number is empty in test data");
        await this.enterDrivingLicenceNumber(drivingLicenceNumber);
        break;
      case "NIC":
        if (!nicNumber) throw new Error("NIC number is empty in test data");
        await this.enterNICNumber(nicNumber);
        break;
      default:
        throw new Error(`Unsupported eligibility method: ${eligibilityMethod}`);
    }

    await this.clickContinue();
  }
}
