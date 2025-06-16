# PlaywrightDemo

End-to-end (E2E) testing of the Railcard website, built using Playwright with TypeScript.

---

## Overview

This project uses **Data Driven Testing (DDT)** to run test scenarios with various inputs based on Excel data.  
Test data is maintained in Excel files such as `Railcard_Purchase_BAU.xlsx` located in `/data`.  
The data sheet used can be changed dynamically via code or configuration.

The project also integrates with:

- **Railcard API**: For fetching railcard order details and authentication tokens.
- **Salesforce API**: For querying orders, updating order items, and marking orders as complete.
- **Gmail API**: For email verification steps, with OAuth2 token management.

---

## Prerequisites

Install the following before proceeding:

- [Visual Studio Code (VS Code)](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)

---

## Setup Instructions

Run the following commands to install dependencies and prepare your environment:

```bash
npx playwright install
npm install playwright --save-dev
npm install @playwright/test --save-dev
npm install typescript --save-dev
npx tsc --init
npm install xlsx --save-dev
npm install googleapis playwright
npm install --save-dev @playwright/test
npm install -D ts-node typescript
npm install --save-dev @types/node-fetch
npm install --save-dev @types/axios
npm install axios
npm install --save-dev rimraf
npm install --save-dev @types/node
```

## Recommended VS Code Extensions

    "Playwright Test" — enhances Playwright support and test running in VS Code.

Gmail Authorization

To authorize Gmail API access, run:

```bash
npm run gmail
```

Follow the CLI instructions to generate or refresh your authentication token. This will create a token.json file in resources/secrets.

## Project Structure & Usage
Page Object Model (POM)

This project uses the Page Object Model (POM) pattern to organize code.

    Add new pages by following the existing format in /pages.

    Remember to register new pages in index.ts and pages.ts.

    Pages encapsulate UI element locators and methods to interact with them.

Tests

    Test files are located in /tests. These are orgranised by Railcard Type.

    Use the page methods in these test files to build your test scenarios.

Resources

    The /resources folder contains essential files such as user secrets and document uploads.

Utilities

    The /utils folder contains helper scripts used by the tests.

    Usually, you won’t need to update these and there is a comment at the top of the each page explaining how the function works.

    To refresh the Gmail token, re-run the authorization command above.

