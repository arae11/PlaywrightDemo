import { Page, Locator } from "@playwright/test";

export class BasePage {
  private hasClickedContinue = false;
  private lastUrl: string | null = null;

  readonly page: Page;

  // Declare Locators
  readonly acceptOneTrustPopUp: Locator;
  readonly globalContinueButton: Locator;
  readonly globalBackButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.acceptOneTrustPopUp = page.locator('#onetrust-accept-btn-handler');
    this.globalContinueButton = page.locator('button:text-is("Continue")');
    this.globalBackButton = page.locator('button:text-is("Back")');
  }

  async handleCookiePopup() {
    await this.acceptOneTrustPopUp
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
    await this.globalBackButton.waitFor({ state: "visible", timeout: 5000 });
    await this.globalBackButton.click();
  }

  async clickContinue() {
    if (this.hasClickedContinue) return;

    await this.globalContinueButton.waitFor({ state: "visible", timeout: 5000 });

    this.lastUrl = this.page.url();

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "load", timeout: 10000 }),
      this.globalContinueButton.click(),
    ]);

    this.hasClickedContinue = true;

    const newUrl = this.page.url();
    if (newUrl !== this.lastUrl) {
      this.resetContinueClick();
    }
  }

  async resetContinueClick() {
    this.hasClickedContinue = false;
  }

  async navigateToRailcardWebsite(path = "/purchase") {
    await this.page.goto(path);
    try {
      await this.acceptOneTrustPopUp
        .click({ timeout: 5000 });
    } catch {
      // Cookie popup not found, continue silently
    }
  }
}
