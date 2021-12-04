'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Template.init({
    header: DataTypes.STRING,
    footer: DataTypes.STRING,
    domain: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Template',
  });
  Monitor.associate = function(models) {
    // associations can be defined here
      Template.hasMany(models.Monitor)
  };

  return Template;
};