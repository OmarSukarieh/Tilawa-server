'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      chatId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fromUserId: {
        type: Sequelize.INTEGER
      },
      fromTeacherId: {
        type: Sequelize.INTEGER
      },
      messageType: {
        type: Sequelize.ENUM({
          values: ['audio', 'video', 'image', 'text']
        }),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};