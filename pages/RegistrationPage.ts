import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ChooseRailcardPage } from "./ChooseRailcardPage";

// Input interface
export interface RegistrationInput {
  email: string;
  password: string;
  purchaseType: "BFS" | "BOB";
  title?: string;
  firstName?: string;
  lastName?: string;
}

export class RegistrationPage extends BasePage {
  readonly chooseRailcard: ChooseRailcardPage;

  // Registration Page Locators
  readonly registerPageHeader: Locator;
  readonly registerTitleDropdown: Locator;
  readonly registerFirstNameField: Locator;
  readonly registerLastNameField: Locator;
  readonly registerEmailField: Locator;
  readonly registerPasswordField: Locator;
  readonly registerConfirmPasswordField: Locator;
  readonly registerRegisterButton: Locator;

  // Login Page Locators
  readonly loginPageHeader: Locator;
  readonly loginRegisterButton: Locator;

  // Midflow Register Locators
  readonly midflowRegisterPageHeader: Locator;
  readonly midflowRegisterButton: Locator;

  // Verification Locators
  readonly verificationPageHeader: Locator;

  // Billing Details (for midflow reg completion)
  readonly billingDetailsPageHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.chooseRailcard = new ChooseRailcardPage(page);

    // Registration Page Locators
    this.registerPageHeader = page.locator('h2:has-text("Register for an online account")');
    this.registerTitleDropdown = page.locator("#Salutation");
    this.registerFirstNameField = page.locator("#FirstName");
    this.registerLastNameField = page.locator("#LastName");
    this.registerEmailField = page.locator("#Email");
    this.registerPasswordField = page.locator("#password");
    this.registerConfirmPasswordField = page.locator("#ConfirmPassword");
    this.registerRegisterButton = page.locator('xpath=//button[.="Register"]');

    // Login Page Locators
    this.loginPageHeader = page.locator('h1:has-text("Login")');
    this.loginRegisterButton = page.locator('xpath=//a[text()="Register"]');

    // Midflow Register Locators
    this.midflowRegisterPageHeader = page.locator('h2:has-text("Register for an online account")');
    this.midflowRegisterButton = page.locator('button:text-is("Register")');

    // Verification Locators
    this.verificationPageHeader = page.locator('h2:has-text("Verify your email address")');

    // Billing Details Header
    this.billingDetailsPageHeader = page.locator('xpath=//h1[.="My Order: Billing details"]');
  }

  async navigateToRegistration() {
    await this.page.goto("/purchase");
    await this.handleCookiePopup();
    await this.chooseRailcard.navigateToAccount();
    await this.verifyRegistrationPage();
  }

  async verifyRegistrationPage() {
    await expect(this.registerPageHeader).toHaveText("Register for an online account");
  }

  async selectTitle(title: string) {
    await this.registerTitleDropdown.selectOption(title);
  }

  async enterFirstName(firstName: string) {
    await this.registerFirstNameField.fill(firstName);
  }

  async enterLastName(lastName: string) {
    await this.registerLastNameField.fill(lastName);
  }

  async enterEmailAddress(email: string) {
    await this.registerEmailField.fill(email);
  }

  async enterPassword(password: string) {
    await this.registerPasswordField.fill(password);
  }

  async clickRegisterRegisterButton() {
    await this.registerRegisterButton.click();
  }

  async registerNewUser(input: RegistrationInput) {
    const { email, password, purchaseType, title, firstName, lastName } = input;

    await this.enterEmailAddress(email);
    await this.enterPassword(password);

    if (purchaseType === "BOB") {
      if (!title || !firstName || !lastName) {
        throw new Error("BOB registration requires title, firstName, and lastName");
      }
      await this.selectTitle(title);
      await this.enterFirstName(firstName);
      await this.enterLastName(lastName);
    }
    await this.clickRegisterRegisterButton();
  }

  async verifyMidflowRegistrationPage() {
    await this.page.waitForLoadState("networkidle");
    await expect(this.loginPageHeader).toHaveText("Login");
  }

  async clickRegister() {
    await this.loginRegisterButton.click();
  }

  async clickMidflowRegisterButton() {
    await this.midflowRegisterButton.click({ delay: 100, force: true });
    await this.billingDetailsPageHeader.waitFor({ state: "visible", timeout: 10000 });
  }

  async verifyVerificationHeader() {
    await this.verificationPageHeader.waitFor({ state: "visible", timeout: 10000 });
  }

  async midflowAccountRegistration(data: RegistrationInput, emailResult: { loginEmail: string }) {
    await this.verifyMidflowRegistrationPage();
    await this.clickRegister();

    const registrationData: RegistrationInput =
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
  }
}
