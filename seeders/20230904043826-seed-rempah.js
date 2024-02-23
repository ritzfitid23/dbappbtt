"use strict";
const rempahs = require("./rempah.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    rempahs.forEach((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Rempahs", rempahs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Rempahs", null, {});
  },
};
