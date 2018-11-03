import * as React from "react";
import * as io from "socket.io-client";
import { styled } from "@glitz/react";
import initializeSocketResponse from "./socket-callbacks";

import { Header } from "./elements/header";
import { Footer, FooterElement } from "./elements/footer";
import { Button } from "./elements/button";
import { ProductCard } from "./cards";
import { brands } from "./brands";

type PropType = {
  name: string;
  email: string;
  clearName: () => void;
};
type StateType = {
  clicks: number;
  brand: string;
};

export class Game extends React.Component<PropType, StateType> {
  socket: SocketIOClient.Socket;
  timeout: NodeJS.Timer;

  constructor(props: PropType) {
    super(props);
    this.socket = io();
    this.socket.emit("client:join", { name: this.props.name, email: this.props.email });
    /* Initialize socket responses here, if any are created
    initializeSocketResponse(this.socket);*/

    this.state = {
      clicks: 0,
      brand: brands[0],
    };
  }

  handleClick(e: React.MouseEvent<HTMLElement>): void {
    this.increment();
    if (this.state.clicks % 30 === 0) {
      this.setNewBrand();
    }

    if (this.timeout !== undefined) {
      this.resetTimeout();
    }

    this.timeout = setTimeout(() => {
      this.emitScore();
    }, 1500);
  }

  emitScore() {
    this.socket.emit("client:submit-score", { name: this.props.name, score: this.state.clicks });
    this.reset();
  }

  resetTimeout() {
    clearTimeout(this.timeout);
  }

  setNewBrand() {
    this.setState({ brand: brands[Math.floor(Math.random() * brands.length)] });
  }

  increment(): void {
    this.setState({ clicks: this.state.clicks + 1 });
  }

  reset(): void {
    this.setState({ clicks: 0 });
  }

  render(): JSX.Element {
    return (
      <>
        <Button onClick={this.handleClick.bind(this)}>
          <Header brand={this.state.brand} clicks={this.state.clicks} />
          <ProductCard brand={this.state.brand} />
        </Button>
        <Footer>
          <FooterElement onClick={() => {
            this.resetTimeout();
            this.emitScore();
            localStorage.clear();
            this.props.clearName();
          }}>
            <i className="fa fa-sign-out" />
            <styled.Div css={{ fontSize: 12, fontStyle: "italic" }}>Sign out</styled.Div>
          </FooterElement>
          <FooterElement onClick={() => {
            history.pushState(null, null, "https://www.avensia.com/careers/fields/avensia-academy");
            window.location.href = "/https://www.avensia.com/careers/fields/avensia-academy";
          }}>
            <styled.Img css={{ alignSelf: "center", height: 31 }} src="/logos/avensia.png" />
            <styled.Div css={{ fontSize: 12, fontStyle: "italic", fontWeight: "bold" }}>About Avensia</styled.Div>
          </FooterElement>
          <FooterElement onClick={() => {
            history.pushState(null, null, "/admin");
            window.location.href = "/admin";
          }}>
            <i className="fa fa-trophy" />
            <styled.Div css={{ fontSize: 12, fontStyle: "italic" }}>Scores</styled.Div>
          </FooterElement>
        </Footer>
      </>
    );
  }
}
