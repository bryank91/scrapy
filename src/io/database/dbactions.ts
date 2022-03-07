import Difference, { DifferenceInstance } from "../../models/difference";
import DiscordWebhook, { DiscordWebhookInstance } from "../../models/discordwebhook";
import ErrorLogging, { ErrorLoggingInstance } from "../../models/errorlogging";
import Monitor, { MonitorInstance } from "../../models/monitor";
import MonitorType, { MonitorTypeInstance } from "../../models/monitortype";
import NestedSelector, { NestedSelectorInstance } from "../../models/nestedselector";
import Template, { TemplateInstance } from "../../models/template";

export namespace dbactions {
  type Model =
    | {
        type: "differences";
        record: DifferenceInstance;
      }
    | {
        type: "discordWebhooks";
        record: DiscordWebhookInstance;
      }
    | {
        type: "errorLoggings";
        record: ErrorLoggingInstance;
      }
    | {
        type: "monitors";
        record: MonitorInstance;
      }
    | {
        type: "monitorTypes";
        record: MonitorTypeInstance;
      }
    | {
        type: "nestedSelectors";
        record: NestedSelectorInstance;
      }
    | {
        type: "templates";
        record: TemplateInstance;
      };

  export async function getContentsByName(name: string): Promise<string> {
    return (await Difference.findOne({ where: { name } }))?.value ?? "<undefined>";
    // temp measure to omit a certian keyword
  }

  export async function writeContents(name: string, value: string): Promise<void> {
    const existing = await getContentsByName(name);
    if (existing && existing !== "<undefined>") {
      await Difference.update({ name, value }, { where: { name } });
    } else {
      await Difference.create({ name, value });
    }
  }

  export async function findOne(model: Model["type"], id: string): Promise<Model["record"] | null> {
    switch (model) {
      case "differences":
        return Difference.findOne({ where: { id } });
      case "discordWebhooks":
        return DiscordWebhook.findOne({ where: { id } });
      case "errorLoggings":
        return ErrorLogging.findOne({ where: { id } });
      case "monitors":
        return Monitor.findOne({ where: { id } });
      case "monitorTypes":
        return MonitorType.findOne({ where: { id } });
      case "nestedSelectors":
        return NestedSelector.findOne({ where: { id } });
      case "templates":
        return Template.findOne({ where: { id } });
      default:
        throw Error("Unsupported model");
    }
  }

  export async function findAll(model: Model["type"]): Promise<Model["record"][]> {
    switch (model) {
      case "differences":
        return Difference.findAll();
      case "discordWebhooks":
        return DiscordWebhook.findAll();
      case "errorLoggings":
        return ErrorLogging.findAll();
      case "monitors":
        return Monitor.findAll();
      case "monitorTypes":
        return MonitorType.findAll();
      case "nestedSelectors":
        return NestedSelector.findAll();
      case "templates":
        return Template.findAll();
      default:
        throw Error("Unsupported model");
    }
  }

  export async function createOne(model: Model["type"], json: string): Promise<Model["record"]> {
    const data = JSON.parse(json);
    switch (model) {
      case "differences":
        return Difference.create(data);
      case "discordWebhooks":
        return DiscordWebhook.create(data);
      case "errorLoggings":
        return ErrorLogging.create(data);
      case "monitors":
        return Monitor.create(data);
      case "monitorTypes":
        return MonitorType.create(data);
      case "nestedSelectors":
        return NestedSelector.create(data);
      case "templates":
        return Template.create(data);
      default:
        throw Error("Unsupported model");
    }
  }

  export async function updateOne(model: Model["type"], id: string, json: string): Promise<void> {
    const data = JSON.parse(json);
    switch (model) {
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
      case "monitorTypes":
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

  export async function deleteOne(model: Model["type"], id: string): Promise<void> {
    switch (model) {
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
      case "monitorTypes":
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
