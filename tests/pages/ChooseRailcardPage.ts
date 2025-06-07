import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { chooseRailcardLocators } from "../resources/locators";

export class ChooseRailcardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyChooseRailcardPage() {
    await this.page.waitForSelector(chooseRailcardLocators.pageHeader);
    await expect(
      this.page.locator(chooseRailcardLocators.pageHeader)
    ).toHaveText("Choose a Railcard");
  }

  async select16To25Railcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.select16To25);
    await expect(
      this.page.locator('h1')
    ).toHaveText("16-25 Railcard");
  }

  async select26To30Railcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.select26To30);
    await expect(
      this.page.locator('h1')
    ).toHaveText("26-30 Railcard");
  }

  async selectSeniorRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.selectSenior);
    await expect(
      this.page.locator('h1')
    ).toHaveText("Senior Railcard");
  }

  async selectNetworkRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.selectNetwork);
    await expect(
      this.page.locator('h1')
    ).toHaveText("Network Railcard");
  }

  async selectDPRCRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.selectDPRC);
    await expect(
      this.page.locator('h1')
    ).toHaveText("Disabled Persons Railcard");
  }

  async selectTwoTogetherRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.selectTwoTogether);
    await expect(
      this.page.locator('h1')
    ).toHaveText("Two Together Railcard");
  }

  async selectFamilyRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.click(chooseRailcardLocators.selectFamily);
    await expect(
      this.page.locator('h1')
    ).toHaveText("Family & Friends Railcard");
  }

  async selectSantanderRailcard() {
    await this.verifyChooseRailcardPage();
    await this.page.goto("/purchase/santander");
    await expect(
      this.page.locator('h1')
    ).toHaveText("Santander 16-25 Railcard");
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
    await this.page.click(chooseRailcardLocators.selectAccount);
  }
}
