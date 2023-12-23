"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ResepStareds", {
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
      idUser: {
        type: Sequelize.INTEGER,
        references: { model: "Users", type: Sequelize.INTEGER, key: "id" },
      },
      status: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("ResepStareds");
  },
};
