import { Command } from 'commander';
const program = new Command();

export class Commands {
    program: any; // Commander

    constructor() {
        this.program = program
    }

    parse(str: string []) {

        this.program.option('-d, --debug', 'output extra debugging')
        this.program.parse(str);
    
        const options = this.program.opts();
        
        return options
    }
}