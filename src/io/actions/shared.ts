const chromium = require('chrome-aws-lambda');

import { html } from "../actions/html"
import { HtmlTypes } from "../../data/htmlTypes"

export namespace Shared {

    async function initBrowser() {
        let browser = await chromium.puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        return browser
    }

    export async function getInventory(site: HtmlTypes.Site) {

        let browser = await initBrowser()

        let page = await html.navigate(site, browser)
        let products: any[] = await html.getProducts(page)
        let inventory = await html.getSingleTextContentBasedOnSelector(page, "#VariantJson-product-template")
        let listOfInventory: HtmlTypes.Inventory = (typeof inventory === "string")
            ? await html.parseObjectsToList(inventory, "inventory_quantity")
            : []
        await browser.close()

        await products.map((i: any, index) => i["inventory"] = listOfInventory[index])
        return products
    }

    export async function getChanges(site: HtmlTypes.Site, selector: string) {

        let browser = await initBrowser()

        let page = await html.navigate(site, browser)

        // use this for debugging
        // console.log(await page.content())

        const res: string[] | null = await html.getValueBasedOnSelector(page, selector)
        res?.map(i => {
            console.log(i)
        })

        await browser.close()

    }
}