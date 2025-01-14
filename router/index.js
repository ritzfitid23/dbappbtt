const express = require("express");
const router = express.Router();
// const ngrok = require("ngrok");

const ResepController = require("../controller/resep.js");
const RempahController = require("../controller/rempah.js");
const NamaLain = require("../controller/nmlain.js");
const Satuan = require("../controller/satuan.js");
const BahanController = require("../controller/bahan.js");
const BarangController = require("../controller/barang.js");
const UserController = require("../controller/user.js");
const SupplierController = require("../controller/supplier.js");
const RakController = require("../controller/rak.js");
const BackUpController = require("../controller/backup.js");
const DownloadController = require("../controller/download.js");
const VarianController = require("../controller/varian.js");

const HterimaController = require("../controller/hterima.js");
const DterimaController = require("../controller/dterima.js");

const { errorHandler } = require("../handler");
const { authN, authZCRall, authZUD } = require("../middleware");

//-- start upload file initialization
const multer = require("multer");
const { ro } = require("date-fns/locale");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//--------end upload file initialization

router.post("/login", UserController.login);

router.use(authN);
router.post("/register", UserController.register);
//------RESEP
router.post("/resep", ResepController.create);
router.put("/resep", ResepController.update);
router.delete("/resep", ResepController.delete);
router.get("/resep", ResepController.readall);

//---namalain
router.post("/nmlain", NamaLain.create);
router.delete("/nmlain", NamaLain.delete);

//---SUPPLIER
router.post("/supplier", SupplierController.create);
router.put("/supplier", SupplierController.update);

//---SATUAN
router.post("/satuan", Satuan.create);
router.put("/satuan", Satuan.update);
router.get("/satuan", Satuan.readall);
// router.delete("/satuan", Satuan.delete); // berbahaya kalau ada

//---BAHAN
router.post("/bahan", BahanController.create);
router.put("/bahan", BahanController.update);
router.delete("/bahan", BahanController.delete);

//---BARANG
router.post("/barang", BarangController.create);
router.put("/barang", BarangController.update);

//---REMPAH
router.post("/rempah", RempahController.create);
router.put("/rempah", RempahController.update);
// router.delete("/rempah", RempahController.delete);

//---RAK
router.get("/rak", RakController.readAll);
router.post("/rak", RakController.create);
router.put("/rak", RakController.update);

//-------VARIAN
router.post("/varian", VarianController.create);
router.put("/varian", VarianController.update);

//------HTERIMA
router.post("/hterima", HterimaController.create);
router.get("/hterima", HterimaController.readall);
router.put("/hterima", HterimaController.update);

//------DTERIMA
router.post("/dterima", DterimaController.create);
router.put("/dterima", DterimaController.update);

//------------------- 2 slash -------------------------------

//varian
router.get("/varian/:idBarang", VarianController.getvarianbyidbarang);
router.post("/varian/setsatuankecil", VarianController.setsatuankecil);

//-----RESEP
router.get("/resep/all", ResepController.readall);
router.post("/resep/search", ResepController.readsearch);

//-----BAHAN
router.post("/bahan/batch", BahanController.create);
router.get("/resep/:id", ResepController.getbyid);

//------SATUAN
router.get("/satuan/:id", Satuan.getbyid);
router.delete("/satuan/:id", Satuan.delete);
router.post("/satuan/search", Satuan.search);

//------SUPPLIER

router.get("/supplier/all", SupplierController.readAll);
router.get("/supplier/:id", SupplierController.getById);
router.delete("/supplier/:id", SupplierController.delete);
router.post("/supplier/search", SupplierController.search);

//------NAMA LAIN
// router.get("/nmlain/all", NamaLain.readall);
router.put("/nmlain/:id", NamaLain.update);
router.post("/nmlain/search", NamaLain.readsearch);

//--------REMPAH
router.post("/rempah/upload", upload.single("file"), RempahController.upload);
router.get("/rempah/all", RempahController.readall);
router.post("/rempah/search", RempahController.readsearch);
router.post("/rempah/stared", RempahController.createrempahstared);
router.get("/rempah/stared", RempahController.getrempahstared);
router.put("/rempah/updateimage", RempahController.updateimage);

//-------BARANG
router.post("/barang/upload", upload.single("file"), BarangController.upload);
router.post(
  "/barang/importtokped",
  upload.single("file"),
  BarangController.importtokped
);
router.post("/barang/search", BarangController.readsearch);
router.get("/barang/export", BarangController.exportbarang);
router.put("/barang/updateimage", BarangController.updateimage);
router.put("/barang/stok", BarangController.updatestok);
router.get("/barang/gennewsku", BarangController.generateNewSku);

//--------HTERIMA
router.post("/hterima/upload", upload.single("file"), HterimaController.upload);
router.get("/hterima/:id", HterimaController.readbyid);
router.put("/hterima/updateimage", HterimaController.updateimage);
router.delete("/hterima/:id", HterimaController.delete);

//-------DTERIMA
router.get("/dterima/:idHTerimaBarang", DterimaController.read);

//-------DOWNLOAD
router.get("/download/exporttokped", DownloadController.exporttokped);
//----------------------------- 3 slash -------------------------------------

//rempah
router.get("/rempah/byid/:id", RempahController.readbyid);
router.put("/rempah/unstared/:id", RempahController.updaterempahstared);
router.get("/rempah/norak/:norak", RempahController.readbynorak);
router.get("/rempah/images/:filename", RempahController.loadimage);
// router.post("/rempah/download/:filename", RempahController.downloadimage);

//barang
router.get("/barang/images/:filename", BarangController.loadimage);
router.get("/barang/byid/:id", BarangController.readbyid);
router.get("/barang/norak/:kode", BarangController.readbynorak);

//------HTERIMA
router.get("/nota/images/:filename", HterimaController.loadimage);
router.post("/nota/search/barang", HterimaController.searchbyidbarang);
router.post("/nota/search/supplier", HterimaController.searchbysupplier);
router.post("/nota/search/tanggal", HterimaController.searchbytanggal);

//-----DTERIMA
router.get("/dterima/getbyid/:id", DterimaController.readbyid);

//-----RESEP
router.get("/resep/byrempah/:id", ResepController.readbyrempah);

//varian
router.post(
  "/varian/fetch/getsatuanexvarian",
  VarianController.getsatuanexthisvarian
);

//======BACKUP
router.get("backup/class/barang", BackUpController.backupbarang);
router.get("backup/class/resep", BackUpController.backupresep);
router.get("backup/class/bahan", BackUpController.backupbahan);

// router.get("backup/class/satuan",BackUpController.backupsatuan);
// router.get("backup/class/rak");
// router.get("backup/class/lokator");
// router.get("backup/class/supplier");
router.post("backup/class/upload", BackUpController.uploadbackupresep);

router.use(errorHandler);

module.exports = router;
