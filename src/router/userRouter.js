const userController = require(`../controller/userController`);
const route = require(`express`).Router();
const registerValidator = require(`../middlewares/register_verificator`);
const { blobUploader } = require("../middlewares/multer");
const { userValidationRules, validate } = require("../middlewares/validator");

route.get(`/`, userController.getByQuery.bind(userController));
route.get(`/token`, userController.keepLogin.bind(userController));
route.get(`/render_image`, userController.renderImage.bind(userController));
route.get(
  `/username/:username`,
  userController.getByUserName.bind(userController)
);
route.get(`/:id`, userController.getById.bind(userController));

route.post(`/auth`, userController.login.bind(userController));
route.post(
  `/resend/:id`,
  userController.resendVerification.bind(userController)
);
route.post(`/verify/token`, userController.verifyUser.bind(userController));
route.post(
  `/new_account`, //for REGISTER
  userValidationRules(),
  validate,
  registerValidator,
  userController.register.bind(userController)
);
route.post(
  `/forgot_pass/:email`,
  userController.resetPasswordVerification.bind(userController)
);
route.post(
  `/reset_password/:token`,
  userController.resetPasswordSubmission.bind(userController)
);

route.post(
  `/resend_verification_link/:id`,
  userController.resendVerification.bind(userController)
);

route.patch(
  `/:id`,
  blobUploader({ filetype: "image" }).single("image"),
  userController.blobAvatar.bind(userController),
  userController.editProfile.bind(userController)
);

module.exports = route;
