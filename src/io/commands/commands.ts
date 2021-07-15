import { Command } from 'commander';

export namespace Parse {

    export function options(program: Command, str: string []) {

        program.option('-d, --debug', 'output extra debugging')
                    .option('-dc <url>, --dailyclack', 'check inventory level for daily clack')
                    .option('-server', 'runs a express server')
        program.parse(str);
    
        const options = program.opts();
        
        return options
    }
}