'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      User.hasOne(models.Profile, {
        foreignKey: 'UserId'
      });

      User.hasMany(models.Order, {
        foreignKey: 'UserId'
      });
    }
    checkPassword(plainPassword) {
      return bcrypt.compareSync(plainPassword, this.password);
    }
  }
 

  User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Email ini sudah terdaftar. Silakan gunakan email lain.'
        },
        validate: {
            isEmail: { // Jenis Validasi 1: Format Email
                msg: 'Format email tidak valid.'
            },
            notEmpty: { // Jenis Validasi 2: Tidak Boleh Kosong
                msg: 'Email wajib diisi.'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password wajib diisi'
          },
          len: {
            args: [8],
            msg: 'Password minimal 8 karakter'
          }
        }
        
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            isIn: { // Jenis Validasi 3: Memastikan Role hanya 'admin' atau 'customer'
                args: [['admin', 'customer']],
                msg: 'Role harus admin atau customer.'
            }
        }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });
  return User;
};