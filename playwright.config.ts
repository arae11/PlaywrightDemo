/**
 * Playwright Test Configuration
 *
 * - Tests located in "./tests"
 * - Runs tests fully in parallel locally; restricted concurrency in CI environment
 * - Retry failed tests once locally, twice on CI
 * - Supports test sharding on CI using TEST_SHARDS and TEST_SHARD_INDEX env variables
 * - All shards output results to a common, timestamped directory under "test-results"
 * - Artifacts include screenshots and videos only on test failure
 * - Trace enabled on first retry for debugging
 * - Default browser is Google Chrome desktop; other browsers and mobile devices configured but commented out
 * - Headless mode enabled with viewport 1280x720
 * - Base URL set to secure preproduction Railcard environment
 * - Run name and timestamp environment variables (RUN_NAME, UNIQUE_TIMESTAMP) control output folder naming
 */

import { defineConfig, devices } from "@playwright/test";
import path from "path";
import fs from "fs";

// Generate ONE timestamp for all shards
const runName = process.env.RUN_NAME || "run";
const timestamp =
  process.env.UNIQUE_TIMESTAMP ||
  new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

const baseDir = path.join("test-results", `${runName}--${timestamp}`);

// Ensure all shards use the same directory
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,

  // Force all shards to use same output
  outputDir: path.join(baseDir, "artifacts"),

  // All reporters use the same base directory
  reporter: [
    [
      "html",
      {
        outputFolder: path.join(baseDir, "html-report"),
        open: "never",
      },
    ],
    [
      "json",
      {
        outputFile: path.join(
          baseDir,
          `results-${process.env.TEST_SHARD_INDEX || "0"}.json`
        ),
      },
    ],
  ],

  // Critical for sharding
  workers: process.env.CI ? 1 : undefined, // Let Playwright manage workers
  shard: process.env.CI ? { total: +process.env.TEST_SHARDS!, current: +process.env.TEST_SHARD_INDEX! } : undefined,

  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: "https://secure-preproduction.railcard.co.uk",
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],

  // Critical for single-folder output
  preserveOutput: "always",

  // Add this to prevent multiple instances
  maxFailures: process.env.CI ? 1 : 0,
});
