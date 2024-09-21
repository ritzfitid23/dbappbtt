"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DTerimaBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.HTerimaBarang, { foreignKey: "idHTerimaBarang" });
      this.belongsTo(models.Barang, { foreignKey: "idBarang" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuan" });
    }
  }
  DTerimaBarang.init(
    {
      idHTerimaBarang: DataTypes.INTEGER,
      idBarang: DataTypes.INTEGER,
      idSatuan: DataTypes.INTEGER,
      qtyterima: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
      disc: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DTerimaBarang",
    }
  );
  return DTerimaBarang;
};
