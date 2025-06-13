import { globalLocators } from "../resources/locators";
import { Page, expect } from "@playwright/test";

export class BasePage {
  private hasClickedContinue = false;
  private lastUrl: string | null = null;

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async handleCookiePopup() {
    await this.page
      .locator(globalLocators.acceptOneTrustPopUp)
      .click({ timeout: 5000 })
      .catch(() => console.log("Cookie popup not found"));
  }

  async takeScreenshot(testCaseID: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `screenshots/error-${testCaseID}-${timestamp}.png`,
    });
  }

  async clickBack() {
    const backBtn = this.page.locator(globalLocators.globalBackButton);
    await backBtn.waitFor({ state: "visible", timeout: 5000 });
    await backBtn.click();
  }

  async clickContinue() {
    if (this.hasClickedContinue) return;

    const continueBtn = this.page.locator(globalLocators.globalContinueButton);

    await continueBtn.waitFor({ state: "visible", timeout: 5000 });

    // Store the current URL to detect navigation
    this.lastUrl = this.page.url();

    // Click and wait for navigation
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "load", timeout: 10000 }),
      continueBtn.click(),
    ]);

    this.hasClickedContinue = true;

    // After navigation, reset automatically
    const newUrl = this.page.url();
    if (newUrl !== this.lastUrl) {
      this.resetContinueClick();
    }
  }

  // Reset manually when needed
  async resetContinueClick() {
    this.hasClickedContinue = false;
  }

  async navigateToRailcardWebsite(path = "/purchase") {
    await this.page.goto(path);
    try {
      await this.page
        .locator(globalLocators.acceptOneTrustPopUp)
        .click({ timeout: 5000 });
    } catch {
      // Cookie popup not found, continue silently
    }
  }
}
