import { Sequelize } from "sequelize";

const env = process.env.NODE_ENV || "development";
/* eslint-disable */
const config = require("../../config/config.json")[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

export { Sequelize, sequelize };
