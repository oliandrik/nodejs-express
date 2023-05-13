module.exports = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Invalid password format. Password should contain: 1 lowercase, 1 uppercase, numeric character [0-9], at least 8 characters long",
    });
  }

  // If email and password are valid, continue to the next middleware
  next();
};
