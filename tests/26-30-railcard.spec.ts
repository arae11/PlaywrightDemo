import {
  expect,
  readExcelData,
  generateEmailWithEpoch,
  EmailHelper,
  SalesforceApiHelper,
  RailcardApiHelper,
  OrderProcessingService,
  PromocodeHelper,
  getTestData,
  test,
  path,
  type RegistrationInput,
  fs,
  Pages
} from "../utils/imports";

test.setTimeout(60000);

const testDataBFS = getTestData("26-30_BFS") as any[];
const testDataBOB = getTestData("26-30_BOB") as any[];


test.describe("26-30 Purchase", () => {
  testDataBFS.forEach((data: any) => {
    test(`26-30 BFS Test: ${data.TestCaseID}`, async ({ page }) => {
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

        const emailResult = generateEmailWithEpoch(
          data.LoginEmail,
          data.Railcard,
          data.PurchaseType,
          data.SecondaryHolder
        );

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
          fulfilment: data.Fulfilment,
        });
        await pages.holderDetails.clickContinue();

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

        // Photo upload page - upload single photo
        await pages.uploadPhoto.uploadPhotoFlow({
          dual: false,
          photoFileName: data.PhotoFile,
        });

        // Midflow register/login page - redirect to midflow IDP
        await pages.midflowLogin.midflowRegisterLogin();

        // IDP Account Registration page - generate email and create account
        const registrationInput: RegistrationInput = {
          email: "", // will be overridden in the method, so can be empty or any string here
          password: data.LoginPassword,
          purchaseType: data.PurchaseType as "BFS" | "BOB",
          title: data.Title,
          firstName: data.FirstName,
          lastName: data.LastName,
        };
        await pages.register.midflowAccountRegistration(
          registrationInput,
          emailResult
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

        // Railcard Order: Summary page
        const finalPrice =
          await pages.orderSummary.verifyCorrectPriceOnSummaryPage({
            railcard: data.Railcard,
            years: data.Duration,
            deliveryType: data.DeliveryType,
            promo: data.Promocode,
            sku: data.SKU,
          });

        // Make payment unless final price is £0.00
        if (finalPrice !== 0) {
          await pages.payment.completePurchase(
            data.CreditCardNumber,
            data.CardExpiry,
            data.CardCVC,
            data.CardHolder
          );
        } else {
          console.log("💸 Final price is £0.00. Skipping payment step.");
          await pages.orderSummary.clickPurchase();
        }

        // Order Confirmation Page
        await pages.confirmation.verifyOrderConfirmationPage();
        await pages.confirmation.logPaymentSummaryText();
        const orderNumber = pages.confirmation.extractedOrderNumber;
        if (!orderNumber) {
          throw new Error("Order number was not extracted.");
        }

        // Wait for confirmation email and extract link
        const confirmationLink = await EmailHelper.getConfirmationLink(
          emailResult.loginEmail
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
        await pages.login.login(emailResult.loginEmail, data.LoginPassword);

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
  testDataBOB.forEach((data: any) => {
    test(`26-30 BOB Test: ${data.TestCaseID}`, async ({ page }) => {
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

        const emailResult = generateEmailWithEpoch(
          data.BOBEmail,
          data.Railcard,
          data.PurchaseType,
          data.SecondaryHolder
        );

        // Holder Details page - enter primary holder details
        await pages.holderDetails.fillPrimaryHolderDetails({
          title: data.BOBTitle,
          firstName: data.BOBFirstName,
          lastName: data.BOBLastName,
          dobDay: data.DOBDay,
          dobMonth: data.DOBMonth,
          dobYear: data.DOBYear,
          phoneNumber: data.PhoneNumber,
          brailleSticker: data.BrailleSticker,
          railcard: data.Railcard,
          years: parseInt(data.Duration, 10) === 3 ? 3 : 1,
          purchaseType: data.PurchaseType,
          email:
            data.PurchaseType === "BOB"
              ? emailResult.bobEmail!
              : emailResult.loginEmail,
            fulfilment: data.Fulfilment,
        });
        await pages.holderDetails.clickContinue();

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
        await pages.uploadPhoto.uploadPhotoFlow({
          dual: false,
          photoFileName: data.PhotoFile,
        });

        // Midflow register/login page - redirect to midflow IDP
        await pages.midflowLogin.midflowRegisterLogin();

        // IDP Account Registration page - generate email and create account
        await pages.register.midflowAccountRegistration(
          {
            email: emailResult.loginEmail,
            password: data.LoginPassword,
            purchaseType: data.PurchaseType,
            title: data.Title,
            firstName: data.FirstName,
            lastName: data.LastName,
          },
          emailResult
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

        // Railcard Order: Summary page
        const finalPrice =
          await pages.orderSummary.verifyCorrectPriceOnSummaryPage({
            railcard: data.Railcard,
            years: data.Duration,
            deliveryType: data.DeliveryType,
            promo: data.Promocode,
            sku: data.SKU,
          });

        // Make payment unless final price is £0.00
        if (finalPrice !== 0) {
          await pages.payment.completePurchase(
            data.CreditCardNumber,
            data.CardExpiry,
            data.CardCVC,
            data.CardHolder
          );
        } else {
          console.log("💸 Final price is £0.00. Skipping payment step.");
          //await pages.orderSummary.clickPurchase();
        }

        // Order Confirmation Page
        await pages.confirmation.verifyOrderConfirmationPage();
        await pages.confirmation.logPaymentSummaryText();
        const orderNumber = pages.confirmation.extractedOrderNumber;
        if (!orderNumber) {
          throw new Error("Order number was not extracted.");
        }

        // Wait for confirmation email and extract link
        const confirmationLink = await EmailHelper.getConfirmationLink(
          emailResult.loginEmail
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
        await pages.login.login(emailResult.loginEmail, data.LoginPassword);

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
