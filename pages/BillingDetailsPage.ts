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
  readonly emailField: Locator;
  readonly phoneCountryCodeDropDown: Locator;
  readonly phoneCountryCodeSearch: Locator;
  readonly phoneCountryCodeList: Locator;
  readonly phoneNumberField: Locator;
  readonly billingCountry: Locator;
  readonly postcodeLookupBilling: Locator;
  readonly enterAddressManuallyBilling: Locator;
  readonly billingAddressLine1: Locator;
  readonly billingAddressLine2: Locator;
  readonly billingAddressLine3: Locator;
  readonly billingTownCity: Locator;
  readonly billingPostcode: Locator;

  // Declare Delivery locators
  readonly sameAsBillingCheckbox: Locator;
  readonly postcodeLookupDelivery: Locator;
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
    (this.emailField = page.locator("#email")),
      (this.phoneCountryCodeDropDown = page.locator(
        "xpath=//button[@aria-label='Selected country']"
      ));
    this.phoneCountryCodeSearch = page.locator(
      "xpath=//input[@aria-label='Search']"
    );
    this.phoneCountryCodeList = page.locator(
      "xpath=//ul[@aria-label='List of countries']"
    );
    this.phoneNumberField = page.locator("xpath=//input[@type='tel']");
    this.billingCountry = page.locator("#country_id");
    this.postcodeLookupBilling = page.locator("#billing-postcodeInput");
    this.enterAddressManuallyBilling = page.locator(
      'xpath=//a[contains(text(),"Enter address manually")]'
    );
    this.billingAddressLine1 = page.locator("#billing-addressLine1");
    this.billingAddressLine2 = page.locator("#billing-addressLine2");
    this.billingAddressLine3 = page.locator("#billing-addressLine3");
    this.billingTownCity = page.locator("#billing-townCity");
    this.billingPostcode = page.locator("#billing-postcode");

    // Initialize Delivery locators
    this.sameAsBillingCheckbox = page.locator("#deliveryAddressSameAsBilling");
    this.postcodeLookupDelivery = page.locator("#delivery-postcodeInput");
    this.enterAddressManuallyDelivery = page.locator(
      'xpath=//a[contains(text(),"Enter address manually")]'
    );
    this.deliveryAddressLine1 = page.locator("#delivery-addressLine1");
    this.deliveryAddressLine2 = page.locator("#delivery-addressLine2");
    this.deliveryAddressLine3 = page.locator("#delivery-addressLine3");
    this.deliveryTownCity = page.locator("#delivery-townCity");
    this.deliveryPostcode = page.locator("#delivery-postcode");
    this.freeDelivery = page.locator(
      "xpath=//span[contains(text(),'Standard Delivery')]"
    );
    this.specialDelivery = page.locator(
      "xpath=//span[contains(text(),'Special Delivery')]"
    );
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
    const filteredOption = this.phoneCountryCodeList.locator(
      `:text-is("${countryPrefix}")`
    );
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

    const fillIfPresent = async (locator: Locator, value?: string | number) => {
      if (value !== undefined && value !== null) {
        const textValue = String(value).trim();
        if (textValue) {
          await locator.fill(textValue);
        }
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

  // async checkSameAsBillingAddress() {
  //   if (!(await this.sameAsBillingCheckbox.isChecked())) {
  //     await this.sameAsBillingCheckbox.check();
  //   }
  // }

  // async uncheckSameAsBillingAddress() {
  //   if (await this.sameAsBillingCheckbox.isChecked()) {
  //     await this.sameAsBillingCheckbox.uncheck();
  //   }
  // }

  // async isManualAddressEntryVisible(): Promise<boolean> {
  //   try {
  //     await this.deliveryAddressLine1.waitFor({
  //       state: "visible",
  //       timeout: 1000,
  //     });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }

  // async clickIfVisible(locator: Locator) {
  //   if (await locator.isVisible()) {
  //     await locator.click();
  //   }
  // }

  async clickSameAsBillingAddressCheckbox() {
    await this.sameAsBillingCheckbox.click();
  }

  async setDeliveryAddress(
    countryId: string,
    sameAsBillingAddress: string,
    deliveryAddress?: Address
  ) {
    console.log(
      `setDeliveryAddress called with countryId=${countryId}, sameAsBillingAddress=${sameAsBillingAddress}`
    );

    const isUK = countryId.toString() === "826";
    const isSame = sameAsBillingAddress.toUpperCase() === "YES";

    console.log(`isUK: ${isUK}, isSame: ${isSame}`);

    // Check if Enter Address Manually Delivery button is visible
    if (await this.enterAddressManuallyDelivery.isVisible()) {
      console.log(
        "Clicking 'Enter Address Manually Delivery' as button is visible"
      );
      await this.clickEnterAddressManuallyDelivery();
    }

    if (isUK && !isSame) {
      console.log(
        "UK and not same as billing - clicking Same As Billing Address checkbox"
      );
      await this.clickSameAsBillingAddressCheckbox();
      await this.clickEnterAddressManuallyDelivery();
    }

    if (!isUK || !isSame) {
      console.log("Entering delivery address");
      await this.enterDeliveryAddress(deliveryAddress, countryId);
      console.log("Delivery address entered");
    } else {
      console.log("No delivery address entry needed");
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

  async setAddresses(
    countryId: string,
    sameAsBillingAddress: string,
    billingAddress?: Address,
    deliveryAddress?: Address
  ) {
    const isUK = countryId === "826";
    const isSame = sameAsBillingAddress === "YES";

    if (isUK) {
      // Billing address - always enter manually if needed
      await this.clickIfVisible(this.enterAddressManuallyBilling);
      await this.billingAddressLine1.waitFor({ state: "visible" });
      await this.fillAddressFields(
        {
          addressLine1: this.billingAddressLine1,
          addressLine2: this.billingAddressLine2,
          addressLine3: this.billingAddressLine3,
          townCity: this.billingTownCity,
          postcode: this.billingPostcode,
        },
        billingAddress
      );

      if (isSame) {
        await this.checkSameAsBillingAddress();
      } else {
        await this.uncheckSameAsBillingAddress();

        // Delivery address - click enter manually if needed
        await this.clickIfVisible(this.enterAddressManuallyDelivery);
        await this.deliveryAddressLine1.waitFor({ state: "visible" });
        await this.fillAddressFields(
          {
            addressLine1: this.deliveryAddressLine1,
            addressLine2: this.deliveryAddressLine2,
            addressLine3: this.deliveryAddressLine3,
            townCity: this.deliveryTownCity,
            postcode: this.deliveryPostcode,
          },
          deliveryAddress
        );
      }
    } else {
      // Non-UK flow
      await this.fillAddressFields(
        {
          addressLine1: this.billingAddressLine1,
          addressLine2: this.billingAddressLine2,
          addressLine3: this.billingAddressLine3,
          townCity: this.billingTownCity,
          postcode: this.billingPostcode,
        },
        billingAddress
      );

      // Delivery address - click enter manually if visible
      await this.clickIfVisible(this.enterAddressManuallyDelivery);
      await this.deliveryAddressLine1.waitFor({ state: "visible" });
      await this.fillAddressFields(
        {
          addressLine1: this.deliveryAddressLine1,
          addressLine2: this.deliveryAddressLine2,
          addressLine3: this.deliveryAddressLine3,
          townCity: this.deliveryTownCity,
          postcode: this.deliveryPostcode,
        },
        deliveryAddress
      );
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
    await this.page.waitForTimeout(500);

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
