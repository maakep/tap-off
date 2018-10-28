import * as React from "React";
import { styled } from "@glitz/react";

const ProductCard = styled.div({
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  backgroundColor: 'rgb(255, 10, 100)',
  userSelect: 'none',
  display: 'flex',
  justifyContent: 'center',
  WebkitTapHighlightColor: 'transparent'
});


type PropType = {
  onClick: () => void,
}

type StateType = {

}

export class Button extends React.Component<PropType, StateType> {
 
  constructor(props: PropType) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ProductCard onClick={this.props.onClick}>
        { this.props.children }
      </ProductCard>
    );
  }
}