"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rak extends Model {
    static associate(models) {
      // define association here
      this.hasOne(models.Lokator, { foreignKey: "idRak", as: "LokatorRak" });

      this.belongsToMany(models.Barang, {
        through: models.Lokator,
        foreignKey: "idRak",
        as: "BarangsRak",
      });
    }
  }
  Rak.init(
    {
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure kode is unique
      },
      letak: DataTypes.STRING,
      status: DataTypes.STRING,
      keterangan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Rak",
    }
  );
  return Rak;
};
