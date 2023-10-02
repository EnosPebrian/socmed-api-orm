const route = require("express").Router();
const commentController = require("../controller/commentController");
const check_verified = require("../middlewares/check_verified");

route.post(
  `/:post_id`,
  check_verified,
  commentController.create.bind(commentController)
);
route.get(`/:post_id`, commentController.getByPostID.bind(commentController));

module.exports = route;
