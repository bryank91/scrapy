import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"

export namespace Parse {

    export function options(program: Command, str: string []) {

        program
            .version('0.1.0')

        program
            .command('test')
            .description('run test commands')

        program
            .command('dc <url>')
            .description('check inventory level for daily clack')
            .action((url) => {
                console.log('Processing daily clack...')
                Shared.getInventory(url).then((result) => {
                    console.log(result)
                })
            })

        program
            .command('ch <url>')
            .description('get changes for a website')

        program
            .command('ocr <file> <language>')
            .description('uses OCR to grab text from a specified img url')
            .action((file,language) => {
                // TODO: currently default to english only for now                
                OCR.convertTextFromFile(file, "eng")     
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