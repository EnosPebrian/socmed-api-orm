const route = require("express").Router();
const commentController = require("../controller/commentController");

route.post(`/:post_id`, commentController.create.bind(commentController));
route.get(`/:post_id`, commentController.getByPostID.bind(commentController));

module.exports = route;
