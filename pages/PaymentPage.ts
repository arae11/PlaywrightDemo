import { Page, FrameLocator, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentPage extends BasePage {
  private readonly pageLoadTimeout = 45000; // Increased from 30s to 45s
  private readonly defaultTimeout = 30000;
  private readonly fieldDelay = 1000;
  private readonly initialDelay = 2000;

  readonly pageHeader: Locator;
  readonly paymentFrame: FrameLocator;
  readonly paymentForm: Locator;
  readonly cardNumber: Locator;
  readonly cardNumberError: Locator;
  readonly expiryDate: Locator;
  readonly expiryDateError: Locator;
  readonly securityCode: Locator;
  readonly securityCodeError: Locator;
  readonly cardholderName: Locator;
  readonly cardholderNameError: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader = page.locator('h1:has-text("Payment")');
    this.paymentFrame = page.frameLocator('#payment-frame');
    this.paymentForm = this.paymentFrame.locator('#card-payment-form');
    this.cardNumber = this.paymentFrame.locator('#pas_ccnum');
    this.cardNumberError = this.paymentFrame.locator('#pas_ccnum-error');
    this.expiryDate = this.paymentFrame.locator('#pas_expiry');
    this.expiryDateError = this.paymentFrame.locator('#pas_expiry-error');
    this.securityCode = this.paymentFrame.locator('#pas_cccvc');
    this.securityCodeError = this.paymentFrame.locator('#pas_cccvc-error');
    this.cardholderName = this.paymentFrame.locator('#pas_ccname');
    this.cardholderNameError = this.paymentFrame.locator('#pas_ccname-error');
    this.purchaseButton = this.paymentFrame.locator('#rxp-primary-btn');
  }

  async verifyPaymentPage(): Promise<void> {
    await this.pageHeader.waitFor({ timeout: this.pageLoadTimeout });
    await expect(this.pageHeader).toContainText("Payment", { timeout: this.defaultTimeout });
  }

  private async fillFieldWithDelay(
    locator: Locator,
    value: string,
    delay = this.fieldDelay
  ): Promise<void> {
    await locator.fill(String(value), { timeout: this.defaultTimeout });
    await this.page.waitForTimeout(delay);
  }

  async enterPaymentDetails(
    number: string,
    expiry: string,
    cvc: string,
    holder: string
  ): Promise<void> {
    await this.page.waitForTimeout(this.initialDelay);
    await this.fillFieldWithDelay(this.cardNumber, number);
    await this.fillFieldWithDelay(this.expiryDate, expiry);
    await this.fillFieldWithDelay(this.securityCode, cvc);
    await this.fillFieldWithDelay(this.cardholderName, holder);
    await this.page.waitForTimeout(this.fieldDelay * 2);
  }

  async clickPurchaseButton(): Promise<void> {
    await this.purchaseButton.waitFor({ state: "visible", timeout: this.defaultTimeout });
    await this.purchaseButton.scrollIntoViewIfNeeded();
    await expect(this.purchaseButton).toBeEnabled({ timeout: this.defaultTimeout });
    await this.purchaseButton.click({ timeout: this.defaultTimeout });
  }

  async completePurchase(
    creditCardNumber: string,
    cardExpiry: string,
    cardCvc: string,
    cardHolder: string
  ): Promise<void> {
    await this.verifyPaymentPage();
    await this.paymentForm.waitFor({ timeout: this.pageLoadTimeout });
    await this.enterPaymentDetails(creditCardNumber, cardExpiry, cardCvc, cardHolder);
    await this.clickPurchaseButton();

    await this.page.getByText("Order Confirmation").waitFor({
      state: "visible",
      timeout: this.pageLoadTimeout
    });
  }
}
