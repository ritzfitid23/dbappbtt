'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PenyesuaianStok extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PenyesuaianStok.init({
    tanggal: DataTypes.DATE,
    jenis: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    keterangan: DataTypes.INTEGER,
    hargajual: DataTypes.INTEGER,
    idBarang: DataTypes.INTEGER,
    idSatuan: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PenyesuaianStok',
  });
  return PenyesuaianStok;
};