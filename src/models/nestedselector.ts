import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import Monitor from "./monitor";

interface NestedSelectorAttributes {
  id: string;
  selector: string;
  attribute: string;
}

type NestedSelectorCreationAttributes = Optional<
  NestedSelectorAttributes,
  "id"
>;

interface NestedSelectorInstance
  extends Model<NestedSelectorAttributes, NestedSelectorCreationAttributes>,
    NestedSelectorAttributes {
  createdAt: Date;
  updatedAt: Date;
}

const NestedSelector = sequelize.define<NestedSelectorInstance>(
  "NestedSelector",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    selector: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    attribute: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }
);

NestedSelector.hasMany(Monitor, {
  sourceKey: "id",
  foreignKey: "nestedSelectorId",
  as: "monitors",
});

Monitor.belongsTo(NestedSelector, {
  foreignKey: "nestedSelectorId",
  as: "nestedSelector",
});

export default NestedSelector;
