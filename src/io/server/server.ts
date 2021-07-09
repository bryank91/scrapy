import express from 'express';

const app = express();

export class Server {
  app: Express.Application

  constructor(app: Express.Application) {
    this.app = app;
  }

  run() {
    app.use(express.json())

    app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    
    app.post('/getName', function (req, res) {
      console.log(req.body)
      let request : string = req.body.Name != null ? req.body.Name : "Unknown" // TODO: there must be a better way to handle these types
      res.send('My name is:' + request)
    })

    app.listen(4000, () => {
      console.log(`server running on port 4000`);
    });
  }
}


