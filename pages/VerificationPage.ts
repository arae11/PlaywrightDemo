import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { verificationLocators } from '../resources/locators';

export class VerificationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async verifyEmail(confirmationLink: string) {
        await this.page.goto(confirmationLink);
        await expect(this.page.locator(verificationLocators.verifiedPageHeader)).toBeVisible();
    }

    async clickLogin() {
        await this.page.click(verificationLocators.verifiedLoginButton);
    }

    async verifyEmailAndNavigateToIDP(confirmationLink: string) {
        await this.verifyEmail(confirmationLink);
        await this.clickLogin();
    }
}