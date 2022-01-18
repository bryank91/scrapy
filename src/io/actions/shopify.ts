import axios from "axios";
import { FileHandle } from "../file/fileHandle";
import { Data as Config } from "data/config";
import { Discord } from "../discord/webhook";
import { dbactions } from "../database/dbactions";

// Helper function
async function fileSystemCompare(
  contents: Config.SimpleDiscord[] | Config.ShopifyATC[],
  filename: string
) {
  const source = await FileHandle.readFile(filename);
  const sourceJSON = source.Content.length > 1 ? JSON.parse(source.Content) : [];
  await FileHandle.writeFile(JSON.stringify(contents), filename);
  const results = await FileHandle.compareObjects(contents, sourceJSON);
  await console.log(results);
  return results;
}

// Helper function
async function databaseCompare(
  contents: Config.SimpleDiscord[] | Config.ShopifyATC[],
  filename: string
) {
  const sourceContents = await dbactions.getContentsByName(filename);
  const sourceJSON = sourceContents.length > 1 ? JSON.parse(sourceContents) : [];
  await dbactions.writeContents(filename, JSON.stringify(contents));
  const results = await FileHandle.compareObjects(contents, sourceJSON);
  await console.log(results);
  return results;
}

export namespace Shopify {
  export interface Construct {
    url: string; // url to check against. needs to be product.json
    file: string; // file to verify against
    discordId: string;
    discordToken: string;
  }

  export function getShopifyJson(shopify: Construct, fileSystem = false, timeout = 5000) {
    axios
      .get(shopify.url, { timeout })
      .then((response) => {
        const productJson = response.data;
        const newProductJson: Config.SimpleDiscord[] = productJson.products.map(
          (product: { handle: string; title: string }) => {
            const link: string = shopify.url.replace("products.json", "products/" + product.handle);
            return { title: product.title, url: link };
          }
        );
        return newProductJson;
      })
      .then(async function (res) {
        if (fileSystem) {
          const result = (await fileSystemCompare(res, shopify.file)) as Config.SimpleDiscord[];
          return result;
        } else {
          const result = (await databaseCompare(res, shopify.file)) as Config.SimpleDiscord[];
          return result;
        }
      })
      .then((res: Config.SimpleDiscord[]) => {
        const webhook: Config.Webhook = {
          id: shopify.discordId,
          token: shopify.discordToken,
        };
        if (res.length > 0) Discord.Webhook.simpleMessage(res, webhook);
      });
  }

  export function getATC(shopify: Shopify.Construct, fileSystem = false, timeout = 5000) {
    axios
      .get(shopify.url, { timeout })
      .then((response) => {
        const productJson = response.data;
        const newProductJson: Config.ShopifyATC[] = productJson.products.map(
          (product: Config.ShopifyProduct) => {
            const variants: Config.Variants[] = product.variants.map((variant: Config.Variants) => {
              const res = {
                id: variant.id,
                title: variant.title,
                url: shopify.url.replace("products.json", "cart/" + variant.id + ":1"),
                option1: variant.option1,
                option2: variant.option2,
                option3: variant.option3,
              };

              return res;
            });

            const res = {
              title: product.title,
              url: shopify.url.replace("products.json", "products/" + product.handle),
              variants,
            };
            return res;
          }
        );

        return newProductJson;
      })
      .then(async function (res) {
        if (fileSystem) {
          const result = (await fileSystemCompare(res, shopify.file)) as Config.ShopifyATC[];
          return result;
        } else {
          const result = (await databaseCompare(res, shopify.file)) as Config.ShopifyATC[];
          return result;
        }
      })
      .then((res: Config.ShopifyATC[]) => {
        const webhook: Config.Webhook = {
          id: shopify.discordId,
          token: shopify.discordToken,
        };
        if (res.length > 0) {
          res.forEach((element) => {
            Discord.Webhook.atcMessage(element, webhook);
          });
        }
      });
  }

  const profileToShopify = (profile: Config.Profile): Shopify.Construct => {
    const shopify: Shopify.Construct = {
      url: profile.url,
      file: profile.file,
      discordId: profile.webhook.id,
      discordToken: profile.webhook.token,
    };
    return shopify;
  };

  export function getShopifyJsonProfile(profiles: Config.Profile[] | []) {
    profiles.forEach((profile) => {
      const construct = profileToShopify(profile);
      getShopifyJson(construct);
    });
  }
}
