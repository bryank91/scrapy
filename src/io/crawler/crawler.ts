// Crawler atm doesnt have native typescript supportability

import { Data as Config } from "../../data/config";
export namespace Crawler { 

    function getConfig(): Config.Crawler {
        try {
          return Config.cluster;
        } catch (e) {
          console.log("Unable to retrieve cluster, reverting to default:\n" + e);
          return {
            maxConnections: 5
          };
        }
      }

    export function setup() {
        const Crawler = require('crawler');
        const config = getConfig();
        const c = new Crawler({
            maxConnections: 10, // TODO: fix
            callback: (error: any, res : any, done : any) => {
                if (error) {
                    console.log(error)
                    //TODO: log to discord potentially or another logging method
                } else {
                    const $ = res.$;
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server
                    console.log(res.$('title').text());
                }
                done()
            }
        });
        return c;
    }

    // Crawler does not have any types
    export function queue(c : any, profile: Config.Discord) {
        c.queue([{
            uri: profile.url,
            jquery: true,
            
            // global callback will be ignored
            callback: (error:any, res:any, done:any) => {
                if (error) {
                    console.log(error)
                } else {
                    const item = res.$(profile.selector);
                    console.log(item)
                }
            }
        }])
    }

}