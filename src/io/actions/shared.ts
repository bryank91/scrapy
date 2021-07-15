const chromium = require('chrome-aws-lambda');

import { Shopify } from "../actions/shopify"
import { Data } from "../../data/shopify"

export namespace Shared {
    export async function execute(site: string) {
        
            let browser = await chromium.puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: true,
                ignoreHTTPSErrors: true,
            });

            let page = await Shopify.navigate(site,browser)
            let products : any[] = await Shopify.getProducts(page)          
            let inventory = await Shopify.getContentBasedOnSelector(page, "#VariantJson-product-template")
            let listOfInventory : Data.Inventory = (typeof inventory === "string")  
                                ? await Shopify.parseObjectsToList(inventory,"inventory_quantity")
                                : []        
            await browser.close()

            await products.map((i:any, index) => i["inventory"] = listOfInventory[index])
            return products
    }
}