import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { orderSummaryLocators } from "../resources/locators";
import { PromocodeHelper } from "../utils/promocodeHelper";

interface VerifyPriceParams {
  orderTotalLocator: string;
  railcard: string;
  years: string;
  deliveryType: string;
  promo?: string;
  sku: string;
}

export class OrderSummaryPage extends BasePage {
  private promocodeHelper: PromocodeHelper;

  constructor(page: Page) {
    super(page);
    this.promocodeHelper = new PromocodeHelper();
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

  async getOrderTotalText(locator: string): Promise<number> {
    await this.page.waitForSelector(locator, { state: "visible", timeout: 30000 });
    const text = await this.page.textContent(locator);
    if (!text) throw new Error("Order total price text not found");
    // Remove currency symbols and whitespace, parse float
    const price = parseFloat(text.replace(/[^\d.]/g, ""));
    if (isNaN(price)) throw new Error(`Failed to parse order total price from "${text}"`);
    return price;
  }

  async verifyCorrectPriceOnSummaryPage(params: VerifyPriceParams): Promise<number> {
    const { orderTotalLocator, railcard, years, deliveryType, promo = "", sku } = params;
    await this.verifyOrderSummaryPage();

    // Step 1: Get actual price from page
    const actualPrice = await this.getOrderTotalText(orderTotalLocator);
    console.log(`🛒 Actual Price from summary page: £${actualPrice.toFixed(2)}`);

    // Step 2: Get base price without promo
    const basePrice = this.promocodeHelper.getRailcardValueWithoutPromo(railcard, years);
    console.log(`💰 Base Price (no promo): £${basePrice.toFixed(2)}`);

    let finalPrice = basePrice;

    if (promo.trim() !== "") {
      // Step 3: Promo logic
      const { skipPayment } = await this.promocodeHelper.verifyPromocodeTags(promo, sku, basePrice);

      // Step 4: Adjust price if skip payment promo tag applies
      finalPrice = this.getFinalPriceConsideringSkipPayment(basePrice, skipPayment);

      // Step 5: Validate promocode via API (optional - logs response)
      const promoResponse = await this.promocodeHelper.validatePromocode(promo, sku, finalPrice);
      console.log("🎟️ Promocode validation response:", promoResponse);

      // Step 6: Extract discount amount and apply
      const discountAmount = this.extractTotalDiscountValue(promoResponse);
      console.log(`🔖 Discount amount from promocode: £${discountAmount.toFixed(2)}`);

      finalPrice = this.calculatePromocodeDiscount(finalPrice, discountAmount);
    }

    // Step 7: Add delivery charge if deliveryType is SPECIAL
    if (deliveryType === "SPECIAL") {
      finalPrice += 6.85;
      console.log("📦 Added SPECIAL delivery charge: £6.85");
    }

    console.log(`✅ Expected Final Price: £${finalPrice.toFixed(2)} should match Actual Price: £${actualPrice.toFixed(2)}`);

    // Step 8: Assert prices match (throw error if not)
    if (Math.abs(finalPrice - actualPrice) > 0.01) {
      throw new Error(`Price mismatch! Expected £${finalPrice.toFixed(2)}, but got £${actualPrice.toFixed(2)}`);
    }
    await this.clickPurchase();

    return finalPrice;
  }

  getFinalPriceConsideringSkipPayment(basePrice: number, skipPayment: boolean): number {
    return skipPayment ? 0.0 : basePrice;
  }

  extractTotalDiscountValue(promoResponse: any): number {
    // Assuming promoResponse has a 'discounts' array with 'amount' fields
    if (!promoResponse || !promoResponse.discounts) return 0.0;

    return promoResponse.discounts.reduce(
      (acc: number, d: any) => acc + (d.amount || 0),
      0
    );
  }

  calculatePromocodeDiscount(price: number, discount: number): number {
    return Math.max(0, price - discount);
  }
}
