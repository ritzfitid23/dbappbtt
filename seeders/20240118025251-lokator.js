"use strict";
let lokator = require("./lokator-28sept2024.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    lokator.map((el) => {
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
