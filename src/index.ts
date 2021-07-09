import Puppeteer from "puppeteer";
import { Commands } from "./io/commands/commands"
import { Actions } from "./io/actions/shopify"
import { Data } from "./data/shopify"
import { Command, OptionValues } from "commander";

const command = new Commands
const options:OptionValues = command.parse(process.argv);

if (options.Dc != null) {
    const execute = 
        (async () => {
            const shopify = await new Actions.Shopify(options.Dc)
            const browser: Puppeteer.Browser = await shopify.init()
            let page: Puppeteer.Page = await shopify.navigate(browser);
            let products : any[] = await shopify.getProducts(page)          
            let inventory = await shopify.getContentBasedOnSelector(page, "#VariantJson-product-template")
            let listOfInventory : Data.Inventory = (typeof inventory === "string")  
                                ? await shopify.parseObjectsToList(inventory,"inventory_quantity")
                                : []        
            await browser.close()

            await products.map((i:any, index) => i["inventory"] = listOfInventory[index])
            await console.log(products)
            return products
        })
    execute()
} else {
    console.warn("Something went wrong with the options passed in\n")
    console.warn(options)
}

