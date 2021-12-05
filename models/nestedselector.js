'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NestedSelector extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NestedSelector.init({
    selector: DataTypes.STRING,
    attribute: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NestedSelector',
  });

  NestedSelector.associate = function(models) {
    // associations can be defined here
      NestedSelector.hasMany(models.Monitor)
  };  
  return NestedSelector;
};