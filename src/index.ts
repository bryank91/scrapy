import Puppeteer from "puppeteer";
import { Commands } from "./io/commands/commands"
import { Actions } from "./io/actions/shopify"
import { Data } from "./data/shopify"

const command = new Commands
const actions = command.parse(process.argv);
const shopify = new Actions.Shopify

const execute =
    (async () => {
        const browser: Puppeteer.Browser = await shopify.init()
        let page: Puppeteer.Page = await shopify.navigate(browser);
        let products : any[] = await shopify.getProducts(page)          
        let productJSON = await shopify.getContentBasedOnSelector(page, "#VariantJson-product-template")
        let listOfInventory : Data.Inventory = (typeof productJSON === "string")  
                             ? await shopify.parseObjectsToList(productJSON,"inventory_quantity")
                             : []
                             
        products.map((i:any, index) => i["inventory"] = listOfInventory[index])
        browser.close()
    })

execute()

