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

        // #id = id
        // .class = class
        // gets the content based on selector
        async getContentBasedOnSelector(page: puppeteer.Page, selector: string) : Promise<string | null> {
            await page.waitForSelector(selector)
            const html = await page.$$eval(selector, element =>  {
                return element[0].textContent
            })
            return html;
        }

        // parse array of objects in JSON string with the keyword as the key
        async parseObjectsToList(jsonString: string, keyword: string) {
            let json: Object [] = JSON.parse(jsonString)
            return json.map((i:any) => i[keyword])
            
        }


    }
}