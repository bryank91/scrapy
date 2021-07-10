import Puppeteer from "puppeteer"
import { OptionValues } from "commander"

import { Shopify } from "../actions/shopify"
import { Data } from "../../data/shopify"
import { Hosting as Server } from "../server/server"
import { Parse } from "../commands/commands"

export class Router {
    
    private _argv: string[];

    constructor (_argv: string[]) {
        this._argv = _argv
    }

    init(): OptionValues {
        const parse = new Parse()
        return parse.options(this._argv);
    }

    routeOptions(options: OptionValues) {
        if (options.Dc != null) {
            const execute = 
                (async () => {
                    const shopify = await new Shopify(options.Dc)
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
        } else if (options.Server == true) {
            const express = require('express')
            const app = express()
            const server = new Server(app)
            server.run()
        } else {
            console.warn("Something went wrong with the options passed in\n")
            console.warn(options)
        }
    }
}
