const chromium = require('chrome-aws-lambda');

import { Shopify } from "../actions/shopify"
import { Data } from "../../data/shopify"

export namespace Shared {
    export async function execute(site: string) {
        
            let browser = await chromium.puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            });

            let shopify = new Shopify(site)
            let page = await shopify.navigate(browser);
            let products : any[] = await shopify.getProducts(page)          
            let inventory = await shopify.getContentBasedOnSelector(page, "#VariantJson-product-template")
            let listOfInventory : Data.Inventory = (typeof inventory === "string")  
                                ? await shopify.parseObjectsToList(inventory,"inventory_quantity")
                                : []        
            await browser.close()

            await products.map((i:any, index) => i["inventory"] = listOfInventory[index])
            return products
    }
}