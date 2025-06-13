import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OrderConfirmationPage extends BasePage {
  public extractedOrderNumber: string | null = null;

  readonly pageHeader: Locator;
  readonly orderNumber: Locator;
  readonly orderDateTime: Locator;
  readonly paymentReference: Locator;
  readonly billingAddress: Locator;
  readonly purchasedBy: Locator;
  readonly items: Locator;
  readonly orderTotal: Locator;
  readonly buyAnotherRailcardButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1:has-text("Confirmation")');
    this.orderNumber = page.locator('xpath=//p[.="Order number:"]/following-sibling::*[1]');
    this.orderDateTime = page.locator('xpath=//p[.="Order date:"]/following-sibling::*[1]');
    this.paymentReference = page.locator('xpath=//p[.="Payment reference:"]/following-sibling::*[1]');
    this.billingAddress = page.locator('xpath=//p[.="Billing address:"]/following-sibling::*[1]');
    this.purchasedBy = page.locator('xpath=//p[.="Purchased by:"]/following-sibling::*[1]');
    this.items = page.locator('xpath=//p[contains(text(), "Items:")]/following-sibling::div//p[contains(@class, "bold")][1]');
    this.orderTotal = page.locator('//p[contains(normalize-space(.), "Order total:")]/following-sibling::*[1]');
    this.buyAnotherRailcardButton = page.locator('xpath=//button[contains(text(),"Buy another Railcard")]');
  }

  async verifyOrderConfirmationPage() {
    await this.pageHeader.waitFor();
    await expect(this.page.locator("h1")).toContainText("Confirmation");
  }

  async logPaymentSummaryText() {
    const divider = "═".repeat(80);
    console.log("\n" + divider);
    console.log("💳  PAYMENT SUMMARY");
    console.log(divider);

    const getText = async (locator: Locator) =>
      (await locator.textContent())?.trim() || "N/A";

    this.extractedOrderNumber = await getText(this.orderNumber);
    const orderNumber = this.extractedOrderNumber;
    const orderDateTime = await getText(this.orderDateTime);
    const total = await getText(this.orderTotal);
    const billingAddress = await getText(this.billingAddress);
    const purchasedBy = await getText(this.purchasedBy);
    const orderItems = await getText(this.items);

    const labelWidth = 24;

    const logRow = (label: string, value: string) =>
      console.log(`${label.padEnd(labelWidth)}: ${value}`);

    logRow("🧾 Order Number", orderNumber);
    logRow("📅 Order Date/Time", orderDateTime);
    logRow("💰 Order Total", total);

    if (total !== "£0.00") {
      const paymentReference = await getText(this.paymentReference);
      logRow("🆔 Payment Reference", paymentReference);
    }

    logRow("🏠 Billing Address", billingAddress);
    logRow("👤 Purchased By", purchasedBy);
    logRow("📦 Order Items", orderItems);

    console.log(divider + "\n");
  }
}
