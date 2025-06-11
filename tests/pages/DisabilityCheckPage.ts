import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { disabilityLocators } from "../resources/locators";
import path from "path";
import fs from "fs";

export class DisabilityCheckPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifySelectDisabilityPage() {
    await expect(this.page.locator("h1")).toContainText("Your disability");
  }

  async selectDisabilityAllowance() {
    await this.page.click(disabilityLocators.methodDLA);
  }

  async selectPersonalIndependancePayments() {
    await this.page.click(disabilityLocators.methodPIP);
  }

  async selectVisualImpairment() {
    await this.page.click(disabilityLocators.methodVisualImpairment);
  }

  async selectDeafOrHearingAid() {
    await this.page.click(disabilityLocators.methodDeafHeadingAid);
  }

  async selectEpilepsy() {
    await this.page.click(disabilityLocators.methodEpilepsy);
  }

  async selectPensionAgeDisabilityPayment() {
    await this.page.click(disabilityLocators.methodPADP);
  }

  async selectSevereDisablementAllowance() {
    await this.page.click(disabilityLocators.methodSevereDisablementAllowance);
  }

  async selectMobilitySupplement() {
    await this.page.click(disabilityLocators.methodMobilitySupplement);
  }

  async selectServiceDisablementPension() {
    await this.page.click(disabilityLocators.methodServiceDisablementPension);
  }

  async selectMotabilityScheme() {
    await this.page.click(disabilityLocators.methodMotabilityScheme);
  }

  async verifyDisabilityEvidencePage() {
    const text = await this.page.locator("h1").textContent();
    const normalizedText = text?.trim() ?? "";

    expect(normalizedText).toMatch(
      /(Upload proof of disability documentation|Select one option below and upload proof of disability documentation)/
    );
  }

  async selectEvidenceDLA() {
    await this.page.click(disabilityLocators.evidenceDLA);
  }

  async selectEvidenceAwardLetter() {
    await this.page.click(disabilityLocators.evidenceAwardLetter);
  }

  async selectEvidenceVisualImpairment() {
    await this.page.click(disabilityLocators.evidenceVisualImpairment);
  }

  async selectEvidenceServiceStamp() {
    await this.page.click(disabilityLocators.evidenceServiceStamp);
  }

  async selectEvidenceNHSBook() {
    await this.page.click(disabilityLocators.evidenceNHSBook);
  }

  async selectEpilepsyPrescription() {
    await this.page.click(disabilityLocators.evidenceEpilepsyPrescription);
  }

  async selectEpilepsyDVLA() {
    await this.page.click(disabilityLocators.evidenceEpilepsyDVLA);
  }

  async selectHPAgreement() {
    await this.page.click(disabilityLocators.evidenceHPAgreement);
  }

  async selectEvidenceApprovalLetter() {
    await this.page.click(disabilityLocators.evidenceApprovalLetter);
  }

  async selectAwardLetterPIP() {
    await this.page.click(disabilityLocators.evidenceAwardLetterPIP);
  }

  async selectAwardLetterAA() {
    await this.page.click(disabilityLocators.evidenceAwardLetterAA);
  }

  async selectAwardLetterSDA() {
    await this.page.click(disabilityLocators.evidenceAwardLetterSDA);
  }

  async selectAwardLetterMobilitySupplement() {
    await this.page.click(
      disabilityLocators.evidenceAwardLetterMobilitySupplement
    );
  }

  async evidenceWarService() {
    await this.page.click(disabilityLocators.evidenceWarService);
  }

  // Disability selectors
  private disabilityMap: Record<string, () => Promise<void>> = {
    "DLA": this.selectDisabilityAllowance.bind(this),
    "PIP": this.selectPersonalIndependancePayments.bind(this),
    "VISUAL IMPAIRMENT": this.selectVisualImpairment.bind(this),
    "DEAF OR HEARING AID": this.selectDeafOrHearingAid.bind(this),
    "EPILEPSY": this.selectEpilepsy.bind(this),
    "AA": this.selectPensionAgeDisabilityPayment.bind(this),
    "SDA": this.selectSevereDisablementAllowance.bind(this),
    "MOBILITY SUPPLEMENT": this.selectMobilitySupplement.bind(this),
    "DISABLEMENT PENSION": this.selectServiceDisablementPension.bind(this),
    "MOTABILITY SCHEME": this.selectMotabilityScheme.bind(this),
  };

  // Evidence selectors by disability + index (1-based)
  private evidenceMap: Record<string, Record<number, () => Promise<void>>> = {
    "DLA": {
      1: this.selectEvidenceDLA.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "PIP": {
      1: this.selectAwardLetterPIP.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "VISUAL IMPAIRMENT": {
      1: this.selectEvidenceVisualImpairment.bind(this),
      2: this.selectEvidenceServiceStamp.bind(this),
      3: this.selectEvidenceApprovalLetter.bind(this),
    },
    "DEAF OR HEARING AID": {
      1: this.selectEvidenceServiceStamp.bind(this),
      2: this.selectEvidenceNHSBook.bind(this),
      3: this.selectEvidenceApprovalLetter.bind(this),
    },
    "EPILEPSY": {
      1: this.selectEpilepsyPrescription.bind(this),
      2: this.selectEpilepsyDVLA.bind(this),
      3: this.selectEvidenceApprovalLetter.bind(this),
    },
    "AA": {
      1: this.selectAwardLetterAA.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "SDA": {
      1: this.selectAwardLetterSDA.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "MOBILITY SUPPLEMENT": {
      1: this.selectAwardLetterMobilitySupplement.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "DISABLEMENT PENSION": {
      1: this.evidenceWarService.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
    "MOTABILITY SCHEME": {
      1: this.selectHPAgreement.bind(this),
      2: this.selectEvidenceApprovalLetter.bind(this),
    },
  };

  private disabilityAliasMap: Record<string, string> = {
    "MOTABILITY": "MOTABILITY SCHEME",
    "VISUAL": "VISUAL IMPAIRMENT",
    "DEAF OR HEARING": "DEAF OR HEARING AID",
    "MOBILITY": "MOBILITY SUPPLEMENT",
    "DISABLEMENT": "DISABLEMENT PENSION",
    // Add more aliases here if needed
  };

  private normalizeDisabilityName(rawDisability: string): string {
    const parts = rawDisability.trim().toUpperCase().split(/\s+/);
    const baseDisability = parts.slice(0, -1).join(" ") || parts[0];
    return this.disabilityAliasMap[baseDisability] || baseDisability;
  }

  // Main handler based on your excel string input
  async selectDisabilityAndEvidence(
    disabilityType: string,
    documentFileName: string
  ) {
    // Normalize and get index
    const parts = disabilityType.trim().toUpperCase().split(/\s+/);
    const evidenceIndex = Number(parts[parts.length - 1]);
    const index = isNaN(evidenceIndex) ? 1 : evidenceIndex;

    // Normalize disability name with alias support
    const normalizedDisability = this.normalizeDisabilityName(disabilityType);

    // Lookup disability selector
    const disabilityAction = this.disabilityMap[normalizedDisability];
    if (!disabilityAction) {
      throw new Error(`No disability method for "${normalizedDisability}"`);
    }
    await disabilityAction();
    await this.clickContinue();

    // Lookup evidence selector
    const evidenceActions = this.evidenceMap[normalizedDisability];
    if (!evidenceActions) {
      throw new Error(`No evidence map for "${normalizedDisability}"`);
    }
    const evidenceAction = evidenceActions[index];
    if (!evidenceAction) {
      throw new Error(
        `No evidence method for "${normalizedDisability}" with index ${index}`
      );
    }
    await evidenceAction();
    await this.provideEvidence(documentFileName);
  }

  async uploadEligibilityDocument(documentFileName: string) {
    const filePath = path.join(
      __dirname,
      "../resources/UploadFiles",
      documentFileName
    );

    await this.page
      .locator(disabilityLocators.evidenceChooseFile)
      .setInputFiles(filePath);
  }

  async waitForDeleteButtonVisible(timeout = 10000) {
    await this.waitForDeleteButton();
  }

  async provideEvidence(documentFileName: string) {
    await this.verifyDisabilityEvidencePage();
    await this.uploadEligibilityDocument(documentFileName);
    await this.clickUpload();
    await this.waitForDeleteButtonVisible();
    await this.clickContinue();
  }

  async clickUpload() {
    await this.page.locator(disabilityLocators.evidenceUpload).click();
  }

  async waitForDeleteButton() {
    await this.page.waitForSelector(disabilityLocators.evidenceDelete);
  }
}
