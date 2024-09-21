"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Barangs", "idSatuan", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "Satuans", type: Sequelize.INTEGER, key: "id" },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Barangs", "idSatuan");
  },
};
