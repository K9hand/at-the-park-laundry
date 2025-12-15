/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:8080',
    headless: true,
  },
};
