const errorHandler = (err, req, res, next) => {
  let code = 500;
  // let msg = "Error Pada Pusat Data";
  let msg = err;

  if (err.name === "NOT_FOUND") {
    code = 400;
    msg = "Data Tidak Ditemukan";
  } else if (err.name == "GAGAL_UPDATE") {
    msg = "Data Gagal Diupdate";
  } else {
    res.status(code).json({
      data: msg,
    });
  }
};

module.exports = { errorHandler };
