import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { orderSummaryLocators } from "../resources/locators";

export class OrderSummaryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyOrderSummaryPage() {
    await this.page.waitForSelector(orderSummaryLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText(
      "Railcard Order: Summary"
    );
  }

  async clickPurchase() {
    const purchaseBtn = this.page.locator(orderSummaryLocators.purchaseButton);
    await purchaseBtn.waitFor({ state: "visible", timeout: 5000 });
    await purchaseBtn.click();
  }

  async skipOrderSummaryPage() {
    await this.verifyOrderSummaryPage();
    await this.clickPurchase();
  }
}
