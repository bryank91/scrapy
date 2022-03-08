import { Command, OptionValues } from "commander";
import { Server } from "./server";
import { Parse } from "../commands/commands";
import { Shared } from "../actions/shared";
import { Shopify as ShopifySites } from "../../io/sites/shopify";
import { dbactions as DbActions } from "../database/dbactions";

export namespace Router {
  export function init(argv: string[]): OptionValues {
    const command = new Command();
    return Parse.options(command, argv);
  }

  export async function server() {
    const express = require("express");
    const init = express(); // TODO: typescript definitions

    // initialize the server
    const serverConfig = await Server.run(init);
    const app = serverConfig.app;
    const cluster = serverConfig.cluster;

    app.get("/", (req: unknown, res: any) => {
      res.send("Hello World!");
    });

    app.post("/shopify/inventory", function (req: any, res: any) {
      (async () => {
        const browser = await Shared.initBrowser();
        req.body.Url !== null
          ? Shared.getInventory(browser, req.body.Url).then((result) => {
              res.send(result);
            })
          : res.send("Something went wrong");
      })();
    });

    app.post("/queue", function (req: any, res: any) {
      (async () => {
        ShopifySites.queue(cluster, "bot1");
        res.send("Queued");
      })();
    });

    // TODO: prints out the status of the cluster
    app.post("/status", function (req: any, res: any) {
      (async () => {
        res.send("Status");
      })();
    });

    // CRUD operations for profiles
    app.get("/profile/:id", function (req: any, res: any) {
      (async () => {
        if (req.params.id !== null) {
          console.log("Getting profile..");
          // TODO: database implementation for profiles
        } else {
          res.send();
        }
      })();
    });

    app.post("/profile", function (req: any, res: any) {
      (async () => {
        res.send("Queued");
      })();
    });

    app.put("/profile/:id", function (req: any, res: any) {
      (async () => {
        res.send("Queued");
      })();
    });

    app.delete("/profile/:id", function (req: any, res: any) {
      (async () => {
        res.send("Queued");
      })();
    });

    // get all monitor types
    app.get("/monitor", function (req: any, res: any) {
      (async () => {
        DbActions.findAll("monitors").then((result) => {
          res.json(result);
        });
      })();
    });

    // create a new monitor with differences, monitors, nestedSelectors and templates
    app.post("/monitor", function (req: any, res: any) {
      async () => {
        if (req.body) {
          const difference = req.body.difference;

          // find if difference exist, if not create it
          DbActions.findOne("differences", difference.id).then((result) => {
            const differenceInstance = result; // either differenceInstance or null
            if (!differenceInstance) {
              DbActions.createOne("differences", JSON.stringify(req.body)).then((result) => {
                // res.json(result);
              });
            } else {
              DbActions.updateOne("differences", difference.id, JSON.stringify(req.body)).then(
                (result) => {
                  // res.json(result);
                }
              );
            }
          });

          DbActions.createOne("monitors", JSON.stringify(req.body)).then((result) => {
            res.json(result);
          });

          DbActions.createOne("monitors", JSON.stringify(req.body)).then((result) => {
            res.json(result);
          });
          const monitor = req.body.discordWebhook;
          const nestedSelector = req.body.nestedSelector;
          const template = req.body.template;

          DbActions.createOne("monitors", JSON.stringify(req.body)).then((result) => {
            res.json(result);
          });
        } else {
          res.status(400).json({
            name: "Monitor1",
            siteUrl: "www.google.com",
            selector: "test",
            frequencySeconds: 60,
            discordWebhookId: 1,
            differenceId: 1,
            monitorTypeId: 1,
            nestedSelectorId: 1, // optional
            templateId: 1,
          });
        }
      };
    });

    app.put("/monitor/:id", function (req: any, res: any) {
      (async () => {
        res.send("Queued");
      })();
    });

    app.delete("/monitor/:id", function (req: any, res: any) {
      (async () => {
        res.send("Queued");
      })();
    });
  }
}
