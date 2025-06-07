import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { getReadyLocators } from "../resources/locators";

export class GettingReadyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyGettingReadyPage() {
    await this.page.waitForSelector(getReadyLocators.pageHeader);
    await expect(this.page.locator(getReadyLocators.pageHeader)).toContainText(
      "Getting ready to apply"
    );

    await this.clickContinue();
  }
}
