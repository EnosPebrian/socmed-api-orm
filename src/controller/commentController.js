const Controller = require("./Controller");
const db = require("../sequelize/models");
const moment = require("moment-timezone");

class CommentController extends Controller {
  constructor(model) {
    super(model);
  }
  getByPostID = async (req, res) => {
    const { post_id } = req.params;
    const { page } = req.query;
    this.db
      .findAndCountAll({
        logging: false,
        attributes: {
          include: [
            [
              db.sequelize.literal(
                `(SELECT TIMEDIFF('${moment()
                  .tz("GMT")
                  .format("YYYY-MM-DD HH:mm:ss")}',Comment.createdAt))`
              ),
              "time_posted",
            ],
          ],
        },
        limit: 10 * (page ? Number(page) : 1),
        where: { post_id },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            as: "users",
            attributes: ["username", "id", "image_url"],
          },
        ],
      })
      .then((result) =>
        res.send({
          total_comments: result.count,
          data: result.rows,
          number_of_page: Math.ceil(result.count / 10),
        })
      )
      .catch((err) => {
        return res.status(500).send(err?.message);
      });
  };
}

module.exports = new CommentController("Comment");
