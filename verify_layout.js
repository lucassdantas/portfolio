const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  // Access the app
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000); // Wait for hydration

  // Screenshot Light Mode
  await page.screenshot({ path: 'light_mode_fix.png' });

  // Toggle Dark Mode
  await page.click('button:has-text("LIGHT"), button:has-text("ESCURO"), button:has-text("DARK"), button:has-text("SOMBRE")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'dark_mode_fix.png' });

  // Hover Flags
  await page.hover('img[alt="Português"], img[alt="English"], img[alt="Français"], img[alt="Español"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'flags_hover.png' });

  await browser.close();
})();
