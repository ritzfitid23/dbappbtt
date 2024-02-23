'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubDTerimaBarang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SubDTerimaBarang.init({
    qty: DataTypes.INTEGER,
    qtyawal: DataTypes.INTEGER,
    idDterima: DataTypes.INTEGER,
    expdate: DataTypes.DATE,
    idSatuan: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SubDTerimaBarang',
  });
  return SubDTerimaBarang;
};