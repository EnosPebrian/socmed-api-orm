const userRoutes = require(`./userRouter`);
const postRoutes = require(`./postRouter`);
const commentRoutes = require(`./commentRouter`);
const likeRoutes = require("./likeRouter");
const followRoutes = require("./followRouter");
const messageRoutes = require("./messageRouter");

module.exports = {
  userRoutes: userRoutes,
  postRoutes: postRoutes,
  commentRoutes: commentRoutes,
  likeRoutes: likeRoutes,
  followRoutes: followRoutes,
  messageRoutes: messageRoutes,
};
