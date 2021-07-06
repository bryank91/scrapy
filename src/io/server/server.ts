import express from 'express';
const app = express();

class Server {
  app : any;

  constructor() {
    this.app = app;
  }

  run() {
    app.listen(4000, () => {
      console.log(`server running on port 4000`);
    });
  }
}


