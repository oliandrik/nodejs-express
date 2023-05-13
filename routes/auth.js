const router = require("express").Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/auth");
const validateAuth = require("../middleware/validate-auth");

router.post("/signup", validateAuth, async (req, res) => {
  try {
    console.log(req.body.email);
    const takenEmail = await User.findOne({ email: req.body.email });

    if (takenEmail) {
      return res
        .status(400)
        .json({ message: "This email has already been taken" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email }, process.env.TOKEN, {
      expiresIn: "10h",
    });
    res.status(200).json({
      message: "Success",
      token: token,
      expiresIn: 36000,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({ message: "Check your password" });
    }

    const token = jwt.sign({ email: user.email }, process.env.TOKEN, {
      expiresIn: "10h",
    });

    res.status(200).json({
      message: "Success",
      token: token,
      expiresIn: 36000,
    });
  } catch (error) {}
});

router.get("/me", verifyToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
