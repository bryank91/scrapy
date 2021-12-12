import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import ErrorLogging from "./errorlogging";
import Monitor from "./monitor";

interface DiscordWebhookAttributes {
  id: string;
  name: string;
  webhookId: string;
  webhookToken: string;
}

type DiscordWebhookCreationAttributes = Optional<
  DiscordWebhookAttributes,
  "id"
>;

interface DiscordWebhookInstance
  extends Model<DiscordWebhookAttributes, DiscordWebhookCreationAttributes>,
    DiscordWebhookAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const DiscordWebhook = sequelize.define<DiscordWebhookInstance>(
  "DiscordWebhook",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    webhookId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    webhookToken: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }
);

DiscordWebhook.hasMany(Monitor, {
  sourceKey: "id",
  foreignKey: "discordWebhookId",
  as: "monitors",
});

DiscordWebhook.hasMany(ErrorLogging, {
  sourceKey: "id",
  foreignKey: "errorLoggingId",
  as: "errorloggings",
});

Monitor.belongsTo(DiscordWebhook, {
  foreignKey: "discordWebhookId",
  as: "discordWebhook",
});

ErrorLogging.belongsTo(DiscordWebhook, {
  foreignKey: "discordWebhookId",
  as: "discordWebhook",
});

export default DiscordWebhook;
