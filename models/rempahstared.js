"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RempahStared extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Rempah, { foreignKey: "idRempah" });
    }
  }
  RempahStared.init(
    {
      idRempah: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "RempahStared",
    }
  );
  return RempahStared;
};
