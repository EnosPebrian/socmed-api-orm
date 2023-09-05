const registerValidator = (req, res, next) => {
  const { email, username, phone, password, passwordConfirmation } = req.body;
  if (password !== passwordConfirmation) {
    return res
      .status(500)
      .send("password does not match to password confirmation");
  } else if (password.length < 8) {
    return res.status(500).send("password at least have 8 characters");
  }
  next();
};

module.exports = registerValidator;
