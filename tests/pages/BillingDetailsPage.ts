import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import {
  billingDetailsLocators,
  deliveryDetailsLocators,
} from "../resources/locators";

interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  townCity?: string;
  postcode?: string;
}

interface BillingDetails {
  countryPrefix: string;
  phoneNumber: string;
  countryId: string;
  sameAsBillingAddress: string;
  billingAddress: Address;
  deliveryAddress?: Address;
  fulfilment: string;
  deliveryType: string;
}

interface DeliveryDetails {
  sameAsBillingAddress: string;
  countryId: string;
  deliveryAddress?: Address;
  fulfilment: string;
  deliveryType: string;
}

export class BillingDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyBillingDetailsPage() {
    await this.page.waitForSelector(billingDetailsLocators.pageHeader, {
      state: "visible",
      timeout: 500000,
    });
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page.locator("h1")).toHaveText(
      "My Order: Billing details"
    );
  }

  async clickPhoneNumberDropdown() {
    await this.page.click(billingDetailsLocators.phoneCountryCodeDropDown);
  }

  async searchPhoneNumberCountry(countryPrefix: string) {
    await this.page.fill(
      billingDetailsLocators.phoneCountryCodeSearch,
      countryPrefix
    );
  }

  async selectPhoneNumberCountry(countryPrefix: string) {
    // Type the search prefix
    await this.page.fill(
      billingDetailsLocators.phoneCountryCodeSearch,
      countryPrefix
    );

    // Look for exact visible match
    const filteredOption = this.page.locator(
      `${billingDetailsLocators.phoneCountryCodeList} >> :text-is("${countryPrefix}")`
    );

    await filteredOption.first().waitFor({ state: "visible", timeout: 5000 });
    await filteredOption.first().click();
  }

  async enterPhoneNumber(phoneNumber: string | number) {
    await this.page.fill(
      billingDetailsLocators.phoneNumberField,
      String(phoneNumber)
    );
  }

  async selectBillingCountry(countryId: string | number) {
    await this.page.selectOption(
      billingDetailsLocators.billingCountry,
      String(countryId) // Coerce number to string
    );
  }

  async clickEnterAddressManuallyBilling() {
    await this.page.click(billingDetailsLocators.enterAddressManually);
  }

  async fillAddressFields(locators: any, address?: Address) {
    if (!address) {
      console.warn("Address object is missing.");
      return;
    }

    const fillIfPresent = async (
      locator: string,
      value: any,
      label: string
    ) => {
      const str = String(value ?? "").trim();
      if (!str) {
        return;
      }

      const isVisible = await this.page.locator(locator).isVisible();

      if (!isVisible) {
        return;
      }

      try {
        await this.page.fill(locator, str);
      } catch (error) {
        throw error; // rethrow so test still fails
      }
    };

    await fillIfPresent(locators.addressLine1Field, address.line1, "line1");
    await fillIfPresent(locators.addressLine2Field, address.line2, "line2");
    await fillIfPresent(locators.addressLine3Field, address.line3, "line3");
    await fillIfPresent(locators.townCityField, address.townCity, "townCity");
    await fillIfPresent(locators.postcodeField, address.postcode, "postcode");
  }

  async enterBillingAddress(address?: Address) {
    if (!address) return;

    await this.clickEnterAddressManuallyBilling();
    await this.page.waitForSelector(billingDetailsLocators.addressLine1Field, {
      state: "visible",
    });
    await this.fillAddressFields(billingDetailsLocators, address);
  }

  async clickEnterAddressManuallyDelivery() {
    await this.page.click(deliveryDetailsLocators.enterAddressManually);
  }

  async enterDeliveryAddress(address?: Address, countryId?: string) {
    if (!address) return;

    if (countryId === "826") {
      await this.clickEnterAddressManuallyDelivery();
      await this.page.waitForSelector(
        deliveryDetailsLocators.addressLine1Field,
        {
          state: "visible",
        }
      );
    }
    await this.fillAddressFields(deliveryDetailsLocators, address);
  }

  async checkSameAsBillingAddress() {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );
    if (!(await checkbox.isChecked())) await checkbox.check();
  }

  async uncheckSameAsBillingAddress() {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );
    if (await checkbox.isChecked()) await checkbox.uncheck();
  }

  async setDeliveryAddress(
    countryId: string,
    sameAsBillingAddress: string,
    deliveryAddress?: Address
  ) {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );

    const isUK = countryId === "826";
    const isSame = sameAsBillingAddress === "YES";

    if (isUK) {
      if (!isSame) {
        if (await checkbox.isChecked()) {
          await checkbox.click(); // triggers proper UI event
        }

        // Wait for manual entry link and click it
        await this.clickEnterAddressManuallyDelivery();

        // Wait until address fields appear
        await this.page.waitForSelector(
          deliveryDetailsLocators.addressLine1Field,
          {
            state: "visible",
            timeout: 5000,
          }
        );

        await this.fillAddressFields(deliveryDetailsLocators, deliveryAddress);
        return;
      }

      if (isSame && !(await checkbox.isChecked())) {
        await checkbox.check();
        return;
      }
    }

    // For non-UK or sameAsBillingAddress NO (but not handled above)
    if (!isUK || sameAsBillingAddress === "NO") {
      // This calls enterDeliveryAddress which also calls clickEnterAddressManuallyDelivery for UK internally
      await this.enterDeliveryAddress(deliveryAddress, countryId);
    }
  }

  async selectDeliveryType(deliveryType: string) {
    if (deliveryType === "FREE") {
      await this.page.click(deliveryDetailsLocators.freeDelivery);
    } else if (deliveryType === "SPECIAL") {
      await this.page.click(deliveryDetailsLocators.specialDelivery);
    } else {
      throw new Error(`Unknown delivery type: ${deliveryType}`);
    }
  }

  async enterBillingDetails(details: BillingDetails) {
    const {
      countryPrefix,
      phoneNumber,
      countryId,
      sameAsBillingAddress,
      billingAddress,
      deliveryAddress,
      fulfilment,
      deliveryType,
    } = details;

    await this.verifyBillingDetailsPage();
    await this.clickPhoneNumberDropdown();
    await this.searchPhoneNumberCountry(countryPrefix);
    await this.selectPhoneNumberCountry(countryPrefix);
    await this.enterPhoneNumber(phoneNumber);
    await this.selectBillingCountry(countryId);
    await this.enterBillingAddress(billingAddress);
    await this.setDeliveryAddress(
      countryId,
      sameAsBillingAddress,
      deliveryAddress
    );

    if (fulfilment === "PLASTIC") {
      await this.selectDeliveryType(deliveryType);
    }

    await this.clickContinue();
  }
}
