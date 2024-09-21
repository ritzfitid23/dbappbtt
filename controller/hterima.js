const { HTerimaBarang, Supplier, Barang, DTerimaBarang } = require("../models");
const { bucket } = require("../config/firebaseConfig");
const { Op, where } = require("sequelize");

const uploadImageToFirebaseStorage = async (fileBuffer, filename) => {
  try {
    // Set the destination path in Firebase Storage
    const filePath = `nota/${filename}`;

    // Create a write stream for Firebase Storage

    const fileUploadStream = bucket.file(filePath).createWriteStream({
      metadata: {
        contentType: "image/jpeg", // Replace with the appropriate content type
      },
    });

    // Handle errors during the upload
    fileUploadStream.on("error", (error) => {
      console.error(error);
      throw new Error("Error uploading file to Firebase Storage.");
    });

    // Handle successful upload
    fileUploadStream.on("finish", () => {
      console.log("File uploaded successfully!");
    });

    // Pipe the file buffer to the write stream
    fileUploadStream.end(fileBuffer);
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error.");
  }
};

class Controller {
  static async create(request, response, next) {
    const {
      tanggal,
      nonota,
      idSupplier,
      jumlah,
      disc,
      jumlahppn,
      totalppn,
      imgnota,
    } = request.body;

    try {
      const newHterima = await HTerimaBarang.create(
        {
          tanggal,
          nonota,
          idSupplier,
          jumlah,
          disc,
          jumlahppn,
          totalppn,
          imgnota,
        },
        {
          returning: true,
        }
      );
      response.status(201).json(newHterima);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async update(request, response, next) {
    const {
      id,
      tanggal,
      nonota,
      idSupplier,
      jumlah,
      disc,
      jumlahppn,
      totalppn,
    } = request.body;

    try {
      const rowsUpdated = await HTerimaBarang.update(
        {
          tanggal,
          nonota,
          idSupplier,
          jumlah,
          disc,
          jumlahppn,
          totalppn,
        },
        {
          where: { id },
        }
      );
      if (rowsUpdated > 0) {
        response.status(200).json("berhasil update");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async delete(request, response) {
    const { id } = request.params;

    try {
      const rowsDeleted = await DTerimaBarang.destroy({
        where: { id },
      });

      if (rowsDeleted > 0) {
        response.status(200).json({ message: "Berhasil dihapus" });
      } else {
        response.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async readall(request, response, next) {
    try {
      const hterima = await HTerimaBarang.findAll({
        order: [["updatedAt", "DESC"]],
        include: {
          model: Supplier,
          required: false,
        },
      });
      response.status(200).json(hterima);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  static async readbyid(request, response, next) {
    const { id } = request.params;
    try {
      const hterima = await HTerimaBarang.findOne({
        include: {
          model: Supplier,
        },
        where: {
          id,
        },
      });
      response.status(200).json(hterima);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;

      // Call the function to upload the image to Firebase Storage
      await uploadImageToFirebaseStorage(fileBuffer, filename);

      res.status(200).json({ message: "File uploaded successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  }

  static async loadimage(req, res, next) {
    try {
      const filename = req.params.filename;
      const file = bucket.file("nota/" + filename);

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

  static async updateimage(request, response, next) {
    const { img, id } = request.body;
    try {
      const rowsUpdated = await HTerimaBarang.update(
        {
          imgnota: img,
        },
        {
          where: {
            id,
          },
        }
      );
      console.log({ img, id }, "dari update image hterima");
      if (rowsUpdated) {
        response.status(200).json(request.body);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async searchbyidbarang(request, response, next) {
    const { idBarang } = request.body;
    try {
      const hterimaBarangs = await HTerimaBarang.findAll({
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Supplier,
            required: false,
          },
          {
            model: DTerimaBarang,
            where: {
              idBarang,
            },
          },
        ],
      });
      response.status(200).json(hterimaBarangs);
    } catch (error) {
      console.error("Error finding Barangs by namabarang:", error);
      throw error;
    }
  }
  static async searchbysupplier(request, response, next) {
    const { idSupplier } = request.body;

    try {
      const hterimaBarangs = await HTerimaBarang.findAll({
        include: [{ model: Supplier }],
        where: {
          idSupplier,
        },
      });
      response.status(200).json(hterimaBarangs);
    } catch (error) {
      next(error);
      throw error;
    }
  }
  static async searchbytanggal(request, response, next) {
    const { startDate, endDate } = request.body;
    try {
      const hterimaBarangs = await HTerimaBarang.findAll({
        include: [{ model: Supplier }],
        where: {
          tanggal: {
            [Op.gte]: startDate, // Greater than or equal to startDate
            [Op.lte]: endDate, // Less than or equal to endDate
          },
        },
      });
      response.status(200).json(hterimaBarangs);
    } catch (error) {
      console.error("Error finding HTerimaBarangs by date range:", error);
      throw error;
    }
  }
}

module.exports = Controller;
