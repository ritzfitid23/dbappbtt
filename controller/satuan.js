const { Satuan, Sequelize } = require("../models");

const { Op } = Sequelize;
class Controller {
  static async create(request, response, next) {
    const { namahz, namalain, img } = request.body;
    try {
      const newSatuan = await Satuan.create({
        namahz,
        namalain,
        img,
      });
      // console.log(newSatuan);
      response.status(201).json(newSatuan);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async getbyid(request, response, next) {
    const { id } = request.params;
    try {
      const satuan = await Satuan.findOne({
        where: { id },
      });
      response.status(200).json(satuan);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async update(request, response, next) {
    const { namahz, namalain, img, id } = request.body;
    try {
      const [rowsUpdated] = await Satuan.update(
        {
          namahz,
          namalain,
          img, // Replace with the new image URL or file path
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(`Updated ${rowsUpdated} row(s)`);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }
  static async delete(request, response, next) {
    const { id } = request.params;
    try {
      const rowsDeleted = await Satuan.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        response.status(200).json(`Deleted ${rowsDeleted} row(s)`);
      } else {
        response.status(200).json("No rows were deleted.");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async readall(request, response) {
    try {
      const satuans = await Satuan.findAll({});
      response.status(200).json(satuans);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async search(request, response, next) {
    const { hanzhi, namaLain } = request.body;

    try {
      const satuans = await Satuan.findAll({
        where: {
          [Op.or]: [
            {
              namahz: {
                [Op.like]: `%${hanzhi}%`, // Search for records with hanzhi containing the provided value
              },
            },
            {
              namalain: {
                [Op.like]: `%${namaLain}%`, // Search for records in the Namalain table with namaLain containing the provided value
              },
            },
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
