'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorLogging extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ErrorLogging.init({
    name: DataTypes.STRING,
    discordWebhookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ErrorLogging',
  });

  ErrorLogging.associate = function(models) {
    // associations can be defined here
      ErrorLogging.belongsTo(models.DiscordWebhook)
  };
  return ErrorLogging;
};