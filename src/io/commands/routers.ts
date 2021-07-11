const chromium = require('chrome-aws-lambda');
import { OptionValues } from "commander"

import { Shopify } from "../actions/shopify"
import { Data } from "../../data/shopify"
import { Server } from "../server/server"
import { Parse } from "../commands/commands"
import Chromium from "chrome-aws-lambda";

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
                    let browser = await chromium.puppeteer.launch({
                        args: chromium.args,
                        defaultViewport: chromium.defaultViewport,
                        executablePath: await chromium.executablePath,
                        headless: true,
                        ignoreHTTPSErrors: true,
                      });

                    let shopify = new Shopify(options.Dc)
                    let page = await shopify.navigate(browser);
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
