import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { idpLocators } from '../resources/locators';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToLogin() {
        await this.page.goto('https://secure-preproduction.railcard.co.uk/login');
        await this.handleCookiePopup();
    }

    async login(username: string, password: string) {
        await this.page.fill(idpLocators.loginUsernameField, username);
        await this.page.fill(idpLocators.loginPasswordField, password);
        await this.page.click(idpLocators.loginLoginButton);
    }

    async navigateToRegistration() {
        await this.page.click(idpLocators.loginRegisterButton);
    }
}