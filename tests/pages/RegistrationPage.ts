import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ChooseRailcardPage } from "./ChooseRailcardPage";
import { billingDetailsLocators, idpLocators } from "../resources/locators";
import { verificationLocators } from "../resources/locators";

export interface RegistrationInput {
  email: string;
  password: string;
  purchaseType: "BFS" | "BOB";
  title?: string;
  firstName?: string;
  lastName?: string;
}

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

  async verifyRegistrationPage() {
    await expect(this.page.locator(idpLocators.registerPageHeader)).toHaveText(
      "Register for an online account"
    );
  }

  async selectTitle(title: string) {
    await this.page.selectOption(idpLocators.registerTitleDropdown, title);
  }

  async enterFirstName(firstName: string) {
    await this.page.fill(idpLocators.registerFirstNameField, firstName);
  }

  async enterLastName(lastName: string) {
    await this.page.fill(idpLocators.registerLastNameField, lastName);
  }

  async enterEmailAddress(email: string) {
    await this.page.fill(idpLocators.registerEmailField, email);
  }

  async enterPassword(password: string) {
    await this.page.fill(idpLocators.registerPasswordField, password);
  }

  async clickRegister() {
    await this.page.click(idpLocators.loginRegisterButton);
  }

  async verifyMidflowRegistrationPage() {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector(idpLocators.midflowRegisterPageHeader);
    await expect(this.page.locator("h1")).toHaveText("Login");
  }

  async clickMidflowRegisterButton() {
    await this.page.click(idpLocators.midflowRegisterButton, {
      force: true,
      delay: 100,
    });
    await this.page.waitForSelector(billingDetailsLocators.pageHeader, {
      state: "visible",
      timeout: 10000,
    });
  }

  async clickRegisterRegisterButton() {
    await this.page.click(idpLocators.registerRegisterButton);
  }

  async verifyVerificationHeader() {
    await this.page.waitForSelector(
      verificationLocators.verificationPageHeader
    );
  }

  async registerNewUser(input: RegistrationInput) {
    const { email, password, purchaseType, title, firstName, lastName } = input;

    // Common fields for both BFS and BOB
    await this.enterEmailAddress(email);
    await this.enterPassword(password);

    // BOB-specific fields
    if (purchaseType === "BOB") {
      if (!title || !firstName || !lastName) {
        throw new Error(
          "BOB registration requires title, firstName, and lastName"
        );
      }

      await this.selectTitle(title);
      await this.enterFirstName(firstName);
      await this.enterLastName(lastName);
    }

    await this.clickRegisterRegisterButton();
    //await this.verifyVerificationHeader();
  }

  async midflowAccountRegistration(
    data: RegistrationInput,
    emailResult: { loginEmail: string }
  ) {
    await this.verifyMidflowRegistrationPage();
    await this.clickRegister();

    const registrationData =
      data.purchaseType === "BFS"
        ? {
            email: emailResult.loginEmail,
            password: data.password,
            purchaseType: data.purchaseType,
          }
        : {
            email: emailResult.loginEmail,
            password: data.password,
            purchaseType: data.purchaseType,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
          };

    await this.registerNewUser(registrationData);
    //await this.clickMidflowRegisterButton();
  }
}
export default RegistrationPage;
