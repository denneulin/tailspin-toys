import { createHash } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Each checkout (the main folder or a git worktree) serves the site on its own
 * port, derived from its path, so two worktrees never test each other's server.
 * Set E2E_PORT to override it.
 */
const port =
  Number(process.env.E2E_PORT) ||
  4400 + (parseInt(createHash('sha1').update(process.cwd()).digest('hex').slice(0, 8), 16) % 600);
const baseURL = `http://localhost:${port}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e-tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot only on failure */
    screenshot: 'only-on-failure',
    
    /* Record video only on failure */
    video: 'retain-on-failure',
    
    /* Default timeout for actions */
    actionTimeout: 10000,
    
    /* Default timeout for navigation */
    navigationTimeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Build the site and serve it before starting the tests */
  webServer: {
    /*
     * --ignore-lock keeps `astro preview` in the foreground: when an agent such
     * as Claude Code runs the tests, Astro 7 would otherwise move it to the
     * background on macOS and Linux, and Playwright would see it exit early.
     */
    command: `npm run build && npm run preview -- --port ${port} --ignore-lock`,
    url: baseURL,
    /* Never reuse a running server: it may serve an old build. */
    reuseExistingServer: false,
    timeout: 120 * 1000, // 2 minutes to allow for build + seed
  },
});
