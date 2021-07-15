import { Command, OptionValues } from "commander"

import { Shared } from "../actions/shared"
import { Server } from "../server/server"
import { Parse } from "../commands/commands"

export namespace Router {
    
    export function init(argv: any): OptionValues {
        const command = new Command()
        const parse = Parse.options(command,argv)
        return parse.options(argv);
    }

    export function routeOptions(options: OptionValues) {
        if (options.Dc != null) {
            Shared.execute(options.Dc).then((result) => {
                console.log(result)
            })
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
