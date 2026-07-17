const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  try {
    // ── Login ──
    console.log('1. Going to login page...');
    await page.goto(process.env.APP_URL, { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'screenshots/01-login-page.png' });
    const newString = page.url();
  console.log("Current Page URL is: "+newString); 
    await page.getByRole('textbox', { name: 'EMAIL' }).fill(process.env.APP_EMAIL);
    await page.getByRole('textbox', { name: 'PASSWORD' }).fill(process.env.APP_PASSWORD);
    await page.screenshot({ path: 'screenshots/02-login-filled.png' });

    await page.getByRole('button',
        { name: 'SIGN IN' } 
    ).click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'screenshots/03-after-login.png' });
    console.log('✓ Logged in');

    // ── Dashboard (auto-loads on login) ──
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/04-dashboard.png' });
    console.log('✓ Dashboard loaded');

    // ── History tab ──
    await page.getByRole('button', { name: 'History' }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/05-history.png' });
    console.log('✓ History tab loaded');
    await page.pause();
    await page.selectOption('#histVehicle', { index: 1 }); // picks first vehicle
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/08-reports.png' });
    console.log('✓ Reports tab loaded');


    // ── Vehicles tab ──
    await page.getByRole('button', { name: 'Vehicles' }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/06-vehicles.png' });
    console.log('✓ Vehicles tab loaded');

    await page.getByRole('button', { name: 'Charts' }).click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/07-charts.png' });
    console.log('✓ Charts tab loaded');



    console.log('✅ All done — Supabase is alive!');

  } catch (err) {
    // Screenshot on failure too
    await page.screenshot({ path: 'screenshots/ERROR.png' });
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
