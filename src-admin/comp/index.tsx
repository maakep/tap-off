import * as React from "react";
import * as Io from "socket.io-client";
import * as Types from "../../src-server/types";
import { GlitzClient } from '@glitz/core';
const glitz = new GlitzClient();

type PropType = {

}

type StateType = {
    scores: Types.PlayerScore[],
}

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
            <div className={"scores"}>
                { this.state.scores.map((score: Types.PlayerScore, i: number) => {
                    return (<div key={score.player.ip+score.player.name}> {score.player.name } - { score.highestScore } </div>);
                }) }
            </div>
        );
    }
}
