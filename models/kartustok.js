"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KartuStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Barang, { foreignKey: "idBarang" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuan" });
    }
  }
  KartuStok.init(
    {
      tanggal: DataTypes.DATE,
      jenis: DataTypes.STRING,
      stokawal: DataTypes.INTEGER,
      debit: DataTypes.INTEGER,
      kredit: DataTypes.INTEGER,
      stokakhir: DataTypes.INTEGER,
      hargatransaksi: DataTypes.INTEGER,
      nilaikonversi: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      idBarang: DataTypes.INTEGER,
      idSatuan: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "KartuStok",
    }
  );
  return KartuStok;
};
