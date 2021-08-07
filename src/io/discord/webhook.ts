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

        let webhook = await getWebhook(webhookId)
        const webhookClient = await new WebhookClient({ id: "873504876641021992", token: "ELl5D8Xk3Lya5qVojcDmI04P1AHygs3h_mcGdEz4MRSNfwNnKXcUrGzjAlBlfh3CaWQC" });

        try {
            const embed = new MessageEmbed()
                .setTitle('Some Title')
                .setColor('#0099ff');

            webhookClient.send({
                content: 'Webhook test',
                username: 'some-username',
                avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                embeds: [embed],
            });
        } catch (e) {
            await console.log(e)
        }

    }
}