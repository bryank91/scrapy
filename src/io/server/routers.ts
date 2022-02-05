import { Command, OptionValues } from "commander";
import { Server } from "./server";
import { Parse } from "../commands/commands";
import { Shared } from "../actions/shared";
import { Shopify as ShopifySites } from "io/sites/shopify";

export namespace Router {
  export function init(argv: string[]): OptionValues {
    const command = new Command();
    return Parse.options(command, argv);
  }

  export async function server() {
    console.log("Running server");
    const express = require("express");
    const appInit = express();

    // initialize the server
    const serverConfig = await Server.run(appInit);
    const app = serverConfig.app;
    const cluster = serverConfig.cluster;

    app.get("/", (req: unknown, res: any) => {
      res.send("Hello World!");
    });

    app.post("/getInventory", function (req: any, res: any) {
      (async () => {
        const browser = await Shared.initBrowser();
        req.body.Url !== null
          ? Shared.getInventory(browser, req.body.Url).then((result) => {
              res.send(result);
            })
          : res.send("Something went wrong");
      })();
    });

    app.post("/tryPuppeteer", function (req: any, res: any) {
      (async () => {
        ShopifySites.queue(cluster, "bot1");
        res.send("Queued");
      })();
    });
  }
}
