const express = require("express");
const router = express.Router();
const ngrok = require("ngrok");
const ResepController = require("../controller/resep.js");
const RempahController = require("../controller/rempah.js");
const NamaLain = require("../controller/nmlain.js");
const Satuan = require("../controller/satuan.js");
const BahanController = require("../controller/bahan.js");
const BarangController = require("../controller/barang.js");
const UserController = require("../controller/user.js");

const { errorHandler } = require("../handler");
const { authN, authZCRall, authZUD } = require("../middleware");

//
router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.post("/testfirestore", BarangController.create);
router.use(authN);
//-----------
router.post("/resep", ResepController.create);
router.put("/resep", ResepController.update);
router.delete("/resep", ResepController.delete);
router.get("/resep", ResepController.readall);

//-----------
router.post("/nmlain", NamaLain.create);

router.delete("/nmlain", NamaLain.delete);

//-----------
router.post("/satuan", Satuan.create);
router.put("/satuan", Satuan.update);
router.get("/satuan", Satuan.readall);
// router.delete("/satuan", Satuan.delete); // berbahaya kalau ada

//-----------
router.put("/bahan", BahanController.update);
router.delete("/bahan", BahanController.delete);

//----------
// router.post("/rempah", RempahController.create);
router.put("/rempah", RempahController.update);
// router.delete("/rempah", RempahController.delete);

//----------- 2 slash

////--Nama resep
router.get("/resep/all", ResepController.readall);
router.post("/resep/search", ResepController.readsearch);

//bahan resep
router.post("/bahan/batch", BahanController.create);
router.get("/resep/:id", ResepController.getbyid);

//satuan
router.get("/satuan/:id", Satuan.getbyid);
router.delete("/satuan/:id", Satuan.delete);

////--nama lain
// router.get("/nmlain/all", NamaLain.readall);
router.put("/nmlain/:id", NamaLain.update);
router.post("/nmlain/search", NamaLain.readsearch);

////--nama rempah
router.get("/rempah/all", RempahController.readall);
router.post("/rempah/search", RempahController.readsearch);
router.post("/rempah/stared", RempahController.createrempahstared);
router.get("/rempah/stared", RempahController.getrempahstared);

//satuan
router.post("/satuan/search", Satuan.search);

// 3 route
router.get("/rempah/byid/:id", RempahController.readbyid);
router.put("/rempah/unstared/:id", RempahController.updaterempahstared);

//------

router.use(errorHandler);

module.exports = router;
