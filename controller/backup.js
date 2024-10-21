const {
  Barang,
  Rak,
  Lokator,
  Supplier,
  Rempah,
  Satuan,
  Resep,
  Sequelize,
  sequelize,
} = require("../models");
const { Op } = Sequelize;
const { bucket } = require("../config/firebaseConfig");
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns");

const uploadJsonToFirebaseStorage = async (fileBuffer, filename) => {
  try {
    // Set the destination path in Firebase Storage
    const filePath = `json/${filename}`;

    // Create a write stream for Firebase Storage
    const fileUploadStream = bucket.file(filePath).createWriteStream({
      metadata: {
        contentType: "application/json", // Set content type for JSON files
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

class BackUpController {
  static async backupbarang(request, response, next) {
    //load barang
    const barangs = await Barang.findAll({
      attributes: ["sku", "namabarang", "hargajual", "idSupplier"],
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
    });

    const data = barangs.map((barang) => {
      const modifiedBarang = {
        sku: barang.sku,
        namabarang: barang.namabarang,
        hargajual: barang.hargajual,
        idSupplier: barang.idSupplier == null ? 0 : barang.idSupplier,
        idRak: barang.RaksBarang.length > 0 ? barang.RaksBarang[0].kode : "",
      };
      return modifiedBarang;
    });

    response.status(200).json(data);

    // Save the workbook to a file
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyyMMddHHmmss");

    // Convert JSON object to a string
    const jsonString = JSON.stringify(data, null, 2); // The third parameter (2) adds indentation for better readability

    const filePath2 = `./exporter/${formattedDate}_barang.json`;
    // Write to the file
    try {
      fs.writeFileSync(filePath2, jsonString, "utf-8");
      console.log("File written successfully.");
    } catch (error) {
      console.error("Error writing to JSON file:", error.message);
    }
  }

  static async backupresep(request, response, next) {
    //load barang
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

    console.log(recipes);
    const data = recipes.map((resep) => {
      const modifiedresep = {
        idResep: resep.id,
        namahz: resep.namahz,
        namalain: resep.namalain,
        fungsi: resep.fungsi,
        keterangan: resep.keterangan,
        harga: resep.harga,
      };
      return modifiedresep;
    });

    response.status(200).json(data);

    // Save the workbook to a file
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyyMMddHHmmss");

    // Convert JSON object to a string
    const jsonString = JSON.stringify(data, null, 2); // The third parameter (2) adds indentation for better readability

    const filePath2 = `./exporter/${formattedDate}_resep.json`;
    // Write to the file
    try {
      fs.writeFileSync(filePath2, jsonString, "utf-8");
      console.log("File written successfully.");
    } catch (error) {
      console.error("Error writing to JSON file:", error.message);
    }
  }
  static async backupbahan(request, response, next) {
    //load barang
    const bahans = await Bahan.findAll({});

    console.log(bahans);
    const data = bahans.map((bahan) => {
      const modifiedbahan = {
        idBahan: bahan.id,
        idResep: bahan.idResep,
        idRempah: bahan.idRempah,
        idSatuan: bahan.idSatuan,
        qty: bahan.qty,
      };
      return modifiedbahan;
    });

    response.status(200).json(data);

    // Save the workbook to a file
    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyyMMddHHmmss");

    // Convert JSON object to a string
    const jsonString = JSON.stringify(data, null, 2); // The third parameter (2) adds indentation for better readability

    const filePath2 = `./exporter/${formattedDate}_resep.json`;
    // Write to the file
    try {
      fs.writeFileSync(filePath2, jsonString, "utf-8");
      console.log("File written successfully.");
    } catch (error) {
      console.error("Error writing to JSON file:", error.message);
    }
  }

  static async uploadbackupresep(req, res, next) {
    const { filename } = req.body;

    try {
      const filePath = path.join(__dirname, "exporter", filename); // Specify the path to your JSON file
      const fileBuffer = fs.readFileSync(filePath);

      if (!fileBuffer) {
        return res.status(400).json({ error: "No file buffer provided." });
      }

      // Call the function to upload the file buffer to Firebase Storage
      await uploadJsonToFirebaseStorage(fileBuffer, filename);

      res.status(200).json({ message: "File uploaded successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
}

module.exports = BackUpController;
