"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Resep extends Model {
    static associate(models) {
      this.hasMany(models.Bahan, { foreignKey: "idResep" });
      this.hasOne(models.ResepStared, { foreignKey: "idResep" });
    }
  }
  Resep.init(
    {
      namahz: DataTypes.STRING,
      namalain: DataTypes.STRING,
      fungsi: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Resep",
    }
  );
  return Resep;
};
