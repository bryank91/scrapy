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

    export function routeOptions(options: OptionValues) {
        if (options.Dc != null) {
            Shared.getInventory(options.Dc).then((result) => {
                console.log(result)
            })
        } else if (options.Ocr != null) {            
            const _ = OCR.convertTextFromFile(options.Ocr, "eng")        
        } else if (options.Server == true) {
            const express = require('express')
            const app = express()
            const server = new Server(app)
            server.run()
        } else {
            console.warn("Something went wrong with the options passed in\n")
            console.warn(options)
        }
    }
}
