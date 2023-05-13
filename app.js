const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const documentRoute = require("./routes/document");
const multer = require("multer");
const cors = require("cors");
const File = require("./models/file.model");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });

mongoose
  .connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`)
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/files");
  },
  filename: function (req, file, cb) {
    const filetype = file.mimetype;
    const prefix = +new Date() + "_";
    cb(null, prefix + file.fieldname + "." + filetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("myFile"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  const newFile = new File({
    documentId: req.body.documentId,
    filename: file.filename,
  });

  newFile.save();

  res.send(file);
});

app.get("/", (req, res) => {
  res.send("Server is working");
});
