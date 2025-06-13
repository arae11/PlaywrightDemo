import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

interface CustomiseRailcardData {
  Duration: string;
  Fulfilment: string;
  Promocode: string;
  Railcard: string;
  PurchaseType: string;
}

export class CustomiseRailcardPage extends BasePage {
  // Declare Locators
  readonly selectMatureCheckbox: Locator;
  readonly selectOneYear: Locator;
  readonly selectThreeYear: Locator;
  readonly selectDigital: Locator;
  readonly selectPlastic: Locator;
  readonly selectPromoInput: Locator;
  readonly selectPromoApplyButton: Locator;
  readonly selectRemovePromoButton: Locator;
  readonly selectBuyForSelf: Locator;
  readonly selectBuyOnBehalf: Locator;
  readonly selectTermsDigital: Locator;
  readonly selectTermsPlastic: Locator;
  readonly selectTermsFF: Locator;
  readonly selectTermsTT: Locator;
  readonly selectTermsTT2: Locator;
  readonly selectTermsNetwork2: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize Locators
    this.selectMatureCheckbox = page.locator('input#mature-student-0');
    this.selectOneYear = page.locator('//label[@for="select-term-option-1"]');
    this.selectThreeYear = page.locator('//label[@for="select-term-option-0"]');
    this.selectDigital = page.locator('//label[@for="railcard-type-option-0"]');
    this.selectPlastic = page.locator('//label[@for="railcard-type-option-1"]');
    this.selectPromoInput = page.locator('#promo-code');
    this.selectPromoApplyButton = page.locator('//button[contains(text(),"Apply Code")]');
    this.selectRemovePromoButton = page.locator('button[aria-label="Remove"]');
    this.selectBuyForSelf = page.locator('//label[contains(.,"for me")]');
    this.selectBuyOnBehalf = page.locator('//label[contains(.,"else")]');
    this.selectTermsDigital = page.locator('#digital-terms-conditions-0');
    this.selectTermsPlastic = page.locator('#plastic-terms-conditions-0');
    this.selectTermsFF = page.locator('#friendsAndFamily-terms-conditions-0');
    this.selectTermsTT = page.locator('#digital-terms-conditions-0');
    this.selectTermsTT2 = page.locator('//input[@name="agreeToTwoTogether"]');
    this.selectTermsNetwork2 = page.locator('#discounts-terms-conditions-1');
  }

  async checkMatureRailcard() {
    await this.selectMatureCheckbox.check();
  }

  async selectDuration(duration: string) {
    if (duration === "1" || duration === "4") {
      await this.selectOneYear.click();
    } else if (duration === "3") {
      await this.selectThreeYear.click();
    } else {
      throw new Error(`Unsupported duration: ${duration}. Use '1', '3' or '4'.`);
    }
  }

  async selectFulfilment(fulfilment: string) {
    if (fulfilment === "DIGITAL") {
      await this.selectDigital.click();
    } else if (fulfilment === "PLASTIC") {
      await this.selectPlastic.click();
    } else {
      throw new Error(`Unsupported fulfilment: ${fulfilment}. Use 'DIGITAL' or 'PLASTIC'.`);
    }
  }

  async applyPromoCode(code: string) {
    await this.selectPromoInput.fill(code);
    await this.selectPromoApplyButton.click();
  }

  async waitForPromo() {
    await this.selectRemovePromoButton.waitFor({ state: "visible" });
  }

  async enterPromocodeIfPresent(promoCode: string) {
    if (promoCode?.trim()) {
      await this.applyPromoCode(promoCode);
      await this.waitForPromo();
    }
  }

  async selectPurchaseType(railcard: string, purchaseType: string) {
    if (railcard.toUpperCase() !== "SANTANDER") {
      if (purchaseType.toUpperCase() === "BFS") {
        await this.selectBuyForSelf.click();
      } else if (purchaseType.toUpperCase() === "BOB") {
        await this.selectBuyOnBehalf.click();
      } else {
        throw new Error(`Unsupported purchase type: ${purchaseType}. Use 'BFS' or 'BOB'.`);
      }
    }
  }

  async clickTermsAndConditions(railcard: string, fulfilment: string) {
    railcard = railcard.toUpperCase();
    fulfilment = fulfilment.toUpperCase();

    const clickWithRetry = async (locator: Locator) => {
      await locator.scrollIntoViewIfNeeded();
      await locator.waitFor({ state: "visible", timeout: 30000 });
      await locator.click();
    };

    if (["1625", "MATURE", "2630", "DPRC", "SANTANDER"].includes(railcard)) {
      await clickWithRetry(this.selectTermsDigital);
    } else if (railcard === "SENIOR") {
      if (fulfilment === "DIGITAL") {
        await clickWithRetry(this.selectTermsDigital);
      } else if (fulfilment === "PLASTIC") {
        await clickWithRetry(this.selectTermsPlastic);
      }
    } else if (railcard === "TWOTOGETHER") {
      await clickWithRetry(this.selectTermsDigital);
      await clickWithRetry(this.selectTermsTT2);
    } else if (railcard === "NETWORK") {
      await clickWithRetry(this.selectTermsDigital);
      await clickWithRetry(this.selectTermsNetwork2);
    } else if (railcard === "FAMILYANDFRIENDS") {
      await clickWithRetry(this.selectTermsDigital);
      await clickWithRetry(this.selectTermsFF);
    }
  }

  async customiseRailcard(data: CustomiseRailcardData) {
    const { Duration, Fulfilment, Promocode, Railcard, PurchaseType } = data;

    if (Railcard === "MATURE") {
      await this.checkMatureRailcard();
    }

    await this.selectDuration(Duration);
    await this.selectFulfilment(Fulfilment);
    await this.enterPromocodeIfPresent(Promocode);
    await this.selectPurchaseType(Railcard, PurchaseType);
    await this.clickTermsAndConditions(Railcard, Fulfilment);

    await this.clickContinue();
  }
}
