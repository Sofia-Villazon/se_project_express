const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "69553155db35f1c3e5ecc370", // paste the _id of the test user created in the previous step
  };
  next();
});
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
