import { Sites as Data } from "../../data/sites";
import { Profiles } from "../../data/profiles";
import { Page } from "puppeteer-core";
import { Cluster } from "puppeteer-cluster3";

// flip the namespacing around
export namespace Shopify {
  type ClusterRunner = Cluster<Page, unknown>;

  export function getConfig(profile: string): Data.Site | null {
    try {
      console.log(Data.sites[profile]);
      return Data.sites[profile];
    } catch (e) {
      console.log("Unable to retrieve profile:\n" + e);
      return null;
    }
  }

  // returns an array of profile that can be used randomly
  export function getProfile(profile: string): Profiles.Profile[] | null {
    try {
      console.log(Profiles.Profile[profile]);
      return Profiles.Profile[profile];
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

  // go to checkout
  export async function checkout(page: Page, domain: string) : Promise<void> {
    try {
      const pageC = page as unknown as Page;
      await pageC.goto(domain + "/checkout");
    } catch (e) {
      console.log(e)
    }
  }

  // fill in the details page and click continue
  export async function details(page: Page, profile: string) : Promise<void> {
    const pageC = page as unknown as Page;
    const profiles = getProfile(profile);
    // TODO - we need to randomise the selectors

    if (profiles) {
      try {
        // predefine shopify selectors
        const firstNameSelector = 'input#checkout_shipping_address_first_name';
        const lastNameSelector = 'input#checkout_shipping_address_last_name';
        const address1Selector = 'input#checkout_shipping_address_address1';
        const address2Selector = 'input#checkout_shipping_address_address2';
        const citySelector = 'input#checkout_shipping_address_city';
        const stateSelector = 'select#checkout_shipping_address_province';
        const postcodeSelector = 'input#checkout_shipping_address_zip';
        const phoneSelector = 'input#checkout_shipping_address_phone';

        await pageC.waitForSelector(firstNameSelector);
        await pageC.type(firstNameSelector, profiles[0].details.firstName);

        await pageC.waitForSelector(lastNameSelector);
        await pageC.type(lastNameSelector, profiles[0].details.firstName);

        await pageC.waitForSelector(address1Selector);
        await pageC.type(address1Selector, profiles[0].details.firstName);

        await pageC.waitForSelector(address2Selector);
        await pageC.type(address2Selector, profiles[0].details.firstName);

        await pageC.waitForSelector(citySelector);
        await pageC.type(citySelector, profiles[0].details.firstName);

        await pageC.waitForSelector(stateSelector);
        await pageC.type(stateSelector, profiles[0].details.firstName);

        await pageC.waitForSelector(postcodeSelector);
        await pageC.type(postcodeSelector, profiles[0].details.firstName);

        await pageC.waitForSelector(phoneSelector);
        await pageC.type(phoneSelector, profiles[0].details.firstName);

        
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('Profile does not exist.. Please ensure it is define')
    }
  }

  // fill in the shipping page and click continue
  export async function shipping(page: Page) : Promise<void> {
    const pageC = page as unknown as Page;
  }

  // fill in the payment page and click continue
  export async function payment(page: Page) : Promise<void> {
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
        // go to the site and run javascript
        await pageC.goto(config.site);
        // we are sure there is shopify identifier in the config
        await addToCart(pageC, config.shopify!.identifier.toString(), config.domain);
        await checkout(pageC, config.domain);
        await details(pageC, config.profiles);
      });
      await cluster.idle();
    }
  }
}
