const userRoutes = require(`./userRouter`);
const postRoutes = require(`./postRouter`);
const commentRoutes = require(`./commentRouter`);
const likeRoutes = require("./likeRouter");

module.exports = {
  userRoutes: userRoutes,
  postRoutes: postRoutes,
  commentRoutes: commentRoutes,
  likeRoutes: likeRoutes,
};
