const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    body("email").isEmail().withMessage("not an email"),
    body("phone_number").isMobilePhone().withMessage("not a phone number"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("password length is less than 8"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.errors.map((err) => extractedErrors.push({ [err.path]: err.msg }));
  return res.status(422).send({ errors: extractedErrors });
};

module.exports = { userValidationRules, validate };
