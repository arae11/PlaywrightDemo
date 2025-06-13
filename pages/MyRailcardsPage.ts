import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

interface RailcardDetails {
  header: string;
  name: string;
  expiry: string;
  email: string;
  fulfilment: string;
  number: string;
}

export class MyRailcardsPage extends BasePage {
  readonly pageHeader: Locator;
  readonly railcardDetailsHeader: Locator;
  readonly railcardDetailsName: Locator;
  readonly railcardDetailsExpiry: Locator;
  readonly railcardDetailsEmail: Locator;
  readonly railcardDetailsFulfilment: Locator;
  readonly railcardDetailsRailcardNumber: Locator;
  readonly railcardDetailsRenewButton: Locator;
  readonly railcardDetailsReplaceButton: Locator;
  readonly railcardDetailsAddToApp: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1:has-text("My Railcards")');
    this.railcardDetailsHeader = page.locator('(//h3)[1]');
    this.railcardDetailsName = page.locator('//p[1]');
    this.railcardDetailsExpiry = page.locator('//p[2]');
    this.railcardDetailsEmail = page.locator('//p[.="Email"]/following-sibling::*[1]');
    this.railcardDetailsFulfilment = page.locator('//p[.="Railcard Type"]/following-sibling::*[1]');
    this.railcardDetailsRailcardNumber = page.locator('//p[.="Railcard Number"]/following-sibling::*[1]');
    this.railcardDetailsRenewButton = page.locator('//button[text()="Renew Railcard"]');
    this.railcardDetailsReplaceButton = page.locator('//a[text()="Replace a lost or stolen Railcard"]');
    this.railcardDetailsAddToApp = page.locator('xpath=//button[text()="Add Railcard to app"]');
  }

  async verifyMyRailcardPage() {
    await this.pageHeader.waitFor();
    await expect(this.pageHeader).toContainText("My Railcards");
  }

  private async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() || "N/A";
  }

  private async getRailcardDetails(): Promise<RailcardDetails> {
    return {
      header: await this.getText(this.railcardDetailsHeader),
      name: await this.getText(this.railcardDetailsName),
      expiry: await this.getText(this.railcardDetailsExpiry),
      email: await this.getText(this.railcardDetailsEmail),
      fulfilment: await this.getText(this.railcardDetailsFulfilment),
      number: await this.getText(this.railcardDetailsRailcardNumber),
    };
  }

  private logRailcardDetails(details: RailcardDetails): void {
    const divider = "═".repeat(80);
    console.log("\n\n" + divider);
    console.log("📦  RAILCARD DETAILS");
    console.log(divider);
    console.log(`🔹 Railcard             : ${details.header}`);
    console.log(`🔹 Recipient Name       : ${details.name}`);
    console.log(`🔹 Recipient Email      : ${details.email}`);
    console.log(`🔹 Fulfilment Type      : ${details.fulfilment}`);
    console.log(`🔹 Expiry Date          : ${details.expiry}`);
    console.log(`🔹 Railcard Number      : ${details.number}`);
    console.log(divider + "\n");
  }

  async extractRailcardInfo(): Promise<RailcardDetails> {
    const details = await this.getRailcardDetails();
    this.logRailcardDetails(details);
    return details;
  }

  async clickAddRailcardToApp() {
    await this.railcardDetailsAddToApp.click();
  }

  async getMyRailcardDetails(fulfilment: string) {
    await this.verifyMyRailcardPage();
    await this.extractRailcardInfo();
    if (fulfilment === "DIGITAL") {
      await this.clickAddRailcardToApp();
    }
  }
}
