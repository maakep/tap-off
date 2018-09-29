import * as Http from "http";
import * as express from "express";
import * as SocketIo from "socket.io";
import Root from "./root";
import * as Types from "./types";

const root = { root : Root };

const app = express();
const http = Http.createServer(app);
const io = SocketIo(http);

let Players: Types.Player[] = [];
let Scores: Types.PlayerScore[] = [];

io.on('connection', (socket: SocketIo.Socket) => {
    console.log(socket.handshake.address + " connected.");
    socket.emit("server:send-scores", Scores);
    
    socket.on('client:join', (name: string) => {
        console.log("client join " + name);
        if (GetScore(name) === undefined) {
            InitializePlayer(name, socket);
        }
    });

    socket.on('client:submit-score', (data: {name: string, score: number}) => {
        SetScore(data.name, data.score);
        io.sockets.emit("server:send-scores", Scores);
    });

    socket.on('disconnecting', () => {
        console.log(socket.handshake.address + " disconnected.");
    });
});

function SetScore(name: string, score: number) {
    let pScore: Types.PlayerScore = GetScore(name);
    if (pScore !== undefined && score > pScore.highestScore) {
        pScore.highestScore = score;
    }
}

function GetScore(name: string): Types.PlayerScore {
    return Scores.filter(x => x.player.name === name)[0];
}

function InitializePlayer(name: string, socket: SocketIo.Socket) {
    const playerLength = Players.push({ name: name, ip: socket.handshake.address });
    Scores.push({ player: Players[playerLength-1], highestScore: 0 });
}

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