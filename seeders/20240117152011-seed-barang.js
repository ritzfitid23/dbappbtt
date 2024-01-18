"use strict";
const barangs = require("./barang17jan.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    barangs.forEach((el) => {
      delete el.idRak;
      el.idSupplier = el.idSupplier == 0 ? null : el.idSupplier;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.img1 = "";
      el.img2 = "";
      el.img3 = "";
      el.deskripsi = "";
      el.stok = 0;
      el.berat = 0;
      el.hargabeli = 0;
      return el;
    });
    await queryInterface.bulkInsert("Barangs", barangs, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Barangs", null, {});
  },
};
