module.exports = {
  testURL: "https://192.168.33.129:6443/api/v1",
  testEnvironment: "./tests/PuppeteerEnvironment",
  verbose: false,
  extraSetupFiles: ["./tests/setupTests.js"],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: false,
    localStorage: null,
  },
};
