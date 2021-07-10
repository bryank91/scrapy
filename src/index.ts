import { OptionValues } from "commander"
import { Router } from "./io/commands/routers"

const route = new Router(process.argv)
const options: OptionValues = route.init()
route.routeOptions(options)

