import express, { Express } from 'express';
import { Shared } from "../actions/shared"


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
    
    this._app.post('/getInventory', function (req, res) {
      req.body.Url != null 
      ?       
        Shared.execute(req.body.Url).then((result) => {
          res.send(result)
        })
      : 
        res.send("Something went wrong")
    })

    this._app.listen(4001, () => {
      console.log(`server running on port 4001`);
    });

    return this._app;
  }
}



