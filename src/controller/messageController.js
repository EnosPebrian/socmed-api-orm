const Controller = require("./Controller");
const db = require(`../sequelize/models`);

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
        logging: false,
        where: { user_sender_id: sender, user_reciever_id: receiver },
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
      return res.send(new_message);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  };
}

module.exports = new MessageController("Message");
