"use strict";
const supplier = require("./supplier17jan.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    supplier.forEach((el) => {
      delete el.idSupplier;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.email = "";
      el.keterangan = "";
      el.status = "Aktif";

      return el;
    });
    await queryInterface.bulkInsert("Suppliers", supplier, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Suppliers", null, {});
  },
};
