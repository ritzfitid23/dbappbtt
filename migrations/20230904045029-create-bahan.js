"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bahans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idResep: {
        type: Sequelize.INTEGER,
        references: { model: "Reseps", type: Sequelize.INTEGER, key: "id" },
      },
      idRempah: {
        type: Sequelize.INTEGER,
        references: { model: "Rempahs", type: Sequelize.INTEGER, key: "id" },
      },
      idSatuan: {
        type: Sequelize.INTEGER,
        references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
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
    await queryInterface.dropTable("Bahans");
  },
};
