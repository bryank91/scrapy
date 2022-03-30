const chromium = require("chrome-aws-lambda");

import { html } from "../actions/html";
import { Data } from "../../data/html";
import { Data as Config } from "../../data/config";
import { dbactions } from "../database/dbactions";
import { Browser, Page } from "puppeteer-core";
import { Items } from "../../data/items"

export namespace Shared {
  export interface ReturnComparison {
    Changes: boolean;
    Content: string[];
    Error: unknown;
    Log: string | null;
  }

  export const initBrowser = async () => {
    const browser = await chromium.puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process", "--no-zygote"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    return browser;
  };

  export async function getInventory(browser: Browser, site: Data.Html.Site) {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders(Config.headers);
    await page.goto(site);

    const products: Config.ShopifyProduct[] = await html.getProducts(page);
    const inventory = await html.getSingleTextContentBasedOnSelector(
      page,
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
  export async function getDifferences(
    profile: Config.Discord,
    page: Page,
    forceNotify = false, // notifies immediately regardless of fileExist
    timeout = 5000
  ): Promise<ReturnComparison> {
    let selectorValues: string[] | null = null;
    try {
      selectorValues = await html.getValueBasedOnSelector(page, profile.selector, timeout);
    } catch (e) {
      return {
        Changes: false,
        Content: [], // no changes hence empty array
        Error: "Issues getting selectors",
        Log: null
      };
    }

    try {
      const metadata = await Promise.all(
        profile.metadataSelector.map(async (el) => {
          const res = await html.getValueBasedOnAttribute(page, el.selector, el.attribute);
          if (el.attribute === "href" && res !== null) {
            return html.cleanHref(res, profile.domain); // allows cleaning of href
          } else {
            return res;
          }
        })
      );

      const merged: string[] | null | undefined = selectorValues?.map((el, i) => {
        let res = el;

        metadata.forEach((element) => {
          res = res + "\n" + element?.[i];
        });
        return res;
      });

      const newFileContent: string = merged?.length
        // filter this in the differences table and eliminating any blanks
        ? merged.filter(x => x.trim() != "").join("\n--\n")
        : "";

      const oldContents = await dbactions.getContentsByName(profile.file);

      await dbactions.writeContentsDifference(profile.file, newFileContent);

      console.log(newFileContent + "\n \n VS \n \n" + oldContents)

      if (!oldContents.length && !forceNotify) {
        return {
          Changes: false,
          Content: newFileContent.split("\n"),
          Error: false,
          Log: "Old contents length is less than 0"
        };
      } else if (oldContents === newFileContent) {
        return {
          Changes: false,
          Content: [], // no changes hence empty array
          Error: false,
          Log: "Old contents is similar to new file contents"
        };
      } else {

        // TODO: bug found. it doesnt register read new items getting added into the list
        const content = Items.compareTwoArraysWithNewLineEnumeration(newFileContent, oldContents);
        const trimmedContent = content.filter(x => x.trim() != ""); // remove empty selectors

        if (trimmedContent.length > 0) { //verify if its null
          return {
            Changes: true,
            Content: trimmedContent,
            Error: false,
            Log: "Found changes, notifying.."
          };
        } else {
          return {
            Changes: false,
            Content: trimmedContent,
            Error: false,
            Log: "All string arrays are empty. High chance selectors are not found or page is empty"
          };
        }

      }
    } catch (e) {
      return {
        Changes: false,
        Content: [], // no changes hence empty array
        Error: e,
        Log: "Promise failed"
      };
    }
  }
}
