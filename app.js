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

app.use((req, res, next) => {
  req.user = {
    _id: "695523ca8b7a58e60134899d", // paste the _id of the test user created in the previous step
  };
  next();
});
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
