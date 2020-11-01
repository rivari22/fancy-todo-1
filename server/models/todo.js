'use strict';
const {
  Model
} = require('sequelize');
const convertDate = require('../helpers/convertDate');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User)
    }
  };
  Todo.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    due_date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: {
          args: convertDate(new Date()),
          msg: "Cannot select a date less than today"
        }
      }
    },
    start_date: {
      type: DataTypes.DATE,
      validate: {
        isAfter: {
          args: convertDate(new Date()),
          msg: "Cannot select a date less than today"
        }
      }
    },
    category: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};