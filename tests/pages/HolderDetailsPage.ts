import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { holderDetailsLocators } from "../resources/locators";
import {
  calculateBoundaryDOB,
  BoundaryType,
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
  railcard?: RailcardType; // Add railcard info
  years?: 1 | 3; // Optional years param
  purchaseType?: "BFS" | "BOB";
  email?: string;
}

export function isAgeRelatedRailcard(railcard: string): boolean {
  const ageBasedRailcards = ["1625", "2630", "MATURE", "SENIOR"];
  return ageBasedRailcards.includes(railcard.toUpperCase());
}

export class HolderDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
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
    } = details;

    let finalDobDay = dobDay;
    let finalDobMonth = dobMonth;
    let finalDobYear = dobYear;

    const requiresDOB = railcard ? isAgeRelatedRailcard(railcard) : false;

    // Handle boundary DOBs only if DOB is required
    if (requiresDOB && (dobDay === "lower" || dobDay === "upper") && railcard) {
      const boundaryType = dobDay as "lower" | "upper";

      const calculatedDOB = calculateBoundaryDOB(railcard, boundaryType, years);

      finalDobDay = calculatedDOB.day.toString().padStart(2, "0");
      finalDobMonth = calculatedDOB.month.toString().padStart(2, "0");
      finalDobYear = calculatedDOB.year.toString();
    }

    await this.page.selectOption(holderDetailsLocators.primaryTitle, title);
    await this.page.fill(holderDetailsLocators.primaryFirstName, firstName);
    await this.page.fill(holderDetailsLocators.primaryLastName, lastName);

    if (requiresDOB) {
      await this.page.fill(
        holderDetailsLocators.primaryDOBDay,
        String(finalDobDay)
      );
      await this.page.fill(
        holderDetailsLocators.primaryDOBMonth,
        String(finalDobMonth)
      );
      await this.page.fill(
        holderDetailsLocators.primaryDOBYear,
        String(finalDobYear)
      );
    }

    await this.page.fill(
      holderDetailsLocators.primaryPhoneNumber,
      String(phoneNumber)
    );

    if (purchaseType === "BOB" && email) {
      await this.page.fill(holderDetailsLocators.primaryEmail, email);
    }

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
