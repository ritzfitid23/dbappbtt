"use strict";
const barangs = require("./barang-28sept2024.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    barangs.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Barangs", barangs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Barangs", null, {});
  },
};
