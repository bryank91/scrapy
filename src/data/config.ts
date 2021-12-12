// retrieve headers for browsers
export namespace Data {
  export const headers = require("../../config/headers.json");
  export const discord = require("../../config/discord.json");
  export const errorLogger = require("../../config/error.json");

  export interface Webhook {
    id: string;
    token: string;
  }

  export interface Metadata {
    selector: string;
    attribute: string;
  }

  export interface Discord {
    url: string;
    selector: string;
    metadataSelector: Metadata[];
    file: string;
    webhook: Data.Webhook;
    footer: string;
    title: string;
    domain: string; // used for relative pathing in href
  }

  export interface SimpleDiscord {
    title: string;
    url: string;
    extra?: string;
  }

  export interface ShopifyATC {
    title: string;
    url: string;
    variants: Variants[];
  }
  export interface Variants {
    id: string;
    title: string;
    url: string;
    option1: string | null | undefined;
    option2: string | null | undefined;
    option3: string | null | undefined;
  }

  export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    price: number;
    name: string;
    public_title: string | null;
    sku: string;
    inventory?: number;
    variants: Variants[];
  }

  export interface Profile {
    url: string;
    file: string;
    webhook: Webhook;
  }
}
