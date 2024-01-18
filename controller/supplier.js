const { Supplier, Sequelize } = require("../models");
const { Op } = Sequelize;

class SupplierController {
  static async create(req, res, next) {
    const { perusahaan, namakontak, nohp, email, keterangan } = req.body;

    const status = "aktif";

    try {
      const newSupplier = await Supplier.create({
        perusahaan,
        namakontak,
        nohp,
        email,
        keterangan,
        status,
      });

      res.status(201).json(newSupplier);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;

    try {
      const supplier = await Supplier.findOne({
        where: { id },
      });

      res.status(200).json(supplier);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async update(req, res, next) {
    const { perusahaan, namakontak, nohp, email, keterangan, status, id } =
      req.body;

    try {
      const [rowsUpdated] = await Supplier.update(
        {
          perusahaan,
          namakontak,
          nohp,
          email,
          keterangan,
          status,
        },
        {
          where: { id },
        }
      );

      if (rowsUpdated > 0) {
        res.status(200).json(`Updated ${rowsUpdated} row(s)`);
      } else {
        res.status(400).json("No rows were updated.");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const rowsDeleted = await Supplier.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        res.status(200).json(`Deleted ${rowsDeleted} row(s)`);
      } else {
        res.status(200).json("No rows were deleted.");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async readAll(req, res, next) {
    try {
      const suppliers = await Supplier.findAll({});
      res.status(200).json(suppliers);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getbyid(request, response, next) {
    const { id } = request.params;
    try {
      const supplier = await Supplier.findOne({
        where: { id },
      });
      response.status(200).json(supplier);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async search(req, res, next) {
    const { perusahaan, namakontak } = req.body;

    try {
      const suppliers = await Supplier.findAll({
        where: {
          [Op.or]: [
            { perusahaan: { [Op.like]: `%${perusahaan}%` } },
            { namakontak: { [Op.like]: `%${namakontak}%` } },
          ],
        },
      });

      res.status(200).json(suppliers);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = SupplierController;
