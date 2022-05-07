'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, {
        foreignKey: "chatId",
      });
    }
  }
  Message.init({
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: "Message must have a value" },
        notEmpty: { msg: "Message must not be an empty" },
      },
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Chat id must have a value" },
        notEmpty: { msg: "Chat id must not be an empty" },
      },
    },
    fromUserId: DataTypes.INTEGER,
    fromTeacherId: DataTypes.INTEGER,
    messageType: {
      type: DataTypes.ENUM({
        values: ['audio', 'video', 'photo', 'text']
      }),
      allowNull: false,
      validate: {
        notNull: { msg: "Message Type must have a value either audio, video or photo" },
        notEmpty: { msg: "Message Type must not be an empty" },
      },
    }
  }, {
    sequelize,
    tableName: 'messages',
    modelName: 'Message',
  });
  return Message;
};