'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Chat, {
        foreignKey: "teacherId",
      });
    }
    toJSON() {
      return {
        ...this.get(),
        password: undefined,
      };
    }
  }
  Teacher.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name should not be empty" },
        notNull: { msg: "First name should not be null" },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Last name should not be empty" },
        notNull: { msg: "Last name should not be null" },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Email should not be empty" },
        notNull: { msg: "Email should not be null" },
        isEmail: { msg: "Should be an email" }
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password should not be empty" },
        notNull: { msg: "Password should not be null" },
        min: {
          args: [6],
          msg: "Minimum 6 characters required in Password",
        }
      }
    },
    isApprove: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    sequelize,
    tableName: 'teachers',
    modelName: "Teacher",
  });
  return Teacher;
};