import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { photoUploadLocators } from "../resources/locators";
import path from "path";

export class PhotoUploadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyPhotoUploadPageSingle() {
    await expect(
      this.page.locator(photoUploadLocators.pageHeaderSingle)
    ).toContainText("Photo upload");
  }
  async verifyPhotoUploadPageDual() {
    await expect(
      this.page.locator(photoUploadLocators.pageHeaderDual)
    ).toContainText(": Photo upload");
  }

  async uploadPhoto(photoFileName: string, dual: boolean = false) {
    const filePath = path.join(
      __dirname,
      "../resources/UploadFiles",
      photoFileName
    );

    if (dual) {
      await this.page
        .locator(photoUploadLocators.chooseFileDualA)
        .setInputFiles(filePath);
      await this.page
        .locator(photoUploadLocators.chooseFileDualB)
        .setInputFiles(filePath);
    } else {
      await this.page
        .locator(photoUploadLocators.chooseFile)
        .setInputFiles(filePath);
    }
  }

  async clickSave(){
    await this.page.locator(photoUploadLocators.saveButton).click();
  }

  async waitForClearButtonVisible(timeout = 10000) {
    await this.page
      .locator(photoUploadLocators.clearButton)
      .waitFor({ state: "visible", timeout });
  }

  async uploadPhotoSingle(photoFileName: string) {
    await this.verifyPhotoUploadPageSingle();
    await this.uploadPhoto(photoFileName, false);
    await this.clickSave();
    await this.waitForClearButtonVisible();
    await this.clickContinue();
  }

  async uploadPhotoDual(photoFileName: string) {
    await this.verifyPhotoUploadPageSingle();
    await this.uploadPhoto(photoFileName, true);
    await this.clickSave();
    await this.waitForClearButtonVisible();
    await this.clickContinue();
  }
}
