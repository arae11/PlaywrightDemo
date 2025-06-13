import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly loginUsernameField: Locator;
  readonly loginPasswordField: Locator;
  readonly loginLoginButton: Locator;
  readonly loginRegisterButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginUsernameField = page.locator('#Username');
    this.loginPasswordField = page.locator('#Password');
    this.loginLoginButton = page.locator('[name="button"]');
    this.loginRegisterButton = page.locator('xpath=//a[text()="Register"]');
  }

  async navigateToLogin() {
    await this.page.goto('https://secure-preproduction.railcard.co.uk/login');
    await this.handleCookiePopup();
  }

  async login(username: string, password: string) {
    await this.loginUsernameField.fill(username);
    await this.loginPasswordField.fill(password);
    await this.loginLoginButton.click();
  }

  async navigateToRegistration() {
    await this.loginRegisterButton.click();
  }
}
