# PlaywrightDemo

End-to-end (E2E) testing of the Railcard website, built using Playwright with TypeScript.

---

## Overview

This project uses **Data Driven Testing (DDT)**.  
To update test data, modify the `Railcard_Purchase_BAU.xlsx` file located in `tests/resources`.

---

## Prerequisites

Make sure to download and install the following:

- [Visual Studio Code (VS Code)](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/)
- [Playwright](https://playwright.dev/)

---

## Setup Instructions

Run the following commands in your terminal to install dependencies and set up the environment:

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
```

## Recommended VS Code Extensions

    "Playwright Test" — enhances Playwright support and test running in VS Code.

Gmail Authorization

To authorize Gmail API access, run:

```bash
npx ts-node tests/utils/authorizeGmail.ts
```

Follow the on-screen instructions to generate or refresh your authentication token. This will create a token.json file in tests/resources.

## Project Structure & Usage
Page Object Model (POM)

This project uses the Page Object Model (POM) pattern to organize code.

    Add new pages by following the existing format in tests/pages.

    Remember to register new pages in index.ts and pages.ts.

    Pages encapsulate UI element locators and methods to interact with them.

Tests

    Test files are located in tests/specs.

    Use the page methods in these test files to build your test scenarios.

Resources

    The tests/resources folder contains essential files such as locators and test data.

    Avoid modifying files here unless adding new locators to locators.ts.

Utilities

    The tests/utils folder contains helper scripts used by the tests.

    Usually, you won’t need to update these, except for Gmail token renewal.

    To refresh the Gmail token, re-run the authorization command above.

