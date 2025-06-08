// Selector Methods:
// 1. ID
// const element:Locator = page.locator('id=button');
// const element:Locator = page.locator('#button');
// 2. Class
// const element:Locator = page.locator('.submit-button');
// 3. Text
// const element:Locator = page.locator('text=submit');
// 4. CSS
// const element:Locator = page.locator('css=button#id');
// 5. XPath
// const element:Locator = page.locator('xpath=//button[text()="submit"]');

// getByRole()	page.getByRole('button', { name: 'Continue' })	Semantic, robust, accessible
// getByLabel()	page.getByLabel('First Name')	For form fields (accessible labels)
// getByPlaceholder()	page.getByPlaceholder('Enter email')	Fast for input fields
// getByTestId()	page.getByTestId('checkout-button')	Best for stable, test-only attributes
// CSS selectors	page.locator('.nav-item >> text=Contact')	OK if HTML is stable

export const globalLocators = {
    acceptOneTrustPopUp: '#onetrust-accept-btn-handler',
    globalContinueButton: 'button:text-is("Continue")',
    globalBackButton: 'button:text-is("Back")',
};

export const idpLocators = {
    // IDP Registration page
    registerPageHeader: 'h2:has-text("Register for an online account")',
    registerTitleDropdown: '#Salutation',
    registerFirstNameField: '#FirstName',
    registerLastNameField: '#LastName',
    registerEmailField: '#Email',
    registerPasswordField: '#password',
    registerConfirmPasswordField: '#ConfirmPassword',
    registerRegisterButton: 'xpath=//button[.="Register"]',

    // IDP Login page
    loginPageHeader: 'h1:has-text("Login")',
    loginUsernameField: '#Username',
    loginPasswordField: '#Password',
    loginLoginButton: '[name="button"]',
    loginRegisterButton: 'xpath=//a[text()="Register"]',

    // Midflow Register page
    midflowRegisterPageHeader: 'h2:has-text("Register for an online account")',
    midflowRegisterButton: 'button:text-is("Register")',
};

export const verificationLocators = {
    // Email Verification page
    verificationPageHeader: 'h2:has-text("Verify your email address")',
    verifiedPageHeader: 'h2:has-text("Account verified")',
    verifiedLoginButton: '//a[.="Login"]',
};
    
export const chooseRailcardLocators = {
    // Choose a Railcard page
    pageHeader: 'h1:has-text("Choose a Railcard")',
    selectAccount: 'xpath=//a[text()="Account"]',
    select16To25: 'h2:has-text("16-25 Railcard")',
    select26To30: 'h2:has-text("26-30 Railcard")',
    selectSenior: 'h2:has-text("Senior Railcard")',
    selectNetwork: 'h2:has-text("Network Railcard")',
    selectDPRC: 'h2:has-text("Disabled Persons Railcard")',
    selectFamily: 'h2:has-text("Family & Friends Railcard")',
    selectTwoTogether: 'h2:has-text("Two Together Railcard")',
};

export const customiseRailcardLocators = {
    // Customise Railcard page
    selectMatureCheckbox: 'input#mature-student-0',
    selectOneYear: 'xpath=//label[@for="select-term-option-1"]', //same as 4 year
    selectThreeYear: 'xpath=//label[@for="select-term-option-0"]',
    selectDigital: 'xpath=//label[@for="railcard-type-option-0"]',
    selectPlastic: 'xpath=//label[@for="railcard-type-option-1"]',
    selectPromoInput: '#promo-code',
    selectPromoApplyButton: 'xpath=//button[contains(text(),"Apply Code")]',
    selectRemovePromoButton: 'button[aria-label="Remove"]',
    selectBuyForSelf: 'xpath=//label[contains(.,"for me")]',
    selectBuyOnBehalf: 'xpath=//label[contains(.,"else")]',
    selectTermsDigital: '#digital-terms-conditions-0',
    selectTermsPlastic: '#plastic-terms-conditions-0',
    selectTermsFF: '#friendsAndFamily-terms-conditions-0',
    selectTermsTT: '#digital-terms-conditions-0',
    selectTermsTT2: '//input[@name="agreeToTwoTogether"]',
    selectTermsNetwork2: '#discounts-terms-conditions-1',
};

export const getReadyLocators = {
    // Get Ready page
    pageHeader: 'h1:has-text("Getting ready to apply")',
};

export const holderDetailsLocators = {
    // Primary Holder
    primaryTitle: '#title',
    primaryFirstName: '#first-name',
    primaryLastName: '#last-name',
    primaryDOBDay: '#txtdob-day',
    primaryDOBMonth: '#txtdob-month',
    primaryDOBYear: '#txtdob-year',
    primaryPhoneNumber: '#phone-number',
    primaryBrailleSticker: '#braille-sticker',

    // Secondary Holder
    secondaryCheckbox: '#agree-to-additional-card-holder',
    secondaryTitle: '#title-secondary',
    secondaryFirstName: '#first-name-secondary',
    secondaryLastName: '#last-name-secondary',
    secondaryEmail: '#email',
    secondaryPermission: '#agree-to-permission-of-secondary-cardholder',
};

export const eligibilityLocators = {
    // Age Eligiblity Check page
    checkPageHeader: 'h1:has-text("Select an eligibility check method")',
    selectPassport: /*'#method-option-0', */'//label[@for="method-option-0"]',
    selectLicence: /*'#method-option-1', */'//label[@for="method-option-1"]',
    selectNIC: /*'#method-option-2',*/'//label[@for="method-option-2"]',
    enterDocumentNumber: '#seg1',

    // Age Eligibility Validation page
    licenceValidationPageHeader: 'h1:has-text("Driving licence validation")',
    nicValidationPageHeader: 'h1:has-text("Identity card validation")',
    passportValidationPageHeader: 'h1:has-text("Passport validation")',
};

export const supportingEvidenceLocators = {
    // Mature 16-25 Railcard - Provide Supporting Evidence page
    pageHeader: 'h1:has-text("Provide supporting evidence")',
    uploadMatureDocument: '#files',
    uploadButton: '//button[@aria-label="Upload"]',
    deleteButton: 'a[aria-label="Delete"]',
};

export const disabilityLocators = {
    // Disbility Eligibility Check page
    methodDLA: '//label[@for="DR001"]',
    methodPIP: '//label[@for="DR002"]',
    methodVisualImpairment: '//label[@for="DR003"]',
    methodDeafHeadingAid: '//label[@for="DR004"]',
    methodEpilepsy: '//label[@for="DR005"]',
    methodAttendanceAllowance: '//label[@for="DR006"]',
    methodSevereDisablementAllowance: '//label[@for="DR007"]',
    methodMobilitySupplement: '//label[@for="DR008"]',
    methodServiceDisablementPension: '//label[@for="DR009"]',
    methodMotabilityScheme: '//label[@for="DR010"]',

    // Disability Upload page
    evidenceDLA: '//label[@for="DT001"]',
    evidenceAwardLetter: '"//label[@for="DT002"]',
    evidenceVisualImpairment: './/label[@for="DT003"]',
    evidenceServiceStamp: '//label[@for="DT004"]',
    evidenceNHSBook: '//label[@for="DT005"]',
    evidenceEpilepsyPrescription: '//label[@for="DT006"]',
    evidenceEpilepsyDVLA: '//label[@for="DT007"]',
    evidenceHPAgreement: '//label[@for="DT008"]',
    evidenceApprovalLetter: '//label[@for="DT009"]',
    evidenceAwardLetterPIP: '//label[@for="DT010"]',
    evidenceAwardLetterAA: '//label[@for="DT011"]',
    evidenceAwardLetterSDA: '//label[@for="DT012"]',
    evidenceAwardLetterMobilitySupplement: '//label[@for="DT013"]',
    evidenceWarService: '//label[@for="DT014"]',
};

export const photoUploadLocators = {
    // Photo Upload page
    pageHeaderSingle: 'xpath=//label[contains(text(),"Photo upload")]',
    pageHeaderDual: 'xpath=//h1[contains(text(),": Photo upload")]',
    chooseFile: '#photoUpload',
    chooseFileDualA: '#dualPhotoUpload',
    chooseFileDualB: '#dualPhotoUpload-secondary',
    fileInput: 'xpath=//input[@type="file"]',
    saveButton: 'xpath=//button[@aria-label="Save"]',
    clearButton: 'button[aria-label="Clear"]',
};

export const midflowLoginLocators = {
    // Midflow Login page
    pageHeader: 'h1:has-text(": Login")',
    registerLoginButton: '//button[@aria-label="Register / Login"]',
};

export const billingDetailsLocators = {
    // Billing Details page - Billing Details
    pageHeader: 'xpath=//h1[.="My Order: Billing details"]',
    emailField: '#email',
    phoneNumberField: 'xpath=//input[@type="tel"]',
    phoneCountryCodeDropDown: 'xpath=//button[@aria-label="Selected country"]',
    phoneCountryCodeSearch: 'xpath=//input[@aria-label="Search"]',
    phoneCountryCodeList: 'xpath=//ul[@aria-label="List of countries"]',
    billingCountry: '#country_id',
    postcodeLookup: '#billing-postcodeInput',
    enterAddressManually: 'xpath=//a[contains(text(),"Enter address manually")]',
    addressLine1Field: '#billing-addressLine1',
    addressLine2Field: '#billing-addressLine2',
    addressLine3Field: '#billing-addressLine3',
    townCityField: '#billing-townCity',
    postcodeField: '#billing-postcode',
};

export const deliveryDetailsLocators = {
    // Billing Details page - Delivery/Holder address
    sameAsBillingCheckbox: '#deliveryAddressSameAsBilling',
    postcodeLookup: '#delivery-postcodeInput',
    enterAddressManually: 'xpath=//a[contains(text(),"Enter address manually")]',
    addressLine1Field: '#delivery-addressLine1',
    addressLine2Field: '#delivery-addressLine2',
    addressLine3Field: '#delivery-addressLine3',
    townCityField: '#delivery-townCity',
    postcodeField: '#delivery-postcode',
    freeDelivery: 'xpath=//span[contains(text(),"Standard Delivery")]',
    specialDelivery: 'xpath=//span[contains(text(),"Special Delivery")]',
};

export const keepInTouchLocators = {
    // Keep in touch page
    pageHeader: 'xpath=//h2[.="Keeping in touch with special offers"]',
    communications: '#privacy-0',
    offers: '#privacy-1',
};

export const orderSummaryLocators = {
    // Railcard Order Summary page
    pageHeader: 'h1:has-text("Railcard Order: Summary")',
    addAnotherRailcardButton: 'xpath=//button[text()="Add another Railcard"]',
    orderTotalPrice: '(//div[contains(@class, "Invoice-module__invoiceRow")]//p[contains(@class, "Typography-module__heading-2")])[2]',
    purchaseButton: 'xpath=//button[contains(text(),"Purchase")]',
};

export const paymentLocators = {
    // Payment Portal page
    pageHeader: 'h1:has-text("Payment")',
    paymentFrame: '#payment-frame',
    paymentForm: '#card-payment-form',
    cardNumber: '#pas_ccnum',
    cardNumberError: '#pas_ccnum-error',
    expiryDate: '#pas_expiry',
    expiryDateError: '#pas_expiry-error',
    securityCode: '#pas_cccvc',
    securityCodeError: '#pas_cccvc-error',
    cardholderName: '#pas_ccname',
    cardholderNameError: '#pas_ccname-error',
    purchaseButton: '#rxp-primary-btn',
};

export const confirmationLocators = {
    // Payment Confirmation page
    pageHeader: 'h1:has-text("Confirmation")',
    orderNumber: 'xpath=//p[.="Order number:"]/following-sibling::*[1]',
    orderDateTime: 'xpath=//p[.="Order date:"]/following-sibling::*[1]',
    paymentReference: 'xpath=//p[.="Payment reference:"]/following-sibling::*[1]',
    billingAddress: 'xpath=//p[.="Billing address:"]/following-sibling::*[1]',
    purchasedBy: 'xpath=//p[.="Purchased by:"]/following-sibling::*[1]',
    items: 'xpath=//p[contains(text(), "Items:")]/following-sibling::div//p[contains(@class, "bold")][1]',
    orderTotal: '//p[contains(normalize-space(.), "Order total:")]/following-sibling::*[1]',
    buyAnotherRailcardButton: 'xpath=//button[contains(text(),"Buy another Railcard")]',
};

export const myRailcardsLocators = {
    // My Railcards page
    pageHeader: 'h1:has-text("My Railcards")',
    railcardDetailsHeader: '(//h3)[1]',
    railcardDetailsName: '//p[1]',
    railcardDetailsExpiry: '//p[2]',
    railcardDetailsEmail: '//p[.="Email"]/following-sibling::*[1]',
    railcardDetailsFulfilment: '//p[.="Railcard Type"]/following-sibling::*[1]',
    railcardDetailsRailcardNumber: '//p[.="Railcard Number"]/following-sibling::*[1]',
    railcardDetailsRenewButton: '//button[text()="Renew Railcard"]',
    railcardDetailsReplaceButton: '//a[text()="Replace a lost or stolen Railcard"]',
    railcardDetailsAddToApp: 'xpath=//button[text()="Add Railcard to app"]',
};

export const manageDigitalRailcardLocators = {
    // Manage Digital Railcard page
    pageHeader: 'h1:has-text("Manage Digital Railcard")',
    downloadCodeField: '#downloadCode',
};