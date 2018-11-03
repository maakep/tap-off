import * as React from "react";
import { styled } from "@glitz/react";

type PropType = {
  brand: string;
};

type StateType = {
};

const ImageCard = styled.img({
  width: "250px",
  height: "400px",
  alignSelf: "center",
  textAlign: "center",
  transition: {
    property: "all",
    duration: ".15s",
    timingFunction: "linear",
  },
  ":active": {
    transform: "scale(0.90)",
  },
});

export class ProductCard extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
    super(props);
    this.state = {
    };
  }

  getProductCard(): JSX.Element {
    return <ImageCard src={"images/" + this.props.brand + ".png"} />;
  }

  render() {
    return (
      this.getProductCard()
    );
  }
}