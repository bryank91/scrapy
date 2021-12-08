import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"
import { Discord } from '../discord/webhook';

import { FileHandle } from "../file/fileHandle"
import { Data as Config } from "data/config"

import axios from 'axios';

export namespace Parse {

    // returns if options exist for forever. takes in options from commander
    function getDoForever(options: any): number {
        return options.forever
            ? parseInt(String(options.forever))
            : 0
    }

    export function options(program: Command, str: string[]) {

        program
            .version('0.1.0')

        let util = program.command('util')

        util
            .description('utility commands')
            .command('discord')
            .description('run discord commands')
            .argument('<webhook>', 'the webhook that you want to send message to')
            .argument('<content>', 'the string that you want to send')
            .description('Sends a message to the discord webhook')
            .action((webhook, content) => {
                (async () => {
                    await Discord.Webhook.sendMessage(webhook, content)
                })()
            })
        util
            .command('compare')
            .argument('<source>', 'the source file that you want to compare against')
            .argument('<target>', 'the target file that you want compare against')
            .description('compare the differences between 2 files')
            .action((source, target) => {
                (async () => {
                    let sourceFile = await FileHandle.readFile(source)
                    let targetFile = await FileHandle.readFile(target)
                    let isSimilar = await FileHandle.compare(sourceFile, targetFile)

                    await isSimilar ? console.log("It is similar") : console.log("different")
                })()


            })

        program
            .command('ic')
            .description('check inventory level for a product in site')
            .argument('<url>', 'the url of the product')
            .option('--id <discordId>', 'discord id')
            .option('--token <discordToken>', 'discord token')
            .action((url, options) => {
                console.log('Gathering inventory for product...')
                Shared.getInventory(url).then((result) => {
                    if (result.length > 0 && options.id && options.token) {
                        const webhook: Config.Webhook = { id: options.id, token: options.token }
                        Discord.Webhook.productMessage(result, webhook).finally(() => console.log('Done'));
                    } else {
                        console.log(result);
                    }
                })
            })

        let shopify = program.command('shopify')

        shopify
            .description('Shopify tooling')
            .command('products')
            .description('get links of all products periodically')
            .argument('<url>', 'url to check against on. usually products.json')
            .argument('<file>', 'file name to append to')
            .argument('<discordId>', 'discord id')
            .argument('<discordToken>', 'discord token')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((url, file, discordId, discordToken, options) => {
                console.log('Checking shopify products..')
                let doForever = getDoForever(options)

                function getShopifyJson() {
                    axios.get(url).then((response) => {
                        let productJson = response.data
                        let newProductJson: Config.SimpleDiscord[] = productJson["products"].map((product: any) => {
                            let link: string = url.replace('products.json', 'products/' + product.handle)
                            return { title: product.title, url: link }
                        });
                        return newProductJson
                    }).then(async function (res) {
                        let source = await FileHandle.readFile(file)
                        let sourceJSON = await (source.Content.length > 1) ? JSON.parse(source.Content) : []
                        await FileHandle.writeFile(JSON.stringify(res), file)

                        let results = await FileHandle.compareObjects(res, sourceJSON)
                        await console.log(results)
                        return results;

                    }).then((res: Config.SimpleDiscord[]) => {
                        let webhook: Config.Webhook = { id: discordId, token: discordToken }
                        if (res.length > 0) Discord.Webhook.simpleMessage(res, webhook)
                    })
                }

                if (doForever >= 3) {  // sets a hard limit   
                    console.log("Running forever function...")
                    setInterval(
                        () => { getShopifyJson() }
                        , doForever * 1000) // it takes in ms
                } else {
                    console.log('Looking for any changes on the site once...')
                    getShopifyJson()
                }

            })

        shopify.
            command('atc')
            .description('get add to cart links with options and description')
            .argument('<url>', 'url to check against on. usually products.json')
            .argument('<file>', 'file name to append to')
            .argument('<discordId>', 'discord id')
            .argument('<discordToken>', 'discord token')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((url, file, discordId, discordToken, options) => {
                console.log('Checking ATC links')

                let doForever = getDoForever(options)

                function getATC() {
                    axios.get(url).then((response) => {
                        let productJson = response.data
                        let newProductJson: Config.ShopifyATC[] = productJson["products"].map((product: any) => {

                            let variants: any[] = product.variants.map((variant: any) => {
                                let res =
                                {
                                    title: variant.title,
                                    url: url.replace('products.json', 'cart/' + variant.id + ":1"),
                                    option1: variant.option1 !== undefined && variant.option1,
                                    option2: variant.option2 !== undefined && variant.option2,
                                    option3: variant.option3 !== undefined && variant.option3
                                }

                                return res
                            })

                            let res =
                            {
                                title: product.title,
                                url: url.replace('products.json', 'products/' + product.handle),
                                variants: variants
                            }
                            return res
                        });

                        return newProductJson
                    }).then(async function (res) {
                        let source = await FileHandle.readFile(file)
                        let sourceJSON = await (source.Content.length > 1) ? JSON.parse(source.Content) : []
                        await FileHandle.writeFile(JSON.stringify(res), file)

                        let results = await FileHandle.compareObjects(res, sourceJSON)
                        await console.log(results)
                        return results;

                    }).then((res: Config.ShopifyATC[]) => {
                        let webhook: Config.Webhook = { id: discordId, token: discordToken }
                        if (res.length > 0) {
                            res.forEach(element => {
                                Discord.Webhook.atcMessage(element, webhook)
                            });
                        }
                    })
                }

                if (doForever >= 3) {  // sets a hard limit   
                    console.log("Running forever function...")
                    setInterval(
                        () => { getATC() }
                        , doForever * 1000) // it takes in ms
                } else {
                    console.log('Looking for any changes on the site once...')
                    getATC()
                }
            });


        program
            .command('changes')
            .description('get changes for a website based on the selector and comparing to the file source')
            .argument('<profileId>', 'the id from config.discord that you want to use')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((profileId, options) => {

                let doForever = getDoForever(options)
                let profiles = Discord.Webhook.getWebhook(profileId)

                function doGetDifference(forceNotify: boolean = false): void {
                    profiles.forEach(profile => {
                        try {
                            Shared.getDifferencesUsingFileSystem(profile, forceNotify).then((result) => {
                                (async () => {
                                    await console.log(result) // if similar return false else true
                                    if (result.Changes && !result.Error) {
                                        const combined = await result.Content.join("\n")
                                        const parsedProfile: Config.Discord = profile
                                        await Discord.Webhook.sendMessage(parsedProfile, combined)

                                    } else if (!result.Changes && result.Error) {
                                        console.log("Encountered error")
                                        // TODO: alert once
                                    }
                                })()
                            })
                        } catch (e) {
                            console.log(e)
                        }
                    });
                }

                if (doForever >= 5) {  // sets a hard limit   
                    console.log("Running forever function...")
                    setInterval(
                        () => { doGetDifference() }
                        , doForever * 1000) // it takes in ms
                } else {
                    console.log('Looking for any changes on the site once...')
                    let forceNotify = true
                    doGetDifference(forceNotify)
                }
            })

        program
            .command('ocr')
            .description('uses OCR to grab text from a specified img url')
            .argument('<file>', 'relative location of file to perform ocr reading on')
            .argument('[language]', 'the language to perform OCR upon', 'eng')
            .action((file, language) => {
                OCR.convertTextFromFile(file, language)
            })

        program
            .command('server')
            .description('runs a express server')
            .action(() => {
                Router.server()
            })

        program
            .option('-d, --debug', 'enable more verbose logging')

        program
            .parse(str);


        const options = program.opts();

        return options
    }
}