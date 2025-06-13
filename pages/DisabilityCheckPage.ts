import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import path from "path";

// Create a centralised DisabilityLocators class to store all selectors as Locators
export class DisabilityLocators {
  readonly page: Page;

  // Disability eligibility selectors
  readonly methodDLA: Locator;
  readonly methodPIP: Locator;
  readonly methodVisualImpairment: Locator;
  readonly methodDeafHeadingAid: Locator;
  readonly methodEpilepsy: Locator;
  readonly methodPADP: Locator;
  readonly methodSevereDisablementAllowance: Locator;
  readonly methodMobilitySupplement: Locator;
  readonly methodServiceDisablementPension: Locator;
  readonly methodMotabilityScheme: Locator;

  // Disability upload selectors
  readonly evidenceDLA: Locator;
  readonly evidenceAwardLetter: Locator;
  readonly evidenceVisualImpairment: Locator;
  readonly evidenceServiceStamp: Locator;
  readonly evidenceNHSBook: Locator;
  readonly evidenceEpilepsyPrescription: Locator;
  readonly evidenceEpilepsyDVLA: Locator;
  readonly evidenceHPAgreement: Locator;
  readonly evidenceApprovalLetter: Locator;
  readonly evidenceAwardLetterPIP: Locator;
  readonly evidenceAwardLetterAA: Locator;
  readonly evidenceAwardLetterSDA: Locator;
  readonly evidenceAwardLetterMobilitySupplement: Locator;
  readonly evidenceWarService: Locator;
  readonly evidenceChooseFile: Locator;
  readonly evidenceUpload: Locator;
  readonly evidenceDelete: Locator;

  constructor(page: Page) {
    this.page = page;

    // Eligibility
    this.methodDLA = page.locator('//label[@for="DR001"]');
    this.methodPIP = page.locator('//label[@for="DR002"]');
    this.methodVisualImpairment = page.locator('//label[@for="DR003"]');
    this.methodDeafHeadingAid = page.locator('//label[@for="DR004"]');
    this.methodEpilepsy = page.locator('//label[@for="DR005"]');
    this.methodPADP = page.locator('//label[@for="DR006"]');
    this.methodSevereDisablementAllowance = page.locator('//label[@for="DR007"]');
    this.methodMobilitySupplement = page.locator('//label[@for="DR008"]');
    this.methodServiceDisablementPension = page.locator('//label[@for="DR009"]');
    this.methodMotabilityScheme = page.locator('//label[@for="DR010"]');

    // Upload
    this.evidenceDLA = page.locator('//label[@for="DT001"]');
    this.evidenceAwardLetter = page.locator('//label[@for="DT002"]');
    this.evidenceVisualImpairment = page.locator('//label[@for="DT003"]');
    this.evidenceServiceStamp = page.locator('//label[@for="DT004"]');
    this.evidenceNHSBook = page.locator('//label[@for="DT005"]');
    this.evidenceEpilepsyPrescription = page.locator('//label[@for="DT006"]');
    this.evidenceEpilepsyDVLA = page.locator('//label[@for="DT007"]');
    this.evidenceHPAgreement = page.locator('//label[@for="DT008"]');
    this.evidenceApprovalLetter = page.locator('//label[@for="DT009"]');
    this.evidenceAwardLetterPIP = page.locator('//label[@for="DT010"]');
    this.evidenceAwardLetterAA = page.locator('//label[@for="DT011"]');
    this.evidenceAwardLetterSDA = page.locator('//label[@for="DT012"]');
    this.evidenceAwardLetterMobilitySupplement = page.locator('//label[@for="DT013"]');
    this.evidenceWarService = page.locator('//label[@for="DT014"]');
    this.evidenceChooseFile = page.locator('#files');
    this.evidenceUpload = page.locator('button[aria-label="Upload"]');
    this.evidenceDelete = page.locator('a[aria-label="Delete"]');
  }
}

export class DisabilityCheckPage extends BasePage {
  readonly locators: DisabilityLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new DisabilityLocators(page);
  }

  async verifySelectDisabilityPage() {
    await expect(this.page.locator("h1")).toContainText("Your disability");
  }

  async verifyDisabilityEvidencePage() {
    const header = await this.page.locator("h1").textContent();
    const text = header?.trim() ?? "";
    expect(text).toMatch(/Upload proof of disability documentation|Select one option below and upload proof of disability documentation/);
  }

  async clickUpload() {
    await this.locators.evidenceUpload.click();
  }

  async waitForDeleteButton() {
    await this.locators.evidenceDelete.waitFor({ state: "visible" });
  }

  // Maps
  private readonly disabilityMap = {
    "DLA": this.locators.methodDLA,
    "PIP": this.locators.methodPIP,
    "VISUAL IMPAIRMENT": this.locators.methodVisualImpairment,
    "DEAF OR HEARING AID": this.locators.methodDeafHeadingAid,
    "EPILEPSY": this.locators.methodEpilepsy,
    "AA": this.locators.methodPADP,
    "SDA": this.locators.methodSevereDisablementAllowance,
    "MOBILITY SUPPLEMENT": this.locators.methodMobilitySupplement,
    "DISABLEMENT PENSION": this.locators.methodServiceDisablementPension,
    "MOTABILITY SCHEME": this.locators.methodMotabilityScheme
  };

  private readonly evidenceMap = {
    "DLA": [this.locators.evidenceDLA, this.locators.evidenceApprovalLetter],
    "PIP": [this.locators.evidenceAwardLetterPIP, this.locators.evidenceApprovalLetter],
    "VISUAL IMPAIRMENT": [
      this.locators.evidenceVisualImpairment,
      this.locators.evidenceServiceStamp,
      this.locators.evidenceApprovalLetter
    ],
    "DEAF OR HEARING AID": [
      this.locators.evidenceServiceStamp,
      this.locators.evidenceNHSBook,
      this.locators.evidenceApprovalLetter
    ],
    "EPILEPSY": [
      this.locators.evidenceEpilepsyPrescription,
      this.locators.evidenceEpilepsyDVLA,
      this.locators.evidenceApprovalLetter
    ],
    "AA": [this.locators.evidenceAwardLetterAA, this.locators.evidenceApprovalLetter],
    "SDA": [this.locators.evidenceAwardLetterSDA, this.locators.evidenceApprovalLetter],
    "MOBILITY SUPPLEMENT": [
      this.locators.evidenceAwardLetterMobilitySupplement,
      this.locators.evidenceApprovalLetter
    ],
    "DISABLEMENT PENSION": [this.locators.evidenceWarService, this.locators.evidenceApprovalLetter],
    "MOTABILITY SCHEME": [this.locators.evidenceHPAgreement, this.locators.evidenceApprovalLetter]
  };

  private readonly disabilityAliasMap = {
    "MOTABILITY": "MOTABILITY SCHEME",
    "VISUAL": "VISUAL IMPAIRMENT",
    "DEAF OR HEARING": "DEAF OR HEARING AID",
    "MOBILITY": "MOBILITY SUPPLEMENT",
    "DISABLEMENT": "DISABLEMENT PENSION"
  };

  private normalizeDisabilityName(rawDisability: string): string {
    const parts = rawDisability.trim().toUpperCase().split(/\s+/);
    const baseDisability = parts.slice(0, -1).join(" ") || parts[0];
    return this.disabilityAliasMap[baseDisability] || baseDisability;
  }

  async selectDisabilityAndEvidence(disabilityType: string, documentFileName: string) {
    const parts = disabilityType.trim().toUpperCase().split(/\s+/);
    const index = isNaN(Number(parts[parts.length - 1])) ? 0 : Number(parts[parts.length - 1]) - 1;
    const normalizedDisability = this.normalizeDisabilityName(disabilityType);

    const disabilityLocator = this.disabilityMap[normalizedDisability];
    if (!disabilityLocator) {
      throw new Error(`No disability method for "${normalizedDisability}"`);
    }
    await disabilityLocator.click();
    await this.clickContinue();

    const evidenceLocators = this.evidenceMap[normalizedDisability];
    if (!evidenceLocators || !evidenceLocators[index]) {
      throw new Error(`No evidence method for "${normalizedDisability}" index ${index + 1}`);
    }

    await evidenceLocators[index].click();
    await this.provideEvidence(documentFileName);
  }

  async provideEvidence(documentFileName: string) {
    await this.verifyDisabilityEvidencePage();
    await this.uploadEligibilityDocument(documentFileName);
    await this.clickUpload();
    await this.waitForDeleteButton();
    await this.clickContinue();
  }

  async uploadEligibilityDocument(documentFileName: string) {
    const filePath = path.join(__dirname, "../resources/UploadFiles", documentFileName);
    await this.locators.evidenceChooseFile.setInputFiles(filePath);
  }
}
