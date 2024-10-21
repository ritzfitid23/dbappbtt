"use strict";
const suppliers = require("./supplier-28sept2024.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    suppliers.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Suppliers", suppliers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};
