const chromium = require('chrome-aws-lambda');

import { html } from "../actions/html"
import { Data } from "../../data/html"
import { FileHandle } from "../file/fileHandle";
import { Data as Config } from "../../data/config"
import { Discord } from "../discord/webhook";

export namespace Shared {

    export type ReturnComparison =
        {
            Changes: boolean,
            Content: string[],
            Error: string | boolean
        }

    async function initBrowser() {
        let browser = await chromium.puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process', '--no-zygote'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        return browser
    }

    export async function getInventory(site: Data.Html.Site) {

        const browser = await initBrowser();

        const pageData = await html.navigate(site, browser);

        const errorLogger = await Discord.Webhook.getErrorLogger();

        if (errorLogger && pageData.Response.status() != 200) {
            Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + site);
        }

        const products: Config.ShopifyProduct[] = await html.getProducts(pageData.Page);
        const inventory = await html.getSingleTextContentBasedOnSelector(pageData.Page, "#VariantJson-product-template")
        const listOfInventory: Data.Html.Inventory = (typeof inventory === "string")
            ? await html.parseObjectsToList(inventory, "inventory_quantity")
            : []
        await browser.close()

        return products.map((i: Config.ShopifyProduct, index) => ({
            ...i,
            ...((listOfInventory[index] !== undefined && listOfInventory[index] !== null) && {
                inventory: parseInt(listOfInventory[index])
            })
        }));
    }

    // gets the differences of a site and writes it to a file
    // will be able to run repetitively if a foreverTimer is provided
    // if not provided, defaults to 0 where it runs once
    export async function getDifferencesUsingFileSystem
        (profile: Config.Discord,
            forceNotify: boolean = false) // notifies immediately regardless of fileExist
        : Promise<ReturnComparison> {

        let browser = await initBrowser()
        
        try {
            let pageData = await html.navigate(profile.url, browser)

            let errorLogger = await Discord.Webhook.getErrorLogger()

            if (errorLogger && pageData.Response.status() != 200)
                Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + profile.domain)

            const selectorValues: string[] | null
                = await html.getValueBasedOnSelector(pageData.Page, profile.selector)

            const metadata = await Promise.all(profile.metadataSelector.map(async (el) => {
                let res = await html.getValueBasedOnAttribute(pageData.Page, el.selector, el.attribute)
                if (el.attribute == 'href' && res != null) {
                    return html.cleanHref(res, profile.domain) // allows cleaning of href
                } else {
                    return res
                }
            }))

            const merged: string[] | null | undefined =
                selectorValues?.map((el, i) => {
                    let res = el //TODO: mutable

                    metadata.forEach(element => {
                        res = res + "\n" + element![i]
                    });
                    return res
                })

            let newFileContent: string =
                merged != null || undefined
                    ? merged!.join("\n--\n") // unsafe mode as we handle null/undefined values
                    : ""


            let fileExist = await FileHandle.checkFileExist(profile.file)

            let oldFile = await FileHandle.readFile(profile.file)

            await FileHandle.writeFile(newFileContent, profile.file)
            await browser.close()

            if (!fileExist && !forceNotify) {
                return {
                    Changes: false,
                    Content: newFileContent.split("\n")
                        .filter(x => !oldFile.Content.split("\n").includes(x)),
                    Error: false
                }
            } else if (oldFile.Content == newFileContent) {
                return {
                    Changes: false,
                    Content: [], // no changes hence empty array
                    Error: false
                }
            }
            else {
                return {
                    Changes: true,
                    Content: newFileContent.split("\n")
                        .filter(x => !oldFile.Content.split("\n").includes(x)),
                    Error: false
                }
            }
        } catch (e) {
            await browser.close()
            return {
                Changes: false,
                Content: [], // no changes hence empty array
                Error: e // log the error
            }
            
        }

    }

}