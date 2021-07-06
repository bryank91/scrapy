const { Commander } = require('commander');
const program = new Commander();

class Command {
    program: any; // Commander

    constructor() {
        this.program = program
    }

    parse(str: string []) {
        return 1
    }
}