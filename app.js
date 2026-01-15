const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
