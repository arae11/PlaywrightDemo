import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { PromocodeHelper } from "../utils/promocodeHelper";

interface VerifyPriceParams {
  railcard: string;
  years: string;
  deliveryType: string;
  promo?: string;
  sku: string;
}

export class OrderSummaryPage extends BasePage {
  private promocodeHelper: PromocodeHelper;

  // Declare Locators
  readonly pageHeader: Locator;
  readonly addAnotherRailcardButton: Locator;
  readonly orderTotalPrice: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.promocodeHelper = new PromocodeHelper();

    // Initialize Locators
    this.pageHeader = page.locator('h1:has-text("Railcard Order: Summary")');
    this.addAnotherRailcardButton = page.locator('xpath=//button[text()="Add another Railcard"]');
    this.orderTotalPrice = page.locator('//div[contains(@class, "Invoice-module__invoiceRow")]//p[contains(@class, "Typography-module__heading-2")][2]');
    this.purchaseButton = page.locator('xpath=//button[contains(text(),"Purchase")]');
  }

  async verifyOrderSummaryPage() {
    await this.pageHeader.waitFor({ state: "visible" });
    await expect(this.pageHeader).toContainText("Railcard Order: Summary");
  }

  async clickPurchase() {
    await this.purchaseButton.waitFor({ state: "visible", timeout: 5000 });
    await this.purchaseButton.click();
  }

  async skipOrderSummaryPage() {
    await this.verifyOrderSummaryPage();
    await this.clickPurchase();
  }

  async getOrderTotalText(): Promise<number> {
    await this.orderTotalPrice.waitFor({
      state: "visible",
      timeout: 30000,
    });
    const text = await this.orderTotalPrice.textContent();
    if (!text) throw new Error("Order total price text not found");
    const price = parseFloat(text.replace(/[^\d.]/g, ""));
    if (isNaN(price)) throw new Error(`Failed to parse order total price from "${text}"`);
    return price;
  }

  async verifyCorrectPriceOnSummaryPage(params: VerifyPriceParams): Promise<number> {
    const { railcard, years, deliveryType, promo = "", sku } = params;

    await this.verifyOrderSummaryPage();

    const actualPrice = await this.getOrderTotalText();
    const basePrice = this.promocodeHelper.getRailcardValueWithoutPromo(railcard, years);

    let finalPrice = basePrice;

    if (promo.trim() !== "") {
      const { skipPayment } = await this.promocodeHelper.verifyPromocodeTags(promo, sku, basePrice);
      finalPrice = this.getFinalPriceConsideringSkipPayment(basePrice, skipPayment);

      const promoResponse = await this.promocodeHelper.validatePromocode(promo, sku, finalPrice);
      const discountAmount = this.extractTotalDiscountValue(promoResponse);
      finalPrice = this.calculatePromocodeDiscount(finalPrice, discountAmount);
    }

    if (deliveryType === "SPECIAL") {
      finalPrice += 6.85;
    }

    console.log(
      `✅ Expected Final Price: £${finalPrice.toFixed(2)} should match Actual Price: £${actualPrice.toFixed(2)}`
    );

    if (Math.abs(finalPrice - actualPrice) > 0.01) {
      throw new Error(
        `Price mismatch! Expected £${finalPrice.toFixed(2)}, but got £${actualPrice.toFixed(2)}`
      );
    }

    await this.clickPurchase();
    return finalPrice;
  }

  private getFinalPriceConsideringSkipPayment(basePrice: number, skipPayment: boolean): number {
    return skipPayment ? 0.0 : basePrice;
  }

  private extractTotalDiscountValue(promoResponse: any): number {
    if (!promoResponse) return 0;

    if (typeof promoResponse.totalDiscountValue === "number") {
      return promoResponse.totalDiscountValue;
    }

    if (typeof promoResponse.discountAmount === "number") {
      return promoResponse.discountAmount;
    }

    if (Array.isArray(promoResponse.discounts)) {
      return promoResponse.discounts.reduce((acc: number, d: any) => acc + (d.amount || 0), 0);
    }

    return 0;
  }

  private calculatePromocodeDiscount(price: number, discount: number): number {
    return Math.max(0, price - discount);
  }
}