"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lokators", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idRak: {
        type: Sequelize.INTEGER,
        references: { model: "Raks", type: Sequelize.INTEGER, key: "id" },
      },
      idBarang: {
        type: Sequelize.INTEGER,
        references: { model: "Barangs", type: Sequelize.INTEGER, key: "id" },
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
    await queryInterface.dropTable("Lokators");
  },
};
