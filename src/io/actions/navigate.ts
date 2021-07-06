const puppeteer = require('puppeteer');

declare const window: any;

export namespace Actions {
    export class Navigate {        

        goTo : string;

        constructor() {
            // placeholders
            this.goTo = "https://dailyclack.com/collections/switches/products/seal-switches"
        }

        getId(browser: unknown) {
            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(this.goTo);
                let id = 
                    await page.evaluate(() : number [] => {
                        const { variants } = window.ShopifyAnalytics.meta.product;
                        return variants; // array of shopify objects with id and names
                    })
                console.log(id)
                await browser.close();
            })();
        } // return browser and id of array

        addIdToCart(browser: unknown, id: number []) {

        }


    }
}