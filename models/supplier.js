"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Barang, { foreignKey: "idSupplier" });
    }
  }
  Supplier.init(
    {
      perusahaan: DataTypes.STRING,
      namakontak: DataTypes.STRING,
      nohp: DataTypes.STRING,
      email: DataTypes.STRING,
      keterangan: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
