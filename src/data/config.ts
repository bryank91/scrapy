// retrieve headers for browsers
export namespace Data {
    export const headers = require('../../config/headers.json')
    export const discord = require('../../config/discord.json')
    export const errorLogger = require('../../config/error.json')

    export type Webhook = {
        id: string,
        token: string
    }

    export type Metadata = {
        selector: string,
        attribute: string
    }

    export type Discord = {
        url: string
        selector: string,
        metadataSelector: Metadata[]
        file: string,
        webhook: Data.Webhook
        footer: string,
        title: string,
        domain: string // used for relative pathing in href
    }

    export type SimpleDiscord = {
        title: string
        url: string
        extra?: string
    }

    export type ShopifyATC = {
        title: string
        url: string
        variants: Variants[]

    }
    export type Variants = {
        title: string
        url: string
        option1: string | null | undefined
        option2: string | null | undefined
        option3: string | null | undefined
    }

    export type ShopifyProduct = {
        id: string;
        price: number;
        name: string;
        public_title: string | null;
        sku: string;
        inventory?: number;
    }
}
