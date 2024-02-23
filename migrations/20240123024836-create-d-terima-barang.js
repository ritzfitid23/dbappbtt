"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DTerimaBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idHTerimaBarang: {
        type: Sequelize.INTEGER,
        references: {
          model: "HTerimaBarangs",
          type: Sequelize.INTEGER,
          key: "id",
        },
      },
      idBarang: {
        type: Sequelize.INTEGER,
        references: { model: "Barangs", type: Sequelize.INTEGER, key: "id" },
      },
      idSatuan: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
      },
      qtyterima: {
        type: Sequelize.INTEGER,
      },
      harga: {
        type: Sequelize.INTEGER,
      },
      disc: {
        type: Sequelize.INTEGER,
      },
      harganett: {
        type: Sequelize.INTEGER,
      },
      subtotal: {
        type: Sequelize.INTEGER,
      },
      subtotalnett: {
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
    await queryInterface.dropTable("DTerimaBarangs");
  },
};
