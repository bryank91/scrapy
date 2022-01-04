import { Page } from "puppeteer-core";
import { Data as Config } from "../../data/config";

interface Window {
  ShopifyAnalytics: {
    meta: {
      product: {
        variants: Config.ShopifyProduct[];
      };
    };
  };
}

declare const window: Window;

export namespace html {
  // async get the id
  export async function getProducts(page: Page) {
    const products: Config.ShopifyProduct[] = await page.evaluate(() => {
      const { variants } = window.ShopifyAnalytics.meta.product;
      return variants; // array of shopify objects with id and names
    });
    return products;
  } // return browser and id of array

  export async function getSingleTextContentBasedOnSelector(
    page: Page,
    selector: string
  ): Promise<string | null> {
    const timeoutInSeconds = 10;
    try {
      await page.waitForSelector(selector, {
        timeout: timeoutInSeconds * 1000,
      });
    } catch (e: unknown) {
      if ((e as Error)?.name === "TimeoutError") {
        console.log(`Timed out after ${timeoutInSeconds} seconds - no access to inventory`);
        return null;
      }
    }
    const html = await page.$$eval(selector, (element: { textContent: string | null }[]) => {
      return element[0].textContent;
    });
    return html;
  }

  // get array of values based on selector defined
  // if not found in timeout seconds, return null
  export async function getValueBasedOnSelector(
    page: Page,
    selector: string,
    timeout = 5000
  ): Promise<string[] | null> {
    try {
      (await page.waitForSelector(selector, { timeout })) !== null;
      const arrayOfSelectors = await page.$$eval(selector, (anchors) => {
        return anchors.map((anchor) => anchor.textContent ?? "").filter((v) => v);
      });
      return arrayOfSelectors;
    } catch (e) {
      console.log("Timeout limit reached. Exiting..");
      return null;
    }
  }

  export async function getValueBasedOnAttribute(
    page: Page,
    selector: string,
    attribute: string
  ): Promise<string[] | null> {
    const arrayOfAttributes = await page.evaluate(
      function (selector, attribute) {
        return Array.from(document.querySelectorAll(selector), (el) => el.getAttribute(attribute));
      },
      selector,
      attribute
    );

    return arrayOfAttributes;
  }

  // parse array of objects in JSON string with the keyword as the key
  export async function parseObjectsToList(jsonString: string, keyword: string) {
    const json = JSON.parse(jsonString) as Record<string, string>[];
    return json.map((i) => i[keyword]);
  }

  // to be used for atttributes that uses href
  export function cleanHref(arr: string[], domain: string) {
    return arr.map((el) => {
      return domain + el;
    });
  }
}
