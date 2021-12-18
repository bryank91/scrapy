import { Data as Config } from "../../data/config";
import { WebhookClient, MessageEmbed } from "discord.js";

// Error bot
// const errorWebhook: Config.Webhook = {
//   id: "883538158715826196",
//   token: "uhXhLGaZmO3G1W7Asiya-cqn1jM1duf4fsivhGXhxL405RD3B7mTijnWlC-OQzqOTnFR",
// };

export namespace Discord.Webhook {
  export interface DiscordList {
    title: string;
    description: string;
  }

  export function getWebhook(webhookId: string): Config.Discord[] | [] {
    try {
      console.log(Config.discord[webhookId]);
      return Config.discord[webhookId];
    } catch (e) {
      console.log("Unable to retrieve webhookId:\n" + e);
      return [];
    }
  }

  export function getErrorLogger(): Config.Webhook | null {
    try {
      return Config.errorLogger;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  export async function sendMessage(config: Config.Discord, message: string): Promise<void> {
    const webhookClient = await new WebhookClient(config.webhook);

    const embed = new MessageEmbed();

    config.title && embed.setTitle(config.title);
    config.footer && embed.setFooter(config.footer);
    config.url && embed.setURL(config.url).addFields({ name: "Source", value: config.url });
    config.selector &&
      embed.setURL(config.url).addFields({ name: "Selector", value: config.selector });

    try {
      embed.setDescription(message).setTimestamp();

      if (message.length > 0) {
        webhookClient.send({
          embeds: [embed],
        });
      }
    } catch (e) {
      console.log(e);
      // TODO: get this to log error to Discord if env is production
      // await logError(errorWebhook, e.toString());
    }
  }

  export async function productMessage(
    messages: Config.ShopifyProduct[],
    webhook: Config.Webhook,
    title = "Pinger"
  ) {
    const webhookClient = await new WebhookClient(webhook);
    const embed = new MessageEmbed();

    try {
      embed.setTitle(title);
      embed.setTimestamp();
      const parsedMessage = messages.map((el) => {
        let unitText = `$${(Math.round(el.price) / 100).toFixed(2)}`;
        if (el.inventory !== undefined) {
          if (el.inventory > 0) {
            unitText = `${el.inventory} remaining @ ${unitText}`;
          } else if (el.inventory < 0) {
            unitText = `${Math.abs(el.inventory)} bought @ ${unitText}`;
          }
        }
        return { name: el.name, value: unitText };
      });

      parsedMessage && embed.addFields(parsedMessage);
      webhookClient.send({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e);
      // TODO: get this to log error to Discord if env is production
      // await logError(errorWebhook, e.toString());
    }
  }

  export async function simpleMessage(
    messages: Config.SimpleDiscord[],
    webhook: Config.Webhook,
    title = "Pinger"
  ) {
    const webhookClient = await new WebhookClient(webhook);
    const embed = new MessageEmbed();

    try {
      embed.setTitle(title);
      embed.setTimestamp();
      const parsedMessage = messages.map((el) => {
        // set the title of the last element
        embed.setTitle(el.title);

        return { name: el.title, value: el.url }; // does not support extra in SimpleDiscord
      });

      parsedMessage && embed.addFields(parsedMessage);
      webhookClient.send({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e);
      // TODO: get this to log error to Discord if env is production
      // await logError(errorWebhook, e.toString());
    }
  }

  export async function atcMessage(
    messages: Config.ShopifyATC,
    webhook: Config.Webhook,
    title = "Pinger"
  ) {
    const webhookClient = await new WebhookClient(webhook);
    const embed = new MessageEmbed();

    try {
      embed.setTitle(title);
      embed.setTimestamp();
      embed.setTitle(messages.title);
      const parsedMessage = messages.variants.map((el) => {
        return {
          name: el.title + " - " + el.option1 + " - " + el.option2 + " - " + el.option3,
          value: el.url,
        };
      });

      parsedMessage && embed.addFields(parsedMessage);
      webhookClient.send({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e);
      // TODO: get this to log error to Discord if env is production
      // await logError(errorWebhook, e.toString());
    }
  }

  export async function logError(webhook: Config.Webhook, message: string): Promise<void> {
    const webhookClient = await new WebhookClient(webhook);
    const embed = new MessageEmbed();
    embed.setTitle("ScrapyErrorLogger");

    try {
      embed.setDescription(message);
      webhookClient.send({
        embeds: [embed],
      });
    } catch (e) {
      await console.log(e);
    }
  }
}
