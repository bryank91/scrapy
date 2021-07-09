// const puppeteer = require('puppeteer');
import puppeteer, { Browser } from "puppeteer"

declare const window: any;
declare const inventory_quantity: any;

export namespace Actions {
    export class Shopify {

        goTo: string;

        constructor() {
            this.goTo = "https://dailyclack.com/products/tx-springs-15mm-m"
        }

        // inits the browser
        init(): any {
            return puppeteer.launch()
        }

        // closes the browser 
        close(browser: puppeteer.Browser): any {
            browser.close();
        }

        // navigates to the page
        async navigate(browser: puppeteer.Browser) {
            let page = await browser.newPage();
            await page.goto(this.goTo);
            return page
        }

        // async get the id 
        async getProducts(page: puppeteer.Page) {
            let products: any[] =
                await page.evaluate(() => {
                    const { variants } = window.ShopifyAnalytics.meta.product;
                    return variants; // array of shopify objects with id and names
                })
            return products;

        } // return browser and id of array

        async getInventory(page: puppeteer.Page) {
            let inventory: any[] =
                await page.evaluate(() => {
                    const { variants } = inventory_quantity // need to target the script
                    return variants; // array of shopify objects with id and names
                })
            return inventory;
        }


    }
}