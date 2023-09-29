const Controller = require("./Controller");
const db = require(`../sequelize/models`);

class FollowController extends Controller {
  constructor(model) {
    super(model);
  }
  async isFollowing(req, res) {
    console.log(req.query, req.params);
    const following_user_id = Number(req.query.user_id);
    const followed_user_id = Number(req.params.followed_id);
    await this.db
      .findOne({
        where: { followed_user_id, following_user_id },
        logging: false,
      })
      .then((result) => {
        if (result) return res.send({ isFollow: true });
        return res.send({ isFollow: false });
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async Follow(req, res) {
    const following_user_id = Number(req.query.user_id);
    const followed_user_id = Number(req.params.followed_id);
    await this.db
      .findOne({
        where: { followed_user_id, following_user_id },
        logging: false,
      })
      .then(async (result) => {
        if (!result) {
          await this.db
            .create(
              {
                ...{ followed_user_id, following_user_id },
              },
              { logging: false }
            )
            .then((result) => res.send({ result: true }))
            .catch((err) => res.status(400).send(err?.message));
        }
        if (result) {
          await this.db
            .destroy({
              where: { followed_user_id, following_user_id },
            })
            .then((result) => res.send({ result: false }))
            .catch((err) => res.status(400).send(err?.message));
        }
      });
  }
}

module.exports = new FollowController("Follow");
