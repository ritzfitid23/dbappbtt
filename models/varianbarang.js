"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VarianBarang extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Barang, { foreignKey: "idBarang" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuanA", as: "SatuanA" });
      this.belongsTo(models.Satuan, { foreignKey: "idSatuanB", as: "SatuanB" });
    }
  }

  VarianBarang.init(
    {
      idBarang: DataTypes.INTEGER,
      idSatuanB: DataTypes.INTEGER,
      idSatuanA: DataTypes.INTEGER,
      nilaikonversi: DataTypes.INTEGER,
      urutan: DataTypes.INTEGER,
      hargajual: DataTypes.INTEGER,
      hargabeli: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      minOrder: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "VarianBarang",
      hooks: {
        // afterUpdate: async (varianbarang, options) => {
        //   const previousValues = varianbarang._previousDataValues; //currentValues.hargabeli
        //   const currentValues = varianbarang.dataValues;
        //   // Import VarianBarang model here
        //   const { KartuStok } = sequelize.models;
        //   const latestKartuStok = await KartuStok.findOne({
        //     where: { idBarang,idSatuan },
        //     order: [['createdAt', 'DESC']], // Assuming 'createdAt' is the timestamp column
        //   });
        //   const stokawal = latestKartuStok.stokakhir;
        //   const stokakhir = varianbarang.qty;
        //   const debit = 0;
        //   const kredit = 0;
        //   const jenis = "";
        //   if (previousValues.qty < currentValues.qty) {
        //     jenis = "penambahan";
        //     debit=0;
        //   } else {
        //     jenis = "pengurangan";
        //     kredit=0;
        //   }
        //   try {
        //     const newKartustok = await KartuStok.create({
        //       tanggal: new Date(),
        //       jenis,
        //       stokawal,
        //       debit,
        //       kredit,
        //       stokakhir,
        //       nilaikonversi: 1,
        //       hargatransaksi: varianbarang.hargabeli,
        //       qty: varianbarang.qty,
        //       idBarang: varianbarang.idBarang,
        //       idSatuan: varianbarang.idSatuanB,
        //     });
        //     if (newKartustok) {
        //       console.log("berhasil add kartu stok");
        //     }
        //   } catch (error) {
        //     console.log(error);
        //   }
        // },
      },
    }
  );
  return VarianBarang;
};
