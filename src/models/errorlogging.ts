import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";

interface ErrorLoggingAttributes {
  id: string;
  name: string;
  description: string;
  discordWebhookId: string;
}

type ErrorLoggingCreationAttributes = Optional<ErrorLoggingAttributes, "id">;

interface ErrorLoggingInstance
  extends Model<ErrorLoggingAttributes, ErrorLoggingCreationAttributes>,
    ErrorLoggingAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const ErrorLogging = sequelize.define<ErrorLoggingInstance>("ErrorLogging", {
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
  description: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
  discordWebhookId: {
    allowNull: false,
    type: DataTypes.UUID,
  },
});

export default ErrorLogging;
