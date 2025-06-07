import { Page, FrameLocator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { paymentLocators } from "../resources/locators";

export class PaymentPage extends BasePage {
  private readonly pageLoadTimeout = 45000; // Increased from 30s to 45s
  private readonly defaultTimeout = 30000;
  private readonly fieldDelay = 500;
  private readonly initialDelay = 2000;

  constructor(page: Page) {
    super(page);
  }

  async verifyPaymentPage(): Promise<void> {
    await this.page.waitForSelector(paymentLocators.pageHeader, {
      timeout: this.pageLoadTimeout, // Using the longer page load timeout
    });
    await expect(this.page.locator("h1")).toContainText("Payment", {
      timeout: this.defaultTimeout
    });
  }

  async openPaymentFrame(): Promise<FrameLocator> {
    const iframe = this.page.frameLocator(paymentLocators.paymentFrame);
    await iframe.locator(paymentLocators.paymentForm).waitFor({
      timeout: this.pageLoadTimeout // Longer timeout for frame loading
    });
    return iframe;
  }

  private async fillFieldWithDelay(
    frame: FrameLocator,
    selector: string,
    value: string,
    delay = this.fieldDelay
  ): Promise<void> {
    await frame.locator(selector).fill(value, { timeout: this.defaultTimeout });
    await this.page.waitForTimeout(delay);
  }

  async enterPaymentDetails(
    frame: FrameLocator,
    number: string,
    expiry: string,
    cvc: string,
    holder: string
  ): Promise<void> {
    await this.page.waitForTimeout(this.initialDelay);
    
    await this.fillFieldWithDelay(frame, paymentLocators.cardNumber, number);
    await this.fillFieldWithDelay(frame, paymentLocators.expiryDate, expiry);
    await this.fillFieldWithDelay(frame, paymentLocators.securityCode, cvc);
    await this.fillFieldWithDelay(frame, paymentLocators.cardholderName, holder);
    
    await this.page.waitForTimeout(this.fieldDelay * 2);
  }

  async clickPurchaseButton(frame: FrameLocator): Promise<void> {
    const purchaseButton = frame.locator(paymentLocators.purchaseButton);
    await purchaseButton.waitFor({
      state: "visible",
      timeout: this.defaultTimeout
    });
    await purchaseButton.scrollIntoViewIfNeeded();
    await expect(purchaseButton).toBeEnabled({ timeout: this.defaultTimeout });
    await purchaseButton.click({ timeout: this.defaultTimeout });
  }

  async completePurchase(
    creditCardNumber: string,
    cardExpiry: string,
    cardCvc: string,
    cardHolder: string
  ): Promise<void> {
    await this.verifyPaymentPage();
    const frame = await this.openPaymentFrame();
    await this.enterPaymentDetails(frame, creditCardNumber, cardExpiry, cardCvc, cardHolder);
    await this.clickPurchaseButton(frame);
    
    await this.page.getByText("Order Confirmation").waitFor({
      state: "visible",
      timeout: this.pageLoadTimeout // Longer timeout for final confirmation
    });
  }
}
