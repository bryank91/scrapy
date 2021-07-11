import express, { Express } from 'express';

export class Server {
  private _app: Express

  constructor(app: Express) {
    this._app = app;
  }

  run() {
    this._app.use(express.json())

    this._app.get('/', (req, res) => {
      res.send('Hello World!')
    })
    
    this._app.post('/getName', function (req, res) {
      let request : string = req.body.Name != null ? req.body.Name : "Unknown" // TODO: there must be a better way to handle these types
      res.send('My name is:' + request)
    })

    this._app.listen(4000, () => {
      console.log(`server running on port 4000`);
    });

    return this._app;
  }
}



