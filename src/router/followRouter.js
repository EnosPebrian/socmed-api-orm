const route = require("express").Router();
const followController = require("../controller/followController");

route.get("/:followed_id", followController.isFollowing.bind(followController));
route.post("/:followed_id", followController.Follow.bind(followController));

module.exports = route;
