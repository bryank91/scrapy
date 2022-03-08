import { Router } from "./io/server/routers";
import process from "process";

// error handling to allow services to force restart the application
process.on("exit", () => {
  console.log("Force exiting the application");
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  throw reason;
});

// if no arguments are passed, default to server
if (process.argv.length > 2) {
  console.log("Running with arguments");
  Router.init(process.argv);
} else {
  Router.server();
}
