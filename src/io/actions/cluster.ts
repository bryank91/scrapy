import { Cluster } from "puppeteer-cluster3";
import { Data as Config } from "../../data/config";
import { Data as html } from "../../data/html"; // data
import { Discord } from "../discord/webhook";
import { html as Html } from "./html"; // actions
import { Page } from "puppeteer-core";
import { Shared } from "./shared";

const puppeteerCore = require("puppeteer-core");
const { addExtra } = require("puppeteer-extra");
const Stealth = require("puppeteer-extra-plugin-stealth");

export namespace PuppeteerCluster {
  type ClusterRunner = Cluster<Page, unknown>;

  // TODO: future implementation will include our own proxy services
  // let proxy_server = "proxy.soax.com:9000";
  // let user = "some_user_name";
  // let pass = "some_password";

  const puppeteer = addExtra(puppeteerCore);
  puppeteer.use(Stealth());

  export function getConfig(): Config.Cluster {
    try {
      console.log(Config.cluster);
      return Config.cluster;
    } catch (e) {
      console.log("Unable to retrieve cluster, reverting to default:\n" + e);
      return {
        maxConcurrency: 2,
        monitor: false,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
      };
    }
  }

  export async function initBrowser() {
    const config = getConfig();
    const cluster = await Cluster.launch({
      puppeteer,
      puppeteerOptions: {
        headless: true, // set to false for debugging
        args: [
          //'--proxy-server=' + proxy_server, TODO: setup proxy
          // '--single-process',
          "--no-zygote",
          "--no-sandbox",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
        devtools: false, // use this to debug in console.log with headless false
      },
      maxConcurrency: config.maxConcurrency,
      concurrency: Cluster.CONCURRENCY_CONTEXT, // TODO: defaults to CONTEXT for now
      monitor: config.monitor,
      timeout: config.timeout,
    });

    return cluster;
  }

  export async function getInventory(site: string) {
    const cluster = await initBrowser();
    const clusterConfig = PuppeteerCluster.getConfig();

    await cluster.task(async ({ page, data: url }) => {
      const pageC = page as unknown as Page; // how puppeteer-core and puppeteer extra works?
      const response = await pageC.goto(url, {
        timeout: clusterConfig.timeout,
      });
      const errorLogger = await Discord.Webhook.getErrorLogger();

      if (errorLogger && response.status() !== 200) {
        Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + site);
      }

      const products: Config.ShopifyProduct[] = await Html.getProducts(pageC);
      const inventory = await Html.getSingleTextContentBasedOnSelector(
        pageC,
        "#VariantJson-product-template"
      );

      const listOfInventory: html.Html.Inventory =
        typeof inventory === "string"
          ? await Html.parseObjectsToList(inventory, "inventory_quantity")
          : [];

      return products.map((i: Config.ShopifyProduct, index) => ({
        ...i,
        ...(listOfInventory[index] !== undefined &&
          listOfInventory[index] !== null && {
            inventory: parseInt(listOfInventory[index]),
          }),
      }));
    });

    await cluster.queue(site);

    await cluster.idle();
    await cluster.close();
  }

  async function findKeyword(
    profile: Config.Discord,
    data: Shared.ReturnComparison
  ): Promise<void> {
    let reg = new RegExp(profile.title, "gi");

    let res = data.Content.filter((x) => {
      let match = x.match(reg);
      if (match != null && match.length > 0) {
        console.log("Found the match: " + match);
        return true;
      } else {
        return false;
      }
    });

    console.log(res);
    if (res != null && res.length > 0) {
      await Discord.Webhook.singleMessage(
        "@here Found " + profile.title + " in keyword",
        profile.webhook
      );
    }
  }

  export async function queueGetDifference(profiles: Config.Discord[], cluster: ClusterRunner) {
    const clusterConfig = PuppeteerCluster.getConfig();
    profiles.forEach((profile) => {
      cluster.queue(async ({ page }) => {
        const pageC = page as unknown as Page;
        await pageC.goto(profile.url, {
          timeout: clusterConfig.timeout,
        });
        const data = await Shared.getDifferences(profile, pageC, false, clusterConfig.timeout);
        await console.log(data);
        if (data.Content.length > 0 && data.Changes === true) {
          await console.log(profile);
          const combined = await data.Content.join("\n");
          // only send data if its not a timeout issue or selector issue
          if (data.Content[0]!.length > 1) {
            // set more than 1 just in case its a new line
            await Discord.Webhook.sendMessage(profile, combined);
            await findKeyword(profile, data);
          }
        }
      });
    });
    await cluster.idle();
  }
}
