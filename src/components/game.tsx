import * as React from "react";
import * as io from "socket.io-client";
import initializeSocketResponse from "./socket-callbacks";

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
    console.log("click " + this.state.clicks);
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
        <button onClick={() => this.handleClick()} className={"the-button"}>
        </button>
      );
  }
}
