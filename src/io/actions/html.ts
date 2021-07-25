import { Browser, Page } from "puppeteer-core"

declare const window: any;

export namespace html {

    // goto param takes in the url and browser takes in the lamda pupeteer browser
    export async function navigate(goto: string, browser: Browser) {
        let page = await browser.newPage();
        
        // set extra headers
        await page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36 Edg/86.0.622.69',
            'upgrade-insecure-requests': '1',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,en;q=0.8',
            'Referer': 'http://www.google.com/'
        })
    

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
        const arrayOfSelectors = await page.$$eval(selector, anchors => {
            return anchors.map(anchor => anchor.textContent)
        })
        return arrayOfSelectors
    }

    // parse array of objects in JSON string with the keyword as the key
    export async function parseObjectsToList(jsonString: string, keyword: string) {
        let json: Object [] = JSON.parse(jsonString)
        return json.map((i:any) => i[keyword])
        
    }


}
