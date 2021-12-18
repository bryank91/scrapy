import DiscordWebhook from "../../models/discordwebhook";
import MonitorType from "../../models/monitortype";
import NestedSelector from "../../models/nestedselector";
import Template from "../../models/template";

export namespace dbactions {
  export async function createOne(model: string, json: string): Promise<void> {
    try {
      const data = JSON.parse(json);
      switch (model) {
        case "discordwebhook":
          await DiscordWebhook.create(data);
          console.log("Created DiscordWebhook");
          break;
        case "monitortype":
          await MonitorType.create(data);
          console.log("Created MonitorType");
          break;
        case "nestedselector":
          await NestedSelector.create(data);
          console.log("Created NestedSelector");
          break;
        case "template":
          await Template.create(data);
          console.log("Created Template");
          break;
        default:
          console.log("Unsupported model");
          break;
      }
    } catch (e) {
      console.error("Failed to parse JSON string: ", e);
    }
  }

  export async function updateOne(
    model: string,
    id: string,
    json: string
  ): Promise<void> {
    try {
      const data = JSON.parse(json);
      switch (model) {
        case "discordwebhook":
          await DiscordWebhook.update(data, { where: { id } });
          console.log("Updated DiscordWebhook given id: ", id);
          break;
        case "monitortype":
          await MonitorType.update(data, { where: { id } });
          console.log("Updated MonitorType given id: ", id);
          break;
        case "nestedselector":
          await NestedSelector.update(data, { where: { id } });
          console.log("Updated NestedSelector given id: ", id);
          break;
        case "template":
          await Template.update(data, { where: { id } });
          console.log("Updated Template given id: ", id);
          break;
        default:
          console.log("Unsupported model");
          break;
      }
    } catch (e) {
      console.error("Failed to parse JSON string: ", e);
    }
  }

  export async function deleteOne(model: string, id: string): Promise<void> {
    try {
      switch (model) {
        case "discordwebhook":
          await DiscordWebhook.destroy({ where: { id } });
          console.log("Deleted DiscordWebhook given id: ", id);
          break;
        case "monitortype":
          await MonitorType.destroy({ where: { id } });
          console.log("Deleted MonitorType given id: ", id);
          break;
        case "nestedselector":
          await NestedSelector.destroy({ where: { id } });
          console.log("Deleted NestedSelector given id: ", id);
          break;
        case "template":
          await Template.destroy({ where: { id } });
          console.log("Deleted Template given id: ", id);
          break;
        default:
          console.log("Unsupported model");
          break;
      }
    } catch (e) {
      console.error("Failed to parse JSON string: ", e);
    }
  }
}
