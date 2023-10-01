const postController = require(`../controller/postController`);
const check_verified = require("../middlewares/check_verified");
const { fileUploader, blobUploader } = require("../middlewares/multer");
const route = require(`express`).Router();

route.get(`/`, postController.getAll.bind(postController));
route.get(`/q`, postController.getByQuery.bind(postController));
route.get(
  `/profile/:username`,
  postController.getPostByUsername.bind(postController)
);
route.get(`/:id`, postController.getById.bind(postController));

route.patch(
  `/:id`,
  check_verified,
  postController.update.bind(postController),
  postController.getById.bind(postController)
);

// route.post(
//   `/new_post`,
//   fileUploader({
//     destinationFolder: "post",
//     prefix: "POST",
//     filetype: "image",
//   }).single("image"),
//   check_verified,
//   postController.createPost.bind(postController)
// );

route.post(
  `/new_post`,
  blobUploader({ filetype: "image" }).single("image"),
  check_verified,
  postController.createPost.bind(postController)
);

route.delete(
  `/:id`,
  check_verified,
  postController.delete.bind(postController)
);

module.exports = route;
