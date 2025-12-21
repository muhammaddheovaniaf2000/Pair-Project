'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static getProductsInStock(options) {
            const { Op } = require('sequelize');
            // Menambahkan kondisi stok > 0
            options.where.stock = { [Op.gt]: 0 }; 
            return Product.findAll(options);
        }

    get formattedPrice() {
          // 'this' merujuk pada instance objek (misalnya, product)
        const price = this.price; 
        
        // Cek jika harga null/undefined sebelum diformat
        if (price === null || price === undefined) {
            return 'Rp0'; 
        }

        // Menggunakan Intl.NumberFormat untuk format Rupiah yang benar
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0 // Opsional: Menghilangkan ,00 jika harga integer
        }).format(price);
    }

            
    static associate(models) {
      // define association here
      Product.hasMany(models.Order, {
        foreignKey: 'ProductId'
      });

      Product.belongsToMany(models.Category, {
        through: models.Product_Category, 
        foreignKey: 'ProductId',        otherKey: 'CategoryId' 
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};