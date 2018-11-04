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
let ScoreArchive: Types.ScoreArchive;

function SetScore(name: string, email: string, score: number, socket: SocketIo.Socket): void {
    let pScore: Types.PlayerScore = GetScore(name);
    if (pScore === undefined) {
        InitializePlayer(name, email, socket);
        pScore = GetScore(name);
    }
    if (score > pScore.highestScore) {
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

function SortHighscore(a: Types.PlayerScore, b: Types.PlayerScore) {
    return a.highestScore > b.highestScore ? -1 : 1;
}

app.get("/", (req, res) => {
    res.sendFile("/index.html", root);
});

app.get("/admin", (req, res) => {
    res.sendFile("/admin.html", root);
});

app.post("/reset", (req, res) => {
    const date = new Date();
    const timestamp = date.getHours() + ":" + date.getMinutes();
    if (ScoreArchive === undefined) {
        ScoreArchive = [{ name: timestamp, scores: Scores.sort(SortHighscore) }];
    } else {
        ScoreArchive.push({ name: timestamp, scores: Scores.sort(SortHighscore) });
    }
    Scores = [];
    io.sockets.emit("server:send-scores", { archive: ScoreArchive, activeScore: Scores } as Types.Payload);
    res.send(200);
});

app.get("/*.js", (req, res) => {
    res.sendFile(req.url, root);
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});

io.on("connection", (socket: SocketIo.Socket) => {
    console.log(socket.handshake.address + " connected.");

    socket.on("client:request-scores", () => {
        socket.emit("server:send-scores", { archive: ScoreArchive, activeScore: Scores } as Types.Payload);
    });

    socket.on("client:join", ({ name, email }) => {
        console.log("client join " + name);
        if (GetScore(name) === undefined) {
            InitializePlayer(name, email, socket);
        }
    });

    socket.on("client:submit-score", (data: { name: string, email: string, score: number }) => {
        SetScore(data.name, data.email, data.score, socket);
        io.sockets.emit("server:send-scores", { archive: ScoreArchive, activeScore: Scores } as Types.Payload);
    });

    socket.on("disconnecting", () => {
        console.log(socket.handshake.address + " disconnected.");
    });
});