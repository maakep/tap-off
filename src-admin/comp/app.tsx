import * as React from "react";
import * as Io from "socket.io-client";
import * as Types from "../../src-server/types";
import { styled } from "@glitz/react";

type PropType = {

}

type StateType = {
    scores: Types.PlayerScore[],
}

const RowOuterWrapper = styled.div({
    display: 'flex',
    justifyContent: 'center',
});
const RowInnerWrapper = styled.div({
    display: 'flex',
    backgroundColor: 'grey',
    flexDirection: 'column',
    fontSize: 60,
    color: 'white',
    width: 700,
    marginTop: '30px',
});

const Row = styled.div({
    display: 'flex',
    backgroundColor: 'black',
    height: 75,
    borderBottom: {
        color: 'white',
        style: 'solid',
        width: '1px',
    }
});

const RowScore = styled.div({
    width: 150,
    borderRight: {
        color: 'white',
        style: 'solid',
        width: '1px',
    },
    padding: { xy: 10 },
    
});
const RowName = styled.div({
    flexGrow: 10,
    padding: { xy: 10 },
});

export class App extends React.Component<PropType, StateType> {
    socket: SocketIOClient.Socket;

    constructor(props: PropType) {
        super(props);
        this.socket = Io();
        this.socket.on("server:send-scores", (scores: Types.PlayerScore[]) => {
            this.setState({ scores: scores.sort(x => x.highestScore*-1) });
        })
        this.state = {
            scores: []
        }

        
    }
    render() {
        return (
            <RowOuterWrapper>
                <RowInnerWrapper>
                    { this.state.scores.map((score: Types.PlayerScore, i: number) => {
                        return (
                            <Row key={ score.player.ip + score.player.name }> 
                                <RowScore>{ score.highestScore }</RowScore>
                                <RowName>{ score.player.name }</RowName>
                            </Row>
                        );
                    }) }
                </RowInnerWrapper>
            </RowOuterWrapper>
        );
    }
}
