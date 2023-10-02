const Controller = require("./Controller");
const db = require(`../sequelize/models`);
const { Op } = require("sequelize");

class MessageController extends Controller {
  constructor(model) {
    super(model);
  }

  getMessages = async (req, res) => {
    const receiver = Number(req.query.receiver);
    const sender = Number(req.query.sender);
    const page = Number(req.query.page);
    const limit = 50;
    try {
      const result = await this.db.findAll({
        order: [["createdAt", "DESC"]],
        logging: false,
        where: {
          user_sender_id: { [Op.or]: [sender, receiver] },
          user_receiver_id: { [Op.or]: [sender, receiver] },
        },
        limit: limit,
        offset: limit * page ? page - 1 : 0,
      });
      return res.send(result);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };

  newMessage = async (req, res) => {
    const receiver = Number(req.query.receiver);
    const sender = Number(req.query.sender);
    const { message } = req.body;
    try {
      const new_message = await this.db.create({
        user_sender_id: sender,
        user_receiver_id: receiver,
        message: message,
      });
      const chatroom = [sender, receiver].sort((a, b) => a - b);
      global.io?.emit(`chatroom_` + chatroom, new_message.dataValues);
      global.io?.emit(`newMessage_` + receiver, sender);
      return res.send(new_message);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };

  getChatRoom = async (req, res) => {
    const user_id = Number(req.params.user_id);
    try {
      const result = await this.db.findAll({
        attributes: ["user_receiver_id", "user_sender_id"],
        where: {
          [Op.or]: [{ user_sender_id: user_id }, { user_receiver_id: user_id }],
        },
        group: "user_receiver_id",
        include: {
          model: db.User,
          as: `user_receivers`,
          attributes: ["username"],
        },
      });
      return res.send(result);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };
}

module.exports = new MessageController("Message");
