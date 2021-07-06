const puppeteer = require('puppeteer');
import { Commands } from "io/commands/commands"

const command = new Commands
command.parse(process.argv);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();