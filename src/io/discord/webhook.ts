import { Data } from '../../data/config'
import { WebhookClient, MessageEmbed } from 'discord.js'

export namespace Discord.Webhook {

    export function getWebhook(webhookId: string) {
        try {
            console.log(Data.Config.discord[webhookId])
            return Data.Config.discord[webhookId]
        } catch (e) {
            return console.log("Unable to retrieve webhookId:\n" + e)
        }
    }
    export async function sendMessage(webhookId: string, message: string) {

        let config = await getWebhook(webhookId)
        const webhookClient = await new WebhookClient(config.webhook);

        let embed = new MessageEmbed()

        config.title && embed.setTitle(config.title)
        config.footer && embed.setFooter(config.footer)
        config.url && embed.setURL(config.url).addFields({ name: "Source", value: config.url })

        try {
            embed.setDescription(message + "\n" + message + "\n" + message)
                .setTimestamp()

            webhookClient.send({
                username: webhookId,
                embeds: [embed],
            });
        } catch (e) {
            await console.log(e)
        }

    }
}