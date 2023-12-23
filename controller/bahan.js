const { Bahan } = require("../models");

class Controller {
  static async create(request, response, next) {
    const { idResep, idRempah, idSatuan, qty } = request.body;
    try {
      const newBahan = await Bahan.create({
        idResep,
        idRempah,
        idSatuan,
        qty,
      });

      response.status(201).json(newBahan);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(request, response, next) {
    const { idSatuan, qty, id } = request.body;
    try {
      const [rowsUpdated] = await Bahan.update(
        {
          idSatuan,
          qty,
        },
        {
          where: { id },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(`Updated ${rowsUpdated} row(s)`);
      } else {
        response.status(400).json(`Updated ${rowsUpdated} row(s)`);
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(request, response, next) {}
  static async readall(request, response) {}
}

module.exports = Controller;
