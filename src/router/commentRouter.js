const route = require("express").Router();
const commentController = require("../controller/commentController");
const check_login = require("../middlewares/check_login");

route.post(
  `/:post_id`,
  check_login,
  commentController.create.bind(commentController)
);
route.get(`/:post_id`, commentController.getByPostID.bind(commentController));

module.exports = route;
