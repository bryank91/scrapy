import { Command, OptionValues } from "commander"

import { Shared } from "../actions/shared"
import { Server } from "../server/server"
import { Parse } from "../commands/commands"
import { OCR } from "../ocr/ocr"

export namespace Router {
    
    export function init(argv: any): OptionValues {
        const command = new Command()
        return Parse.options(command,argv)
    }
}
