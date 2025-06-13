import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ChooseRailcardPage extends BasePage {
  // Declare Locators
  readonly pageHeader: Locator;
  readonly selectAccount: Locator;
  readonly select16To25: Locator;
  readonly select26To30: Locator;
  readonly selectSenior: Locator;
  readonly selectNetwork: Locator;
  readonly selectDPRC: Locator;
  readonly selectFamily: Locator;
  readonly selectTwoTogether: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize Locators
    this.pageHeader = page.locator('h1:has-text("Choose a Railcard")');
    this.selectAccount = page.locator('xpath=//a[text()="Account"]');
    this.select16To25 = page.locator('h2:has-text("16-25 Railcard")');
    this.select26To30 = page.locator('h2:has-text("26-30 Railcard")');
    this.selectSenior = page.locator('h2:has-text("Senior Railcard")');
    this.selectNetwork = page.locator('h2:has-text("Network Railcard")');
    this.selectDPRC = page.locator('h2:has-text("Disabled Persons Railcard")');
    this.selectFamily = page.locator('h2:has-text("Family & Friends Railcard")');
    this.selectTwoTogether = page.locator('h2:has-text("Two Together Railcard")');
  }

  async verifyChooseRailcardPage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toHaveText("Choose a Railcard");
  }

  async select16To25Railcard() {
    await this.verifyChooseRailcardPage();
    await this.select16To25.click();
    await expect(this.page.locator('h1')).toHaveText("16-25 Railcard");
  }

  async select26To30Railcard() {
    await this.verifyChooseRailcardPage();
    await this.select26To30.click();
    await expect(this.page.locator('h1')).toHaveText("26-30 Railcard");
  }

  async selectSeniorRailcard() {
    await this.verifyChooseRailcardPage();
    await this.selectSenior.click();
    await expect(this.page.locator('h1')).toHaveText("Senior Railcard");
  }

  async selectNetworkRailcard() {
    await this.verifyChooseRailcardPage();
    await this.selectNetwork.click();
    await expect(this.page.locator('h1')).toHaveText("Network Railcard");
  }

  async selectDPRCRailcard() {
    await this.verifyChooseRailcardPage();
    await this.selectDPRC.click();
    await expect(this.page.locator('h1')).toHaveText("Disabled Persons Railcard");
  }

  async selectTwoTogetherRailcard() {
    await this.verifyChooseRailcardPage();
    await this.selectTwoTogether.click();
    await expect(this.page.locator('h1')).toHaveText("Two Together Railcard");
  }

  async selectFamilyRailcard() {
    await this.verifyChooseRailcardPage();
    await this.selectFamily.click();
    await expect(this.page.locator('h1')).toHaveText("Family & Friends Railcard");
  }

  async selectSantanderRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.goto("/purchase/santander");
    await expect(this.page.locator('h1')).toHaveText("Santander 16-25 Railcard");
  }

  async selectRailcard(Railcard: string) {
    switch (Railcard) {
      case "1625":
      case "MATURE":
        return this.select16To25Railcard();
      case "2630":
        return this.select26To30Railcard();
      case "SENIOR":
        return this.selectSeniorRailcard();
      case "NETWORK":
        return this.selectNetworkRailcard();
      case "DPRC":
        return this.selectDPRCRailcard();
      case "TWOTOGETHER":
        return this.selectTwoTogetherRailcard();
      case "FAMILYANDFRIENDS":
        return this.selectFamilyRailcard();
      case "SANTANDER":
        return this.selectSantanderRailcard();
      default:
        throw new Error(`Unknown railcard ID: ${Railcard}`);
    }
  }

  async navigateToAccount() {
    await this.verifyChooseRailcardPage();
    await this.selectAccount.click();
  }
}
