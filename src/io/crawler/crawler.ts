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
        console.log(config)
        const c = new Crawler({
            maxConnections: config.maxConnections,
            callback: (error: any, res : any, done : any) => {
                if (error) {
                    console.log(error)
                    //TODO: log to discord potentially or another logging method
                } else {
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
            headers: Config.headers,
            incomingEncoding: 'utf-8',
            
            // global callback will be ignored
            callback: (error:any, res:any, done:any) => {
                if (error) {
                    console.log(error)
                } else {
                    let items : string[] = []
                    res.$(profile.selector).each((i : number, row : any) => {
                        items[i] = row.children[0].data;
                    });

                    console.log(items)
                    
                }
            }
        }])
    }

}