import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import Monitor from "./monitor";

interface MonitorTypeAttributes {
  id: string;
  name: string;
}

type MonitorTypeCreationAttributes = Optional<MonitorTypeAttributes, "id">;

export interface MonitorTypeInstance
  extends Model<MonitorTypeAttributes, MonitorTypeCreationAttributes>,
    MonitorTypeAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const MonitorType = sequelize.define<MonitorTypeInstance>("MonitorType", {
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
});

MonitorType.hasMany(Monitor, {
  sourceKey: "id",
  foreignKey: "monitorTypeId",
  as: "monitors",
});

Monitor.belongsTo(MonitorType, {
  foreignKey: "monitorTypeId",
  as: "monitorType",
});

export default MonitorType;
