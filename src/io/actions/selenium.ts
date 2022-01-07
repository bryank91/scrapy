import { Shared } from "../actions/shared";
import { Data as Config } from "../../data/config";
import { Discord } from "../discord/webhook";

export namespace Selenium {
  export async function doGetDifference(
    discordProfiles: Config.Discord[],
    forceNotify = false
  ): Promise<number> {
    const browser = await Shared.initBrowser();
    await discordProfiles.forEach((profile) => {
      try {
        (async () => {
          const page = await browser.newPage();
          await page.setExtraHTTPHeaders(Config.headers);
          await page.goto(profile.url);

          await Shared.getDifferences(profile, page, forceNotify).then((result) => {
            (async () => {
              await console.log(result); // if similar return false else true
              if (result.Changes && !result.Error) {
                const combined = await result.Content.join("\n");
                const parsedProfile: Config.Discord = profile;
                await Discord.Webhook.sendMessage(parsedProfile, combined);
              } else if (!result.Changes && result.Error) {
                console.log("Encountered error: ");
                console.log(result.Error);
              }
            })();
          });
          await browser.close();
        })();
      } catch (e) {
        console.log(e);
        browser.close();
      }
    });
    return 1;
  }
}
