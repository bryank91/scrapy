import { Browser, Page } from "puppeteer-core"

declare const window: any;

export namespace html {

    // goto param takes in the url and browser takes in the lamda pupeteer browser
    export async function navigate(goto: string, browser: Browser) {
        let page = await browser.newPage();
        await page.goto(goto);
        return page
    }

    // async get the id 
    export async function getProducts(page: Page) {
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
    export async function getSingleTextContentBasedOnSelector(page: Page, selector: string) : Promise<string | null> {
        await page.waitForSelector(selector)
        const html = await page.$$eval(selector, (element: any) =>  {
            return element[0].textContent
        })
        return html;
    }

    export async function getValueBasedOnSelector(page: Page, selector: string) : Promise <any [] | null> {
        await page.waitForSelector(selector)
        const html = await page.$$eval(selector, (element: any) =>  {
            return element.Value
        })
        return html;
    }

    // parse array of objects in JSON string with the keyword as the key
    export async function parseObjectsToList(jsonString: string, keyword: string) {
        let json: Object [] = JSON.parse(jsonString)
        return json.map((i:any) => i[keyword])
        
    }


}
