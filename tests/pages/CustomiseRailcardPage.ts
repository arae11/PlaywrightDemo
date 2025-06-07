import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { customiseRailcardLocators } from "../resources/locators";

export class CustomiseRailcardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async checkMatureRailcard() {
    await this.page.check(customiseRailcardLocators.selectMatureCheckbox);
  }

  async selectOneYear() {
    await this.page.click(customiseRailcardLocators.selectOneYear);
  }

  async selectThreeYear() {
    await this.page.click(customiseRailcardLocators.selectThreeYear);
  }

  async selectDigitalRailcard() {
    await this.page.click(customiseRailcardLocators.selectDigital);
  }

  async selectPlasticRailcard() {
    await this.page.click(customiseRailcardLocators.selectPlastic);
  }

  async applyPromoCode(code: string) {
    await this.page.fill(customiseRailcardLocators.selectPromoInput, code);
    await this.page.click(customiseRailcardLocators.selectPromoApplyButton);
  }

  async selectBuyForSelf() {
    await this.page.click(customiseRailcardLocators.selectBuyForSelf);
  }

  async selectBuyOnBehalf() {
    await this.page.click(customiseRailcardLocators.selectBuyOnBehalf);
  }

  async acceptTermsForDigital() {
    await this.page.click(customiseRailcardLocators.selectTermsDigital);
  }

  async acceptTermsForPlastic() {
    await this.page.click(customiseRailcardLocators.selectTermsPlastic);
  }

  async selectDuration(Duration: string) {
    if (Duration === "1" || Duration === "4") {
      await this.selectOneYear();
    } else if (Duration === "3") {
      await this.selectThreeYear();
    } else {
      throw new Error(
        `Unsupported duration: ${Duration}, please use '1 Year' or '3 Years'`
      );
    }
  }

  async selectFulfilment(Fulfilment: string) {
    if (Fulfilment === "DIGITAL") {
      await this.selectDigitalRailcard();
    } else if (Fulfilment === "PLASTIC") {
      await this.selectPlasticRailcard();
    } else {
      throw new Error(
        `Unsupported fulfilment: ${Fulfilment}, please use 'DIGITAL' or 'PLASTIC'`
      );
    }
  }

  async enterPromocodeIfPresent(Promocode: string) {
    if (Promocode && Promocode.trim() !== "") {
      await this.applyPromoCode(Promocode);
    }
  }

  async selectPurchaseType(Railcard: string, PurchaseType: string) {
    if (Railcard.toUpperCase() !== "SANTANDER") {
      if (PurchaseType.toUpperCase() === "BFS") {
        await this.selectBuyForSelf();
      } else if (PurchaseType.toUpperCase() === "BOB") {
        await this.selectBuyOnBehalf();
      } else {
        throw new Error(
          `Unsupported purchase type: ${PurchaseType}, please use 'BFS' or 'BOB'`
        );
      }
    }
  }

  async clickTermsAndConditions(Railcard: string, Fulfilment: string) {
    Railcard = Railcard.toUpperCase();
    Fulfilment = Fulfilment.toUpperCase();

    const clickWithRetry = async (selector: string) => {
      await this.page.locator(selector).scrollIntoViewIfNeeded();
      await this.page.waitForSelector(selector, { timeout: 30000 });
      await this.page.locator(selector).click();
    };

    if (["1625", "MATURE", "2630", "DPRC", "SANTANDER"].includes(Railcard)) {
      await clickWithRetry(customiseRailcardLocators.selectTermsDigital);
    } else if (Railcard === "SENIOR") {
      if (Fulfilment === "DIGITAL") {
        await clickWithRetry(customiseRailcardLocators.selectTermsDigital);
      } else if (Fulfilment === "PLASTIC") {
        await clickWithRetry(customiseRailcardLocators.selectTermsPlastic);
      }
    } else if (Railcard === "TWOTOGETHER") {
      await clickWithRetry(customiseRailcardLocators.selectTermsDigital);
      await clickWithRetry(customiseRailcardLocators.selectTermsTT2);
    } else if (Railcard === "NETWORK") {
      await clickWithRetry(customiseRailcardLocators.selectTermsDigital);
      await clickWithRetry(customiseRailcardLocators.selectTermsNetwork2);
    } else if (Railcard === "FAMILYANDFRIENDS") {
      await clickWithRetry(customiseRailcardLocators.selectTermsDigital);
      await clickWithRetry(customiseRailcardLocators.selectTermsFF);
    }
  }

  async customiseRailcard(data: {
    Duration: string;
    Fulfilment: string;
    Promocode: string;
    Railcard: string;
    PurchaseType: string;
  }) {
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
