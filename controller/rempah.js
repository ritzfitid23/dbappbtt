const { rows } = require("pg/lib/defaults");
const { Rempah, RempahStared, Sequelize, Namalain } = require("../models");
const { Op, sequelize } = Sequelize;
const { bucket } = require("../config/firebaseConfig");

const path = require("path");

class Controller {
  static async create(request, response) {}
  static async update(request, response) {
    const { namahz, namalain, fungsi, keterangan, harga, id } = request.body;
    try {
      const rowsUpdated = await Resep.update(
        {
          namahz,
          namalain,
          fungsi,
          keterangan,
          harga,
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(rowsUpdated);
      } else {
        response.status(200).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }
  static async delete(request, response) {}
  static async readall(request, response, next) {
    const { offset, limit } = request.body;

    try {
      const rempahs = await Rempah.findAll({
        offset: offset, // The number of records to skip
        limit: limit, // The maximum number of records to return
      });
      response.status(200).json(rempahs);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async readsearch(request, response, next) {
    const { hanzhi, namaLain } = request.body;
    const idUser = request.currId;
    try {
      const rempahs = await Rempah.findAll({
        where: {
          [Op.or]: [
            {
              hanzhi: {
                [Op.like]: `%${hanzhi}%`, // Search for records with hanzhi containing the provided value
              },
            },
            {
              "$Namalains.namaLain$": {
                [Op.like]: `%${namaLain}%`, // Search for records in the Namalain table with namaLain containing the provided value
              },
            },
          ],
        },
        include: [
          {
            model: Namalain,
            required: false, //supaya join namalain.id=rempah.id
          },
          {
            model: RempahStared,
            required: false,
            where: {
              idUser,
            },
          },
        ],
        order: [["hanzhi", "ASC"]],
      });
      console.log(rempahs);
      response.status(200).json(rempahs);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async readbynorak(request, response, next) {
    const { norak } = request.params;
    try {
      const rempah = await Rempah.findAll({
        where: {
          norak,
        },
        include: [
          {
            model: Namalain,
            required: false, //supaya join namalain.id=rempah.id
          },
        ],
      });
      console.log(rempah);
      response.status(200).json(rempah);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // static async loadimage(req, res, next) {
  //   const filename = req.params.filename;
  //   console.log(filename);
  //   const imagePath = path.resolve(__dirname, "../rempah", filename);
  //   res.sendFile(imagePath);
  // }

  static async loadimage(req, res, next) {
    try {
      const filename = req.params.filename;
      const file = bucket.file("rempah/" + filename);

      // Check if the file exists
      const [exists] = await file.exists();

      if (!exists) {
        return res.status(404).send("Image not found.");
      }

      // Get a readable stream of the file and pipe it to the response
      file.createReadStream().pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error.");
    }
  }

  static async readbyid(request, response, next) {
    const { id } = request.params;
    try {
      const rempah = await Rempah.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Namalain,
          },
        ],
      });
      console.log(rempah);
      response.status(200).json(rempah);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createrempahstared(request, response, next) {
    const idUser = request.currId;
    const { idRempah, status } = request.body;
    try {
      const rempahStared = await RempahStared.create({
        idRempah,
        idUser,
        status,
      });
      response.status(200).json(rempahStared);
    } catch (error) {
      console.error("Error creating RempahStared:", error);
      next(error);
    }
  }

  static async updaterempahstared(request, response, next) {
    const { newStatus } = request.body;
    const { id } = request.params;
    try {
      const [updatedRows] = await RempahStared.update(
        { status: newStatus },
        {
          where: { id },
        }
      );

      if (updatedRows > 0) {
        response.status(200).json("RempahStared record updated successfully");
      } else {
        response
          .status(400)
          .json("No records were updated. RempahStared record not found.");
      }
    } catch (error) {
      console.error("Error updating RempahStared:", error);
      next(error);
    }
  }

  static async getrempahstared(request, response, next) {
    const idUser = request.currId;
    try {
      const rempahs = await Rempah.findAll({
        include: [
          {
            model: Namalain,
            required: false, //supaya join namalain.id=rempah.id
          },
          {
            model: RempahStared,
            required: true,
            where: {
              idUser,
            },
          },
        ],
        order: [["hanzhi", "ASC"]],
      });
      console.log(rempahs);
      response.status(200).json(rempahs);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
