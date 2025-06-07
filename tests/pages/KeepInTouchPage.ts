import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { keepInTouchLocators } from "../resources/locators";

export class KeepInTouchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyKeepInTouchPage() {
    await this.page.waitForSelector(keepInTouchLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText(
      "Let’s keep in touch"
    );
  }

  async skipKeepInTouchPage() {
    await this.verifyKeepInTouchPage();
    await this.clickContinue();
  }
}
