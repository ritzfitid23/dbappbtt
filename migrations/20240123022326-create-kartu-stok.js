"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("KartuStoks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      jenis: {
        type: Sequelize.STRING,
      },
      stokawal: {
        type: Sequelize.INTEGER,
      },
      debit: {
        type: Sequelize.INTEGER,
      },
      kredit: {
        type: Sequelize.INTEGER,
      },
      stokakhir: {
        type: Sequelize.INTEGER,
      },
      hargatransaksi: {
        type: Sequelize.INTEGER,
      },
      nilaikonversi: {
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      idBarang: {
        type: Sequelize.INTEGER,
        references: { model: "Barangs", type: Sequelize.INTEGER, key: "id" },
      },
      idSatuan: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("KartuStoks");
  },
};
