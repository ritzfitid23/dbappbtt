const {
  Barang,
  Rak,
  Lokator,
  Supplier,
  Sequelize,
  sequelize,
} = require("../models");
const { Op } = Sequelize;
const { bucket } = require("../config/firebaseConfig");
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

//excel
const ExcelJS = require("exceljs");

const uploadImageToFirebaseStorage = async (fileBuffer, filename) => {
  try {
    // Set the destination path in Firebase Storage
    const filePath = `barang/${filename}`;

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

class BarangController {
  static async create(request, response, next) {
    const {
      sku,
      namabarang,
      img1,
      img2,
      img3,
      deskripsi,
      stok,
      berat,
      hargajual,
      hargabeli,
      idSupplier,
    } = request.body;

    try {
      const newBarang = await Barang.create({
        sku,
        namabarang,
        img1,
        img2,
        img3,
        deskripsi,
        stok,
        berat,
        hargajual,
        hargabeli,
        idSupplier,
      });
      console.log(newBarang);
      response.status(201).json(newBarang);
    } catch (error) {
      console.log(error, "barang error");
      next(error);
    }
  }

  static async update(request, response, next) {
    const {
      sku,
      namabarang,
      img1,
      img2,
      img3,
      deskripsi,
      stok,
      berat,
      hargajual,
      hargabeli,
      idSupplier,
      id,
    } = request.body;
    try {
      const [rowsUpdated] = await Barang.update(
        {
          sku,
          namabarang,
          img1,
          img2,
          img3,
          deskripsi,
          stok,
          berat,
          hargajual,
          hargabeli,
          idSupplier, // Replace with the new image URL or file path
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated > 0) {
        response.status(200).json(request.body);
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

  static async readall(request, response, next) {
    try {
      const barangs = await Barang.findAll();
      response.status(200).json(barangs);
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

  static async readsearch(request, response, next) {
    const { namabarang } = request.body;
    try {
      const rempahs = await Barang.findAll({
        where: {
          [Op.or]: [
            {
              namabarang: {
                [Op.like]: `%${namabarang}%`, // Search for records with hanzhi containing the provided value
              },
            },
          ],
        },
        include: [
          {
            model: Supplier,
            required: false, //supaya join namalain.id=rempah.id
          },
          {
            model: Lokator,
            as: "LokatorBarang",
            attributes: ["id", "status"], // Include specific attributes if needed
          },
          {
            model: Rak,
            as: "RaksBarang",
            through: { attributes: [] },
            attributes: ["id", "kode", "letak", "status"], // Include specific attributes if needed
          },
        ],
        order: [["namabarang", "ASC"]],
      });
      console.log(rempahs);
      response.status(200).json(rempahs);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async loadimage(req, res, next) {
    try {
      const filename = req.params.filename;
      const file = bucket.file("barang/" + filename);

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
      const barang = await Barang.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Supplier,
          },
          {
            model: Lokator,
            as: "LokatorBarang",
            attributes: ["id", "status"], // Include specific attributes if needed
          },
          {
            model: Rak,
            as: "RaksBarang",
            through: { attributes: [] },
            attributes: ["id", "kode", "letak", "status"], // Include specific attributes if needed
          },
        ],
      });
      console.log(barang);
      response.status(200).json(barang);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async exportbarang(request, response, next) {
    //load barang
    const barangs = await Barang.findAll();
    response.status(200).json(barangs);
    barangs.forEach((barang) => {
      barang.idSupplier = barang.idSupplier == null ? 0 : barang.idSupplier;
      return barang;
    });

    //EXPORT WITH XLSX
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    const data = barangs;

    // Define columns
    const columns = [
      { header: "id", key: "id", width: 10 },
      { header: "sku", key: "sku", width: 200 },
      { header: "namabarang", key: "namabarang", width: 200 },
      { header: "img1", key: "img1", width: 200 },
      { header: "img2", key: "img2", width: 200 },
      { header: "img3", key: "img3", width: 200 },
      { header: "deskripsi", key: "deskripsi", width: 200 },
      { header: "stok", key: "stok", width: 200 },
      { header: "berat", key: "berat", width: 200 },
      { header: "hargajual", key: "hargajual", width: 200 },
      { header: "hargabeli", key: "hargabeli", width: 200 },
      { header: "idSupplier", key: "idSupplier", width: 200 },
    ];

    // Add columns to the worksheet
    worksheet.columns = columns;

    // Add data to the worksheet
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    // Save the workbook to a file
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyyMMddHHmmss");

    const filePath1 = `./exporter/${formattedDate}_barang.xlsx`;
    workbook.xlsx
      .writeFile(filePath1)
      .then(() => {
        console.log("Excel file exported successfully:", filePath1);
      })
      .catch((error) => {
        console.error("Error exporting to Excel:", error.message);
      });
  }
}

module.exports = BarangController;
