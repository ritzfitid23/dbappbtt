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

const generateTimestamp = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");
  let timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return timestamp;
};

module.exports = {
  hashPass,
  comparepass,
  signToken,
  readToken,
  generateTimestamp,
};
