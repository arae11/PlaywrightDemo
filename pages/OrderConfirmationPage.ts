import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { confirmationLocators } from "../resources/locators";

export class OrderConfirmationPage extends BasePage {
  public extractedOrderNumber: string | null = null;

  constructor(page: Page) {
    super(page);
  }

  async verifyOrderConfirmationPage() {
    await this.page.waitForSelector(confirmationLocators.pageHeader);
    await expect(this.page.locator("h1")).toContainText("Confirmation");
  }

  async logPaymentSummaryText() {
    const divider = "═".repeat(80);
    console.log("\n" + divider);
    console.log("💳  PAYMENT SUMMARY");
    console.log(divider);

    const getText = async (locator: string) =>
      (await this.page.textContent(locator))?.trim() || "N/A";

    this.extractedOrderNumber = await getText(confirmationLocators.orderNumber);
    const orderNumber = this.extractedOrderNumber;
    const orderDateTime = await getText(confirmationLocators.orderDateTime);
    const total = await getText(confirmationLocators.orderTotal);
    const billingAddress = await getText(confirmationLocators.billingAddress);
    const purchasedBy = await getText(confirmationLocators.purchasedBy);
    const orderItems = await getText(confirmationLocators.items);

    const labelWidth = 24;

    const logRow = (label: string, value: string) =>
      console.log(`${label.padEnd(labelWidth)}: ${value}`);

    logRow("🧾 Order Number", orderNumber);
    logRow("📅 Order Date/Time", orderDateTime);
    logRow("💰 Order Total", total);

    if (total !== "£0.00") {
      const paymentReference = await getText(confirmationLocators.paymentReference);
      logRow("🆔 Payment Reference", paymentReference);
    }

    logRow("🏠 Billing Address", billingAddress);
    logRow("👤 Purchased By", purchasedBy);
    logRow("📦 Order Items", orderItems);

    console.log(divider + "\n");
  }
}
