"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("HTerimaBarangs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tanggal: {
        type: Sequelize.DATE,
      },
      nonota: {
        type: Sequelize.STRING,
      },
      idSupplier: {
        type: Sequelize.INTEGER,
        references: { model: "Suppliers", type: Sequelize.INTEGER, key: "id" },
      },
      jumlah: {
        type: Sequelize.INTEGER,
      },
      disc: {
        type: Sequelize.STRING,
      },
      jumlahppn: {
        type: Sequelize.INTEGER,
      },
      totalppn: {
        type: Sequelize.INTEGER,
      },
      imgnota: {
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
    await queryInterface.dropTable("HTerimaBarangs");
  },
};
