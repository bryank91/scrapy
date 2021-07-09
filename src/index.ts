const puppeteer = require('puppeteer');
import { Commands } from "./io/commands/commands"
import { Actions } from "./io/actions/shopify"
import Puppeteer from "puppeteer";

const command = new Commands
const actions = command.parse(process.argv);
const shopify = new Actions.Shopify

const execute =
    (async () => {
        const browser: Puppeteer.Browser = await shopify.init()
        let page: Puppeteer.Page = await shopify.navigate(browser);
        let products: any[] = await shopify.getProducts(page);
        let inventory: any[] = await shopify.getInventory(page)
        console.log(inventory)
        browser.close()
    })

execute()

