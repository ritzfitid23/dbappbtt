const { Barang, Sequelize, sequelize } = require("../models");

const fs = require("fs");
const path = require("path");

//buat xlsx file
const { createExporttokpedfile } = require("./func_createworksheet");

class DownloadController {
  static async exporttokped(req, res, next) {
    try {
      const barangs = await Barang.findAll({
        order: [
          [
            sequelize.cast(
              sequelize.fn(
                "regexp_replace",
                sequelize.col("sku"),
                "[^0-9]", // Regex to remove non-numeric characters
                "",
                "g"
              ),
              "integer"
            ),
            "ASC",
          ],
        ],
      });

      //   console.log(barangs);

      // key diisi dengan data, key dibawah ini harus disesuaikan nanti di createfiletokped
      const dynamicData = [];
      barangs.forEach((produk) => {
        dynamicData.push({
          productid: produk.idTokped,
          nama: produk.namabarang,
          url: "url",
          minpesan: "1", // 1
          totstok: "", // dikosongi ""
          stokcampaign: ``,
          hargajual: produk.hargajual,
          stok: produk.stok,
          ingatstok: "3",
          sku: produk.sku,
          status: "", //kosongi dulu
          berat: produk.berat,
        });
      });

      // Define file path (temporary location)
      const filePath = path.join(__dirname, "exporttokped.xlsx");

      // Create the Excel file with dynamic data
      await createExporttokpedfile(dynamicData, filePath);

      // Send the file as a response
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error occurred while sending the file.");
        } else {
          console.log("File sent successfully!");

          // Optionally, delete the file after sending it
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Error deleting file:", unlinkErr);
            } else {
              console.log("File deleted successfully.");
            }
          });
        }
      });
    } catch (error) {
      console.error("Error generating Excel file:", error);
      res.status(500).send("Error occurred while generating the file.");
    }
  }
}

module.exports = DownloadController;
