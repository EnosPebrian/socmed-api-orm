const express = require("express");
const app = express();
const cors = require("cors");
require(`dotenv`).config();
const PORT = process.env.PORT;
const router = require(`./router`);
const db = require("./sequelize/models");
const moment = require("moment-timezone");
const bearerToken = require("express-bearer-token");

app.use(express.json());
app.use(cors());
app.use(bearerToken());
app.use(`/user`, router.userRoutes);
app.use(`/post`, router.postRoutes);
app.use(`/public/avatars`, express.static(`${__dirname}/public/images/avatar`));
app.use(`/public/posts`, express.static(`${__dirname}/public/images/post`));
app.use(`/comment`, router.commentRoutes);
app.use(`/like`, router.likeRoutes);

app.listen(PORT, () => {
  console.log(`server is online on PORT ${PORT}`);
  // db.sequelize.sync({ alter: true });
});

app.get("/", (req, res) => {
  res.send(`VALAR MORGHULIS`);
});
