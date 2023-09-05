const db = require(`../sequelize/models`);
class Controller {
  constructor(model) {
    this.db = db[model];
  }
  getAll(req, res) {
    this.db
      .findAll()
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err?.message));
  }
  getById(req, res) {
    const { id } = req.params;
    this.db
      .findByPk(id)
      .then((result) => res.send(result))
      .catch((err) => res.status(500).send(err?.message));
  }
  create(req, res) {
    this.db
      .create({ ...req.body })
      .then((result) => {
        delete result?.dataValues?.password;
        res.send(result);
      })
      .catch((err) => res.status(500).send(err?.message));
  }
  update(req, res, next) {
    const { id } = req.params;
    this.db
      .update({ ...req.body }, { where: { id } })
      .then(() => next())
      .catch((err) => res.status(500).send(err?.message));
  }
  delete(req, res) {
    const { id } = req.params;
    this.db
      .destroy({ where: { id } })
      .then((result) => res.send({ message: `item deleted` }))
      .catch((err) => res.status(500).send(err?.message));
  }
}

module.exports = Controller;
