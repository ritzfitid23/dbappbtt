const { Rak, Sequelize } = require("../models"); // Make sure to provide the correct path to your Rak model

const { Op } = Sequelize;

class RakController {
  static async create(request, response, next) {
    const { kode, letak, status, keterangan } = request.body;

    try {
      const newRak = await Rak.create({
        kode,
        letak,
        status,
        keterangan,
      });

      if (newRak) {
        response.status(201).json(newRak);
      }
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        // Handle unique constraint violation
        response.status(400).json({ error: "Kode harus unik !" });
      } else {
        next(error);
      }
    }
  }

  static async getById(request, response, next) {
    const { id } = request.params;

    try {
      const rak = await Rak.findOne({
        where: { id },
      });

      response.status(200).json(rak);
    } catch (error) {
      next(error);
    }
  }

  static async update(request, response, next) {
    const { kode, letak, status, keterangan, id } = request.body;

    try {
      const [rowsUpdated] = await Rak.update(
        {
          kode,
          letak,
          status,
          keterangan,
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
      const rowsDeleted = await Rak.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        response.status(200).json(`Deleted ${rowsDeleted} row(s)`);
      } else {
        response.status(200).json("No rows were deleted.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async readAll(request, response, next) {
    try {
      const raks = await Rak.findAll({});

      response.status(200).json(raks);
    } catch (error) {
      next(error);
    }
  }

  static async search(request, response, next) {
    const { kode, letak, status, keterangan } = request.body;

    try {
      const raks = await Rak.findAll({
        where: {
          [Op.or]: [
            {
              kode: {
                [Op.like]: `%${kode}%`,
              },
            },
            {
              letak: {
                [Op.like]: `%${letak}%`,
              },
            },
            {
              status: {
                [Op.like]: `%${status}%`,
              },
            },
            {
              keterangan: {
                [Op.like]: `%${keterangan}%`,
              },
            },
          ],
        },
      });

      response.status(200).json(raks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RakController;
