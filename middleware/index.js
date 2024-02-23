const { readToken } = require("../helper");
const { User } = require("../models");
const authN = async (req, res, next) => {
  try {
    // console.log("masuk auth");
    //headers harus huruf kecil
    const { access_token } = req.headers;
    // console.log(req.headers);
    // console.log(accessToken, "ini token");

    if (!access_token) {
      throw { name: "INVALID_TOKEN" };
    }

    const payload = readToken(access_token);
    // console.log(payload, "ini paylod");
    const id = +payload.id;
    const selectedUser = await User.findByPk(id);
    // console.log(selectedUser, "selecteduser");
    if (!selectedUser) {
      throw { name: "INVALID_TOKEN" };
    }

    req.currId = id;

    //nanti di controller.js panggil currentId dengan cara ini
    //const authorId = request.currentId; //terkirim dari auth

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authN };
