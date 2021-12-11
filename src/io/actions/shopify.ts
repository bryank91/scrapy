import axios from 'axios';
import { FileHandle } from "../file/fileHandle"
import { Data as Config } from "data/config"
import { Discord } from '../discord/webhook'

export namespace Shopify {

    export type Construct = {
        url: string // url to check against. needs to be product.json
        file: string // file to verify against
        discordId: string
        discordToken: string 
    }

    export function getShopifyJson(shopify:Construct, timeout: number = 5000) {

        axios.get(shopify.url, {timeout: timeout}).then((response) => {
            let productJson = response.data
            let newProductJson: Config.SimpleDiscord[] = productJson["products"].map((product: any) => {
                let link: string = shopify.url.replace('products.json', 'products/' + product.handle)
                return { title: product.title, url: link }
            });
            return newProductJson
        }).then(async function (res) {
            let source = await FileHandle.readFile(shopify.file)
            let sourceJSON = await (source.Content.length > 1) ? JSON.parse(source.Content) : []
            await FileHandle.writeFile(JSON.stringify(res), shopify.file)

            let results = await FileHandle.compareObjects(res, sourceJSON)
            await console.log(results)
            return results;

        }).then((res: Config.SimpleDiscord[]) => {
            let webhook: Config.Webhook = { id: shopify.discordId, token: shopify.discordToken }
            if (res.length > 0) Discord.Webhook.simpleMessage(res, webhook)
        })
    }

    export function getATC(shopify:Shopify.Construct, timeout: number = 5000) {
        axios.get(shopify.url, {timeout: timeout}).then((response) => {
            let productJson = response.data
            let newProductJson: Config.ShopifyATC[] = productJson["products"].map((product: any) => {

                let variants: any[] = product.variants.map((variant: any) => {
                    let res =
                    {
                        title: variant.title,
                        url: shopify.url.replace('products.json', 'cart/' + variant.id + ":1"),
                        option1: variant.option1 !== undefined && variant.option1,
                        option2: variant.option2 !== undefined && variant.option2,
                        option3: variant.option3 !== undefined && variant.option3
                    }

                    return res
                })

                let res =
                {
                    title: product.title,
                    url: shopify.url.replace('products.json', 'products/' + product.handle),
                    variants: variants
                }
                return res
            });

            return newProductJson
        }).then(async function (res) {
            let source = await FileHandle.readFile(shopify.file)
            let sourceJSON = await (source.Content.length > 1) ? JSON.parse(source.Content) : []
            await FileHandle.writeFile(JSON.stringify(res), shopify.file)

            let results = await FileHandle.compareObjects(res, sourceJSON)
            await console.log(results)
            return results;

        }).then((res: Config.ShopifyATC[]) => {
            let webhook: Config.Webhook = { id: shopify.discordId, token: shopify.discordToken }
            if (res.length > 0) {
                res.forEach(element => {
                    Discord.Webhook.atcMessage(element, webhook)
                });
            }
        })
    }

    function profileToShopify(profile: any) : Shopify.Construct {
        let shopify : Shopify.Construct = {
            url: profile.url,
            file: profile.file,
            discordId: profile.webhook.id,
            discordToken: profile.webhook.token
        }
        return shopify
    }

    export function getShopifyJsonProfile(profiles: any[] | []) {
        profiles.forEach((profile) => {
            let construct = profileToShopify(profile)
            getShopifyJson(construct)
        })
    }

}