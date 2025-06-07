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
}

export class BillingDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyBillingDetailsPage() {
    await this.page.waitForSelector(billingDetailsLocators.pageHeader);
    await expect(this.page.locator("h1")).toHaveText(
      "My Order: Billing details"
    );
  }

  async clickPhoneNumberDropdown() {
    await this.page.click(billingDetailsLocators.phoneCountryCodeDropDown);
  }

  async searchPhoneNumberCountry(CountryPrefix: string) {
    await this.page.fill(
      billingDetailsLocators.phoneCountryCodeSearch,
      CountryPrefix
    );
  }

  async selectPhoneNumberCountry() {
    const firstOption = this.page
      .locator(billingDetailsLocators.phoneCountryCodeList)
      .first();
    await firstOption.click();
  }

  async enterPhoneNumber(PhoneNumber: string) {
    await this.page.fill(billingDetailsLocators.phoneNumberField, PhoneNumber);
  }

  async selectBillingCountry(CountryId: string) {
    await this.page.selectOption(
      billingDetailsLocators.billingCountry,
      CountryId
    );
  }

  async clickEnterAddressManuallyBilling() {
    await this.page.click(billingDetailsLocators.enterAddressManually);
  }

  async enterBillingAddressLine1(BillingAddressLine1: string) {
    await this.page.fill(
      billingDetailsLocators.addressLine1Field,
      BillingAddressLine1
    );
  }

  async enterBillingAddressLine2(BillingAddressLine2: string) {
    await this.page.fill(
      billingDetailsLocators.addressLine2Field,
      BillingAddressLine2
    );
  }

  async enterBillingAddressLine3(BillingAddressLine3: string) {
    await this.page.fill(
      billingDetailsLocators.addressLine3Field,
      BillingAddressLine3
    );
  }

  async enterBillingAddressTownCity(BillingAddressTownCity: string) {
    await this.page.fill(
      billingDetailsLocators.townCityField,
      BillingAddressTownCity
    );
  }

  async enterBillingAddressPostcode(BillingAddressPostcode: string) {
    await this.page.fill(
      billingDetailsLocators.postcodeField,
      BillingAddressPostcode
    );
  }

  async enterBillingAddress(
    BillingAddressLine1?: string,
    BillingAddressLine2?: string,
    BillingAddressLine3?: string,
    BillingAddressTownCity?: string,
    BillingAddressPostcode?: string
  ) {
    await this.clickEnterAddressManuallyBilling();
    await this.page.waitForSelector(billingDetailsLocators.addressLine1Field, {
      state: "visible",
    });

    if (BillingAddressLine1?.trim()) {
      await this.enterBillingAddressLine1(BillingAddressLine1);
    }

    if (BillingAddressLine2?.trim()) {
      await this.enterBillingAddressLine2(BillingAddressLine2);
    }

    if (BillingAddressLine3?.trim()) {
      await this.enterBillingAddressLine3(BillingAddressLine3);
    }

    if (BillingAddressTownCity?.trim()) {
      await this.enterBillingAddressTownCity(BillingAddressTownCity);
    }

    if (BillingAddressPostcode?.trim()) {
      await this.enterBillingAddressPostcode(BillingAddressPostcode);
    }
  }

  // async uncheckSameAsBillingAddress() {
  //   const checkbox = this.page.locator(
  //     deliveryDetailsLocators.sameAsBillingCheckbox
  //   );
  //   if (await checkbox.isChecked()) {
  //     await checkbox.uncheck();
  //   }
  // }

  // async uncheckSameAsBillingAddress() {
  //   const checkbox = this.page.locator(
  //     deliveryDetailsLocators.sameAsBillingCheckbox
  //   );

  //   await checkbox.waitFor({ state: "visible" });

  //   const isChecked = await checkbox.isChecked();
  //   console.log("Before uncheck - isChecked:", isChecked);

  //   if (isChecked) {
  //     await checkbox.uncheck();
  //     console.log("Checkbox was checked, now attempting to uncheck...");
  //   } else {
  //     console.log("Checkbox already unchecked.");
  //   }

  //   // Final verification
  //   const finalState = await checkbox.isChecked();
  //   console.log("After uncheck - isChecked:", finalState);
  //   expect(finalState).toBe(false);
  // }

  async clickEnterAddressManuallyDelivery() {
    await this.page.click(deliveryDetailsLocators.enterAddressManually);
  }

  async enterDeliveryAddressLine1(DeliveryAddressLine1: string) {
    await this.page.fill(
      deliveryDetailsLocators.addressLine1Field,
      DeliveryAddressLine1
    );
  }

  async enterDeliveryAddressLine2(DeliveryAddressLine2: string) {
    await this.page.fill(
      deliveryDetailsLocators.addressLine2Field,
      DeliveryAddressLine2
    );
  }

  async enterDeliveryAddressLine3(DeliveryAddressLine3: string) {
    await this.page.fill(
      deliveryDetailsLocators.addressLine3Field,
      DeliveryAddressLine3
    );
  }

  async enterDeliveryAddressTownCity(DeliveryAddressTownCity: string) {
    await this.page.fill(
      deliveryDetailsLocators.townCityField,
      DeliveryAddressTownCity
    );
  }

  async enterDeliveryAddressPostcode(DeliveryAddressPostcode: string) {
    await this.page.fill(
      deliveryDetailsLocators.postcodeField,
      DeliveryAddressPostcode
    );
  }

  async enterDeliveryAddress(
    DeliveryAddressLine1?: string,
    DeliveryAddressLine2?: string,
    DeliveryAddressLine3?: string,
    DeliveryAddressTownCity?: string,
    DeliveryAddressPostcode?: string
  ) {
    await this.clickEnterAddressManuallyDelivery();
    await this.page.waitForSelector(deliveryDetailsLocators.addressLine1Field, {
      state: "visible",
    });

    if (DeliveryAddressLine1?.trim()) {
      await this.enterDeliveryAddressLine1(DeliveryAddressLine1);
    }

    if (DeliveryAddressLine2?.trim()) {
      await this.enterDeliveryAddressLine2(DeliveryAddressLine2);
    }

    if (DeliveryAddressLine3?.trim()) {
      await this.enterDeliveryAddressLine3(DeliveryAddressLine3);
    }

    if (DeliveryAddressTownCity?.trim()) {
      await this.enterDeliveryAddressTownCity(DeliveryAddressTownCity);
    }

    if (DeliveryAddressPostcode?.trim()) {
      await this.enterDeliveryAddressPostcode(DeliveryAddressPostcode);
    }
  }

  // async setSameAsBillingAddressIfRequired(
  //   CountryId: string,
  //   SameAsBillingAddress: string,
  //   DeliveryAddressLine1?: string,
  //   DeliveryAddressLine2?: string,
  //   DeliveryAddressLine3?: string,
  //   DeliveryAddressTownCity?: string,
  //   DeliveryAddressPostcode?: string
  // ) {
  //   if (CountryId === "826" && SameAsBillingAddress === "NO") {
  //     await this.uncheckSameAsBillingAddress();
  //     await this.enterDeliveryAddress(
  //       DeliveryAddressLine1,
  //       DeliveryAddressLine2,
  //       DeliveryAddressLine3,
  //       DeliveryAddressTownCity,
  //       DeliveryAddressPostcode
  //     );
  //   }
  // }

  async checkSameAsBillingAddress() {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  async uncheckSameAsBillingAddress() {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );
    if (await checkbox.isChecked()) {
      await checkbox.uncheck();
    }
  }

  async setSameAsBillingAddressIfRequired(
    countryId: string,
    sameAsBillingAddress: string,
    deliveryAddress?: {
      line1?: string;
      line2?: string;
      line3?: string;
      townCity?: string;
      postcode?: string;
    }
  ) {
    const checkbox = this.page.locator(
      deliveryDetailsLocators.sameAsBillingCheckbox
    );

    if (countryId === "826") {
      if (sameAsBillingAddress === "NO" && deliveryAddress) {
        if (await checkbox.isChecked()) {
          await checkbox.uncheck();
        }

        await this.enterDeliveryAddress(
          deliveryAddress.line1,
          deliveryAddress.line2,
          deliveryAddress.line3,
          deliveryAddress.townCity,
          deliveryAddress.postcode
        );
      } else if (sameAsBillingAddress === "YES") {
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }
      }
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
    } = details;

    await this.verifyBillingDetailsPage();
    await this.clickPhoneNumberDropdown();
    await this.searchPhoneNumberCountry(countryPrefix);
    await this.selectPhoneNumberCountry();
    await this.enterPhoneNumber(phoneNumber);
    await this.selectBillingCountry(countryId);
    await this.enterBillingAddress(
      billingAddress.line1,
      billingAddress.line2,
      billingAddress.line3,
      billingAddress.townCity,
      billingAddress.postcode
    );

    await this.setSameAsBillingAddressIfRequired(
      countryId,
      sameAsBillingAddress,
      deliveryAddress
    );

    await this.clickContinue();
  }
}
