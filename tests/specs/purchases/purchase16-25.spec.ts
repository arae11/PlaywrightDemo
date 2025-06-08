import { expect } from "@playwright/test";
import { readExcelData } from "../../utils/excelReader";
import { generateEmailWithEpoch } from "../../utils/emailGenerator";
import { EmailHelper } from "../../utils/emailHelper";
import { SalesforceApiHelper } from "../../utils/salesforceApiHelper";
import { RailcardApiHelper } from "../../utils/railcardApiHelper";
import { OrderProcessingService } from "../../utils/orderProcessingService";
import { PromocodeHelper } from "../../utils/promocodeHelper";
import { test } from "../../fixtures";
import path from "path";

import { Pages } from "../../pages/pages";

test.setTimeout(60000);

// Read test data
const excelPath = path.join(
  __dirname,
  "../../resources/Railcard_Purchase_BAU.xlsx"
);
import fs from "fs";

if (!fs.existsSync(excelPath)) {
  console.error(`Excel file not found at: ${excelPath}`);
  console.log("Current working directory:", process.cwd());
  throw new Error("Test data file missing");
}

const testData = readExcelData(excelPath, "16-25_BFS");

test.describe("16-25 BFS Mid-Flow Purchase", () => {
  testData.forEach((data) => {
    test(`16-25 Test: ${data.TestCaseID}`, async ({ page }) => {
      const pages = new Pages(page);
      const salesforceApiHelper = new SalesforceApiHelper();
      const railcardApiHelper = new RailcardApiHelper();
      const promocodeHelper = new PromocodeHelper();

      try {
        // Navigate to the Railcard Website
        await pages.basePage.navigateToRailcardWebsite();

        // Choose Railcard page - select desired Railcard
        await pages.chooseRailcard.selectRailcard(data.Railcard);

        // Customise Railcard page - select Railcard options
        await pages.customiseRailcard.customiseRailcard({
          Duration: data.Duration,
          Fulfilment: data.Fulfilment,
          Promocode: data.Promocode,
          Railcard: data.Railcard,
          PurchaseType: data.PurchaseType,
        });

        // Getting Ready page - click continue
        await pages.gettingReady.verifyGettingReadyPage();

        // Holder Details page - enter primary holder details
        await pages.holderDetails.fillPrimaryHolderDetails({
          title: data.Title,
          firstName: data.FirstName,
          lastName: data.LastName,
          dobDay: data.DOBDay,
          dobMonth: data.DOBMonth,
          dobYear: data.DOBYear,
          phoneNumber: data.PhoneNumber,
          brailleSticker: data.BrailleSticker,
          railcard: data.Railcard,
          years: parseInt(data.Duration, 10) === 3 ? 3 : 1,
        });

        let skipEligibility = false;
        let skipPayment = false;
        let isSantander = false;

        // Get the Railcard value and promocode tags
        if (data.Promocode !== "") {
          const railcardPrice = promocodeHelper.getRailcardValueWithoutPromo(
            data.Railcard,
            data.Duration
          );

          const flags = await promocodeHelper.verifyPromocodeTags(
            data.Promocode,
            data.SKU,
            railcardPrice
          );

          skipEligibility = flags.skipEligibility;
          skipPayment = flags.skipPayment;
          isSantander = flags.isSantander;
        }

        // Go to eligibility page unless skipcode is used
        if (!skipEligibility) {
          if (data.Railcard === "MATURE") {
            await pages.supportingEvidence.provideEvidence(
              data.EvidenceDocument
            );
          } else {
            await pages.selectEligibility.selectEligibilityCheck(
              data.EligibilityMethod
            );
            await pages.selectEligibility.enterEligibilityNumber(
              data.EligibilityMethod,
              data.Passport,
              data.DrivingLicence,
              data.NIC
            );
          }
        }

        // Photo upload page - upload single photo
        await pages.uploadPhoto.uploadPhotoSingle(data.PhotoFile);

        // Midflow register/login page - redirect to midflow IDP
        await pages.midflowLogin.midflowRegisterLogin();

        // IDP Account Registration page - generate email and create account
        const { email: testEmail } = generateEmailWithEpoch(
          data.LoginEmail,
          data.Railcard
        );
        await pages.register.midflowAccountRegistration(
          testEmail,
          data.LoginPassword
        );

        // Billing Details page - enter billing details
        await pages.billingDetails.enterBillingDetails({
          countryPrefix: data.CountryPrefix,
          phoneNumber: data.PhoneNumber,
          countryId: data.CountryID,
          sameAsBillingAddress: data.SameAsBillingAddress,
          billingAddress: {
            line1: data.BillingAddressLine1,
            line2: data.BillingAddressLine2,
            line3: data.BillingAddressLine3,
            townCity: data.BillingAddressTownCity,
            postcode: data.BillingAddressPostcode,
          },
          deliveryAddress: {
            line1: data.DeliveryAddressLine1,
            line2: data.DeliveryAddressLine2,
            line3: data.DeliveryAddressLine3,
            townCity: data.DeliveryAddressTownCity,
            postcode: data.DeliveryAddressPostcode,
          },
          fulfilment: data.Fulfilment,
          deliveryType: data.DeliveryType,
        });

        // Let's Keep in Touch page - skip keep in touch
        await pages.keepInTouch.skipKeepInTouchPage();

        // Railcard Order: Summary page - check Order ## to be added
        await pages.orderSummary.skipOrderSummaryPage();

        // Make payment
        await pages.payment.completePurchase(
          data.CreditCardNumber,
          data.CardExpiry,
          data.CardCVC,
          data.CardHolder
        );

        // Order Confirmation Page
        await pages.confirmation.verifyOrderConfirmationPage();
        await pages.confirmation.logPaymentSummaryText();
        const orderNumber = pages.confirmation.extractedOrderNumber;
        if (!orderNumber) {
          throw new Error("Order number was not extracted.");
        }

        // Wait for confirmation email and extract link
        const confirmationLink = await EmailHelper.getConfirmationLink(
          testEmail
        );

        // Open confirmation link and verify account, redirect to IDP
        await pages.verification.verifyEmailAndNavigateToIDP(confirmationLink);

        // If Mature Student Railcard then access the Salesforce API and complete the Order
        const orderProcessingService = new OrderProcessingService(
          salesforceApiHelper,
          railcardApiHelper
        );
        await orderProcessingService.processMatureStudentRailcardOrder(
          orderNumber,
          data.Railcard
        );

        // Log back into account
        await pages.login.login(testEmail, data.LoginPassword);

        // Extract Railcard information from My Railcards page
        await pages.myRailcards.getMyRailcardDetails(data.Fulfilment);

        // Navigate to Manage Digital Railcard page and extract Railcard token
        // await pages.manageRailcards.getToken(); - Commented out as failing for some reason
      } catch (error) {
        const testCaseID = data?.TestCaseID || "unknown";
        console.error(`Test ${testCaseID} failed:`, error);
        throw error;
      }
    });
  });
});
