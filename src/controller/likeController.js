const Controller = require("./Controller");
const db = require(`../sequelize/models`);

class LikeController extends Controller {
  constructor(model) {
    super(model);
  }

  async totalLike(req, res) {
    const post_id = Number(req.params.post_id);
    try {
      const result = await this.db.count({ where: { post_id } });
      return res.send({ total: result });
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  }

  async isLiked(req, res) {
    const { post_id } = req.params;
    const { user_id } = req.query;
    await this.db
      .findOne({ logging: false, where: { post_id, user_id } })
      .then((result) => {
        if (result) return res.send({ result: true });
        return res.send({ result: false });
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async like(req, res) {
    const { user_id } = req.body;
    const { post_id } = req.params;
    await this.db
      .findOne({ where: { post_id, user_id } })
      .then(async (result) => {
        if (!result) {
          req.body.post_id = post_id;
          await this.db
            .create({
              ...{ post_id, user_id },
              logging: false,
            })
            .then((result) => res.send({ result: true }))
            .catch((err) => res.status(400).send(err?.message));
        }
        if (result) {
          await this.db
            .destroy({
              where: { post_id, user_id },
              logging: false,
            })
            .then((result) => res.send({ result: false }))
            .catch((err) => res.status(400).send(err?.message));
        }
      });
  }
}

module.exports = new LikeController("PostLike");
