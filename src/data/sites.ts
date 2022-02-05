export namespace Sites {
  export const sites = require("../../config/sites.json");

  export interface Site {
    type: string;
    site: string;
    domain: string;
    webhook: Webhook;
    concurrency: 2;
    shopify?: Shopify;
    bigw?: BigW;
    profiles: string; // but links to Profiles. required to complete any site
  }
  export interface Shopify {
    identifier: number;
    size?: number;
  }

  export interface Webhook {
    id: string;
    token: string;
  }

  export interface BigW {
    link: string;
  }
}
