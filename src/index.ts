const puppeteer = require('puppeteer');
import "../src/io/commands/command"

const command = new Command;
command.parse(process.argv);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();