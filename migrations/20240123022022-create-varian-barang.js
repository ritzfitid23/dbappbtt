"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("VarianBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idBarang: {
        type: Sequelize.INTEGER,
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: "Barangs", type: Sequelize.INTEGER, key: "id" },
      },
      idSatuanB: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
      },
      idSatuanA: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
      },
      nilaikonversi: {
        type: Sequelize.INTEGER,
      },
      urutan: {
        type: Sequelize.INTEGER,
      },
      hargajual: {
        type: Sequelize.INTEGER,
      },
      hargabeli: {
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("VarianBarangs");
  },
};
