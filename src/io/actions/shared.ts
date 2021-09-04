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

    type browserType = "persist" | "ephemeral"

    const persistentSession = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: chromium.defaultViewport,
        executablePath: chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
        userDataDir: '/tmp/myChromeSession' // this is neat, it stores the last session that is used. 
        // might not useful for all types of monitoring
        // we will need a clear separation from each type of commands
    }

    const session = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: chromium.defaultViewport,
        executablePath: chromium.executablePath,
        headless: false,
        ignoreHTTPSErrors: true,
    }


    export async function initBrowser(browserType?: browserType) {
        if (!browserType || browserType == "ephemeral") {
            return await chromium.puppeteer.launch(session);
        } else if (browserType == "persist") {
            return await chromium.puppeteer.launch(persistentSession);
        }
    }

    export async function getInventory(site: Data.Html.Site) {

        let browser = await initBrowser()


        let pageData = await html.navigate(site, browser)

        let errorLogger = await Discord.Webhook.getErrorLogger()

        if (errorLogger && pageData.Response.status() != 200)
            Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + site)

        let products: any[] = await html.getProducts(pageData.Page)
        let inventory = await html.getSingleTextContentBasedOnSelector(pageData.Page, "#VariantJson-product-template")
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
        (profile: Config.Discord,
            forceNotify: boolean = false) // notifies immediately regardless of fileExist
        : Promise<ReturnComparison> {

        try {
            let browser = await initBrowser()
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
            return {
                Changes: false,
                Content: [], // no changes hence empty array
                Error: e // log the error
            }
        }

    }

}