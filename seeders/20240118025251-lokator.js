"use strict";
const lokator = require("./lokator18jan.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    lokator.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Lokators", lokator, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Lokators", null, {});
  },
};
