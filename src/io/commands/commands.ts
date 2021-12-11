import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"
import { Discord } from '../discord/webhook'
import { FileHandle } from "../file/fileHandle"
import { Data as Config } from "data/config"
import { Selenium } from 'io/actions/selenium'
import { Cheerio } from 'io/actions/cheerio'
import { Shopify } from 'io/actions/shopify';


import axios from 'axios';

export namespace Parse {

    // returns if options exist for forever. takes in options from commander
    function getDoForever(options: any): number {
        return options.forever
            ? parseInt(String(options.forever))
            : 0
    }

    function setForever(doForever: number, func:Function) {
        if (doForever >= 3) {  // sets a hard limit   
            console.log("Running forever function...")
            setInterval(
                () => { func() }
                , doForever * 1000) // it takes in ms
        } else {
            console.log('Looking for any changes on the site once...')
            func();
        }
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
                console.log('Gathering inventory for product...');
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

        shopify
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

                let shopify : Shopify.Construct = {
                    url: url,
                    file: file,
                    discordId: discordId,
                    discordToken: discordToken
                }

                setForever(doForever, () => { Shopify.getShopifyJson(shopify) })

            })

        shopify
            .command('profile')
            .description('periodically checks stock based on profiles')
            .argument('<profileId>', 'the id from config.discord that you want to use')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((profileId, options) => {
                let profiles = Discord.Webhook.getWebhook(profileId)
                let doForever = getDoForever(options)
                setForever(doForever, () => { Shopify.getShopifyJsonProfile(profiles) })
            });

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

                let shopify : Shopify.Construct = {
                    url: url,
                    file: file,
                    discordId: discordId,
                    discordToken: discordToken
                }

                let doForever = getDoForever(options)
                setForever(doForever, () => { Shopify.getATC(shopify) })
            });

        let selenium = program.command('selenium')
        selenium.description('Selenium commands')

        selenium
            .command('changes')
            .description('get changes for a website based on the selector and comparing to the file source with selenium')
            .argument('<profileId>', 'the id from config.discord that you want to use')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((profileId, options) => {
                let profiles = Discord.Webhook.getWebhook(profileId)
                let doForever = getDoForever(options)
                setForever(doForever, () => { Selenium.doGetDifference(profiles) })
            })

        let cheerio = program.command('cheerio')
        cheerio.description('Cheerio commands')
        
        cheerio
            .command('changes')
            .description('get changes for a website based on the selector and comparing to the file source with cheerio')
            .argument('<profileId>', 'the id from config.discord that you want to use')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((profileId, options) => {

                let profiles = Discord.Webhook.getWebhook(profileId)
                let doForever = getDoForever(options)
                setForever(doForever, () => { Cheerio.doGetDifference(profiles) })
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