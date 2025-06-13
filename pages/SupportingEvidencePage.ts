import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { supportingEvidenceLocators } from "../resources/locators";
import path from "path";

export class SupportingEvidencePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifySupportingEvidencePage() {
    await this.page.waitForSelector(supportingEvidenceLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText(
      "Provide supporting evidence"
    );
  }

  async uploadEligibilityDocument(documentFileName: string) {
    const filePath = path.join(
      __dirname,
      "../resources/UploadFiles",
      documentFileName
    );

    await this.page
      .locator(supportingEvidenceLocators.uploadMatureDocument)
      .setInputFiles(filePath);
  }

  async clickUpload() {
    await this.page.locator(supportingEvidenceLocators.uploadButton).click();
  }

  async waitForDeleteButtonVisible(timeout = 10000) {
    await this.page
      .locator(supportingEvidenceLocators.deleteButton)
      .waitFor({ state: "visible", timeout });
  }

  async provideEvidence(documentFileName: string) {
    await this.verifySupportingEvidencePage();
    await this.uploadEligibilityDocument(documentFileName);
    await this.clickUpload();
    await this.waitForDeleteButtonVisible();
    await this.clickContinue();
  }
}
