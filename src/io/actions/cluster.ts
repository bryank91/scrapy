import { Cluster } from "puppeteer-cluster3"
import { Data as Config } from "../../data/config";

export namespace PuppeteerCluster {
    export async function verifyFunction() {
    (async () => {
      const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
      });

      await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);
        await page.setExtraHTTPHeaders(Config.headers);
        
        await page.waitForSelector("#AddToCartText-product-template")
        let result = await page.$$eval("#AddToCartText-product-template", el => {
          return el[0].textContent
        })
        console.log(result)
      });

      cluster.queue('https://dailyclack.com/products/gmk-dracula-v2');
      cluster.queue('https://dailyclack.com/collections/products/products/durock-red-back-linear-switches');
      cluster.queue('https://dailyclack.com/products/gmk-dracula-v2');
      cluster.queue('https://dailyclack.com/products/gmk-dracula-v2');
      cluster.queue('https://dailyclack.com/products/gmk-dracula-v2');
      // many more pages

      await cluster.idle();
      await cluster.close();
    })();
  }
}