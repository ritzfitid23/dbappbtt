'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PenyesuaianStoks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATE
      },
      jenis: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.INTEGER
      },
      keterangan: {
        type: Sequelize.INTEGER
      },
      hargajual: {
        type: Sequelize.INTEGER
      },
      idBarang: {
        type: Sequelize.INTEGER
      },
      idSatuan: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PenyesuaianStoks');
  }
};