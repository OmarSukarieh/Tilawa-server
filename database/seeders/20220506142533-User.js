'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      firstName: "User",
      lastName: "Sukarieh",
      email: "user@gmail.com",
      password: bcrypt.hashSync("secret", 10),
      createdAt: "2022-05-05T14:25:32.132Z",
      updatedAt: "2021-05-05T14:25:32.132Z",
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
