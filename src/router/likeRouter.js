const route = require("express").Router();
const likeController = require("../controller/likeController");
const check_verified = require("../middlewares/check_verified");
route.get(
  "/total_like/:post_id",
  likeController.totalLike.bind(likeController)
);
route.get("/:post_id", likeController.isLiked.bind(likeController));

route.post(
  "/:post_id",
  check_verified,
  likeController.like.bind(likeController)
);

module.exports = route;
