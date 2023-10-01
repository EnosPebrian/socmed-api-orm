const Controller = require(`./Controller`);
const db = require(`../sequelize/models`);
const { Op } = require(`sequelize`);
const sharp = require("sharp");

class PostController extends Controller {
  constructor(table) {
    super(table);
  }
  async getPostByUserid(req, res) {
    const { user_id } = req.params;
    const { page } = req.query;
    const limit = 12;
    this.db
      .findAndCountAll({
        logging: false,
        where: { user_id },
        limit: limit,
        offset: page ? Number(page) * limit : 0,
        order: [["createdAt", "DESC"]],
      })
      .then((result) => {
        return res.send(result.rows);
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async getPostByUsername(req, res) {
    const { username } = req.params;
    const user = await db.User.findOne({ where: { username } });
    const { page, limit } = req.query;
    await this.db
      .findAndCountAll({
        logging: false,
        where: { user_id: user.dataValues.id },
        limit: limit * (page ? Number(page) : 1),
        order: [["createdAt", "DESC"]],
      })
      .then((result) => {
        return res.send({
          number_of_page: Math.ceil(result.count / limit),
          data: result.rows,
        });
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async getByQuery(req, res) {
    const { text, limit, page, user_id } = req.query;
    await this.db
      .findAndCountAll({
        logging: false,
        order: [["createdAt", "DESC"]],
        limit: limit
          ? Number(limit) * (page ? Number(page) : 1)
          : 12 * (page ? Number(page) : 1),
        where: {
          ...(text && {
            [Op.or]: [
              { "$user.username$": { [Op.like]: `%${text}%` } },
              { "$user.fullname$": { [Op.like]: `%${text}%` } },
              { caption: { [Op.like]: `%${text}%` } },
            ],
          }),
          ...(user_id && { user_id }),
        },
        include: [
          {
            model: db.User,
            as: "user",
            attributes: ["id", "username", "fullname", "image_url", "bio"],
          },
        ],
      })
      .then((result) =>
        res.send({
          count: result.count,
          data: result.rows,
        })
      )
      .catch((err) => res.status(400).send(err?.message));
  }

  async createPost(req, res) {
    if (req.file) {
      req.file.filename = `POST_${moment().format("YYYY-MM-DD-HH-mm-ss")}.png`;
      await sharp(req.file.buffer)
        .png()
        .resize(1000, null, { withoutEnlargement: true })
        .toFile(`${__dirname}/../public/images/post/` + req.file.filename);
    }
    await this.db
      .create({
        logging: false,
        caption: req.body.caption,
        image_url: req?.file?.filename,
        user_id: req.body.user_id,
      })
      .then((result) => res.send(result))
      .catch((err) => res.status(422).send(err?.message));
  }
}

module.exports = new PostController("Post");
