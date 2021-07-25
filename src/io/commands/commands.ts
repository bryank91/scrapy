import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"

export namespace Parse {

    export function options(program: Command, str: string[]) {

        program
            .version('0.1.0')

        program
            .command('test')
            .description('run test commands')

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
            .command('ch')
            .description('get changes for a website based on the url and selector')
            .argument('<url>', 'the url of the site ')
            .argument('<selector>', 'the selector to target the value at')
            .action((url, selector) => {
                console.log('Looking for any changes on the site..')
                const res = Shared.getChanges(url, selector)
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