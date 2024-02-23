"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VarianBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Barang, { foreignKey: "idBarang" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuanA" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuanB" });
    }
  }
  VarianBarang.init(
    {
      idBarang: DataTypes.INTEGER,
      idSatuanB: DataTypes.INTEGER,
      idSatuanA: DataTypes.INTEGER,
      nilaikonversi: DataTypes.INTEGER,
      urutan: DataTypes.INTEGER,
      hargajual: DataTypes.INTEGER,
      hargabeli: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "VarianBarang",
    }
  );
  return VarianBarang;
};
