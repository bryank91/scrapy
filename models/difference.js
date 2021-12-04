'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Difference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }
  };
  Difference.init({
    name: DataTypes.STRING,
    value: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Difference',
  });

  Difference.associate = function(models) {
    // associations can be defined here
      Difference.hasMany(models.Monitor)
  };
  return Difference;
};