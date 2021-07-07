// const puppeteer = require('puppeteer');
import puppeteer, { PuppeteerNode } from "puppeteer"

declare const window: any;

export namespace Actions {
    export class Shopify {

        goTo: string;

        constructor() {
            this.goTo = "https://dailyclack.com/collections/switches/products/seal-switches"
        }

        // inits the browser
        init(): any {
            return puppeteer.launch()
        }

        // closes the browser 
        close(browser: puppeteer.Browser): any {
            browser.close();
        }

        // async get the id 
        async getId(browser: puppeteer.Browser) {
            const page = await browser.newPage();
            await page.goto(this.goTo);
            let id: any[] =
                await page.evaluate((): number[] => {
                    const { variants } = window.ShopifyAnalytics.meta.product;
                    return variants; // array of shopify objects with id and names
                })
            console.log(id)
            return id;

        } // return browser and id of array

        async addIdToCart(browser: puppeteer.Browser, id: number[]) {

        }


    }
}