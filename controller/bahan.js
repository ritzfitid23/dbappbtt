const { Bahan, Rempah, Satuan } = require("../models");
const fs = require("fs");
const { format } = require("date-fns");
const { bucket } = require("../config/firebaseConfig");
class Controller {
  static async create(request, response, next) {
    const { idResep, idRempah, idSatuan, qty } = request.body;

    try {
      const bahans = await Bahan.findOne({
        where: { idResep, idRempah, idSatuan },
      });
      console.log(bahans);

      if (bahans == null) {
        const newBahan = await Bahan.create({
          idResep,
          idRempah,
          idSatuan,
          qty,
        });

        response.status(201).json(newBahan);
      } else {
        const idnya = bahans.id;
        const exist = 1;
        const rowsUpdated = await Bahan.update(
          {
            idSatuan,
            qty,
            exist,
          },
          {
            where: { id: idnya },
          }
        );
        if (rowsUpdated) {
          response
            .status(200)
            .json("bahan sudah pernah dimasukan dilakukan update saja");
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(request, response, next) {
    const { idSatuan, qty, id } = request.body;
    try {
      const rowsUpdated = await Bahan.update(
        {
          idSatuan,
          qty,
        },
        {
          where: { id },
        }
      );

      if (rowsUpdated) {
        response.status(200).json(`Updated ${rowsUpdated} row(s)`);
      } else {
        response.status(400).json(`Updated ${rowsUpdated} row(s)`);
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(request, response, next) {
    const { id } = request.body;

    try {
      const rowsUpdated = await Bahan.update(
        {
          exist: "0",
        },
        {
          where: { id },
        }
      );

      if (rowsUpdated) {
        response.status(200).json(`Deleted ${rowsUpdated} row(s)`);
      } else {
        response.status(404).json(`Bahan with id ${id} not found`);
      }
    } catch (error) {
      next(error);
    }
  }

  static async readall(request, response) {
    const { idResep } = request.params;

    try {
      const bahans = await Bahan.findAll({
        where: { idResep, exist: 1 },
      });

      if (bahans.length > 0) {
        response.status(200).json(bahans);
      } else {
        response.status(404).json(`No Bahans found for idResep ${idResep}`);
      }
    } catch (error) {
      response.status(500).json(`Internal Server Error: ${error.message}`);
    }
  }
}

module.exports = Controller;
