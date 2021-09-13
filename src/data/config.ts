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

}