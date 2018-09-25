import * as Http from "http";
import * as express from "express";
import * as socketIo from "socket.io";
import Root from "./root";

console.log(Root);
const root = { root : Root };

const app = express();

const http = Http.createServer(app);
const io = socketIo(http);

app.get('/', (req, res) => {
    res.sendFile("/index.html", root);
});

app.get('/admin', (req, res) => {
    res.sendFile("/admin.html", root);
});

app.get('/*.js', (req, res) => {
    res.sendFile(req.url, root);
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});