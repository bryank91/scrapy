import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"
import { Discord } from '../discord/webhook';

import { FileHandle } from "../file/fileHandle"

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
            .command('dc')
            .description('check inventory level for daily clack')
            .argument('<url>', 'the url of the site')
            .action((url) => {
                console.log('Processing daily clack...')
                Shared.getInventory(url).then((result) => {
                    console.log(result)
                })
            })

        program
            .command('changes')
            .description('get changes for a website based on the selector and comparing to the file source')
            .argument('<profileId>', 'the id from config.discord that you want to use')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((profileId, options) => {

                let doForever = getDoForever(options)
                let profiles = Discord.Webhook.getWebhook(profileId)

                function doGetDifference(): void {
                    profiles.forEach(profile => {
                        Shared.getDifferencesUsingFileSystem(profile.url, profile.selector, profile.file, doForever).then((result) => {
                            (async () => {
                                await console.log(result) // if similar return false else true
                                if (result.Changes) {
                                    const combined = await result.Content.join("\n")
                                    await Discord.Webhook.sendMessage(profileId, combined)
                                }
                            })()
                        })
                    });
                }

                if (doForever >= 60) {  // sets a hard limit   
                    console.log("Running forever function...")
                    setInterval(
                        () => { doGetDifference() }
                        , doForever * 1000) // it takes in ms
                } else {
                    console.log('Looking for any changes on the site once...')
                    doGetDifference()
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