const puppeteer = require('puppeteer');

export namespace Actions {
    export class Navigate {
        constructor() {
            // nothing
        }

        launch() {
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto('https://example.com');
                await page.screenshot({ path: 'example.png' });
                await browser.close();
            })();
        }
    }
}