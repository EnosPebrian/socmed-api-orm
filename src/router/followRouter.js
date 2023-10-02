const route = require("express").Router();
const followController = require("../controller/followController");
const check_login = require("../middlewares/check_login");

route.get("/:followed_id", followController.isFollowing.bind(followController));
route.post(
  "/:followed_id",
  check_login,
  followController.Follow.bind(followController)
);

module.exports = route;
