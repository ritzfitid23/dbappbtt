"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Satuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.]
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Bahan, { foreignKey: "idSatuan" });
      this.hasOne(models.KartuStok, { foreignKey: "idSatuan" });

      this.hasOne(models.VarianBarang, { foreignKey: "idSatuanA" });
      this.hasOne(models.VarianBarang, { foreignKey: "idSatuanB" });

      this.hasOne(models.Barang, { foreignKey: "idSatuan" });
      this.hasOne(models.DTerimaBarang, { foreignKey: "idBarang" });
    }
  }
  Satuan.init(
    {
      namahz: DataTypes.STRING,
      namalain: DataTypes.STRING,
      konversi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Satuan",
    }
  );
  return Satuan;
};
