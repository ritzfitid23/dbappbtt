const express = require("express");
const app = express();
const router = require("./router");
const PORT = process.env.PORT;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
