const route = require("express").Router();
const messageController = require("../controller/messageController");
const check_verified = require("../middlewares/check_verified");

route.get(
  "/",
  check_verified,
  messageController.getMessages.bind(messageController)
);
route.get(
  "/chatroom/:user_id",
  check_verified,
  messageController.getChatRoom.bind(messageController)
);
route.post(
  "/new_message",
  check_verified,
  messageController.newMessage.bind(messageController)
);

module.exports = route;
