'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiscordWebhook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  DiscordWebhook.init({
    name: DataTypes.STRING,
    webhookId: DataTypes.STRING,
    webhookToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DiscordWebhook',
  });

  DiscordWebhook.associate = function(models) {
    // associations can be defined here
      DiscordWebhook.hasMany(models.Monitors)
      DiscordWebhook.hasMany(models.ErrorLogging)
  };
  return DiscordWebhook;
};