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
    DeliveryAddressPostcode?: string,
    countryId?: string
  ) {
    console.log("Filling delivery address fields...");
    console.log(`Country ID for delivery: ${countryId}`);

    // Only click "Enter address manually" for UK (826)
    if (countryId === "826") {
      console.log("Country is UK - clicking 'Enter address manually'.");
      await this.clickEnterAddressManuallyDelivery();
      await this.page.waitForSelector(
        deliveryDetailsLocators.addressLine1Field,
        {
          state: "visible",
        }
      );
    }

    if (DeliveryAddressLine1?.trim()) {
      console.log(`Line 1: ${DeliveryAddressLine1}`);
      await this.enterDeliveryAddressLine1(DeliveryAddressLine1);
    }
    if (DeliveryAddressLine2?.trim()) {
      console.log(`Line 2: ${DeliveryAddressLine2}`);
      await this.enterDeliveryAddressLine2(DeliveryAddressLine2);
    }
    if (DeliveryAddressLine3?.trim()) {
      console.log(`Line 3: ${DeliveryAddressLine3}`);
      await this.enterDeliveryAddressLine3(DeliveryAddressLine3);
    }
    if (DeliveryAddressTownCity?.trim()) {
      console.log(`Town/City: ${DeliveryAddressTownCity}`);
      await this.enterDeliveryAddressTownCity(DeliveryAddressTownCity);
    }
    if (DeliveryAddressPostcode?.trim()) {
      console.log(`Postcode: ${DeliveryAddressPostcode}`);
      await this.enterDeliveryAddressPostcode(DeliveryAddressPostcode);
    }
  }

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

    console.log(`Country ID: ${countryId}`);
    console.log(`Same As Billing Address: ${sameAsBillingAddress}`);
    console.log("Delivery Address:", deliveryAddress);

    if (countryId === "826") {
      console.log("Country is UK.");

      if (sameAsBillingAddress === "NO") {
        console.log("Same as billing is NO - clicking checkbox (uncheck).");
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }

        console.log("Clicking 'Enter Address Manually'...");
        await this.clickEnterAddressManuallyDelivery();
      }

      if (sameAsBillingAddress === "YES") {
        console.log("Same as billing is YES - making sure it's checked.");
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }
      }
    }

    if (countryId !== "826" || sameAsBillingAddress === "NO") {
      console.log("Entering delivery address...");
      if (deliveryAddress) {
        await this.enterDeliveryAddress(
          deliveryAddress.line1,
          deliveryAddress.line2,
          deliveryAddress.line3,
          deliveryAddress.townCity,
          deliveryAddress.postcode,
          countryId
        );
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
