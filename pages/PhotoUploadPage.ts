import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import path from "path";

export class PhotoUploadPage extends BasePage {
  readonly pageHeaderSingle: Locator;
  readonly pageHeaderDual: Locator;
  readonly chooseFile: Locator;
  readonly chooseFileSingle: Locator;
  readonly chooseFileDualA: Locator;
  readonly chooseFileDualB: Locator;
  readonly fileInput: Locator;
  readonly saveButton: Locator;
  readonly clearButton: Locator;
  readonly deleteButton: Locator;

  private readonly uploadFolder: string;

  constructor(page: Page) {
    super(page);
    this.pageHeaderSingle = page.locator('xpath=//label[contains(text(),"Photo upload")]');
    this.pageHeaderDual = page.locator('xpath=//h1[contains(text(),": Photo upload")]');
    this.chooseFile = page.locator('#photoUpload');
    this.chooseFileSingle = page.locator('#mainHolder');
    this.chooseFileDualA = page.locator('#dualPhotoUpload');
    this.chooseFileDualB = page.locator('#dualPhotoUpload-secondary');
    this.fileInput = page.locator('xpath=//input[@type="file"]');
    this.saveButton = page.locator('xpath=//button[@aria-label="Save"]');
    this.clearButton = page.locator('button[aria-label="Clear"]');
    this.deleteButton = page.locator('button[aria-label="Delete photos"]');

    this.uploadFolder = path.join(__dirname, "../resources/UploadFiles");
  }

  async verifyPhotoUploadPageSingle() {
    await expect(this.page.locator("h1")).toContainText("Photo upload");
  }

  async verifyPhotoUploadPageDual() {
    await expect(this.pageHeaderDual).toContainText(": Photo upload");
  }

  private async uploadFile(locator: Locator, filePath: string) {
    await locator.setInputFiles(filePath);
    await this.clickSave();
    await this.page.waitForTimeout(1500);
  }

  async uploadPhoto(
    dual: boolean,
    photoFileName?: string,
    photoPrimaryFileName?: string,
    photoSecondaryFileName?: string
  ) {
    if (dual) {
      // Dual card logic
      if (photoPrimaryFileName && !photoSecondaryFileName) {
        const singleHolderPath = path.join(this.uploadFolder, photoPrimaryFileName);
        await this.uploadFile(this.chooseFileSingle, singleHolderPath);
        return;
      }

      if (!photoPrimaryFileName || !photoSecondaryFileName) {
        throw new Error("Both primary and secondary photo filenames are required for dual card uploads.");
      }

      const primaryPath = path.join(this.uploadFolder, photoPrimaryFileName);
      const secondaryPath = path.join(this.uploadFolder, photoSecondaryFileName);

      console.log(`Uploading primary photo: ${photoPrimaryFileName}`);
      await this.uploadFile(this.chooseFileDualA, primaryPath);

      await this.chooseFileDualB.waitFor({ state: "attached", timeout: 5000 });
      if (await this.chooseFileDualB.isDisabled()) {
        throw new Error("Secondary photo input is disabled, cannot upload file");
      }
      await this.uploadFile(this.chooseFileDualB, secondaryPath);
    } else {
      // Single card logic
      if (!photoFileName) {
        throw new Error("photoFileName is required for single uploads.");
      }
      const singlePath = path.join(this.uploadFolder, photoFileName);
      await this.uploadFile(this.chooseFile, singlePath);
    }
  }

  async clickSave() {
    try {
      await this.saveButton.waitFor({ state: "visible", timeout: 3000 });
      if (!(await this.saveButton.isDisabled())) {
        await this.saveButton.click();
      }
    } catch {
      // Button not present or not clickable; silent fail
    }
  }

  async waitForClearButtonVisible(timeout = 10000) {
    await this.clearButton.waitFor({ state: "visible", timeout });
  }

  async waitForDeleteButtonVisible(timeout = 10000) {
    await this.deleteButton.waitFor({ state: "visible", timeout });
  }

  async uploadPhotoFlow({
    dual,
    photoFileName,
    photoPrimaryFileName,
    photoSecondaryFileName,
  }: {
    dual: boolean;
    photoFileName?: string;
    photoPrimaryFileName?: string;
    photoSecondaryFileName?: string;
  }) {
    const isDualWithOneHolder = dual && photoPrimaryFileName && !photoSecondaryFileName;

    if (dual) {
      await this.verifyPhotoUploadPageDual();
      await this.uploadPhoto(true, undefined, photoPrimaryFileName, photoSecondaryFileName);
      if (isDualWithOneHolder) {
        await this.waitForClearButtonVisible();
      } else {
        await this.waitForDeleteButtonVisible();
      }
    } else {
      await this.verifyPhotoUploadPageSingle();
      await this.uploadPhoto(false, photoFileName);
      await this.waitForClearButtonVisible();
    }

    await this.clickContinue();
  }
}
