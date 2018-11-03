import * as React from "react";
import * as Io from "socket.io-client";
import * as Types from "../../src-server/types";
import { styled } from "@glitz/react";

type PropType = {

};

type StateType = {
    scores: Types.PlayerScore[],
};

const RowOuterWrapper = styled.div({
    display: "flex",
    justifyContent: "center",
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

export class App extends React.Component<PropType, StateType> {
    socket: SocketIOClient.Socket;

    constructor(props: PropType) {
        super(props);
        this.socket = Io();
        this.socket.on("server:send-scores", (scores: Types.PlayerScore[]) => {
            this.setState({
                scores: scores.sort((a, b) => {
                    return a.highestScore > b.highestScore ? -1 : 1;
                })
            });
        });
        this.state = {
            scores: []
        };
    }
    render(): JSX.Element {
        return (
            <RowOuterWrapper>
                <RowInnerWrapper>
                    <HeaderImage src="https://www.avensia.com/assets/img/avensia-wide.png"
                        srcSet="https://www.avensia.com/assets/img/avensia-wide.png 1x, https://www.avensia.com/assets/img/avensia-wide@2x.png 2x"
                        alt="Avensia" />
                    {this.state.scores.map((score: Types.PlayerScore, i: number) => {
                        return (
                            <Row key={score.player.ip + score.player.name}>
                                <RowScore>{score.highestScore}</RowScore>
                                <RowName>{score.player.name}</RowName>
                            </Row>
                        );
                    })}
                </RowInnerWrapper>
            </RowOuterWrapper>
        );
    }
}
