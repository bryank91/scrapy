import { Server } from "./io/server/server";
const sls = require("serverless-http");

const express = require("express");
const init = express();
const server = new Server(init);
const app = server.run();
module.exports.server = sls(app);
