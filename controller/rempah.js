const { rows } = require("pg/lib/defaults");
const { Rempah, RempahStared, Sequelize, Namalain } = require("../models");
const { Op, sequelize } = Sequelize;
const { bucket } = require("../config/firebaseConfig");

const path = require("path");

const uploadImageToFirebaseStorage = async (fileBuffer, filename) => {
  try {
    // Set the destination path in Firebase Storage
    const filePath = `rempah/${filename}`;

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
    const { norak, hanzhi, pinyin, img } = request.body;

    const newRempah = await Rempah.create(
      {
        norak,
        hanzhi,
        pinyin,
        img,
      },
      {
        returning: true,
      }
    );
    console.log(newRempah + "||");

    if (newRempah) {
      response.status(201).json(newRempah);
    } else {
      response.status(400).json("No rows were updated.");
    }
  }
  static async update(request, response, next) {
    const { norak, hanzhi, pinyin, img, id } = request.body;
    try {
      const rowsUpdated = await Rempah.update(
        {
          norak,
          hanzhi,
          pinyin,
          img,
        },
        {
          where: {
            id,
          },
        }
      );

      if (rowsUpdated) {
        response.status(200).json(rowsUpdated);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }
  static async delete(request, response, next) {}

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

  static async updateimage(request, response, next) {
    const { img, id } = request.body;
    try {
      const rowsUpdated = await Rempah.update(
        {
          img,
        },
        {
          where: {
            id,
          },
        }
      );
      console.log({ img, id }, "dari update image rempah");
      if (rowsUpdated) {
        response.status(200).json(request.body);
      } else {
        response.status(400).json("No rows were updated.");
      }
    } catch (error) {
      next(error);
    }
  }

  static async downloadimage(request, response, next) {
    const filename = request.params.filename;
    const tempFilePath = path.join(__dirname, filename);

    try {
      // Download file from Firebase Storage to local temp file
      await bucket.file(filename).download({ destination: tempFilePath });

      // Send the file to the client
      response.sendFile(tempFilePath, (err) => {
        if (err) {
          console.log("Error sending file:", err);
          response.status(500).send("Error sending file");
        } else {
          // Delete the temporary file after sending
          fs.unlink(tempFilePath, (err) => {
            if (err) {
              console.log("Error deleting temp file:", err);
            }
          });
        }
      });
    } catch (error) {
      console.log("Error downloading file:", error);
      response.status(500).send("Error downloading file");
    }
  }
}
module.exports = Controller;
