if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRETKEY = process.env.secret;

const signToken = (payload) => {
  return jwt.sign(payload, SECRETKEY);
};

const readToken = (token) => {
  return jwt.verify(token, SECRETKEY);
};

const hashPass = (plainpass) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plainpass, salt);
};

const comparepass = (inputpass, hashedpass) => {
  return bcrypt.compare(inputpass, hashedpass);
};

module.exports = { hashPass, comparepass, signToken, readToken };
