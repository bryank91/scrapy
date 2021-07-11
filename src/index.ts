import { OptionValues } from "commander"
import { Router } from "./io/commands/routers"
import { Server } from "./io/server/server"
const sls = require('serverless-http');

// if no arguments are passed, default to server
switch (process.argv.length > 1) {
    case false:
            const route = new Router(process.argv)
            const options: OptionValues = route.init()
            route.routeOptions(options)
    case true:
            const express = require('express')
            const init = express()
            const server = new Server(init)
            const app = server.run()
            module.exports.handler = sls(app);
}
