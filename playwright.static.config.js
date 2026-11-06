import { defineConfig } from "@playwright/test";
import offline from "./playwright.offline.config.js";
export default defineConfig({
  ...offline,
  testMatch: "http.spec.js",
  webServer: {
    command:
      "python -m http.server 5181 --bind 127.0.0.1 --directory ORBITE_HTML",
    url: "http://127.0.0.1:5181",
    reuseExistingServer: true,
    timeout: 15000,
  },
});
