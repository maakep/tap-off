import * as Http from "http";
import * as express from "express";
import * as SocketIo from "socket.io";
import Root from "./root";
import * as Types from "./types";
import Database from "object-to-file";
const db = new Database("data");

const root: { root: string } = { root: Root };

const app: express.Express = express();
app.use(express.static('public'));

const http: Http.Server = Http.createServer(app);
const io: SocketIo.Server = SocketIo(http);

let Players: Types.Player[] = db.read("Players") ? db.read("Players") : [];
let Scores: Types.PlayerScore[] = db.read("Scores") ? db.read("Scores") : [];
let ScoreArchive: Types.ScoreArchive = db.read("ScoreArchive");


function SetScore(name: string, email: string, score: number, socket: SocketIo.Socket): void {
    let pScore: Types.PlayerScore = GetScore(name);
    if (pScore === undefined) {
        InitializePlayer(name, email, socket);
        pScore = GetScore(name);
    }
    if (score > pScore.highestScore && score > 0) {
        pScore.highestScore = score;
        UpdateDb();
    }
}

function UpdateDb() {
    db.push("Players", Players);
    db.push("Scores", Scores);
    db.push("ScoreArchive", ScoreArchive);
}

function GetScore(name: string): Types.PlayerScore {
    return Scores.filter(x => x.player.name === name)[0];
}

function InitializePlayer(name: string, email: string, socket: SocketIo.Socket): void {
    const playerLength: number = Players.push({ name: name, ip: socket.handshake.address, email: email });
    Scores.push({ player: Players[playerLength - 1], highestScore: 0 });
}

function SortHighscore(a: Types.PlayerScore, b: Types.PlayerScore): number {
    return a.highestScore > b.highestScore ? -1 : 1;
}

app.get("/", (req, res) => {
    res.sendFile("/index.html", root);
});

app.get("/score", (req, res) => {
    res.sendFile("/score.html", root);
});

app.get("/admin", (req, res) => {
    if (req.query.admin === "store") {
        res.sendFile("/admin.html", root);
    } else {
        res.sendStatus(403).send("Wrong password, ask any epi developer for clues");
    }
});

app.get("/delete", (req, res) => {
    if (req.query.admin === "store") {
        if (req.query.user != undefined) {
            Scores.splice(Scores.indexOf(Scores.filter(x => x.player.name === req.query.user)[0]), 1);
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(403).send("Wrong password, ask any epi developer for clues");
    }
});

app.get("/data", (req, res) => {
    if (req.query.admin === "store") {
        res.sendFile("/data.json", root);
    } else {
        res.sendStatus(403).send("Wrong password, ask any epi developer for clues");
    }
});

app.get("/reset", (req, res) => {
    res.sendStatus(404);
});

let prevReset = "00:00";
app.post("/reset", (req, res) => {

    const date = new Date();
    const timestamp = date.getHours() + ":" + date.getMinutes();
    if (prevReset === timestamp) {
        res.status(403).send("You already did this once this minute.");
        return;
    }
    if (ScoreArchive === undefined) {
        ScoreArchive = [{ name: timestamp, scores: Scores.sort(SortHighscore) }];
    } else {
        ScoreArchive.push({ name: timestamp, scores: Scores.sort(SortHighscore) });
    }
    Scores = [];
    io.sockets.emit("server:send-scores", { archive: ScoreArchive, activeScore: Scores } as Types.Payload);
    prevReset = timestamp;
    res.status(200).send("New game started, browse to the previous page if you want to do it again.");
});

app.get("/*.js", (req, res) => {
    res.sendFile(req.url, root);
});

http.listen(1337, () => {
    console.log("listening on *:1337");
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