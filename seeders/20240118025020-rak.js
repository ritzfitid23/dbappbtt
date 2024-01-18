"use strict";
const rak = require("./rak18jan.json");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    rak.forEach((el) => {
      delete el.idRak;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Raks", rak, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Raks", null, {});
  },
};
