"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ResepStared extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Resep, { foreignKey: "id" });
    }
  }
  ResepStared.init(
    {
      idResep: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ResepStared",
    }
  );
  return ResepStared;
};
