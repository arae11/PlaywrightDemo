# PlaywrightDemo
E2E testing of the Railcard website, built using Playwright in Typescript.

This project utilises Data Driven Testing (DDT). Changes to the data should be made to the Railcard_Purchase_BAU.xlsx file in tests/resources.

What to Download:
VS Code
NodeJS
Playwright

Things to install (console):
npx playwright install
npm install playwright --save-dev
npm install @playwright/test --save-dev
npm install typescript --save-dev
npx tsc --inti
npm install xlsx --save-dev
npm install googleapis playwright
npm install --save-dev @playwright/test
npm install -D ts-node typescript


Extensions:
Playwright Test for VSCode

Gmail Authorization Command:
npx ts-node tests/utils/authorizeGmail.ts -> run this and follow instructions to get token

How to use the project:
This project is utilising the Page Object Model (POM). Following the format of the current files in tests/pages, add new pages if needed. Any new pages need to be added to index.ts and pages.ts.

These pages are used to construct your methods to be called in your tests. The tests are located in tests/specs.

There is a folder called tests/resources that contains essential resources. Nothing should need updating here except any additions to locators.ts.
These are set up to be used on individual pages to help improve readability and maintainability.

The tests/utils folder contains essential helpers that are used in the tests. They should not need updating except for when the Gmail token expires. If this happens, run "npx ts-node tests/utils/authorizeGmail.ts" in the console and follow the instructions to refresh the token. It should create a new token.json file in tests/resources.

