"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubDTerimaBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      qtyawal: {
        type: Sequelize.INTEGER,
      },
      idDterima: {
        type: Sequelize.INTEGER,
        references: {
          model: "DTerimaBarangs",
          type: Sequelize.INTEGER,
          key: "id",
        },
      },
      expdate: {
        type: Sequelize.DATE,
      },
      idSatuan: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
      },
      status: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("SubDTerimaBarangs");
  },
};
