const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(
      token,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjdkMTEyYjFhZWIwODhmNjUyZDIwMWQiLCJpYXQiOjE2NTIzNjM1NjMsImV4cCI6MTY1MjM2NzE2M30.xcLp-Fg3uh4IQF3OftsK6TWiHSmN5xBJf3E3UA6U44A"
    );

    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
