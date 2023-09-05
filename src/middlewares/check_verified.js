const jwt = require("jsonwebtoken");

const check_verified = (req, res, next) => {
  try {
    const { token } = req.query;
    const data = jwt.verify(token, process.env.jwt_secret);
    if (data.id != req.body.user_id)
      throw new Error("your credential does not match");
    if (!data.is_verified) throw new Error("your account is not verified");

    next();
  } catch (err) {
    return res.status(400).send(err?.message);
  }
};

module.exports = check_verified;
