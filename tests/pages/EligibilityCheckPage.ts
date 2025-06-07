import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { eligibilityLocators } from '../resources/locators';

export class SelectEligibilityPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async verifyEligibilityCheckPage() {
        await expect(this.page.locator(eligibilityLocators.checkPageHeader))
            .toContainText("Select an eligibility check method");
    }

    async selectPassport() {
        await this.page.click(eligibilityLocators.selectPassport);
    }

    async selectDrivingLicence() {
        await this.page.click(eligibilityLocators.selectLicence);
    }

    async selectNIC() {
        await this.page.click(eligibilityLocators.selectNIC);
    }

    async selectEligibilityCheck(EligibilityMethod: string) {
        await this.verifyEligibilityCheckPage();
        if (EligibilityMethod === 'PASSPORT') {
            await this.selectPassport();
        } else if (EligibilityMethod === 'DRIVING') {
            await this.selectDrivingLicence();
        } else if (EligibilityMethod === 'NIC') {
            await this.selectNIC();
        } else {
            throw new Error(`Unsupported eligibility method: ${EligibilityMethod}, please use 'PASSPORT', 'DRIVING' or 'NIC'`);
        }
        await this.clickContinue();
    }

    async verifyEligibilityValidationPagePassport() {
        await expect(this.page.locator(eligibilityLocators.passportValidationPageHeader))
            .toContainText("Passport validation");
    }
    
    async verifyEligibilityValidationPageLicence() {
        await expect(this.page.locator(eligibilityLocators.licenceValidationPageHeader))
            .toContainText("Driving licence validation");
    }

    async verifyEligibilityValidationPageNIC() {
        await expect(this.page.locator(eligibilityLocators.nicValidationPageHeader))
            .toContainText("Identity card validation");
    }

    async enterPassportNumber(passportNumber: string) {
        const input = this.page.locator(eligibilityLocators.enterDocumentNumber);
        await input.waitFor({ state: "visible" });
        await input.fill(passportNumber);
    }

    async enterDrivingLicenceNumber(drivingLicenceNumber: string) {
        const input = this.page.locator(eligibilityLocators.enterDocumentNumber);
        await input.waitFor({ state: "visible" });
        await input.fill(drivingLicenceNumber);
    }

    async enterNICNumber(nicNumber: string) {
        const input = this.page.locator(eligibilityLocators.enterDocumentNumber);
        await input.waitFor({ state: "visible" });
        await input.fill(nicNumber);
    }

    async enterEligibilityNumber(
        eligibilityMethod: string,
        passportNumber?: string,
        drivingLicenceNumber?: string,
        nicNumber?: string
    ) {
    switch (eligibilityMethod.toUpperCase()) {
        case 'PASSPORT':
            if (!passportNumber) throw new Error("Passport number is empty in test data");
            await this.enterPassportNumber(passportNumber);
            break;
        case 'DRIVING':
            if (!drivingLicenceNumber) throw new Error("Driving licence number is empty in test data");
            await this.enterDrivingLicenceNumber(drivingLicenceNumber);
            break;
        case 'NIC':
            if (!nicNumber) throw new Error("NIC number is empty in test data");
            await this.enterNICNumber(nicNumber);
            break;
        default:
            throw new Error(`Unsupported eligibility method: ${eligibilityMethod}`);
        }

    await this.clickContinue();
    }
}