import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { midflowLoginLocators } from "../resources/locators";

export class MidflowLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyMidflowLoginPage() {
    await this.page.locator(midflowLoginLocators.pageHeader).waitFor();
    await expect(
      this.page.locator(midflowLoginLocators.pageHeader)
    ).toContainText(": Login");
  }

  async clickRegisterLoginButton() {
    await this.page.click(midflowLoginLocators.registerLoginButton);
  }

  async midflowRegisterLogin() {
    await this.verifyMidflowLoginPage();
    await this.clickRegisterLoginButton();
  }
}
