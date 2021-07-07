// const puppeteer = require('puppeteer');
import puppeteer, { PuppeteerNode } from "puppeteer"

declare const window: any;

export namespace Actions {
    export class Navigate {        

        goTo : string;        

        constructor() {
            this.goTo = "https://dailyclack.com/collections/switches/products/seal-switches"
        }

        init() : Promise<puppeteer.Browser> {
            // do something here
        }

        getId(browser: unknown) {
            (async () => {
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