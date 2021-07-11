import { OptionValues } from "commander"
import { Router } from "./io/commands/routers"
import { Server } from "./io/server/server"
const sls = require('serverless-http');

// if no arguments are passed, default to server
if (process.argv.length > 2) {
        console.log("Running with arguments")
        const route = new Router(process.argv)
        const options: OptionValues = route.init()
        route.routeOptions(options)
} else {
        console.log("Running server")
        const express = require('express')
        const init = express()
        const server = new Server(init)
        server.run()
}
