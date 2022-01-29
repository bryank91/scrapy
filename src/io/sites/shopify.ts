import { Sites as Data } from "../../data/sites";
import { Profiles } from "../../data/profiles";
import { Page } from "puppeteer-core";
import { Cluster } from "puppeteer-cluster3";

// flip the namespacing around
export namespace Shopify {

  // details
  const firstNameSelector = 'input#checkout_shipping_address_first_name';
  const lastNameSelector = 'input#checkout_shipping_address_last_name';
  const address1Selector = 'input#checkout_shipping_address_address1';
  const address2Selector = 'input#checkout_shipping_address_address2';
  const citySelector = 'input#checkout_shipping_address_city';
  const stateSelector = 'select#checkout_shipping_address_province';
  const postcodeSelector = 'input#checkout_shipping_address_zip';
  const phoneSelector = 'input#checkout_shipping_address_phone';
  const emailSelector = 'input#checkout_email';
  const confirmAddress = 'button[aria-label="Suggested address:"]';

  // shipping
  const shippingSelector = 'input[name="checkout[shipping_rate][id]"]';

  // paymnent
  const cardFieldsIframeSelector = 'iframe.card-fields-iframe';
  const creditCardNumberSelector = 'input#number';
  const nameOnCardSelector = 'input#name';
  const creditCardExpirationDateSelector = 'input#expiry';
  const creditCardCVVSelector = 'input#verification_value';

  // shared
  const continueButton = 'button#continue_button';   

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
  export function getFirstProfile(profile: string): Profiles.Profile[] | null {
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
    const profiles = getFirstProfile(profile);
    // TODO - we need to randomise the selectors
    if (profiles) {
        // predefine shopify selectors

        await pageC.waitForSelector(emailSelector);
        await pageC.type(emailSelector, profiles[0].details.email);
        await pageC.waitForTimeout(500)

        await pageC.waitForSelector(firstNameSelector);
        await pageC.type(firstNameSelector, profiles[0].details.firstName);

        await pageC.waitForSelector(lastNameSelector);
        await pageC.type(lastNameSelector, profiles[0].details.lastName);

        await pageC.waitForSelector(address1Selector);
        await pageC.type(address1Selector, profiles[0].details.address1);
        await pageC.waitForTimeout(500)

        await pageC.waitForSelector(address2Selector);
        await pageC.type(address2Selector, profiles[0].details.address2);

        await pageC.waitForSelector(citySelector);
        await pageC.type(citySelector, profiles[0].details.city);
        await pageC.waitForTimeout(500)

        await pageC.waitForSelector(stateSelector);
        await pageC.type(stateSelector, profiles[0].details.state);

        await pageC.waitForSelector(postcodeSelector);
        await pageC.type(postcodeSelector, profiles[0].details.postcode);

        await pageC.waitForSelector(phoneSelector);
        await pageC.type(phoneSelector, profiles[0].details.phone);

        let currentUrl = pageC.url();
        await pageC.waitForSelector(continueButton);
        await pageC.click(continueButton);
        await pageC.waitForTimeout(500); // give it time to redirect
        

        // there is a chance they will ask us to confirm the address here
        // this is specifically for certain websites
        // if page redirects, ignore this step
        if (currentUrl === pageC.url()) {
          await pageC.waitForSelector(confirmAddress);
          await pageC.click(confirmAddress);
        }

    } else {
      console.log('Profile does not exist.. Please ensure it is define')
    }
  }

  // fill in the shipping page and click continue
  export async function shipping(page: Page) : Promise<void> {
    const pageC = page as unknown as Page;

    await pageC.waitForSelector(shippingSelector); 
    let el : any = await page.$(shippingSelector); // I am sure there will be an element to return here
    await el.click(); // defaults to the first one
    await pageC.waitForSelector(continueButton);
    await pageC.click(continueButton);
  }

  
  export async function creditCard(page: Page, paymentDetails: Profiles.Payment) : Promise<void> {
    const pageC = page as unknown as Page;
    await pageC.waitForSelector(cardFieldsIframeSelector);
    const cardFieldIframes = await page.$$(cardFieldsIframeSelector);

    // credit card number
    const cardNumberFrameHandle = cardFieldIframes[0];
    const cardNumberFrame = await cardNumberFrameHandle.contentFrame();
    await cardNumberFrame!.waitForSelector(creditCardNumberSelector);
    await cardNumberFrame!.type(
      creditCardNumberSelector,
      paymentDetails.cardNumber
    );
    await pageC.waitForTimeout(500);

    // name
    const nameFrameHandle = cardFieldIframes[1];
    const nameFrame = await nameFrameHandle.contentFrame();
    await nameFrame!.waitForSelector(nameOnCardSelector);
    await nameFrame!.type(
      nameOnCardSelector,
      paymentDetails.name
    );

    // expiry
    const expiryFrameHandle = cardFieldIframes[2];
    const expiryFrame = await expiryFrameHandle.contentFrame();
    await expiryFrame!.waitForSelector(creditCardExpirationDateSelector);
    await expiryFrame!.type(
      creditCardExpirationDateSelector,
      paymentDetails.exp
    );

    // cvv
    const cvvFrameHandle = cardFieldIframes[3];
    const cvvFrame = await cvvFrameHandle.contentFrame();
    await cvvFrame!.waitForSelector(creditCardCVVSelector);
    await cvvFrame!.type(
      creditCardCVVSelector,
      paymentDetails.cvv
    );
  }
  

  // fill in the payment page and click continue
  export async function payment(page: Page, profile: string) : Promise<void> {
    const pageC = page as unknown as Page;
    const profiles = getFirstProfile(profile);

    if (profiles) {
      await creditCard(pageC, profiles[0].payment);
      await pageC.waitForSelector(continueButton);
      await pageC.click(continueButton);
      // SUCCESS!

    } else {
      console.log('profile does not exist')
    }
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
        await pageC.setDefaultNavigationTimeout(60000); // for debugging
        // go to the site and run javascript
        await pageC.goto(config.site);
        // we are sure there is shopify identifier in the config
        await addToCart(pageC, config.shopify!.identifier.toString(), config.domain);
        await checkout(pageC, config.domain);
        await details(pageC, config.profiles);
        await shipping(pageC);
        await payment(pageC, config.profiles);
        
        let httpResponse = await page.waitForNavigation({timeout : 20000})
        if (httpResponse) {
          // handle the success case with different HTTP response
          await console.log('Maybe succesful! with httpResponse: ' + httpResponse.statusText() + 
            ' with code: ' + httpResponse.status().toString());

          //set up webhook here
          // and proper error response cause it might fail with 200
        } else {
          await console.log('Encountered error checking out..')
        }

      });
      await cluster.idle();
    }
  }
}
