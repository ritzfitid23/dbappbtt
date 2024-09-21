const {
  DTerimaBarang,
  Sequelize,
  Barang,
  Satuan,
  HTerimaBarang,
} = require("../models");

const { Op } = Sequelize;
class Controller {
  static async create(request, response, next) {
    const {
      idHTerimaBarang,
      idBarang,
      idSatuan,
      qtyterima,
      harga,
      disc,
      subtotal,
    } = request.body;
    try {
      const newDterima = await DTerimaBarang.create(
        {
          idHTerimaBarang,
          idBarang,
          idSatuan,
          qtyterima,
          harga,
          disc,
          subtotal,
        },
        {
          returning: true,
        }
      );
      response.status(201).json(newDterima);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(request, response, next) {
    const {
      id,
      idHTerimaBarang,
      idBarang,
      idSatuan,
      qtyterima,
      harga,
      disc,
      subtotal,
    } = request.body;

    try {
      const [rowsUpdated] = await DTerimaBarang.update(
        {
          idSatuan,
          qtyterima,
          harga,
          disc,
          subtotal,
        },
        {
          where: { id },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json({ message: "Berhasil update" });
      } else {
        response.status(404).json({ message: "No record found to update" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(request, response, next) {}
  static async read(request, response, next) {
    const { idHTerimaBarang } = request.params;
    // dapetin dterima yang milik specific hterima
    try {
      const listDterima = await DTerimaBarang.findAll({
        where: { idHTerimaBarang },
        include: [
          {
            model: Barang,
          },
          {
            model: Satuan,
          },
        ],
      });
      response.status(200).json(listDterima);
    } catch (error) {
      next(error);
    }
  }
  static async readbyid(request, response, next) {
    const { id } = request.params;
    // dapetin dterima yang milik specific hterima
    try {
      const listDterima = await DTerimaBarang.findOne({
        include: [
          {
            model: Barang,
          },
          {
            model: Satuan,
          },
        ],
        where: { id },
      });
      response.status(200).json(listDterima);
    } catch (error) {
      next(error);
    }
  }
  static async search(request, response, next) {}
}

module.exports = Controller;
