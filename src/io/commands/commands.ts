import { Command } from "commander";
import { Shared } from "../actions/shared";
import { Router } from "../commands/routers";
import { OCR } from "../ocr/ocr";
import { Discord } from "../discord/webhook";
import { Data as Config } from "../../data/config";
import { Selenium } from "../actions/selenium";
import { Cheerio } from "../actions/cheerio";
import { Shopify } from "../actions/shopify";
import { dbactions } from "./dbactions";

export namespace Parse {
  // returns if options exist for forever. takes in options from commander
  const getDoForever = (options: { forever: string }): number => {
    return options.forever ? parseInt(String(options.forever)) : 0;
  };

  const setForever = (doForever: number, func: Function) => {
    if (doForever >= 3) {
      // sets a hard limit
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
      .action((url, options) => {
        console.log("Gathering inventory for product...");
        Shared.getInventory(url).then((result) => {
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
          Shopify.getShopifyJsonProfile(profiles);
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

    const selenium = program.command("selenium");
    selenium.description("Selenium commands");

    selenium
      .command("changes")
      .description(
        "get changes for a website based on the selector and comparing to the file source with selenium"
      )
      .argument("<profileId>", "the id from config.discord that you want to use")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .action((profileId, options) => {
        const profiles = Discord.Webhook.getWebhook(profileId);
        const doForever = getDoForever(options);
        setForever(doForever, () => {
          Selenium.doGetDifference(profiles);
        });
      });

    const cheerio = program.command("cheerio");
    cheerio.description("Cheerio commands");

    cheerio
      .command("changes")
      .description(
        "get changes for a website based on the selector and comparing to the file source with cheerio"
      )
      .argument("<profileId>", "the id from config.discord that you want to use")
      .option(
        "-f, --forever <seconds>",
        "runs forever for a specific amount of time in seconds. lower limit is 60"
      )
      .action((profileId, options) => {
        const profiles = Discord.Webhook.getWebhook(profileId);
        const doForever = getDoForever(options);
        setForever(doForever, () => {
          Cheerio.doGetDifference(profiles);
        });
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
      .action(() => {
        Router.server();
      });

    program.option("-d, --debug", "enable more verbose logging");

    program.parse(str);

    const options = program.opts();

    return options;
  }
}
