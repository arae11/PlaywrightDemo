import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import {
  calculateBoundaryDOB,
  RailcardType,
} from "../utils/ageBoundaryHelper";

interface HolderDetailsInput {
  title: string;
  firstName: string;
  lastName: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  phoneNumber: string;
  brailleSticker?: string;
  railcard?: RailcardType;
  years?: 1 | 3;
  purchaseType?: "BFS" | "BOB";
  email?: string;
  fulfilment: string;
}

interface SecondaryDetailsInput {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  addSecondary?: string;
}

function isAgeRelatedRailcard(railcard: string): boolean {
  const ageBasedRailcards = ["1625", "2630", "MATURE", "SENIOR"];
  return ageBasedRailcards.includes(railcard.toUpperCase());
}

export class HolderDetailsPage extends BasePage {
  // Primary Holder Locators
  readonly primaryTitle: Locator;
  readonly primaryFirstName: Locator;
  readonly primaryLastName: Locator;
  readonly primaryDOBDay: Locator;
  readonly primaryDOBMonth: Locator;
  readonly primaryDOBYear: Locator;
  readonly primaryPhoneNumber: Locator;
  readonly primaryBrailleSticker: Locator;
  readonly primaryEmail: Locator;
  readonly singleEmail: Locator;

  // Secondary Holder Locators
  readonly secondaryCheckbox: Locator;
  readonly secondaryTitle: Locator;
  readonly secondaryFirstName: Locator;
  readonly secondaryLastName: Locator;
  readonly secondaryEmail: Locator;
  readonly secondaryPermission: Locator;

  constructor(page: Page) {
    super(page);

    // Primary Holder
    this.primaryTitle = page.locator('#title');
    this.primaryFirstName = page.locator('#first-name');
    this.primaryLastName = page.locator('#last-name');
    this.primaryDOBDay = page.locator('#txtdob-day');
    this.primaryDOBMonth = page.locator('#txtdob-month');
    this.primaryDOBYear = page.locator('#txtdob-year');
    this.primaryPhoneNumber = page.locator('#phone-number');
    this.primaryBrailleSticker = page.locator('#braille-sticker');
    this.primaryEmail = page.locator('input[name="mainHolderEmail"]');
    this.singleEmail = page.locator('#email');

    // Secondary Holder
    this.secondaryCheckbox = page.locator('#agree-to-additional-card-holder');
    this.secondaryTitle = page.locator('#title-secondary');
    this.secondaryFirstName = page.locator('#first-name-secondary');
    this.secondaryLastName = page.locator('#last-name-secondary');
    this.secondaryEmail = page.locator('input[name="secondaryHolderEmail"]');
    this.secondaryPermission = page.locator('#agree-to-permission-of-secondary-cardholder');
  }

  async fillPrimaryHolderDetails(details: HolderDetailsInput) {
    const {
      title,
      firstName,
      lastName,
      dobDay,
      dobMonth,
      dobYear,
      phoneNumber,
      brailleSticker,
      railcard,
      years = 1,
      purchaseType,
      email,
      fulfilment,
    } = details;

    let finalDobDay = dobDay;
    let finalDobMonth = dobMonth;
    let finalDobYear = dobYear;

    const requiresDOB = railcard ? isAgeRelatedRailcard(railcard) : false;

    if (requiresDOB && (dobDay === "lower" || dobDay === "upper") && railcard) {
      const calculatedDOB = calculateBoundaryDOB(railcard, dobDay as "lower" | "upper", years);
      finalDobDay = calculatedDOB.day.toString().padStart(2, "0");
      finalDobMonth = calculatedDOB.month.toString().padStart(2, "0");
      finalDobYear = calculatedDOB.year.toString();
    }

    await this.primaryTitle.selectOption(title);
    await this.primaryFirstName.fill(firstName);
    await this.primaryLastName.fill(lastName);

    if (requiresDOB) {
      await this.primaryDOBDay.fill(finalDobDay);
      await this.primaryDOBMonth.fill(finalDobMonth);
      await this.primaryDOBYear.fill(finalDobYear);
    }

    await this.primaryPhoneNumber.fill(phoneNumber);

    if (purchaseType === "BOB" && email && railcard !== "FAMILYANDFRIENDS") {
      await this.singleEmail.fill(email);
    }

    if (purchaseType === "BOB" && email && railcard === "FAMILYANDFRIENDS") {
      await this.primaryEmail.fill(email);
    }

    if (brailleSticker === "YES" && fulfilment === "PLASTIC") {
      await this.primaryBrailleSticker.waitFor({ state: "visible", timeout: 10000 });
      await this.primaryBrailleSticker.check();
    }
  }

  async checkSecondaryBox() {
    await this.secondaryCheckbox.check();
  }

  async checkPermissionBox() {
    await this.secondaryPermission.check();
  }

  async fillSecondaryHolderDetails(details: SecondaryDetailsInput) {
    const { title, firstName, lastName, email, addSecondary } = details;

    const checkboxVisible = await this.secondaryCheckbox.isVisible();

    if (checkboxVisible && addSecondary === "YES") {
      await this.secondaryCheckbox.check();
    }

    const emailFieldVisible = await this.secondaryEmail.isVisible();
    if (emailFieldVisible) {
      await this.secondaryTitle.selectOption(title);
      await this.secondaryFirstName.fill(firstName);
      await this.secondaryLastName.fill(lastName);
      await this.secondaryEmail.fill(email);
      await this.checkPermissionBox();
    } else {
      console.warn("Secondary fields not visible — skipping fill.");
    }
  }
}
