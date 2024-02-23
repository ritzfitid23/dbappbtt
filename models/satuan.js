"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Satuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Bahan, { foreignKey: "idSatuan" });
      this.hasOne(models.KartuStok, { foreignKey: "idSatuan" });

      this.hasOne(models.VarianBarang, { foreignKey: "idSatuanA" });
      this.hasOne(models.VarianBarang, { foreignKey: "idSatuanB" });
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
