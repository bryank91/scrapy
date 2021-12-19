const chromium = require("chrome-aws-lambda");

import { html } from "../actions/html";
import { Data } from "../../data/html";
import { Data as Config } from "../../data/config";
import { Discord } from "../discord/webhook";
import { dbactions } from "../commands/dbactions";

export namespace Shared {
  export interface ReturnComparison {
    Changes: boolean;
    Content: string[];
    Error: unknown;
  }

  const initBrowser = async () => {
    const browser = await chromium.puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process", "--no-zygote"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    return browser;
  };

  export async function getInventory(site: Data.Html.Site) {
    const browser = await initBrowser();

    const pageData = await html.navigate(site, browser);

    const errorLogger = await Discord.Webhook.getErrorLogger();

    if (errorLogger && pageData.Response.status() !== 200) {
      Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + site);
    }

    const products: Config.ShopifyProduct[] = await html.getProducts(pageData.Page);
    const inventory = await html.getSingleTextContentBasedOnSelector(
      pageData.Page,
      "#VariantJson-product-template"
    );
    const listOfInventory: Data.Html.Inventory =
      typeof inventory === "string"
        ? await html.parseObjectsToList(inventory, "inventory_quantity")
        : [];
    await browser.close();

    return products.map((i: Config.ShopifyProduct, index) => ({
      ...i,
      ...(listOfInventory[index] !== undefined &&
        listOfInventory[index] !== null && {
          inventory: parseInt(listOfInventory[index]),
        }),
    }));
  }

  // gets the differences of a site and writes it to a file
  // will be able to run repetitively if a foreverTimer is provided
  // if not provided, defaults to 0 where it runs once
  export async function getDifferencesUsingFileSystem(
    profile: Config.Discord,
    forceNotify = false // notifies immediately regardless of fileExist
  ): Promise<ReturnComparison> {
    const browser = await initBrowser();

    try {
      const pageData = await html.navigate(profile.url, browser);

      const errorLogger = await Discord.Webhook.getErrorLogger();

      if (errorLogger && pageData.Response.status() !== 200) {
        Discord.Webhook.logError(errorLogger, "Unable to talk to site in " + profile.domain);
      }

      const selectorValues: string[] | null = await html.getValueBasedOnSelector(
        pageData.Page,
        profile.selector
      );

      const metadata = await Promise.all(
        profile.metadataSelector.map(async (el) => {
          const res = await html.getValueBasedOnAttribute(pageData.Page, el.selector, el.attribute);
          if (el.attribute === "href" && res !== null) {
            return html.cleanHref(res, profile.domain); // allows cleaning of href
          } else {
            return res;
          }
        })
      );

      const merged: string[] | null | undefined = selectorValues?.map((el, i) => {
        let res = el; //TODO: mutable

        metadata.forEach((element) => {
          res = res + "\n" + element?.[i];
        });
        return res;
      });

      const newFileContent: string = merged?.length
        ? merged.join("\n--\n") // unsafe mode as we handle null/undefined values
        : "";

      const oldContents = await dbactions.getContentsByName(profile.file);

      await dbactions.writeContents(profile.file, newFileContent);

      await browser.close();

      if (!oldContents.length && !forceNotify) {
        return {
          Changes: false,
          Content: newFileContent.split("\n"),
          Error: false,
        };
      } else if (oldContents === newFileContent) {
        return {
          Changes: false,
          Content: [], // no changes hence empty array
          Error: false,
        };
      } else {
        return {
          Changes: true,
          Content: newFileContent.split("\n").filter((x) => !oldContents.split("\n").includes(x)),
          Error: false,
        };
      }
    } catch (e) {
      return {
        Changes: false,
        Content: [], // no changes hence empty array
        Error: e,
      };
    } finally {
      await browser.close();
    }
  }
}
