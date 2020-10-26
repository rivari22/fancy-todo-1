'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo)
    }
  };
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      unique: true,
      type: DataTypes.STRING,
      validate: {
        isEmail :{
          msg: "Must be an email format"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6],
          msg: "Password minimum 6 characters"
        }
      }
    },
    birth_date: DataTypes.DATE
  }, {
    hooks: {
      beforeCreate: (user, opt) => {
        user.password = hashPassword(user.password)  
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};