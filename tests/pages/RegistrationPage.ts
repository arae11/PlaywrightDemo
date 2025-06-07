import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ChooseRailcardPage } from "./ChooseRailcardPage";
import { idpLocators } from "../resources/locators";
import { verificationLocators } from "../resources/locators";

export class RegistrationPage extends BasePage {
  chooseRailcard: ChooseRailcardPage;

  constructor(page: Page) {
    super(page);
    this.chooseRailcard = new ChooseRailcardPage(page);
  }

  async navigateToRegistration() {
    await this.page.goto("/purchase");
    await this.handleCookiePopup();
    await this.chooseRailcard.navigateToAccount();
    await this.verifyRegistrationPage();
  }

  async registerNewUser(
    title: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    await this.page.selectOption(idpLocators.registerTitleDropdown, title);
    await this.page.fill(idpLocators.registerFirstNameField, firstName);
    await this.page.fill(idpLocators.registerLastNameField, lastName);
    await this.page.fill(idpLocators.registerEmailField, email);
    await this.page.fill(idpLocators.registerPasswordField, password);
    await this.page.click(idpLocators.registerRegisterButton);
    await this.page.waitForSelector(
      verificationLocators.verificationPageHeader
    );
  }

  async verifyRegistrationPage() {
    //await this.page.waitForSelector(idpLocators.registerPageHeader);
    await expect(this.page.locator(idpLocators.registerPageHeader)).toHaveText(
      "Register for an online account"
    );
  }

  async clickRegister() {
    await this.page.click(idpLocators.loginRegisterButton);
  }

  async verifyMidflowRegistrationPage() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(idpLocators.midflowRegisterPageHeader);
    await expect(this.page.locator("h1")).toHaveText("Login");
  }

  async enterEmailAddress(email: string) {
    await this.page.fill(idpLocators.registerEmailField, email);
  }

  async enterPassword(password: string) {
    await this.page.fill(idpLocators.registerPasswordField, password);
  }

  async clickMidflowRegisterButton() {
    console.log(
      "📧 Registering with email:",
      await this.page.inputValue("#Email")
    );
    await this.page.click(idpLocators.midflowRegisterButton, {
      force: true,
      delay: 100,
    });
  }

  async midflowAccountRegistration(email: string, password: string) {
    await this.verifyMidflowRegistrationPage();
    await this.clickRegister();
    await this.enterEmailAddress(email);
    await this.enterPassword(password);
    await this.clickMidflowRegisterButton();
  }
}
