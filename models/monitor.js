'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Monitor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  };
  Monitor.init({
    name: DataTypes.STRING,
    siteurl: DataTypes.STRING,
    selector: DataTypes.STRING,
    frequencySeconds: DataTypes.INTEGER,
    differenceId: DataTypes.INTEGER,
    discordWebhookId: DataTypes.INTEGER,
    monitorTypeId: DataTypes.INTEGER,
    nestedSelectorId: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Monitor',
  });
  Monitor.associate = function(models) {
    // associations can be defined here
    Monitor.belongsTo(models.Difference)
    Monitor.belongsTo(models.DiscordWebhook)
    Monitor.belongsTo(models.MonitorType)
    Monitor.belongsTo(models.NestedSelector)
    Monitor.belongsTo(models.Template)
  };
  return Monitor;
};