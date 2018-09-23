import * as Http from "http";
import * as express from "express";
import * as socketIo from "socket.io";

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);


app.get('/', (req, res) => {
    res.sendStatus(200);
});

http.listen(3000, () => {
    console.log("listening on *:3000");
  });