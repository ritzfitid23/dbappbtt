"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rempah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Namalain, { foreignKey: "idRempah" });
      this.hasOne(models.RempahStared, { foreignKey: "idRempah" });
      this.hasOne(models.Bahan, { foreignKey: "idRempah" });
    }
  }
  Rempah.init(
    {
      norak: DataTypes.STRING,
      hanzhi: DataTypes.STRING,
      pinyin: DataTypes.STRING,
      img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Rempah",
    }
  );
  return Rempah;
};
