"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Namalain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Rempah, { foreignKey: "idRempah" });
    }
  }
  Namalain.init(
    {
      idRempah: DataTypes.INTEGER,
      namaLain: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Namalain",
    }
  );
  return Namalain;
};
