import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { manageDigitalRailcardLocators } from "../resources/locators";

export class ManageDigitalRailcardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyManageDigitalRailcardPage() {
    await this.page.waitForSelector(manageDigitalRailcardLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText(
      "Manage Digital Railcard"
    );
  }

  async extractRailcardToken() {
    const tokenInput = await this.page.waitForSelector(manageDigitalRailcardLocators.downloadCodeField, {
      timeout: 80000,
    });
    const token = await tokenInput.getAttribute("value");
    if (!token) {
      throw new Error("❌ Token input appeared but no value was found.");
    }

    console.log(`✅ Railcard Token: ${token}`);
    return token;
  }

  async getToken() {
    await this.verifyManageDigitalRailcardPage();
    await this.extractRailcardToken();
  }
}
