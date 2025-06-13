import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class VerificationPage extends BasePage {
    readonly verificationPageHeader: Locator;
    readonly verifiedPageHeader: Locator;
    readonly verifiedLoginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.verificationPageHeader = page.locator('h2:has-text("Verify your email address")');
        this.verifiedPageHeader = page.locator('h2:has-text("Account verified")');
        this.verifiedLoginButton = page.locator('//a[.="Login"]');
    }

    async verifyEmail(confirmationLink: string) {
        await this.page.goto(confirmationLink);
        await expect(this.verifiedPageHeader).toBeVisible();
    }

    async clickLogin() {
        await this.verifiedLoginButton.click();
    }

    async verifyEmailAndNavigateToIDP(confirmationLink: string) {
        await this.verifyEmail(confirmationLink);
        await this.clickLogin();
    }
}
