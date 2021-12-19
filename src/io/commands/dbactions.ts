import Difference, { DifferenceInstance } from "../../models/difference";
import DiscordWebhook, { DiscordWebhookInstance } from "../../models/discordwebhook";
import ErrorLogging, { ErrorLoggingInstance } from "../../models/errorlogging";
import Monitor, { MonitorInstance } from "../../models/monitor";
import MonitorType, { MonitorTypeInstance } from "../../models/monitortype";
import NestedSelector, { NestedSelectorInstance } from "../../models/nestedselector";
import Template, { TemplateInstance } from "../../models/template";

export namespace dbactions {
  type ModelRecord =
    | DifferenceInstance
    | DiscordWebhookInstance
    | ErrorLoggingInstance
    | MonitorInstance
    | MonitorTypeInstance
    | NestedSelectorInstance
    | TemplateInstance;

  export async function getContentsByName(name: string): Promise<string> {
    return (await Difference.findOne({ where: { name } }))?.value ?? "";
  }

  export async function writeContents(name: string, value: string): Promise<void> {
    const existing = await getContentsByName(name);
    if (existing) {
      await Difference.update({ name, value }, { where: { name } });
    } else {
      await Difference.create({ name, value });
    }
  }

  export async function findOne(model: string, id: string): Promise<ModelRecord | null> {
    switch (model) {
      case "difference":
        return Difference.findOne({ where: { id } });
      case "discordwebhook":
        return DiscordWebhook.findOne({ where: { id } });
      case "errorlogging":
        return ErrorLogging.findOne({ where: { id } });
      case "monitor":
        return Monitor.findOne({ where: { id } });
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
      case "difference":
        return Difference.findAll();
      case "discordwebhook":
        return DiscordWebhook.findAll();
      case "errorlogging":
        return ErrorLogging.findAll();
      case "monitor":
        return Monitor.findAll();
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
      case "difference":
        return Difference.create(data);
      case "discordwebhook":
        return DiscordWebhook.create(data);
      case "errorlogging":
        return ErrorLogging.create(data);
      case "monitor":
        return Monitor.create(data);
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
      case "difference":
        await Difference.update(data, { where: { id } });
        break;
      case "discordwebhook":
        await DiscordWebhook.update(data, { where: { id } });
        break;
      case "errorlogging":
        await ErrorLogging.update(data, { where: { id } });
        break;
      case "monitor":
        await Monitor.update(data, { where: { id } });
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
      case "difference":
        await Difference.destroy({ where: { id } });
        break;
      case "discordwebhook":
        await DiscordWebhook.destroy({ where: { id } });
        break;
      case "errorlogging":
        await ErrorLogging.destroy({ where: { id } });
        break;
      case "monitor":
        await Monitor.destroy({ where: { id } });
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
