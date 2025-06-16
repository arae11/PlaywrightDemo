import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class KeepInTouchPage extends BasePage {
  readonly pageHeader: Locator;
  readonly pageHeader2: Locator;
  readonly communicationsCheckbox: Locator;
  readonly offersCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    // this.pageHeader = page.locator('xpath=//h1[contains(text(),"Let’s keep in touch")]');
    this.pageHeader = page.locator('h1:has-text("Let’s keep in touch")');
    this.pageHeader2 = page.locator('xpath=//h2[.="Keeping in touch with special offers"]');
    this.communicationsCheckbox = page.locator("#privacy-0");
    this.offersCheckbox = page.locator("#privacy-1");
  }

  async verifyKeepInTouchPage() {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.pageHeader).toContainText("Let’s keep in touch");
  }

  async skipKeepInTouchPage() {
    await this.verifyKeepInTouchPage();
    await this.clickContinue();
  }
}
