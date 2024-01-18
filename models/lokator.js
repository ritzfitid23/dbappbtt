"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lokator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Barang, {
        foreignKey: "idBarang",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Rak, {
        foreignKey: "idRak",
        onDelete: "CASCADE",
      });
    }
  }
  Lokator.init(
    {
      idRak: DataTypes.INTEGER,
      idBarang: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Lokator",
    }
  );
  return Lokator;
};
