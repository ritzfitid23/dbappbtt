const { where } = require("sequelize");
const {
  Resep,
  ResepStared,
  Bahan,
  Rempah,
  Satuan,
  Sequelize,
} = require("../models");

const { Op } = Sequelize;

class Controller {
  static async create(request, response, next) {
    const { namahz, namalain, fungsi, keterangan, harga, bahan } = request.body;
    // console.log(bahan);
    try {
      const newResep = await Resep.create(
        {
          namahz,
          namalain,
          fungsi,
          keterangan,
          harga,
        },
        {
          returning: true,
        }
      );
      if (newResep) {
        response.status(201).json(newResep);
      }
    } catch (error) {
      // console.log({ error });
      next(error);
    }
  }
  static async update(request, response, next) {
    try {
      const { namahz, namalain, fungsi, keterangan, harga, id } = request.body;

      // Perform the update operation
      const rowsUpdated = await Resep.update(
        {
          namahz,
          namalain,
          fungsi,
          keterangan,
          harga,
        },
        {
          where: { id },
        }
      );

      console.log(bahan);

      if (rowsUpdated) {
        response
          .status(200)
          .json({ data: `Resep dengan id ${id} telah diperbaharui` });
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }
  static async delete(request, response, next) {
    const { id } = request.body;
    try {
      const rowsDeleted = await Resep.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        response.status(200).json({ data: "Delete Successfully" });
      } else {
        response.status(404).json({ data: "No rows were deleted" });
      }
    } catch (error) {
      next(error);
    }
  }

  static async readall(request, response, next) {
    const { offset, limit } = request.body;
    try {
      const recipes = await Resep.findAll({
        // offset: offset, // The number of records to skip
        // limit: limit, // The maximum number of records to return
        include: [
          {
            model: Bahan,
            required: false,
            where: {
              exist: 1,
            },
            include: [
              {
                model: Rempah,
                required: true,
              },
              {
                model: Satuan,
                required: true,
              },
            ],
          },
        ],
      });
      response.status(200).json(recipes);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async readsearch(request, response, next) {
    const { namahz, namalain } = request.body;

    try {
      const searchTerm = namalain ? `%${namalain}%` : "%%";
      const hanzhiTerm = namahz ? `%${namahz}%` : "%%";
      const recipes = await Resep.findAll({
        include: [
          {
            model: Bahan,
            required: false,
            where: {
              exist: 1,
            },
            include: [
              {
                model: Rempah,
                required: true,
              },
              {
                model: Satuan,
                required: true,
              },
            ],
          },
        ],
        where: {
          [Op.or]: [
            { namalain: { [Op.like]: searchTerm } },
            { namahz: { [Op.like]: hanzhiTerm } },
          ],
        },
      });
      response.status(200).json(recipes);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createresepstared(request, response, next) {
    const { idResep, idUser, status } = request.body;
    try {
      const resepStared = await ResepStared.create({
        idResep,
        idUser,
        status,
      });

      response.status(201).json(resepStared);
    } catch (error) {
      console.error("Error creating ResepStared:", error);
      next(error);
    }
  }

  static async getbyid(request, response, next) {
    const { id } = request.params;
    try {
      const recipe = await Resep.findOne({
        // offset: offset, // The number of records to skip
        // limit: limit, // The maximum number of records to return
        where: { id },
        include: [
          {
            model: Bahan,
            required: false,
            where: {
              exist: 1,
            },
            include: [
              {
                model: Rempah,
                required: true,
              },
              {
                model: Satuan,
                required: true,
              },
            ],
          },
        ],
      });
      response.status(200).json(recipe);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async updateresepstared(request, response, next) {
    const { newStatus, id } = request.body;
    try {
      const [updatedRows] = await ResepStared.update(
        { status: newStatus },
        {
          where: { id },
        }
      );

      if (updatedRows > 0) {
        response.status(200).json("ResepStared record updated successfully");
      } else {
        response
          .status(200)
          .json("No records were updated. ResepStared record not found.");
      }
    } catch (error) {
      console.error("Error updating ResepStared:", error);
      next(error);
    }
  }

  static async readbyrempah(request, response, next) {
    const { id } = request.params;
    try {
      const recipes = await Resep.findAll({
        include: [
          {
            model: Bahan,
            required: true,
            where: {
              idRempah: id,
              exist: 1, //kl 0 dihapus dari resep
            },
            include: [
              {
                model: Rempah,
                required: true,
              },
              {
                model: Satuan,
                required: true,
              },
            ],
          },
        ],
      });
      response.status(200).json(recipes);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
