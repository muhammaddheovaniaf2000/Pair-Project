'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'UserId'
      });
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false, // <-- Batasan database (TIDAK BOLEH NULL)
      validate: {
        notEmpty: { 
          msg: 'Nama wajib diisi.'
        }
        // notNull validator DIHAPUS karena sudah ada allowNull: false
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false, // <-- Tambahkan juga di sini agar sesuai dengan logika bisnis
      validate: {
        notNull: {
          msg: 'Alamat wajib diisi'
        },
        notEmpty: {
          msg: 'Alamat wajib diisi.'
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};