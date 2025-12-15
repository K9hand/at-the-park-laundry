const { test, expect } = require('@playwright/test');

test('nav assistant opens chat and responds to hours', async ({ page }) => {
  await page.goto('/');
  // ensure nav assistant button is present
  const navBtn = page.locator('.chatbot-nav-toggle');
  await expect(navBtn).toBeVisible();
  await navBtn.click();

  const panel = page.locator('.chatbot-panel');
  await expect(panel).toBeVisible();

  // click suggestion Hours
  const hoursBtn = page.locator('.chatbot-suggestions button', { hasText: 'Hours' });
  await hoursBtn.click();

  // Wait for bot reply to include 'Mon–Fri'
  await expect(page.locator('.chatbot-body')).toContainText('Mon–Fri');
});
