import { Page, expect, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

// Address interfaces stay as is
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
  // Declare Billing locators
  readonly pageHeader: Locator;
  readonly phoneCountryCodeDropDown: Locator;
  readonly phoneCountryCodeSearch: Locator;
  readonly phoneCountryCodeList: Locator;
  readonly phoneNumberField: Locator;
  readonly billingCountry: Locator;
  readonly enterAddressManuallyBilling: Locator;
  readonly billingAddressLine1: Locator;
  readonly billingAddressLine2: Locator;
  readonly billingAddressLine3: Locator;
  readonly billingTownCity: Locator;
  readonly billingPostcode: Locator;

  // Declare Delivery locators
  readonly sameAsBillingCheckbox: Locator;
  readonly enterAddressManuallyDelivery: Locator;
  readonly deliveryAddressLine1: Locator;
  readonly deliveryAddressLine2: Locator;
  readonly deliveryAddressLine3: Locator;
  readonly deliveryTownCity: Locator;
  readonly deliveryPostcode: Locator;
  readonly freeDelivery: Locator;
  readonly specialDelivery: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize Billing locators
    this.pageHeader = page.locator("h1:has-text('Billing details')");
    this.phoneCountryCodeDropDown = page.locator("#phoneCountryCode");
    this.phoneCountryCodeSearch = page.locator("#phoneCountryCodeSearch");
    this.phoneCountryCodeList = page.locator("#phoneCountryCode-listbox");
    this.phoneNumberField = page.locator("#phoneNumber");
    this.billingCountry = page.locator("#billingAddressCountryId");
    this.enterAddressManuallyBilling = page.locator("#billing-enter-address-manually");
    this.billingAddressLine1 = page.locator("#billingAddressLine1");
    this.billingAddressLine2 = page.locator("#billingAddressLine2");
    this.billingAddressLine3 = page.locator("#billingAddressLine3");
    this.billingTownCity = page.locator("#billingAddressTownCity");
    this.billingPostcode = page.locator("#billingAddressPostcode");

    // Initialize Delivery locators
    this.sameAsBillingCheckbox = page.locator("#sameAsBillingAddress");
    this.enterAddressManuallyDelivery = page.locator("#delivery-enter-address-manually");
    this.deliveryAddressLine1 = page.locator("#deliveryAddressLine1");
    this.deliveryAddressLine2 = page.locator("#deliveryAddressLine2");
    this.deliveryAddressLine3 = page.locator("#deliveryAddressLine3");
    this.deliveryTownCity = page.locator("#deliveryAddressTownCity");
    this.deliveryPostcode = page.locator("#deliveryAddressPostcode");
    this.freeDelivery = page.locator("#freeDelivery");
    this.specialDelivery = page.locator("#specialDelivery");
  }

  async verifyBillingDetailsPage() {
    await this.pageHeader.waitFor({ state: "visible", timeout: 50000 });
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.pageHeader).toHaveText("My Order: Billing details");
  }

  async clickPhoneNumberDropdown() {
    await this.phoneCountryCodeDropDown.click();
  }

  async searchPhoneNumberCountry(countryPrefix: string) {
    await this.phoneCountryCodeSearch.fill(countryPrefix);
  }

  async selectPhoneNumberCountry(countryPrefix: string) {
    await this.phoneCountryCodeSearch.fill(countryPrefix);
    const filteredOption = this.phoneCountryCodeList.locator(`:text-is("${countryPrefix}")`);
    await filteredOption.first().waitFor({ state: "visible", timeout: 5000 });
    await filteredOption.first().click();
  }

  async enterPhoneNumber(phoneNumber: string | number) {
    await this.phoneNumberField.fill(String(phoneNumber));
  }

  async selectBillingCountry(countryId: string | number) {
    await this.billingCountry.selectOption(String(countryId));
  }

  async clickEnterAddressManuallyBilling() {
    await this.enterAddressManuallyBilling.click();
  }

  private async fillAddressFields(
    addressLocators: {
      addressLine1: Locator;
      addressLine2: Locator;
      addressLine3: Locator;
      townCity: Locator;
      postcode: Locator;
    },
    address?: Address
  ) {
    if (!address) return;

    const fillIfPresent = async (locator: Locator, value?: string) => {
      if (value?.trim()) {
        await locator.fill(value.trim());
      }
    };

    await fillIfPresent(addressLocators.addressLine1, address.line1);
    await fillIfPresent(addressLocators.addressLine2, address.line2);
    await fillIfPresent(addressLocators.addressLine3, address.line3);
    await fillIfPresent(addressLocators.townCity, address.townCity);
    await fillIfPresent(addressLocators.postcode, address.postcode);
  }

  async enterBillingAddress(address?: Address) {
    if (!address) return;
    await this.clickEnterAddressManuallyBilling();
    await this.billingAddressLine1.waitFor({ state: "visible" });
    await this.fillAddressFields(
      {
        addressLine1: this.billingAddressLine1,
        addressLine2: this.billingAddressLine2,
        addressLine3: this.billingAddressLine3,
        townCity: this.billingTownCity,
        postcode: this.billingPostcode,
      },
      address
    );
  }

  async clickEnterAddressManuallyDelivery() {
    await this.enterAddressManuallyDelivery.click();
  }

  async enterDeliveryAddress(address?: Address, countryId?: string) {
    if (!address) return;

    if (countryId === "826") {
      await this.clickEnterAddressManuallyDelivery();
      await this.deliveryAddressLine1.waitFor({ state: "visible" });
    }
    await this.fillAddressFields(
      {
        addressLine1: this.deliveryAddressLine1,
        addressLine2: this.deliveryAddressLine2,
        addressLine3: this.deliveryAddressLine3,
        townCity: this.deliveryTownCity,
        postcode: this.deliveryPostcode,
      },
      address
    );
  }

  async checkSameAsBillingAddress() {
    if (!(await this.sameAsBillingCheckbox.isChecked())) {
      await this.sameAsBillingCheckbox.check();
    }
  }

  async uncheckSameAsBillingAddress() {
    if (await this.sameAsBillingCheckbox.isChecked()) {
      await this.sameAsBillingCheckbox.uncheck();
    }
  }

  async setDeliveryAddress(countryId: string, sameAsBillingAddress: string, deliveryAddress?: Address) {
    const isUK = countryId === "826";
    const isSame = sameAsBillingAddress === "YES";

    if (isUK) {
      if (!isSame) {
        await this.uncheckSameAsBillingAddress();
        await this.clickEnterAddressManuallyDelivery();
        await this.deliveryAddressLine1.waitFor({ state: "visible", timeout: 5000 });
        await this.enterDeliveryAddress(deliveryAddress, countryId);
      } else {
        await this.checkSameAsBillingAddress();
      }
    } else {
      await this.enterDeliveryAddress(deliveryAddress, countryId);
    }
  }

  async selectDeliveryType(deliveryType: string) {
    if (deliveryType === "FREE") {
      await this.freeDelivery.click();
    } else if (deliveryType === "SPECIAL") {
      await this.specialDelivery.click();
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
    await this.setDeliveryAddress(countryId, sameAsBillingAddress, deliveryAddress);

    if (fulfilment === "PLASTIC") {
      await this.selectDeliveryType(deliveryType);
    }

    await this.clickContinue();
  }
}
