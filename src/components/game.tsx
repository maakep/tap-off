import * as React from "react";
import * as io from "socket.io-client";
import initializeSocketResponse from "./socket-callbacks";
import { GlitzClient } from '@glitz/core';
const glitz = new GlitzClient();

const buttonStyle = glitz.injectStyle({
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  backgroundColor: 'rgb(255, 10, 100)',
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'center',
});

const clicksStyle = glitz.injectStyle({
  alignSelf: 'center',
  fontSize: '200%',
});

type PropType = {
  name: string;
};
type StateType = {
  clicks: number;
};

export class Game extends React.Component<PropType, StateType> {
  socket: SocketIOClient.Socket;
  timeout: NodeJS.Timer;

  constructor(props: PropType) {
      super(props);
      this.socket = io();
      this.socket.emit("client:join", this.props.name);
      initializeSocketResponse(this.socket);

      this.state = {
        clicks: 0
      };
  }

  handleClick() {
    this.increment();

    if (this.timeout !== undefined)
      clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.socket.emit('client:submit-score', {name: this.props.name, score: this.state.clicks});
      this.reset();
    }, 1000);
  }

  increment() {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  reset() {
    this.setState({ clicks: 0 });
  }

  render() {
      return (
        <div onClick={() => this.handleClick()} className={buttonStyle} >
          <div className={clicksStyle}>
            { this.state.clicks }
          </div>
        </div>
      );
  }
}
