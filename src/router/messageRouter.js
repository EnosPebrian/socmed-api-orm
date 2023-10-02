const route = require("express").Router();
const messageController = require("../controller/messageController");
const check_login = require("../middlewares/check_login");

route.get(
  "/",
  check_login,
  messageController.getMessages.bind(messageController)
);
route.get(
  "/chatroom/:user_id",
  check_login,
  messageController.getChatRoom.bind(messageController)
);
route.post(
  "/new_message",
  check_login,
  messageController.newMessage.bind(messageController)
);

module.exports = route;
