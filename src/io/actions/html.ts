import { Browser, Page } from "puppeteer-core"
import { Data as Config } from "../../data/config"

declare const window: any;

export namespace html {

    // goto param takes in the url and browser takes in the lamda pupeteer browser
    export async function navigate(goto: string, browser: Browser) {
        let page = await browser.newPage();

        // set extra headers
        await page.setExtraHTTPHeaders(Config.headers)

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

    export async function getSingleTextContentBasedOnSelector(page: Page, selector: string): Promise<string | null> {
        await page.waitForSelector(selector)
        const html = await page.$$eval(selector, (element: any) => {
            return element[0].textContent
        })
        return html;
    }

    // get array of values based on selector defined
    export async function getValueBasedOnSelector(page: Page, selector: string): Promise<any[] | null> {
        await page.waitForSelector(selector)
        const arrayOfSelectors = await page.$$eval(selector, anchors => {
            return anchors.map(anchor => anchor.textContent)
        })
        return arrayOfSelectors
    }

    export async function getValueBasedOnAttribute(page: Page, selector: string, attribute: string): Promise<any[] | null> {
        const arrayOfAttributes = await page.evaluate(function (selector, attribute) {
            return Array.from(document.querySelectorAll(selector), el => el.getAttribute(attribute))
        }, selector, attribute)

        return arrayOfAttributes
    }

    // parse array of objects in JSON string with the keyword as the key
    export async function parseObjectsToList(jsonString: string, keyword: string) {
        let json: Object[] = JSON.parse(jsonString)
        return json.map((i: any) => i[keyword])

    }

    // to be used for atttributes that uses href
    export function cleanHref(arr: string[], domain: string) {
        return arr.map((el) => {
            return (domain + el)
        })
    }

}
