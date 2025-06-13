import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { photoUploadLocators } from "../resources/locators";
import path from "path";

export class PhotoUploadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyPhotoUploadPageSingle() {
    await expect(this.page.locator("h1")).toContainText("Photo upload");
  }
  async verifyPhotoUploadPageDual() {
    await expect(
      this.page.locator(photoUploadLocators.pageHeaderDual)
    ).toContainText(": Photo upload");
  }

  async uploadPhoto(
    dual: boolean,
    photoFileName?: string,
    photoPrimaryFileName?: string,
    photoSecondaryFileName?: string
  ) {
    const basePath = path.join(__dirname, "../resources/UploadFiles");

    const waitAfterSave = async () => {
      await this.page.waitForTimeout(1500);
    };

    if (dual) {
      // ✅ Dual card with only one holder
      if (photoPrimaryFileName && !photoSecondaryFileName) {
        const singleHolderPath = path.join(basePath, photoPrimaryFileName);

        await this.page
          .locator(photoUploadLocators.chooseFileSingle)
          .setInputFiles(singleHolderPath);
        await this.clickSave();
        await waitAfterSave();
        return;
      }

      // ✅ Dual card with two holders
      if (!photoPrimaryFileName || !photoSecondaryFileName) {
        throw new Error(
          "Both photoPrimaryFileName and photoSecondaryFileName are required for full dual uploads."
        );
      }

      const primaryPath = path.join(basePath, photoPrimaryFileName);
      const secondaryPath = path.join(basePath, photoSecondaryFileName);

      console.log(`Uploading primary photo: ${photoPrimaryFileName}`);
      await this.page
        .locator(photoUploadLocators.chooseFileDualA)
        .setInputFiles(primaryPath);
      await this.clickSave();
      await waitAfterSave();

      const secondaryInput = this.page.locator(
        photoUploadLocators.chooseFileDualB
      );
      await secondaryInput.waitFor({ state: "attached", timeout: 5000 });

      const isDisabled = await secondaryInput.isDisabled();
      if (isDisabled) {
        throw new Error(
          "Secondary photo input is disabled, cannot upload file"
        );
      }
      await secondaryInput.setInputFiles(secondaryPath);

      await this.clickSave();
      await waitAfterSave();
    } else {
      // ✅ Single card
      if (!photoFileName) {
        throw new Error("photoFileName is required for single uploads.");
      }

      const filePath = path.join(basePath, photoFileName);
      await this.page
        .locator(photoUploadLocators.chooseFile)
        .setInputFiles(filePath);

      await this.clickSave();
      await waitAfterSave();
    }
  }

  async clickSave() {
    const saveBtn = this.page.locator(photoUploadLocators.saveButton);
    try {
      await saveBtn.waitFor({ state: "visible", timeout: 3000 });
    } catch {
      return;
    }

    const disabled = await saveBtn.isDisabled();
    if (!disabled) {
      await saveBtn.click();
    } else {
    }
  }

  async waitForClearButtonVisible(timeout = 10000) {
    await this.page
      .locator(photoUploadLocators.clearButton)
      .waitFor({ state: "visible", timeout });
  }

  async waitForDeleteButtonVisible(timeout = 10000) {
    await this.page
      .locator(photoUploadLocators.deleteButton)
      .waitFor({ state: "visible", timeout });
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
    const isDualWithOneHolder =
      dual && photoPrimaryFileName && !photoSecondaryFileName;

    if (dual) {
      await this.verifyPhotoUploadPageDual(); // Could split this further if UI is different
      await this.uploadPhoto(
        true,
        undefined,
        photoPrimaryFileName,
        photoSecondaryFileName
      );

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
