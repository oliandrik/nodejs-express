const router = require("express").Router();
const Document = require("../models/document.model");
const File = require("../models/file.model");
const User = require("../models/user.model");
const verify = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs");

router.post("/", verify, async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.user.email });
    const newDocument = new Document({
      userId: findUser._id,
      birth_certificate: req.body.birthCertificate,
      parent_passport: req.body.parentPassport,
      rnottac: req.body.rnottac,
      certificate_of_residence_registration: req.body.certificateRegistration,
      certificate_of_registration_of_person: req.body.certificatePerson,
      status: "pending",
    });

    await newDocument.save();
    res.status(200).json(newDocument);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", verify, async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.user.email });
    const documents = await Document.find({ userId: findUser._id });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", verify, async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.user.email });
    const documents = await Document.find({
      userId: findUser._id,
      _id: req.params.id,
    });
    const files = await File.find({ documentId: req.params.id });
    res.status(200).json({ documents, files });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", verify, async (req, res) => {
  try {
    const id = req.params.id;
    const document = await Document.findOne({ _id: id });
    if (!document) {
      return res.status(404).send("Document not found");
    }
    await Document.updateOne({ _id: id }, { status: req.body.status });
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json(error);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "public/files";
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const filetype = file.mimetype;
    const prefix = +new Date() + "_";
    cb(null, prefix + file.fieldname + "." + filetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("myFile"), (req, res, next) => {
  console.log("upload");
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

module.exports = router;
