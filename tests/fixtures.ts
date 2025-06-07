// fixtures.ts
import { test as base } from '@playwright/test';
import { Pages } from './pages/pages';

export const test = base.extend<{
  pages: Pages;
}>({
  pages: async ({ page }, use) => {
    await use(new Pages(page));
  },
});

export { expect } from '@playwright/test';