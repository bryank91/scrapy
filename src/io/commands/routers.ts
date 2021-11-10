import { Command, OptionValues } from "commander"

import { Server } from "../server/server"
import { Commands } from "../commands/commands"

export namespace Router {
    
    export function init(argv: any): OptionValues {
        const command = new Command()
        return Commands.Parse.options(command,argv)
    }

    export function server() {
        console.log("Running server")
        const express = require('express')
        const init = express()
        const server = new Server(init)
        server.run()
    }

}
