import * as React from "react";
import * as Io from "socket.io-client";
import * as Types from "../../src-server/types";
import { styled } from "@glitz/react";

type PropType = {

};

type StateType = {
    scores: Types.PlayerScore[],
    archive?: Types.ScoreArchive,
};

const RowOuterWrapper = styled.div({
    display: "flex",
    justifyContent: "center",
    marginTop: 25
});
const RowInnerWrapper = styled.div({
    display: "flex",
    flexDirection: "column",
    fontSize: 40,
    fontFamily: '"Titillium Web",sans-serif',
    color: "white",
    width: 700,
    marginTop: "10px",
    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px",
});

const Row = styled.div({
    display: "flex",
    backgroundColor: "#7fcfd4",
    height: 75,
    borderBottom: {
        color: "#90d7db",
        style: "solid",
        width: "3px",
    }
});

const RowScore = styled.div({
    width: 150,
    borderRight: {
        color: "#90d7db",
        style: "solid",
        width: "3px",
    },
    paddingRight: 10,
    alignSelf: "center",
    textAlign: "end"
});

const RowName = styled.div({
    flexGrow: 10,
    margin: { x: 10 },
    alignSelf: "center"
});

const HeaderImage = styled.img({
    width: 250,
    padding: { xy: 30 },
    marginLeft: "50%",
    transform: "translate(-50%)"
});

const Center = styled.div({
    color: "black",
    alignSelf: "center",
});

export class App extends React.Component<PropType, StateType> {
    socket: SocketIOClient.Socket;
    activeHighscoreMax = 10;
    archivedHighscoreMax = 10;

    constructor(props: PropType) {
        super(props);
        var normal = "background: #7fcfd4; color: white";
        var highlight = "background: #7fcfd4; color: black";
        console.log("%c Add query parameter %cshowActive=5%c to limit the active game", normal, highlight, normal);
        console.log("%c Add query parameter %cshowArchived=5%c to limit the archived game", normal, highlight, normal);
        this.socket = Io();
        this.socket.on("server:send-scores", (payload: Types.Payload) => {
            this.setState({
                scores: payload.activeScore.sort(this.sortHighscore),
                archive: payload.archive,
            });
        });
        this.socket.emit("client:request-scores");
        this.state = {
            scores: [],
        };

        const paramsString = location.search;
        const params = new URLSearchParams(paramsString);
        const archivedQuantity = parseInt(params.get('showArchived'));
        if (archivedQuantity > 0) {
            this.archivedHighscoreMax = archivedQuantity;
        }
        const activeQuantity = parseInt(params.get('showActive'));
        if (activeQuantity > 0) {
            this.activeHighscoreMax = activeQuantity;
        }
    }

    sortHighscore(a: Types.PlayerScore, b: Types.PlayerScore) {
        return a.highestScore > b.highestScore ? -1 : 1;
    }

    render(): JSX.Element {
        return (
            <>
                <RowOuterWrapper>
                    <RowInnerWrapper>
                        <HeaderImage src="https://www.avensia.com/assets/img/avensia-wide.png"
                            srcSet="https://www.avensia.com/assets/img/avensia-wide.png 1x, https://www.avensia.com/assets/img/avensia-wide@2x.png 2x"
                            alt="Avensia" />
                            <Center>arkad.avensia.se</Center>
                        {this.state.scores.slice(0, this.activeHighscoreMax).map((score: Types.PlayerScore, i: number) => {
                            return (
                                <Row key={score.player.ip + score.player.name}>
                                    <RowScore>{score.highestScore}</RowScore>
                                    <RowName>{score.player.name}</RowName>
                                </Row>
                            );
                        })}
                    </RowInnerWrapper>
                </RowOuterWrapper>
                {this.state.scores.length - this.activeHighscoreMax > 0 &&
                    <div style={{ textAlign: "center", color: "black", fontSize: "25px", fontStyle: "italic" }}>... and {this.state.scores.length - this.activeHighscoreMax} more</div>
                }
                {this.state.archive !== undefined &&
                    this.state.archive.map((entry: Types.ArchiveEntry) => {
                        return (
                            <div key={entry.name}>
                                <RowOuterWrapper>
                                    <RowInnerWrapper>
                                        <Row>
                                            <RowName css={{ fontWeight: "bold" }}>
                                                Round completed {entry.name}
                                            </RowName>
                                        </Row>
                                        {entry.scores.slice(0, this.archivedHighscoreMax).map((score: Types.PlayerScore) => {
                                            return (
                                                <Row key={score.player.ip + score.player.name}>
                                                    <RowScore>{score.highestScore}</RowScore>
                                                    <RowName>{score.player.name}</RowName>
                                                </Row>
                                            );
                                        })
                                        }
                                    </RowInnerWrapper>
                                </RowOuterWrapper>
                                {entry.scores.length - this.archivedHighscoreMax > 0 &&
                                    <div style={{ textAlign: "center", color: "black", fontSize: "25px", fontStyle: "italic" }}>... and {entry.scores.length - this.archivedHighscoreMax} more</div>
                                }
                            </div>
                        );
                    })
                }
            </>
        )
    }
}
