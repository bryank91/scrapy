const chromium = require('chrome-aws-lambda');

import { html } from "../actions/html"
import { Data } from "../../data/html"
import { FileHandle } from "../file/fileHandle";

export namespace Shared {

    export type ReturnComparison = 
        {
            Changes: boolean,
            Content: string[]
        }

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

    export async function getInventory(site: Data.Html.Site) {

        let browser = await initBrowser()

        let page = await html.navigate(site, browser)
        let products: any[] = await html.getProducts(page)
        let inventory = await html.getSingleTextContentBasedOnSelector(page, "#VariantJson-product-template")
        let listOfInventory: Data.Html.Inventory = (typeof inventory === "string")
            ? await html.parseObjectsToList(inventory, "inventory_quantity")
            : []
        await browser.close()

        await products.map((i: any, index) => i["inventory"] = listOfInventory[index])
        return products
    }

    // gets the differences of a site and writes it to a file
    // will be able to run repetitively if a foreverTimer is provided
    // if not provided, defaults to 0 where it runs once
    export async function getDifferencesUsingFileSystem
        (site: Data.Html.Site, selector: string, file: string, foreverTimer: number = 0)
        : Promise<ReturnComparison>
    {

        let browser = await initBrowser()
        let page = await html.navigate(site, browser)

        const res: string[] | null 
            = await html.getValueBasedOnSelector(page, selector)            

        let newFileContent : string = 
            res != null || undefined
            ? res!.join("\n") // unsafe mode as we handle null/undefined values
            : ""

        let oldFile = await FileHandle.readFile(file)   

        // write to file
        await FileHandle.writeFile(newFileContent, file)
        await browser.close()

        if (oldFile.Content == newFileContent) 
        { 
            return {
                Changes: false,
                Content: [] // no changes hence empty array
            }                             
        } 
        else 
        { 
            return {
                Changes: true,
                Content: newFileContent.split("\n")
                            .filter(x => !oldFile.Content.split("\n").includes(x))
            }      
        }

    }

    export async function foreverFunction(fn: () => Promise<ReturnComparison>) {

    }
}