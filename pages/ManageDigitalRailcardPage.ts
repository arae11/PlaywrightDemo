import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ManageDigitalRailcardPage extends BasePage {
  readonly pageHeader: Locator;
  readonly downloadCodeField: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1:has-text("Manage Digital Railcard")');
    this.downloadCodeField = page.locator("#downloadCode");
  }

  async verifyManageDigitalRailcardPage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toContainText("Manage Digital Railcard");
  }

  async extractRailcardToken() {
    await this.downloadCodeField.waitFor({ timeout: 80000 });
    const token = await this.downloadCodeField.getAttribute("value");
    if (!token) {
      throw new Error("❌ Token input appeared but no value was found.");
    }

    console.log(`✅ Railcard Token: ${token}`);
    return token;
  }

  async getToken() {
    await this.verifyManageDigitalRailcardPage();
    return await this.extractRailcardToken();
  }
}
