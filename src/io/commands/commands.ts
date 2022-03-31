import { Command } from "commander";
import { Shared } from "../actions/shared";
import { Router } from "../server/routers";
import { OCR } from "../ocr/ocr";
import { Discord } from "../discord/webhook";
import { Data as Config } from "../../data/config";
import { Selenium } from "../actions/selenium";
import { Shopify } from "../actions/shopify";
import { Shopify as ShopifySites } from "../sites/shopify";

import { dbactions } from "../database/dbactions";
import { PuppeteerCluster as Cluster } from "../actions/cluster";

export namespace Parse {
  // returns if options exist for forever. takes in options from commander
  const getDoForever = (options: { forever: string }): number => {
    return options.forever ? parseInt(String(options.forever)) : 0;
  };

  const setForever = (doForever: number, func: Function) => {
    if (doForever >= 1) {
      console.log("Running forever function...");
      setInterval(() => {
        func();
      }, doForever * 1000); // it takes in ms
    } else {
      console.log("Looking for any changes on the site once...");
      func();
    }
  };

  export function options(program: Command, str: string[]) {
    program.version("0.1.0");

    const db = program.command("db");

    db.description("run CRUD commands against database");

    db.command("findOne")
      .description("finds a record by id")
      .argument("<model>", "Model type of record")
      .argument("<recordid>", "Record ID of record")
      .action(async (model, recordid) => {
        const record = await dbactions.findOne(model, recordid);
        console.log(`Found: `, record?.toJSON());
      });

    db.command("findAll")
      .description("finds all records")
      .argument("<model>", "Model type of record")
      .action(async (model) => {
        const records = await dbactions.findAll(model);
        console.log(
          `Found ${records.length}: `,
          records.map((v) => v.toJSON())
        );
      });

    db.command("create")
      .description("creates a new record")
      .argument("<model>", "Model type of record")
      .argument("<json>", "JSON string of record")
      .action(async (model, json) => {
        const record = await dbactions.createOne(model, json);
        console.log("Created record: ", record.toJSON());
      });

    db.command("update")
      .description("updates an existing record by id")
      .argument("<model>", "Model type of record")
      .argument("<recordid>", "Record ID to update")
      .argument("<json>", "JSON string of record")
      .action(async (model, recordid, json) => {
        await dbactions.updateOne(model, recordid, json);
        console.log(`Updated record given id: ${recordid}`);
      });

    db.command("delete")
      .description("deletes a record by id")
      .argument("<model>", "Model type of record")
      .argument("<recordid>", "Record ID to delete")
      .action(async (model, recordid) => {
        await dbactions.deleteOne(model, recordid);
        console.log(`Deleted record given id: ${recordid}`);
      });

    const util = program.command("util");

    util
      .description("utility commands")
      .command("discord")
      .description("run discord commands")
      .argument("<webhook>", "the webhook that you want to send message to")
      .argument("<content>", "the string that you want to send")
      .description("Sends a message to the discord webhook")
      .action((webhook, content) => {
        (async () => {
          await Discord.Webhook.sendMessage(webhook, content);
        })();
      });
    util
      .command("compare")
      .argument("<source>", "the name in the differences table")
      .argument("<target>", "the name in the differences table")
      .description("compare the differences between 2 db entries")
      .action((source, target) => {
        (async () => {
          const sourceContents = await dbactions.getContentsByName(source);
          const targetContents = await dbactions.getContentsByName(target);
          const isSimilar = sourceContents === targetContents;

          (await isSimilar) ? console.log("It is similar") : console.log("different");
        })();
      });

    program
      .command("ic")
      .description("check inventory level for a product in site")
      .argument("<url>", "the url of the product")
      .option("--id <discordId>", "discord id")
      .option("--token <discordToken>", "discord token")
      .option("--cluster", "runs using puppeteer cluster")
      .action(async (url, options) => {
        console.log("Gathering inventory for product...");
        if (options.cluster) {
          await console.log("Running cluster with: " + url);
          Cluster.getInventory(url).then((result) => {
            console.log(result);
          });
        } else {
          const browser = await Shared.initBrowser();
          Shared.getInventory(browser, url).then((result) => {
            if (result.length > 0 && options.id && options.token) {
              const webhook: Config.Webhook = {
                id: options.id,
                token: options.token,
              };
              Discord.Webhook.productMessage(result, webhook).finally(() => console.log("Done"));
            } else {
              console.log(result);
            }
          });
        }
      });

    const shopify = program.command("shopify");

    shopify.description("Shopify tooling");

    shopify
      .command("products")
      .description("get links of all products periodically")
      .argument("<url>", "url to check against on. usually products.json")
      .argument("<file>", "file name to append to")
      .argument("<discordId>", "discord id")
      .argument("<discordToken>", "discord token")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .action((url, file, discordId, discordToken, options) => {
        console.log("Checking shopify products..");
        const doForever = getDoForever(options);

        const shopify: Shopify.Construct = {
          url,
          file,
          discordId,
          discordToken,
        };

        setForever(doForever, () => {
          Shopify.getShopifyJson(shopify);
        });
      });

    shopify
      .command("profile")
      .description("periodically checks stock based on profiles")
      .argument("<profileId>", "the id from config.discord that you want to use")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .action((profileId, options) => {
        const profiles = Discord.Webhook.getWebhook(profileId);
        const doForever = getDoForever(options);
        setForever(doForever, () => {
          try {
            Shopify.getShopifyJsonProfile(profiles);
          } catch (e) {
            console.log(e);
          }
        });
      });

    shopify
      .command("atc")
      .description("get add to cart links with options and description")
      .argument("<url>", "url to check against on. usually products.json")
      .argument("<file>", "file name to append to")
      .argument("<discordId>", "discord id")
      .argument("<discordToken>", "discord token")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .action((url, file, discordId, discordToken, options) => {
        console.log("Checking ATC links");

        const shopify: Shopify.Construct = {
          url,
          file,
          discordId,
          discordToken,
        };

        const doForever = getDoForever(options);
        setForever(doForever, () => {
          Shopify.getATC(shopify);
        });
      });

    shopify
      .command("checkout")
      .description("automatically checkout based on the the profile set")
      .argument("<profileId>", "the id from sites profile that you want to use")
      .option(
        "-d, --debug",
        "enable debug mode. will not send webhooks and enable headless mode <Under Development>"
      )
      .action(async (profileId, options) => {
        console.log(options);
        console.log("Running shopify checkout based on: ", profileId);
        // TODO: concurrency adjustor for checkout function

        const cluster = await Cluster.initBrowser();
        await ShopifySites.queue(cluster, profileId);
        await cluster.close();
      });

    const puppeteer = program.command("puppeteer");
    puppeteer.description("Puppeteer type commands");

    puppeteer
      .command("changes")
      .description(
        "get changes for a website based on the selector and comparing to the file source with selenium"
      )
      .argument("<profileId>", "the id from config.discord that you want to use")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .option("--cluster", "run using puppeteer cluster")
      .action((profileId, options) => {
        const profiles = Discord.Webhook.getWebhook(profileId);
        const doForever = getDoForever(options);
        if (options.cluster) {
          (async () => {
            const cluster = await Cluster.initBrowser();
            setForever(doForever, () => {
              (async () => {
                await Cluster.queueGetDifference(profiles, cluster);
              })();
            });
            // await cluster.close();
          })();
        } else {
          setForever(doForever, () => {
            (async () => {
              await Selenium.doGetDifference(profiles);
            })();
          });
        }
      });

    puppeteer
      .command("automate")
      .description("automatically buy the item based on given id")
      .argument("<profileId>", "the id from config.discord that you want to use");

    const crawler = program.command("crawler");
    crawler.description("Crawler commands. Great for low resource monitoring");

    crawler
      .command("monitor")
      .description("monitor based on discord profiles set")
      .argument("<profileId>","profile you would like to monitor in discord.json")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds"
      ).action((profileId, options) => {
      
      });

    program
      .command("ocr")
      .description("uses OCR to grab text from a specified img url")
      .argument("<file>", "relative location of file to perform ocr reading on")
      .argument("[language]", "the language to perform OCR upon", "eng")
      .action((file, language) => {
        OCR.convertTextFromFile(file, language);
      });

    program
      .command("server")
      .description("runs a express server")
      .action(async () => {
        await Router.server();
      });

    program.option("-d, --debug", "enable more verbose logging");

    program.parse(str);

    const options = program.opts();

    return options;
  }
}
