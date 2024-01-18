"use strict";
const { Model } = require("sequelize");
const { hashPass } = require("../helper");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.Rempah, { foreignKey: "id" });
      this.hasOne(models.Resep, { foreignKey: "id" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },

    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate(async (instance) => {
    const hashedPassword = await hashPass(instance.password);
    console.log(hashedPassword);
    instance.password = hashedPassword;
  });

  return User;
};
