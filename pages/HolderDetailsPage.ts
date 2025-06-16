import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { calculateBoundaryDOB, RailcardType } from "../utils/ageBoundaryHelper";
import {
  isDualCardholderRailcard,
  isAgeRelatedRailcard,
  normalizeDOB,
} from "../utils/railcardHelper";

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
    this.primaryTitle = page.locator("#title");
    this.primaryFirstName = page.locator("#first-name");
    this.primaryLastName = page.locator("#last-name");
    this.primaryDOBDay = page.locator("#txtdob-day");
    this.primaryDOBMonth = page.locator("#txtdob-month");
    this.primaryDOBYear = page.locator("#txtdob-year");
    this.primaryPhoneNumber = page.locator("#phone-number");
    this.primaryBrailleSticker = page.locator("#braille-sticker");
    this.primaryEmail = page.locator('input[name="mainHolderEmail"]');
    //this.singleEmail = page.locator('#email');
    this.singleEmail = page.locator('input[name="personEmail"]');

    // Secondary Holder
    this.secondaryCheckbox = page.locator("#agree-to-additional-card-holder");
    this.secondaryTitle = page.locator("#title-secondary");
    this.secondaryFirstName = page.locator("#first-name-secondary");
    this.secondaryLastName = page.locator("#last-name-secondary");
    this.secondaryEmail = page.locator('input[name="secondaryHolderEmail"]');
    this.secondaryPermission = page.locator(
      "#agree-to-permission-of-secondary-cardholder"
    );
  }

  async enterDOBDay(DobDay: string) {
    await this.primaryDOBDay.fill(DobDay);
  }

  async enterDOBMonth(DobMonth: string) {
    await this.primaryDOBMonth.fill(DobMonth);
  }

  async enterDOBYear(DobYear: string) {
    await this.primaryDOBYear.fill(DobYear);
  }

  async selectPrimaryTitle(title: string) {
    await this.primaryTitle.selectOption(title);
  }

  async enterPrimaryFirstName(firstName: string) {
    await this.primaryFirstName.fill(firstName);
  }

  async enterPrimaryLastName(lastName: string) {
    await this.primaryLastName.fill(lastName);
  }

  async enterPrimaryEmail(email: string) {
    await this.primaryEmail.fill(email);
  }

  async enterSingleEmail(email: string) {
    await this.singleEmail.fill(email);
  }

  async enterPhoneNumber(phoneNumber: string) {
    await this.primaryPhoneNumber.fill(String(phoneNumber));
  }

  async selectSecondaryTitle(title: string) {
    await this.secondaryTitle.selectOption(title);
  }

  async enterSecondaryFirstName(firstName: string) {
    await this.secondaryFirstName.fill(firstName);
  }

  async enterSecondaryLastName(lastName: string) {
    await this.secondaryLastName.fill(lastName);
  }

  async enterSecondaryEmail(email: string) {
    await this.secondaryEmail.fill(email);
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

    let finalDobDay: string = String(dobDay);
    let finalDobMonth: string = String(dobMonth);
    let finalDobYear: string = String(dobYear);

    const requiresDOB = railcard ? isAgeRelatedRailcard(railcard) : false;

    if (requiresDOB) {
      if ((dobDay === "lower" || dobDay === "upper") && railcard) {
        const calculatedDOB = calculateBoundaryDOB(
          railcard,
          dobDay as "lower" | "upper",
          years
        );
        finalDobDay = String(calculatedDOB.day).padStart(2, "0");
        finalDobMonth = String(calculatedDOB.month).padStart(2, "0");
        finalDobYear = String(calculatedDOB.year);
      }

      const { day, month, year } = normalizeDOB(
        finalDobDay,
        finalDobMonth,
        finalDobYear
      );

      await this.enterDOBDay(day);
      await this.enterDOBMonth(month);
      await this.enterDOBYear(year);
    }

    await this.selectPrimaryTitle(title);
    await this.enterPrimaryFirstName(firstName);
    await this.enterPrimaryLastName(lastName);

    await this.enterPhoneNumber(String(phoneNumber));

    if (purchaseType === "BOB" && email) {
      if (isDualCardholderRailcard(railcard)) {
        await this.enterPrimaryEmail(email);
      } else {
        await this.enterSingleEmail(email);
      }
    }

    if (brailleSticker === "YES" && fulfilment === "PLASTIC") {
      await this.primaryBrailleSticker.waitFor({
        state: "visible",
        timeout: 10000,
      });
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
      await this.checkSecondaryBox();
    }

    const emailFieldVisible = await this.secondaryEmail.isVisible();
    if (emailFieldVisible) {
      await this.selectSecondaryTitle(title);
      await this.enterSecondaryFirstName(firstName);
      await this.enterSecondaryLastName(lastName);
      await this.enterSecondaryEmail(email);
      await this.checkPermissionBox();
    } else {
      console.warn("Secondary fields not visible — skipping fill.");
    }
  }
}
