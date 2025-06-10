import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { myRailcardsLocators } from "../resources/locators";

interface RailcardDetails {
  header: string;
  name: string;
  expiry: string;
  email: string;
  fulfilment: string;
  number: string;
}

export class MyRailcardsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyMyRailcardPage() {
    await this.page.waitForSelector(myRailcardsLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText("My Railcards");
  }

  private async getText(selector: string): Promise<string> {
    return (await this.page.textContent(selector))?.trim() || "N/A";
  }

  private async getRailcardDetails(): Promise<RailcardDetails> {
    return {
      header: await this.getText(myRailcardsLocators.railcardDetailsHeader),
      name: await this.getText(myRailcardsLocators.railcardDetailsName),
      expiry: await this.getText(myRailcardsLocators.railcardDetailsExpiry),
      email: await this.getText(myRailcardsLocators.railcardDetailsEmail),
      fulfilment: await this.getText(
        myRailcardsLocators.railcardDetailsFulfilment
      ),
      number: await this.getText(
        myRailcardsLocators.railcardDetailsRailcardNumber
      ),
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
    await this.page.click(myRailcardsLocators.railcardDetailsAddToApp);
  }

  async getMyRailcardDetails(fulfilment: string) {
    await this.verifyMyRailcardPage();
    await this.extractRailcardInfo();
    if (fulfilment === "DIGITAL") {
      await this.clickAddRailcardToApp();
    }
  }
}
