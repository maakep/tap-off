import * as Http from "http";
import * as express from "express";
import * as SocketIo from "socket.io";
import Root from "./root";

const root = { root : Root };

const app = express();
const http = Http.createServer(app);
const io = SocketIo(http);

type Player = {
    name: string,
    ip: string,
};

type PlayerScore = {
    player: Player,
    highestScore: number,
};


let Players: Player[] = [];
let Scores: PlayerScore[] = [];

io.on('connection', (socket: SocketIo.Socket) => {
    console.log(socket.handshake.address + " connected.");
    
    socket.on('client:join', (name: string) => {
        console.log("client join " + name);
        if (GetScore(name) === undefined) {
            InitializePlayer(name, socket);
        }
    });

    socket.on('client:submit-score', (data: {name: string, score: number}) => {
        console.log(data.name + " &% " + data.score);
        SetScore(data.name, data.score);
        console.log(GetScore(data.name).highestScore);
    });

    socket.on('disconnecting', () => {
        console.log(socket.handshake.address + " disconnected.");
    });
});

function SetScore(name: string, score: number) {
    let pScore: PlayerScore = GetScore(name);
    if (pScore !== undefined && score > pScore.highestScore) {
        pScore.highestScore = score;
    }
}

function GetScore(name: string): PlayerScore {
    return Scores.filter(x => x.player.name === name)[0];
}

function InitializePlayer(name: string, socket: SocketIo.Socket) {
    const playerLength = Players.push({ name: name, ip: socket.handshake.address });
    Scores.push({ player: Players[playerLength-1], highestScore: 0 });
    console.log("initialized " + name);
    console.log(Players[0]);
    console.log(Scores[0]);
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