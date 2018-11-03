import * as Http from "http";
import * as express from "express";
import * as SocketIo from "socket.io";
import Root from "./root";
import * as Types from "./types";

const root: { root: string } = { root: Root };

const app: express.Express = express();
app.use(express.static('public'));

const http: Http.Server = Http.createServer(app);
const io: SocketIo.Server = SocketIo(http);

let Players: Types.Player[] = [];
let Scores: Types.PlayerScore[] = [];

io.on("connection", (socket: SocketIo.Socket) => {
    console.log(socket.handshake.address + " connected.");
    socket.emit("server:send-scores", Scores);

    socket.on("client:join", ({ name, email }) => {
        console.log("client join " + name);
        if (GetScore(name) === undefined) {
            InitializePlayer(name, email, socket);
        }
    });

    socket.on("client:submit-score", (data: { name: string, score: number }) => {
        SetScore(data.name, data.score);
        io.sockets.emit("server:send-scores", Scores);
    });

    socket.on("disconnecting", () => {
        console.log(socket.handshake.address + " disconnected.");
    });
});

function SetScore(name: string, score: number): void {
    let pScore: Types.PlayerScore = GetScore(name);
    if (pScore !== undefined && score > pScore.highestScore) {
        pScore.highestScore = score;
    }
}

function GetScore(name: string): Types.PlayerScore {
    return Scores.filter(x => x.player.name === name)[0];
}

function InitializePlayer(name: string, email: string, socket: SocketIo.Socket): void {
    const playerLength: number = Players.push({ name: name, ip: socket.handshake.address, email: email });
    Scores.push({ player: Players[playerLength - 1], highestScore: 0 });
}

app.get("/", (req, res) => {
    res.sendFile("/index.html", root);
});

app.get("/admin", (req, res) => {
    res.sendFile("/admin.html", root);
});

app.get("/*.js", (req, res) => {
    res.sendFile(req.url, root);
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});