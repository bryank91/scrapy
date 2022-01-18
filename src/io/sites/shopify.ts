import { Sites as Data } from "../../data/sites";
import { Page } from "puppeteer-core";
import { Cluster } from "puppeteer-cluster3";

// flip the namespacing around
export namespace Shopify {
  type ClusterRunner = Cluster<Page, unknown>;

  interface VariantFormData {
    id: string;
    quantity: number;
    form_type: number;
  }

  export function getConfig(profile: string): Data.Site | null {
    try {
      console.log(Data.sites[profile]);
      return Data.sites[profile];
    } catch (e) {
      console.log("Unable to retrieve profile:\n" + e);
      return null;
    }
  }

  export async function addToCart(page: Page, variantId: string, domain: string) {
    try {
      await page.evaluate(
        async (variantId, domain) => {
          const data: any = [];
          data["id"] = variantId;
          data["quantity"] = 1;
          data["form_type"] = 1;
          const formData = new FormData();
          for (const name in data) {
            formData.append(name, data[name]);
          }

          // change the website.com to a shopify enabled website
          const rawResponse = await fetch(domain + "/cart/add.js", {
            method: "POST",
            body: formData,
          });
          const content = await rawResponse;
          await console.log(content);
        },
        variantId,
        domain
      );
    } catch (e) {
      console.log(e);
    }
  }

  export async function checkout(page: Page) : Promise<void> {
    const pageC = page as unknown as Page;
  }

  export async function details(page: Page) : Promise<void> {
    const pageC = page as unknown as Page;
  }

  export async function queue(cluster: ClusterRunner, profile: string) {
    const configOption = getConfig(profile);
    if (configOption === null || configOption.type !== "shopify") {
      console.log("Error intializing profile.. exiting");
    } else {
      const config: Data.Site = configOption; // safe to typecast
      cluster.queue(async ({ page }) => {
        await console.log("Starting queue for profile: " + profile);
        const pageC = page as unknown as Page;
        await console.log(config.site);
        // go to the site and run javascript
        await pageC.goto(config.site);
        // we are sure there is shopify identifier in the config
        console.log(config.shopify!.identifier.toString());
        await addToCart(pageC, config.shopify!.identifier.toString(), config.domain);
      });
      // await cluster.idle();
    }
  }
}
