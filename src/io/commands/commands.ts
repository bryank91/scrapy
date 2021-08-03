import { Command } from 'commander';
import { Shared } from "../actions/shared"
import { Router } from "../commands/routers"
import { OCR } from "../ocr/ocr"

import { FileHandle } from "../file/fileHandle"


export namespace Parse {

    export function options(program: Command, str: string[]) {

        program
            .version('0.1.0')        
            
        program
            .command('compare')
            .argument('<source>','the source file that you want to compare against')
            .argument('<target>','the target file that you want compare against')
            .description('run test commands')
            .action((source,target) => {
                (async () => {
                    let sourceFile = await FileHandle.readFile(source)
                    let targetFile = await FileHandle.readFile(target)
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
            .command('changes')
            .description('get changes for a website based on the selector and comparing to the file source')
            .argument('<url>', 'the url of the site ')  
            .argument('<selector>', 'the selector to target the value at')
            .argument('<file>', 'the file to write/read')
            .option('-f, --forever <seconds>', 'runs forever for a specific amount of time in seconds. lower limit is 60')
            .action((url, selector, file, options) => {   

                let doForever : number = options.forever 
                                         ? parseInt(String(options.forever))
                                         : 0

                function doGetDifference() : void {
                    Shared.getDifferencesUsingFileSystem(url, selector, file, doForever).then((result) => {
                        console.log(result) // if similar return false else true
                    })
                }

                if (doForever >= 60) {  // sets a hard limit   
                    console.log("Running forever function...")                             
                    setInterval(
                        () => { doGetDifference() }
                    , doForever*1000) // it takes in ms
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