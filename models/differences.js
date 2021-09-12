'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Differences extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Differences.init({
    monitorsId: DataTypes.INTEGER,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Differences',
  });

  Differences.associate = function(models) {
    // associations can be defined here
      Differences.hasOne(models.Monitors)
  };
  return Differences;
};