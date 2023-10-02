const db = require(`../sequelize/models`);
const { Op } = require(`sequelize`);
const Controller = require("./Controller");
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const moment = require("moment-timezone");
const sharp = require("sharp");
const mailer = require("../lib/nodemailer");
const fs = require("fs");
const mustache = require("mustache");

class UserController extends Controller {
  constructor(model) {
    super(model);
  }
  async selfupdate(req, res) {
    const { id } = req.params;
    await this.db.update({ ...req.body }, { where: { id } });
  }
  async login(req, res) {
    const { accountID, password } = req.body;
    this.db
      .findOne({
        logging: false,
        attributes: {
          include: [
            [
              db.sequelize.literal(
                `(SELECT DATEDIFF('${moment()
                  .tz("GMT")
                  .format("YYYY-MM-DD HH:mm:ss")}',updatedAt))`
              ),
              "Datediff",
            ],
            [
              db.sequelize.literal(
                `(SELECT TIMEDIFF('${moment()
                  .tz("GMT")
                  .format("YYYY-MM-DD HH:mm:ss")}',login_attempt_time))`
              ),
              "Timediff",
            ],
          ],
        },
        where: {
          [Op.or]: [
            { username: accountID },
            { phone_number: accountID },
            { email: accountID },
          ],
        },
      })
      .then(async (result) => {
        if (!result?.dataValues) {
          throw new Error(
            `Wrong username or email or phone number or password`
          );
        }
        const isValid = await bcrypt.compare(
          password,
          result?.dataValues?.password
        );

        if (
          result?.dataValues?.login_attempt > 2 &&
          result?.dataValues?.Timediff <= "00:01:00" &&
          result?.dataValues?.Datediff < 1
        ) {
          throw new Error(`Your account is suspended for 1 hours`);
        }
        if (!isValid) {
          if (result?.dataValues?.Timediff > "00:00:30") {
            result.dataValues.login_attempt = 0;
            result.dataValues.login_attempt_time = moment().format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          result.dataValues.login_attempt += 1;

          this.selfupdate(
            {
              params: { id: result?.dataValues?.id },
              body: { ...result?.dataValues },
            },
            res
          );

          throw new Error(
            `wrong password ${result?.dataValues?.login_attempt} of 3 attempts, last attempt: ${result?.dataValues?.Timediff}`
          );
        }
        delete result?.dataValues?.password;
        console.log(result.dataValues);
        const payload = {
          id: result?.dataValues?.id,
          is_verified: result?.dataValues?.is_verified,
        };

        const token = jwt.sign(payload, process.env.jwt_secret, {
          expiresIn: "1h",
        });
        result.dataValues.login_attempt = 0;
        await this.selfupdate(
          {
            params: { id: result?.dataValues?.id },
            body: { ...result?.dataValues },
          },
          res
        );

        return res.send({ token, user: result });
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async getByQuery(req, res) {
    const { name } = req.query;
    const limit = 10;
    try {
      const result = await this.db.findAll({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${name}%` } },
            { fullname: { [Op.like]: `%${name}%` } },
          ],
        },
        limit: limit,
        logging: false,
      });
      return res.send(result);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  }

  async getByUserName(req, res) {
    const { username } = req.params;
    try {
      const user = await this.db.findOne({
        where: { username },
        logging: false,
      });
      return res.send(user);
    } catch (err) {
      return res.status(500).send(err?.message);
    }
  }

  async register(req, res) {
    const { email, username, phone_number, password, passwordConfirmation } =
      req.body;
    try {
      const isUserExist = await db.User.findOne({
        logging: false,
        where: {
          [Op.or]: [
            { username: username },
            { phone_number: phone_number },
            { email: email },
          ],
        },
      });
      if (isUserExist?.dataValues.id) {
        throw new Error("this account has been used");
      }
      req.body.password = await bcrypt.hash(password, 10);

      await this.db
        .create({ ...req.body })
        .then((result) =>
          this.resendVerification({ params: { id: result.id } }, res)
        );
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  }

  async keepLogin(req, res) {
    try {
      const { token } = req;
      const data = jwt.verify(token, process.env.jwt_secret);
      if (!data?.id) throw new Error("invalid token");

      const payload = await this.db.findOne({
        logging: false,
        where: {
          id: data.id,
        },
      });
      delete payload.dataValues.password;

      const newToken = jwt.sign(
        { id: data.id, is_verified: payload.dataValues.is_verified },
        process.env.jwt_secret,
        {
          expiresIn: "1h",
        }
      );

      return res.send({ token: newToken, user: payload });
    } catch (err) {
      res.status(400).send(err?.message);
    }
  }

  async editProfile(req, res) {
    const { id } = req.params;
    if (req.file.filename) req.body.image_url = req.file.filename;
    await this.db
      .findOne({ where: { username: req.body.username }, logging: false })
      .then(async (result) => {
        if (result && result?.dataValues?.id != id)
          throw new Error("Username has been used");
        this.db.update({ ...req.body }, { where: { id } });
        return res.send("successfully update profile");
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async renderImage(req, res) {
    const { username } = req.query;
    await db.User.findOne({ logging: false, where: { username } })
      .then((result) => {
        res.set("Content-type", "image/png");
        res.send(result?.dataValues?.avatar_blob);
      })
      .catch((err) => res.status(400).send(err?.message));
  }

  async resendVerification(req, res) {
    const { id } = req.params;
    const user = await db.User.findOne({ logging: false, where: { id } });

    const template = fs
      .readFileSync(__dirname + "/../template/verify.html")
      .toString();

    const token = jwt.sign(
      { id: user.dataValues.id, is_verified: user.dataValues.is_verified },
      process.env.jwt_secret,
      { expiresIn: "5min" }
    );

    user.dataValues.verification_token = token;
    await db.User.update(
      { ...user.dataValues },
      { logging: false, where: { id } }
    );

    const renderTemplate = mustache.render(template, {
      username: user.dataValues.username,
      fullname: user.dataValues.fullname,
      verify_url: process.env.verify_url + `${user.dataValues.id}/` + token,
    });

    const render = await mailer({
      subject: "User Verifiaction",
      to: user.dataValues.email,
      html: renderTemplate,
      text: "Please verify your account",
    });
    res.send("account verification has been sent to your email");
  }

  async verifyUser(req, res) {
    try {
      const { token } = req.query;
      const user = await this.db.findOne({
        logging: false,
        where: { verification_token: token },
      });
      if (!user || user?.dataValues.verification_token != token)
        throw new Error("Verification link is no longer applicable");
      const payload = jwt.verify(token, process.env.jwt_secret);

      if (!payload)
        throw new Error("Verification link is no longer applicable");
      if (payload.is_verified) throw new Error(`User is already verified`);
      await this.db.update(
        { is_verified: true },
        { logging: false, where: { id: payload.id } }
      );

      return res.send("User has been verified");
    } catch (err) {
      return res.status(400).send(err?.message);
    }
  }

  async resetPasswordVerification(req, res) {
    try {
      const { email } = req.params;
      const user = await db.User.findOne({ logging: false, where: { email } });
      const token = jwt.sign(
        { email: user.dataValues.email },
        process.env.jwt_secret,
        { expiresIn: "5min" }
      );

      const template = fs
        .readFileSync(__dirname + "/../template/resetPassword.html")
        .toString();

      user.dataValues.reset_password_token = token;

      await db.User.update(
        { ...user.dataValues },
        { logging: false, where: { email } }
      );

      const renderTemplate = mustache.render(template, {
        username: user.dataValues.username,
        fullname: user.dataValues.fullname,
        verify_url: process.env.resetPassword_url + token,
      });

      const render = await mailer({
        subject: "Reset password soc-med",
        to: user.dataValues.email,
        html: renderTemplate,
        text: "Please verify your account",
      });
      res.send("reset password link has been sent to your email");
    } catch (err) {
      return res
        .status(400)
        .send("reset password link has been sent to your email");
    }
  }

  async resetPasswordSubmission(req, res) {
    try {
      const { token } = req.params;
      const payload = jwt.verify(token, process.env.jwt_secret);
      const user = await this.db.findOne({
        logging: false,
        where: { email: payload.email, reset_password_token: token },
      });
      if (!user)
        throw new Error(
          "Invalid credential or your reset password link has been expired"
        );
      if (req.body.password !== req.body.passwordConfirmation)
        throw new Error("Your password does not match");
      await this.db.update(
        { reset_password_token: "", password: req.body.password },
        { logging: false, where: { email: user.dataValues.email } }
      );
      return res.send("Reset password success");
    } catch (err) {
      res.status(400).send(err?.message);
    }
  }

  async blobAvatar(req, res, next) {
    const { id } = req.params;
    if (req.file) {
      req.body.avatar_blob = await sharp(req.file.buffer).png().toBuffer();
      req.body.image_url = req.file.originalname;
    }

    await db.User.update(req.body, { logging: false, where: { id } })
      .then(() => next())
      .catch((err) => res.status(422).send(err?.message));
  }
}

module.exports = new UserController("User");
