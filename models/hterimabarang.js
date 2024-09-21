"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HTerimaBarang extends Model {
    static associate(models) {
      this.belongsTo(models.Supplier, { foreignKey: "idSupplier" });
      this.hasOne(models.DTerimaBarang, { foreignKey: "idHTerimaBarang" });
    }
  }
  HTerimaBarang.init(
    {
      tanggal: DataTypes.DATE,
      nonota: DataTypes.STRING,
      idSupplier: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      disc: DataTypes.STRING,
      jumlahppn: DataTypes.INTEGER,
      totalppn: DataTypes.INTEGER,
      imgnota: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HTerimaBarang",
    }
  );
  return HTerimaBarang;
};
