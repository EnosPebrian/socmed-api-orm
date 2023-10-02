const route = require("express").Router();
const followController = require("../controller/followController");
const check_verified = require("../middlewares/check_verified");

route.get("/:followed_id", followController.isFollowing.bind(followController));
route.post(
  "/:followed_id",
  check_verified,
  followController.Follow.bind(followController)
);

module.exports = route;
