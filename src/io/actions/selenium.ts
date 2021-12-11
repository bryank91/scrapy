import { Shared } from "../actions/shared";
import { Data as Config } from "data/config";
import { Discord } from "../discord/webhook";

export namespace Selenium {
  export function doGetDifference(
    discordProfiles: Config.Discord[],
    forceNotify = false
  ): void {
    discordProfiles.forEach((profile) => {
      try {
        Shared.getDifferencesUsingFileSystem(profile, forceNotify).then(
          (result) => {
            (async () => {
              await console.log(result); // if similar return false else true
              if (result.Changes && !result.Error) {
                const combined = await result.Content.join("\n");
                const parsedProfile: Config.Discord = profile;
                await Discord.Webhook.sendMessage(parsedProfile, combined);
              } else if (!result.Changes && result.Error) {
                console.log("Encountered error");
                // TODO: alert once
              }
            })();
          }
        );
      } catch (e) {
        console.log(e);
      } finally {
        return 1;
      }
    });
  }
}
