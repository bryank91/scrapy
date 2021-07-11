const chromium = require('chrome-aws-lambda');
import { OptionValues } from "commander"

import { Shared } from "../actions/shared"
import { Server } from "../server/server"
import { Parse } from "../commands/commands"

export class Router {
    
    private _argv: string[];

    constructor (_argv: string[]) {
        this._argv = _argv
    }

    init(): OptionValues {
        const parse = new Parse()
        return parse.options(this._argv);
    }

    routeOptions(options: OptionValues) {
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
