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

    export async function sendMessage(config: Config.Discord, message: string) {

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
}