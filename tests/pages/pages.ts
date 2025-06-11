import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { RegistrationPage } from "./RegistrationPage";
import { VerificationPage } from "./VerificationPage";
import { LoginPage } from "./LoginPage";
import { ChooseRailcardPage } from "./ChooseRailcardPage";
import { CustomiseRailcardPage } from "./CustomiseRailcardPage";
import { HolderDetailsPage } from "./HolderDetailsPage";
import { GettingReadyPage } from "./GettingReadyPage";
import { SelectEligibilityPage } from "./EligibilityCheckPage";
import { DisabilityCheckPage } from "./DisabilityCheckPage";
import { PhotoUploadPage } from "./PhotoUploadPage";
import { MidflowLoginPage } from "./MidflowLoginPage";
import { BillingDetailsPage } from "./BillingDetailsPage";
import { KeepInTouchPage } from "./KeepInTouchPage";
import { OrderSummaryPage } from "./OrderSummaryPage";
import { PaymentPage } from "./PaymentPage";
import { OrderConfirmationPage } from "./OrderConfirmationPage";
import { MyRailcardsPage } from "./MyRailcardsPage";
import { ManageDigitalRailcardPage } from "./ManageDigitalRailcardPage";
import { SupportingEvidencePage } from "./SupportingEvidencePage";

export class Pages {
  readonly basePage: BasePage;
  readonly register: RegistrationPage;
  readonly verification: VerificationPage;
  readonly login: LoginPage;
  readonly chooseRailcard: ChooseRailcardPage;
  readonly customiseRailcard: CustomiseRailcardPage;
  readonly gettingReady: GettingReadyPage;
  readonly holderDetails: HolderDetailsPage;
  readonly selectEligibility: SelectEligibilityPage;
  readonly selectDisability: DisabilityCheckPage;
  readonly uploadPhoto: PhotoUploadPage;
  readonly midflowLogin: MidflowLoginPage;
  readonly billingDetails: BillingDetailsPage;
  readonly keepInTouch: KeepInTouchPage;
  readonly orderSummary: OrderSummaryPage;
  readonly payment: PaymentPage;
  readonly confirmation: OrderConfirmationPage;
  readonly myRailcards: MyRailcardsPage;
  readonly manageRailcards: ManageDigitalRailcardPage;
  readonly supportingEvidence: SupportingEvidencePage;

  constructor(public readonly page: Page) {
    this.basePage = new BasePage(page);
    this.register = new RegistrationPage(page);
    this.verification = new VerificationPage(page);
    this.login = new LoginPage(page);
    this.chooseRailcard = new ChooseRailcardPage(page);
    this.customiseRailcard = new CustomiseRailcardPage(page);
    this.gettingReady = new GettingReadyPage(page);
    this.holderDetails = new HolderDetailsPage(page);
    this.selectEligibility = new SelectEligibilityPage(page);
    this.selectDisability = new DisabilityCheckPage(page);
    this.uploadPhoto = new PhotoUploadPage(page);
    this.midflowLogin = new MidflowLoginPage(page);
    this.billingDetails = new BillingDetailsPage(page);
    this.keepInTouch = new KeepInTouchPage(page);
    this.orderSummary = new OrderSummaryPage(page);
    this.payment = new PaymentPage(page);
    this.confirmation = new OrderConfirmationPage(page);
    this.myRailcards = new MyRailcardsPage(page);
    this.manageRailcards = new ManageDigitalRailcardPage(page);
    this.supportingEvidence = new SupportingEvidencePage(page);
  }
}
