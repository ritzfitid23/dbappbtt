const { VarianBarang, Barang, Sequelize, Satuan } = require("../models");
const { Op } = require("sequelize");
class Controller {
  static async create(request, response, next) {
    const {
      idBarang,
      idSatuanB, //besar dan yang dipakai namanya
      idSatuanA,
      nilaikonversi,
      urutan,
      hargajual,
      hargabeli,
      qty,
      minOrder,
    } = request.body;

    const existingVarian = await VarianBarang.findOne({
      where: {
        idBarang,
        idSatuanB,
      },
    });

    if (existingVarian) {
      return response.status(400).json({
        message: "Combination of idBarang and idSatuanB must be unique",
      });
    } else {
      try {
        const newVarian = await VarianBarang.create(
          {
            idBarang,
            idSatuanB,
            idSatuanA,
            nilaikonversi,
            urutan,
            hargajual,
            hargabeli,
            qty,
            minOrder,
          },
          {
            returning: true,
          }
        );
        if (newVarian) {
          response.status(201).json(newVarian);
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  }

  static async setsatuankecil(request, response, next) {
    const {
      idBarang,
      idSatuanB, //besar dan yang dipakai namanya
      idSatuanA,
      nilaikonversi,
      urutan,
      hargajual,
      hargabeli,
      qty,
    } = request.body;

    try {
      const existingVarian = await VarianBarang.findOne({
        where: {
          idBarang,
          idSatuanB,
        },
      });

      if (existingVarian) {
        return response.status(400).json({
          message: "Combination of idBarang and idSatuanB must be unique",
        });
      } else {
        const newVarian = await VarianBarang.create(
          {
            idBarang,
            idSatuanB,
            idSatuanA,
            nilaikonversi,
            urutan,
            hargajual,
            hargabeli,
            qty,
          },
          {
            returning: true,
          }
        );
        const id = idBarang;
        const idSatuan = idSatuanB;
        const rowsUpdated = await Barang.update(
          {
            idSatuan, // Replace with the new image URL or file path
          },
          {
            where: {
              id,
            },
          }
        );
        if (rowsUpdated == 0) {
          console.log("masalah update barang");
        }

        if (newVarian) {
          console.log("masalah di new varian");
        }

        if (rowsUpdated > 0 && newVarian) {
          response.status(200).json("updated and created");
        }
      }
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        response.status(400).json({
          message: "Combination of idBarang and idSatuanB must be unique",
        });
      } else {
        console.log(error);
        next(error);
      }
    }
  }

  static async update(request, response, next) {
    const {
      idVarian,
      idBarang,
      idSatuanB, //besar dan yang dipakai namanya
      idSatuanA,
      nilaikonversi,
      urutan,
      hargajual,
      hargabeli,
      qty,
      minOrder,
    } = request.body;
    try {
      const id = idVarian;
      const rowsUpdated = await VarianBarang.update(
        {
          idSatuanB,
          idSatuanA,
          nilaikonversi,
          hargajual,
          hargabeli,
          qty,
          minOrder,
        },
        {
          where: {
            id,
          },
        }
      );
      if (rowsUpdated) {
        response.status(200).json("berhasil update");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async delete(request, response, next) {}
  static async getvarianbyidbarang(request, response, next) {
    const { idBarang } = request.params;
    try {
      const varianlist = await VarianBarang.findAll({
        where: {
          idBarang,
        },
        include: [
          {
            model: Satuan,
            as: "SatuanA",
          },
          {
            model: Satuan,
            as: "SatuanB",
          },
        ],
      });
      response.status(200).json(varianlist);
    } catch (error) {
      console.log(error);
      next(error);
      response.status(500).json(error);
    }
  }
  static async search(request, response, next) {}

  static async getsatuanexthisvarian(request, response, next) {
    const { idBarang, namalain } = request.body;

    try {
      const satuans = await Satuan.findAll({
        include: [
          {
            model: VarianBarang,
            required: false,
            attributes: [],
            where: {
              idBarang,
            },
          },
        ],
        where: {
          [Op.and]: [
            { "$VarianBarang.idBarang$": { [Op.eq]: null } },
            { namalain: { [Op.like]: `%${namalain}%` } },
          ],
        },
      });
      response.status(200).json(satuans);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
