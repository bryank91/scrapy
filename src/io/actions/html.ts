import { Browser, HTTPResponse, Page } from "puppeteer-core";
import { Data as Config } from "../../data/config";

declare const window: any;

export namespace html {

    type PageData = {
        Page: Page
        Response: HTTPResponse
    }

    // goto param takes in the url and browser takes in the lamda pupeteer browser
    export async function navigate(goto: string, browser: Browser): Promise<PageData> {
        let page = await browser.newPage();

        // set extra headers
        await page.setExtraHTTPHeaders(Config.headers)

        let response = await page.goto(goto);

        return { Page: page, Response: response }
    }

    // async get the id 
    export async function getProducts(page: Page) {
        let products: Config.ShopifyProduct[] =
            await page.evaluate(() => {
                const { variants } = window.ShopifyAnalytics.meta.product;
                return variants; // array of shopify objects with id and names
            })
        return products;

    } // return browser and id of array

    export async function getSingleTextContentBasedOnSelector(page: Page, selector: string): Promise<string | null> {
        const timeoutInSeconds = 10;
        try {
            await page.waitForSelector(selector, { timeout: timeoutInSeconds * 1000 });
        } catch (e: unknown) {
            if ((e as Error)?.name === 'TimeoutError') {
                console.log(`Timed out after ${timeoutInSeconds} seconds - no access to inventory`);
                return null;
            }
        }
        const html = await page.$$eval(selector, (element: any) => {
            return element[0].textContent
        })
        return html;
    }

    // get array of values based on selector defined
    // if not found in timeout seconds, return null
    export async function getValueBasedOnSelector(page: Page, selector: string, timeout: number = 5000): Promise<any[] | null> {
        try {
            await page.waitForSelector(selector, {timeout: timeout}) != null
            const arrayOfSelectors = await page.$$eval(selector, anchors => {
                return anchors.map(anchor => anchor.textContent)
            })
            return arrayOfSelectors
        } catch (e) {
            console.log('Timeout limit reached. Exiting..')
            return null
        }
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
