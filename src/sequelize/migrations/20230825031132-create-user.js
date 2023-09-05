"use strict";

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.STRING,
      },
      image_url: {
        type: Sequelize.STRING,
      },
      avatar_blob: { type: Sequelize.BLOB("long") },
      google_uid: {
        type: Sequelize.STRING,
        unique: true,
      },
      facebook_uid: {
        type: Sequelize.STRING,
        unique: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      gender: {
        type: Sequelize.ENUM("male", "female"),
      },
      login_attempt: {
        type: Sequelize.INTEGER,
      },
      login_attempt_time: {
        type: Sequelize.DATE,
      },
      reset_password_token: {
        type: Sequelize.STRING,
      },
      verification_token: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
