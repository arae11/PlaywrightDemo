import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MidflowLoginPage extends BasePage {
  readonly pageHeader: Locator;
  readonly registerLoginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1:has-text(": Login")');
    this.registerLoginButton = page.locator('//button[@aria-label="Register / Login"]');
  }

  async verifyMidflowLoginPage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toContainText(": Login");
  }

  async clickRegisterLoginButton() {
    await this.registerLoginButton.click();
  }

  async midflowRegisterLogin() {
    await this.verifyMidflowLoginPage();
    await this.clickRegisterLoginButton();
  }
}
