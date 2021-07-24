import { Command } from 'commander';

export namespace Parse {

    export function options(program: Command, str: string []) {

        program
            .version('0.1.0')
            .option('-d, --debug', 'output extra debugging')
            .option('-dc <url>, --dailyclack', 'check inventory level for daily clack')
            .option('-ocr <url>', '--tesseract', 'uses OCR to grab text from a specified img url')
            .option('-server', 'runs a express server')
            .parse(str);
    
        const options = program.opts();
        
        return options
    }
}