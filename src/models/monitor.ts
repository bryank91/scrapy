import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";

interface MonitorAttributes {
  id: string;
  name: string;
  siteUrl: string;
  selector: string;
  frequencySeconds: number;
  differenceId: string;
  discordWebhookId: string;
  monitorTypeId: string;
  nestedSelectorId: string;
  templateId: string;
}

type MonitorCreationAttributes = Optional<MonitorAttributes, "id">;

interface MonitorInstance
  extends Model<MonitorAttributes, MonitorCreationAttributes>,
    MonitorAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const Monitor = sequelize.define<MonitorInstance>("Monitor", {
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
  siteUrl: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  selector: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  frequencySeconds: {
    allowNull: true,
    defaultValue: 60,
    type: DataTypes.INTEGER,
  },
  discordWebhookId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  differenceId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  monitorTypeId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  nestedSelectorId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
  templateId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
});

export default Monitor;
