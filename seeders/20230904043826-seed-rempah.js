"use strict";
const rempahs = require("./index.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    rempahs.forEach((el) => {
      delete el.idRamuan;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Rempahs", rempahs, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     *
     */
    await queryInterface.bulkDelete("Rempahs", null, {});
  },
};
