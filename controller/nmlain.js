const { Namalain, Sequelize, Rempah } = require("../models");
const { Op } = Sequelize;

class Controller {
  static async create(request, response, next) {
    const { idRempah, namaLain } = request.body;
    try {
      const newNamalain = await Namalain.create({
        idRempah,
        namaLain,
      });

      // The `newNamalain` object now represents the newly created record in the database.
      console.log("New Namalain created:", newNamalain.toJSON());
      response.status(201).json(newNamalain);
    } catch (error) {
      next(error);
      console.error("Error creating Namalain:", error);
    }
  }
  static async update(request, response, next) {
    try {
      // Define the update data
      const { id } = request.params;
      const { namaLain } = request.body;
      // Perform the update operation
      const [rowsUpdated] = await Namalain.update(
        { namaLain },
        {
          where: { id },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(`Updated ${rowsUpdated} row(s)`);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async updatenamalain(request, response, next) {
    try {
      const { id } = req.params; // Get the ID from the route parameters
      const { namaLain } = req.body; // Get updated data from the request body

      // Perform the update operation
      const [rowsUpdated, [updatedNamalain]] = await Namalain.update(
        {
          namaLain,
        },
        {
          where: { id },
          returning: true, // This option returns the updated record
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(updatedNamalain);
      } else {
        throw {
          name: "GAGAL_UPDATE",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async delete(request, response, next) {
    const { id } = request.body;
    try {
      const rowsDeleted = await Namalain.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        response.status(200).json(`Deleted ${rowsDeleted} row(s)`);
      } else {
        response.status(400).json("No rows were deleted.");
      }
    } catch (error) {
      next(error);
    }
  }
  static async readall(request, response) {}
  static async readsearch(request, response) {
    try {
      const searchTerm = "your_search_term"; // Replace with the search term you want to use

      // Perform the search query
      const results = await Namalain.findAll({
        where: {
          namaLain: {
            [Op.like]: `%${searchTerm}%`,
          },
        },
        include: [
          {
            model: Rempah,
            as: "Rempah", // Use the alias you defined for the association in your model
          },
        ],
      });

      // Extract the Rempah records from the results
      const rempahRecords = results.map((namalain) => namalain.Rempah);

      if (rempahRecords.length > 0) {
        console.log("Matching Rempah records:");
        rempahRecords.forEach((rempah) => {
          console.log(rempah.toJSON());
        });
      } else {
        console.log("No matching Rempah records found.");
      }
    } catch (error) {
      console.error("Error searching for Rempah records:", error);
    }
  }
}

module.exports = Controller;
