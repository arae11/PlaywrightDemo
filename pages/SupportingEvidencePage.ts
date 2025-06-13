import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import path from "path";

export class SupportingEvidencePage extends BasePage {
  readonly pageHeader: Locator;
  readonly uploadMatureDocument: Locator;
  readonly uploadButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeader = page.locator('h1:has-text("Provide supporting evidence")');
    this.uploadMatureDocument = page.locator('#files');
    this.uploadButton = page.locator('//button[@aria-label="Upload"]');
    this.deleteButton = page.locator('a[aria-label="Delete"]');
  }

  async verifySupportingEvidencePage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toContainText("Provide supporting evidence");
  }

  async uploadEligibilityDocument(documentFileName: string) {
    const filePath = path.join(__dirname, "../resources/UploadFiles", documentFileName);
    await this.uploadMatureDocument.setInputFiles(filePath);
  }

  async clickUpload() {
    await this.uploadButton.click();
  }

  async waitForDeleteButtonVisible(timeout = 10000) {
    await this.deleteButton.waitFor({ state: "visible", timeout });
  }

  async provideEvidence(documentFileName: string) {
    await this.verifySupportingEvidencePage();
    await this.uploadEligibilityDocument(documentFileName);
    await this.clickUpload();
    await this.waitForDeleteButtonVisible();
    await this.clickContinue();
  }
}
