import { OptionValues } from "commander"
import { Router } from "./io/commands/routers"

export async function handler(context, event, callback) {

    // need to get data and pass to router

    const route = new Router(process.argv)
    const options: OptionValues = route.init()
    route.routeOptions(options)

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: `Hello, world! Your function executed successfully!`,
            },
            null,
            2
        ),
    };
};
