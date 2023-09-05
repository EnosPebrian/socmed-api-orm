const route = require("express").Router();
const likeController = require("../controller/likeController");

route.get("/:post_id", likeController.isLiked.bind(likeController));
route.post("/:post_id", likeController.like.bind(likeController));

module.exports = route;
