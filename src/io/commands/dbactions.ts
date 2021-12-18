import DiscordWebhook, { DiscordWebhookInstance } from "../../models/discordwebhook";
import MonitorType, { MonitorTypeInstance } from "../../models/monitortype";
import NestedSelector, { NestedSelectorInstance } from "../../models/nestedselector";
import Template, { TemplateInstance } from "../../models/template";

export namespace dbactions {
  type ModelRecord =
    | DiscordWebhookInstance
    | MonitorTypeInstance
    | NestedSelectorInstance
    | TemplateInstance;

  export async function findOne(model: string, id: string): Promise<ModelRecord | null> {
    switch (model) {
      case "discordwebhook":
        return DiscordWebhook.findOne({ where: { id } });
      case "monitortype":
        return MonitorType.findOne({ where: { id } });
      case "nestedselector":
        return NestedSelector.findOne({ where: { id } });
      case "template":
        return Template.findOne({ where: { id } });
      default:
        throw Error("Unsupported model");
    }
  }

  export async function findAll(model: string): Promise<ModelRecord[]> {
    switch (model) {
      case "discordwebhook":
        return DiscordWebhook.findAll();
      case "monitortype":
        return MonitorType.findAll();
      case "nestedselector":
        return NestedSelector.findAll();
      case "template":
        return Template.findAll();
      default:
        throw Error("Unsupported model");
    }
  }

  export async function createOne(model: string, json: string): Promise<ModelRecord> {
    const data = JSON.parse(json);
    switch (model) {
      case "discordwebhook":
        return DiscordWebhook.create(data);
      case "monitortype":
        return MonitorType.create(data);
      case "nestedselector":
        return NestedSelector.create(data);
      case "template":
        return Template.create(data);
      default:
        throw Error("Unsupported model");
    }
  }

  export async function updateOne(model: string, id: string, json: string): Promise<void> {
    const data = JSON.parse(json);
    switch (model) {
      case "discordwebhook":
        await DiscordWebhook.update(data, { where: { id } });
        break;
      case "monitortype":
        await MonitorType.update(data, { where: { id } });
        break;
      case "nestedselector":
        await NestedSelector.update(data, { where: { id } });
        break;
      case "template":
        await Template.update(data, { where: { id } });
        break;
      default:
        throw Error("Unsupported model");
    }
  }

  export async function deleteOne(model: string, id: string): Promise<void> {
    switch (model) {
      case "discordwebhook":
        await DiscordWebhook.destroy({ where: { id } });
        break;
      case "monitortype":
        await MonitorType.destroy({ where: { id } });
        break;
      case "nestedselector":
        await NestedSelector.destroy({ where: { id } });
        break;
      case "template":
        await Template.destroy({ where: { id } });
        break;
      default:
        throw Error("Unsupported model");
    }
  }
}
