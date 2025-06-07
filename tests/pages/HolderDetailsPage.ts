import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { holderDetailsLocators } from "../resources/locators";

export class HolderDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillPrimaryHolderDetails(details: {
    title: string;
    firstName: string;
    lastName: string;
    dobDay: string;
    dobMonth: string;
    dobYear: string;
    phoneNumber: string;
    brailleSticker?: string;
  }) {
    const {
      title,
      firstName,
      lastName,
      dobDay,
      dobMonth,
      dobYear,
      phoneNumber,
      brailleSticker,
    } = details;

    await this.page.selectOption(holderDetailsLocators.primaryTitle, title);
    await this.page.fill(holderDetailsLocators.primaryFirstName, firstName);
    await this.page.fill(holderDetailsLocators.primaryLastName, lastName);
    await this.page.fill(holderDetailsLocators.primaryDOBDay, dobDay);
    await this.page.fill(holderDetailsLocators.primaryDOBMonth, dobMonth);
    await this.page.fill(holderDetailsLocators.primaryDOBYear, dobYear);
    await this.page.fill(holderDetailsLocators.primaryPhoneNumber, phoneNumber);

    if (brailleSticker && brailleSticker.trim() !== "") {
      await this.page.check(holderDetailsLocators.primaryBrailleSticker);
    }

    await this.clickContinue();
  }

  async fillSecondaryHolderDetails(details: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    const { title, firstName, lastName, email } = details;

    await this.page.check(holderDetailsLocators.secondaryCheckbox);
    await this.page.selectOption(holderDetailsLocators.secondaryTitle, title);
    await this.page.fill(holderDetailsLocators.secondaryFirstName, firstName);
    await this.page.fill(holderDetailsLocators.secondaryLastName, lastName);
    await this.page.fill(holderDetailsLocators.secondaryEmail, email);
    await this.page.check(holderDetailsLocators.secondaryPermission);
  }
}
