import { Router } from "./io/server/routers";

// if no arguments are passed, default to server
if (process.argv.length > 2) {
  console.log("Running with arguments");
  Router.init(process.argv);
  // Router.routeOptions(options)
} else {
  Router.server();
}
