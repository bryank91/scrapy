'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Monitors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Monitors.init({
    name: DataTypes.STRING,
    siteurl: DataTypes.STRING,
    selector: DataTypes.STRING,
    frequencySeconds: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER,
    discordWebhookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Monitors',
  });
  Monitors.associate = function(models) {
    // associations can be defined here
      Monitors.belongsTo(models.Templates)
      Monitors.belongsTo(models.DiscordWebhook)
      Monitors.belongsTo(models.Differences)
  };
  return Monitors;
};