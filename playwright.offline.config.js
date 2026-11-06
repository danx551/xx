import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/offline",
  testMatch: "file.spec.js",
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  use: {
    headless: true,
    launchOptions: {
      executablePath: process.env.ORBITE_CHROME_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  },
  reporter: "list",
});
