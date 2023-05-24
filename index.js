const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const documentRoute = require("./routes/document");
const cors = require("cors");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

mongoose
  .connect(`mongodb+srv://root:Root@cluster0.6ukpzxa.mongodb.net/`)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server started on port 3000 && connected to db");
    });
  })
  .catch((error) => console.log(error));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/auth", authRoute);
app.use("/document", documentRoute);

app.get("/", (req, res) => {
  res.send("Server is working");
});
