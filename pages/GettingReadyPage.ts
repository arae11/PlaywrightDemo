import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class GettingReadyPage extends BasePage {
  readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeader = page.locator('h1:has-text("Getting ready to apply")');
  }

  async verifyGettingReadyPage() {
    await this.pageHeader.waitFor({ state: "visible" });
    await expect(this.pageHeader).toContainText("Getting ready to apply");
    await this.clickContinue();
  }
}
