'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HTerimaBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HTerimaBarang.init({
    tanggal: DataTypes.DATE,
    nonota: DataTypes.STRING,
    idSupplier: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    disc: DataTypes.INTEGER,
    jumlahppn: DataTypes.INTEGER,
    totalppn: DataTypes.INTEGER,
    imgnota: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HTerimaBarang',
  });
  return HTerimaBarang;
};