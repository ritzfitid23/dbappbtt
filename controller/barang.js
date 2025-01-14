const {
  Barang,
  Rak,
  Lokator,
  Supplier,
  Satuan,
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
const { where } = require("sequelize");

const { readImportTokopedia } = require("./func_createworksheet");

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

//xlsx
const XLSX = require("xlsx");

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
      idSatuan,
      idTokped,
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
        idSatuan,
        idTokped,
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
      deskripsi,
      stok,
      berat,
      hargajual,
      hargabeli,
      idSupplier,
      idSatuan,
      id,
    } = request.body;
    console.log(
      {
        sku,
        namabarang,
        deskripsi,
        stok,
        berat,
        hargajual,
        hargabeli,
        idSupplier,
        idSatuan,
        id,
      },
      "dari sini masuk"
    );
    try {
      const rowsUpdated = await Barang.update(
        {
          sku,
          namabarang,
          deskripsi,
          stok,
          berat,
          hargajual,
          hargabeli,
          idSupplier,
          idSatuan,
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated) {
        response.status(200).json(request.body);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateimage(request, response, next) {
    const { img1, img2, img3, id } = request.body;
    console.log({ img1, img2, img3, id }, "ini dari barang update image");
    try {
      const rowsUpdated = await Barang.update(
        {
          img1,
          img2,
          img3,
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated) {
        response.status(200).json(request.body);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async updatestok(request, response, next) {
    const { id, stok } = request.body;
    try {
      const rowsUpdated = await Barang.update(
        {
          stok,
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated) {
        response.status(200).json("updated");
      } else {
        response.status(400).json("not update");
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
    const { namabarang, supplier, tokped } = request.body;
    let whereCondition = {};

    if (tokped) {
      whereCondition = {
        idTokped: {
          [Sequelize.Op.ne]: null, // This checks that 'name' is not NULL
        },
      };
    } else if (namabarang != "" && supplier != "-1") {
      whereCondition = {
        [Op.and]: [
          {
            namabarang: {
              [Op.like]: `%${namabarang}%`,
            },
          },
          { idSupplier: supplier },
        ],
      };
    } else if (supplier != "-1") {
      whereCondition = {
        idSupplier: supplier,
      };
    } else {
      whereCondition = {
        [Op.or]: [
          {
            namabarang: {
              [Op.like]: `%${namabarang}%`,
            },
          },
        ],
      };
    }

    try {
      const barang = await Barang.findAll({
        where: whereCondition,
        include: [
          {
            model: Supplier,
            required: false,
          },
          {
            model: Satuan,
            required: false,
            attributes: ["id", "namahz", "namalain", "konversi"],
          },
          {
            model: Lokator,
            as: "LokatorBarang",
            attributes: ["id", "status"],
          },
          {
            model: Rak,
            as: "RaksBarang",
            through: { attributes: [] },
            attributes: ["id", "kode", "letak", "status"],
            order: [["id", "ASC"]],
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

  static async loadimage(req, res, next) {
    try {
      const filename = req.params.filename;
      const file = bucket.file("barang/" + filename);

      // Check if the file exists
      const [exists] = await file.exists();
      res.status(200);
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
            model: Satuan,
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

  static async readbynorak(request, response, next) {
    const { kode } = request.params;
    try {
      const barangInRak = await Barang.findAll({
        include: [
          {
            model: Satuan,
          },
          {
            model: Supplier,
          },
          {
            model: Rak,
            through: {
              model: Lokator,
            },
            where: { kode: kode }, // Filter by the kode of the Rak
            as: "RaksBarang",
          },
        ],
      });
      response.status(200).json(barangInRak);
    } catch (error) {
      console.error("Error retrieving barang in rak:", error);
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

  static async generateNewSku(req, res, next) {
    try {
      // Step 1: Find the maximum numeric part of the SKU
      const maxSku = await Barang.findOne({
        attributes: [
          [
            sequelize.fn(
              "MAX",
              sequelize.cast(
                sequelize.fn("SUBSTRING", sequelize.col("sku"), 2),
                "INTEGER" // Use INTEGER instead of UNSIGNED for PostgreSQL
              )
            ),
            "max_sku",
          ],
        ],
      });

      // Extract the max SKU number and add 1 to it
      const maxSkuNumber = maxSku?.get("max_sku") || 0; // Default to 0 if no SKU found
      const newSkuNumber = parseInt(maxSkuNumber, 10) + 1;

      // Step 2: Create the new SKU by appending the new number to the prefix 'B'
      const newSku = `B${newSkuNumber.toString().padStart(3, "0")}`;

      console.log("New SKU:", newSku);
      res.status(200).json(newSku);
    } catch (err) {
      next(err);
    }
  }
  static async importtokped(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }

      const fileBuffer = req.file.buffer;
      const filename = req.file.originalname;

      const data = await readImportTokopedia(fileBuffer);

      // res.status(200).json({ data: data, filename: filename });

      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        const idTokped = element["idTokped"];
        const sku = element["sku"];
        await Barang.update(
          {
            idTokped,
          },
          {
            where: {
              sku,
            },
          }
        );
      }
      res
        .status(200)
        .json({ message: "File uploaded successfully!", data: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
}

module.exports = BarangController;
