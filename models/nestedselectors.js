'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NestedSelectors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NestedSelectors.init({
    selector: DataTypes.STRING,
    attribute: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NestedSelectors',
  });

  NestedSelectors.associate = function(models) {
    // associations can be defined here
      NestedSelectors.hasOne(models.Monitors)
  };  
  return NestedSelectors;
};