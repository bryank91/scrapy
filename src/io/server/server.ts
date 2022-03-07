import express, { Express } from "express";
import { Shared } from "../actions/shared";
import * as dotenv from "dotenv";
import { PuppeteerCluster as Cluster } from "../actions/cluster";

export namespace Server {
  export interface Server {
    app: Express;
    cluster: any; // supposedly is Cluster<any , any>
  }

  export async function run(app: Express): Promise<Server> {
    // need to handle Cluster types instead of using any
    dotenv.config();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const server = app.listen(process.env.PORT, () => {
      console.log(`server running on port ` + process.env.PORT);
    });

    // allow the application to gracefully close
    setInterval(
      () =>
        server.getConnections((err, connections) =>
          console.log(`${connections} connections currently open`)
        ),
      1000
    );

    // init cluster
    const cluster = await Cluster.initBrowser();

    let connections: any = [];

    process.on("SIGTERM", shutDown);
    process.on("SIGINT", shutDown);

    server.on("connection", (connection) => {
      connections.push(connection);
      connection.on(
        "close",
        () => (connections = connections.filter((curr: any) => curr !== connection))
      );
    });

    function shutDown() {
      console.log("Received kill signal, shutting down gracefully");
      server.close(async () => {
        console.log("Closed out remaining connections");
        await cluster.close();
        process.exit(0);
      });

      setTimeout(async () => {
        console.error("Could not close connections in time, forcefully shutting down");
        await cluster.close(); // await this to make sure all connections are closed
        process.exit(1);
      }, 10000);

      connections.forEach((curr: any) => curr.end());
      setTimeout(() => connections.forEach((curr: any) => curr.destroy()), 5000);
    }

    return {
      app,
      cluster,
    };
  }
}
