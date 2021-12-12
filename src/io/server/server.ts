import express, { Express } from "express";
import { Shared } from "../actions/shared";
import * as dotenv from "dotenv";

export class Server {
  private _app: Express;

  constructor(app: Express) {
    this._app = app;
  }

  run() {
    dotenv.config();
    this._app.use(express.json());

    this._app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    this._app.post("/getInventory", function (req, res) {
      req.body.Url !== null
        ? Shared.getInventory(req.body.Url).then((result) => {
            res.send(result);
          })
        : res.send("Something went wrong");
    });

    this._app.listen(process.env.PORT, () => {
      console.log(`server running on port ` + process.env.PORT);
    });

    return this._app;
  }
}
