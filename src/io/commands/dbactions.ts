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
    switch (model.toLowerCase()) {
      case "differences":
        return Difference.findOne({ where: { id } });
      case "discordWebhooks":
        return DiscordWebhook.findOne({ where: { id } });
      case "errorLoggings":
        return ErrorLogging.findOne({ where: { id } });
      case "monitors":
        return Monitor.findOne({ where: { id } });
      case "monitortypes":
        return MonitorType.findOne({ where: { id } });
      case "nestedSelectors":
        return NestedSelector.findOne({ where: { id } });
      case "templates":
        return Template.findOne({ where: { id } });
      default:
        throw Error("Unsupported model");
    }
  }

  export async function findAll(model: string): Promise<ModelRecord[]> {
    switch (model.toLowerCase()) {
      case "differences":
        return Difference.findAll();
      case "discordWebhooks":
        return DiscordWebhook.findAll();
      case "errorLoggings":
        return ErrorLogging.findAll();
      case "monitors":
        return Monitor.findAll();
      case "monitortypes":
        return MonitorType.findAll();
      case "nestedSelectors":
        return NestedSelector.findAll();
      case "templates":
        return Template.findAll();
      default:
        throw Error("Unsupported model");
    }
  }

  export async function createOne(model: string, json: string): Promise<ModelRecord> {
    const data = JSON.parse(json);
    switch (model.toLowerCase()) {
      case "differences":
        return Difference.create(data);
      case "discordWebhooks":
        return DiscordWebhook.create(data);
      case "errorLoggings":
        return ErrorLogging.create(data);
      case "monitors":
        return Monitor.create(data);
      case "monitortypes":
        return MonitorType.create(data);
      case "nestedSelectors":
        return NestedSelector.create(data);
      case "templates":
        return Template.create(data);
      default:
        throw Error("Unsupported model");
    }
  }

  export async function updateOne(model: string, id: string, json: string): Promise<void> {
    const data = JSON.parse(json);
    switch (model.toLowerCase()) {
      case "differences":
        await Difference.update(data, { where: { id } });
        break;
      case "discordWebhooks":
        await DiscordWebhook.update(data, { where: { id } });
        break;
      case "errorLoggings":
        await ErrorLogging.update(data, { where: { id } });
        break;
      case "monitors":
        await Monitor.update(data, { where: { id } });
        break;
      case "monitortypes":
        await MonitorType.update(data, { where: { id } });
        break;
      case "nestedSelectors":
        await NestedSelector.update(data, { where: { id } });
        break;
      case "templates":
        await Template.update(data, { where: { id } });
        break;
      default:
        throw Error("Unsupported model");
    }
  }

  export async function deleteOne(model: string, id: string): Promise<void> {
    switch (model.toLowerCase()) {
      case "differences":
        await Difference.destroy({ where: { id } });
        break;
      case "discordWebhooks":
        await DiscordWebhook.destroy({ where: { id } });
        break;
      case "errorLoggings":
        await ErrorLogging.destroy({ where: { id } });
        break;
      case "monitors":
        await Monitor.destroy({ where: { id } });
        break;
      case "monitortypes":
        await MonitorType.destroy({ where: { id } });
        break;
      case "nestedSelectors":
        await NestedSelector.destroy({ where: { id } });
        break;
      case "templates":
        await Template.destroy({ where: { id } });
        break;
      default:
        throw Error("Unsupported model");
    }
  }
}
