import { Command } from 'commander';
const program = new Command();

export class Parse {
    private _program: any; // Commander

    constructor() {
        this._program = program
    }

    options(str: string []) {

        this._program.option('-d, --debug', 'output extra debugging')
                    .option('-dc <url>, --dailyclack', 'check inventory level for daily clack')
                    .option('-server', 'runs a express server')
        this._program.parse(str);
    
        const options = this._program.opts();
        
        return options
    }
}