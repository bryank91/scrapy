import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"

import { FileHandle } from "../file/fileHandle"
import { FileTypes } from "../../data/fileTypes"


export namespace Parse {

    export function options(program: Command, str: string[]) {

        program
            .version('0.1.0')

        program
            .command('test')
            .argument('<source>','the source file that you want to compare against')
            .argument('<target>','the target file that you want compare against')
            .description('run test commands')
            .action((source,target) => {
                (async () => {
                    FileHandle.writeFile("hello world", source)
                    await FileHandle.writeFile("hello world2", target)

                    let sourceFile = await FileHandle.readFile('hello.txt')
                    let targetFile = await FileHandle.readFile('hello2.txt')
                    let isSimilar = await FileHandle.compare(sourceFile,targetFile)

                    await isSimilar ? console.log("It is similar") : console.log("different")                
                })();

                
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

        // TODO: can be improve to support multiple selectors
        program
            .command('ch')
            .description('get changes for a website based on the selector and comparing to the file source')
            .argument('<url>', 'the url of the site ')
            .argument('<selector>', 'the selector to target the value at')
            .argument('[file]', 'the file to write/read')
            .action((url, selector, file) => {
                console.log('Looking for any changes on the site..')
                const res = Shared.getChanges(url, selector, file)
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