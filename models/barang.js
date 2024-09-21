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

      this.belongsTo(models.Satuan, { foreignKey: "idSatuan" });
      this.hasOne(models.DTerimaBarang, { foreignKey: "idBarang" });
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
      idSatuan: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Barang",
      hooks: {
        afterCreate: async (barang, options) => {
          // Import VarianBarang model here
          const { VarianBarang } = sequelize.models;

          // Create a new VarianBarang after a Barang is created
          try {
            await VarianBarang.create({
              idBarang: barang.id, // Associate with the newly created Barang
              idSatuanB: barang.idSatuan, // Example values, adjust as needed
              idSatuanA: barang.idSatuan, // Example values, adjust as needed
              nilaikonversi: 1,
              urutan: 1,
              hargajual: barang.hargajual,
              hargabeli: 0,
              qty: barang.stok,
            });
          } catch (error) {
            console.error("Error creating VarianBarang:", error);
          }
        },
      },
    }
  );

  return Barang;
};
