'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Barang.init({
    sku: DataTypes.STRING,
    namabarang: DataTypes.STRING,
    img1: DataTypes.STRING,
    img2: DataTypes.STRING,
    img3: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    stok: DataTypes.INTEGER,
    berat: DataTypes.INTEGER,
    idRak: DataTypes.INTEGER,
    hargajual: DataTypes.INTEGER,
    hargabeli: DataTypes.INTEGER,
    idSupplier: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};