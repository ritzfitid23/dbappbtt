"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reseps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      namahz: {
        type: Sequelize.STRING,
        collate: "utf8mb4_chinese_ci",
      },
      namalain: {
        type: Sequelize.STRING,
      },
      fungsi: {
        type: Sequelize.STRING,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      harga: {
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
    await queryInterface.dropTable("Reseps");
  },
};
