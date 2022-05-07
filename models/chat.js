'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
      });
      this.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
      });
      this.hasMany(models.Message, {
        foreignKey: "chatId",
      });
    }
  }
  Chat.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "User id must have a name in arabic" },
        notEmpty: { msg: "User id arabic name must not be an empty" },
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Teacher id must have a name in arabic" },
        notEmpty: { msg: "Teacher id arabic name must not be an empty" },
      },
    },
  }, {
    sequelize,
    tableName: 'chats',
    modelName: 'Chat',
  });
  return Chat;
};