"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Supplier, { foreignKey: "idSupplier" });
      this.hasOne(models.Lokator, {
        foreignKey: "idBarang",
        as: "LokatorBarang",
      });

      this.belongsToMany(models.Rak, {
        through: models.Lokator,
        foreignKey: "idBarang",
        as: "RaksBarang",
      });

      this.hasOne(models.VarianBarang, { foreignKey: "idBarang" });
      this.hasOne(models.KartuStok, { foreignKey: "idBarang" });
    }
  }

  Barang.init(
    {
      sku: DataTypes.STRING,
      namabarang: DataTypes.STRING,
      img1: DataTypes.STRING,
      img2: DataTypes.STRING,
      img3: DataTypes.STRING,
      deskripsi: DataTypes.STRING,
      stok: DataTypes.INTEGER,
      berat: DataTypes.INTEGER,
      hargajual: DataTypes.INTEGER,
      hargabeli: DataTypes.INTEGER,
      idSupplier: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Barang",
    }
  );

  return Barang;
};
