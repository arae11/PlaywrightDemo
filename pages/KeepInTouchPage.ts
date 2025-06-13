import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class KeepInTouchPage extends BasePage {
  readonly pageHeader: Locator;
  readonly communicationsCheckbox: Locator;
  readonly offersCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('xpath=//h2[.="Keeping in touch with special offers"]');
    this.communicationsCheckbox = page.locator("#privacy-0");
    this.offersCheckbox = page.locator("#privacy-1");
  }

  async verifyKeepInTouchPage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toContainText("Let’s keep in touch");
  }

  async skipKeepInTouchPage() {
    await this.verifyKeepInTouchPage();
    await this.clickContinue();
  }
}
