import { Data as Config } from '../../data/config'
import { WebhookClient, MessageEmbed } from 'discord.js'


export namespace Discord.Webhook {

    export type DiscordList = {
        title: string
        description: string
    }

    export function getWebhook(webhookId: string): any[] | [] {
        try {
            console.log(Config.discord[webhookId])
            return Config.discord[webhookId]
        } catch (e) {
            console.log("Unable to retrieve webhookId:\n" + e)
            return []
        }
    }

    export function getErrorLogger(): Config.Webhook | null {
        try {
            return Config.errorLogger
        } catch (e) {
            console.log(e)
            return null
        }
    }

    export async function sendMessage(config: Config.Discord, message: string): Promise<void> {

        const webhookClient = await new WebhookClient(config.webhook);

        let embed = new MessageEmbed()

        config.title && embed.setTitle(config.title)
        config.footer && embed.setFooter(config.footer)
        config.url && embed.setURL(config.url).addFields({ name: "Source", value: config.url })
        config.selector && embed.setURL(config.url).addFields({ name: "Selector", value: config.selector })

        try {
            embed.setDescription(message)
                .setTimestamp()

            if (message.length > 0) {
                webhookClient.send({
                    embeds: [embed]
                });
            }
        } catch (e) {
            await console.log(e)
        }

    }

    export async function simpleMessage(messages: Config.SimpleDiscord[], webhook: Config.Webhook, title: string = 'Pinger') {
        const webhookClient = await new WebhookClient(webhook);
        let embed = new MessageEmbed()

        try {
            embed.setTitle(title)
            embed.setTimestamp()
            let parsedMessage = messages.map(el => {
                
                // set the title of the last element
                embed.setTitle(el.title)

                return { name: el.title, value: el.url } // does not support extra in SimpleDiscord
            })

            parsedMessage && embed.setFields(parsedMessage)
            webhookClient.send({
                embeds: [embed]
            })
        } catch (e) {
            await console.log(e)
        }

    }

    export async function atcMessage(messages: Config.ShopifyATC, webhook: Config.Webhook, title: string = 'Pinger') {
        const webhookClient = await new WebhookClient(webhook);
        let embed = new MessageEmbed()

        try {
            embed.setTitle(title)
            embed.setTimestamp()
            embed.setTitle(messages.title)
            let parsedMessage = messages.variants.map(el => {
                return {
                    name: el.title + " - " + el.option1 + " - " + el.option2 + " - " + el.option3,
                    value: el.url
                }
            })

            parsedMessage && embed.setFields(parsedMessage)
            webhookClient.send({
                embeds: [embed]
            })
        } catch (e) {
            await console.log(e)
        }

    }


    export async function logError(webhook: Config.Webhook, message: string): Promise<void> {
        const webhookClient = await new WebhookClient(webhook);
        let embed = new MessageEmbed()
        embed.setTitle('ScrapyErrorLogger')

        try {
            embed.setDescription(message)
            webhookClient.send({
                embeds: [embed]
            })
        } catch (e) {
            await console.log(e)
        }
    }
}