const puppeteer = require('puppeteer');
import { Commands } from "./io/commands/commands"
import { Actions } from "./io/actions/shopify"

const command = new Commands
const actions = command.parse(process.argv);
const shopify = new Actions.Shopify

const execute =
    (async () => {
        const browser = await shopify.init()
        let ids = await shopify.getId(browser);
        browser.close()
    })

execute()

