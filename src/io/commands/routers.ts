import { Command, OptionValues } from "commander";

import { Server } from "../server/server";
import { Parse } from "../commands/commands";

export namespace Router {
  export function init(argv: string[]): OptionValues {
    const command = new Command();
    return Parse.options(command, argv);
  }

  export function server() {
    console.log("Running server");
    const express = require("express");
    const init = express();
    const server = new Server(init);
    server.run();
  }
}
