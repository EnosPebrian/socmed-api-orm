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
          user_reciever_id: { [Op.or]: [sender, receiver] },
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
    console.log(message, receiver, sender);
    try {
      const new_message = await this.db.create({
        user_sender_id: sender,
        user_reciever_id: receiver,
        message: message,
      });
      const chatroom = [sender, receiver].sort((a, b) => a - b);
      global.io?.emit(`chatroom_` + chatroom, new_message.dataValues);
      global.io?.emit(`newMessage_` + receiver, "new_message");
      return res.send(new_message);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };

  getChatRoom = async (req, res) => {
    const user_id = Number(req.params.user_id);
    try {
      const { dataValues } = await this.db.findAll({
        where: { user_sender_id: user_id },
        group: "user_receiver_id",
      });
      return res.send(dataValues);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };
}

module.exports = new MessageController("Message");
