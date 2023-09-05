"use strict";
const bcrypt = require("bcrypt");

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash("password", 10);
    await queryInterface.bulkInsert(`users`, [
      {
        fullName: "test",
        email: "test@mail.com",
        username: "test",
        phone_number: "08123323323",
        password: password,
        image_url: "https://static.thenounproject.com/png/2737060-200.png",
        gender: "male",
        uid_google: null,
        uid_facebook: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Jordan",
        email: "jordansumardi@gmail.com",
        username: "jordanjoe",
        phone_number: "02192",
        password: password,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJa1OMOJtVz5L7tMLpPuX2OPJ-8Uchsi8xY2VrbqkFFQ&s",
        gender: "male",
        uid_google: "114663336155787148437",
        uid_facebook: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Jordan Ong",
        email: "jordansumardi@hotmail.com",
        username: "jordanfb",
        phone_number: "081232344",
        password: password,
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbkX1iqHjTkNQDTGFy29gA25UEtfWHNHhwNNWLFMN8-Q&s",
        gender: "male",
        uid_google: null,
        uid_facebook: "10222445313553844",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Jordan s",
        email: "jordan@mail.com",
        username: "jordansmrd",
        password: password,
        phone_number: "0812232",
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG17a1g4wLj3HEhdq_TpbV8e2_M3t5P6wKF0YLY2L5FA&s",
        gender: "male",
        uid_google: null,
        uid_facebook: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
