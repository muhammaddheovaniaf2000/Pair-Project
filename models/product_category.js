'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product_Category.belongsTo(models.Product, { foreignKey: 'ProductId' });
      
      Product_Category.belongsTo(models.Category, { foreignKey: 'CategoryId' })
    }
  }
  Product_Category.init({
    ProductId: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product_Category',
  });
  return Product_Category;
};