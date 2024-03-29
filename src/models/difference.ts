import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import Monitor from "./monitor";

interface DifferenceAttributes {
  id: string;
  name: string;
  value: string;
}

type DifferenceCreationAttributes = Optional<DifferenceAttributes, "id">;

export interface DifferenceInstance
  extends Model<DifferenceAttributes, DifferenceCreationAttributes>,
    DifferenceAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const Difference = sequelize.define<DifferenceInstance>("Difference", {
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
  value: {
    allowNull: false,
    type: DataTypes.TEXT,
  },
});

Difference.hasMany(Monitor, {
  sourceKey: "id",
  foreignKey: "differenceId",
  as: "monitors",
});

Monitor.belongsTo(Difference, {
  foreignKey: "differenceId",
  as: "difference",
});

export default Difference;
