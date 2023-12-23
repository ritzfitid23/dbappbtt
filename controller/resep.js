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

      // console.log(newResep, "-new-");
      if (newResep) {
        // for (let i = 0; i < bahan.length; i++) {
        //   const rempah = bahan[i];
        //   const idResep = newResep.id;
        //   const idRempah = rempah.idRempah;
        //   const idSatuan = rempah.idSatuan;
        //   const qty = rempah.qty;
        //   const [newBahan, created] = await Bahan.upsert(
        //     {
        //       idResep,
        //       idRempah,
        //       idSatuan,
        //       qty,
        //     },
        //     {
        //       returning: true,
        //       plain: true,
        //     }
        //   );
        // }
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

      if (rowsUpdated > 0) {
        response
          .status(200)
          .json({ data: `Resep dengan id ${id} telah diperbaharui` });
      } else {
        response.status(200).json("No rows were updated.");
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
    const { namahz, namalain, offset, limit } = request.body;

    try {
      const recipes = await Resep.findAll({
        where: {
          [Op.or]: [
            { namahz: { [Op.like]: `%${namahz}%` } },
            { namalain: { [Op.like]: `%${namalain}%` } },
          ],
        },
        offset: offset, // The number of records to skip
        limit: limit, // The maximum number of records to return
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
}

module.exports = Controller;
