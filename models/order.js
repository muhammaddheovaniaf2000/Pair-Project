'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: 'UserId'
      });

      Order.belongsTo(models.Product, {
        foreignKey: 'ProductId'
      });
    }
  }
  Order.init({
    UserId: DataTypes.INTEGER,
    total: DataTypes.DECIMAL(10, 2),
    quantity: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};