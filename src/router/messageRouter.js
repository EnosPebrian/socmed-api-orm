const route = require("express").Router();
const messageController = require("../controller/messageController");

route.get("/", messageController.getMessages.bind(messageController));
route.post(
  "/new_message",
  messageController.newMessage.bind(messageController)
);

module.exports = route;
