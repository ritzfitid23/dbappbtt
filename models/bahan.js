"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Resep, {
        foreignKey: "idResep",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Satuan, {
        foreignKey: "idSatuan",
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Rempah, { foreignKey: "idRempah" });
    }
  }
  Bahan.init(
    {
      idResep: DataTypes.INTEGER,
      idRempah: DataTypes.INTEGER,
      idSatuan: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bahan",
    }
  );
  return Bahan;
};
