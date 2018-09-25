import * as React from "react";

type PropType = {
  name: string;
};
type StateType = {

};

export class Game extends React.Component<PropType, StateType> {
  constructor(props: PropType) {
      super(props);
      this.state = {
      }
  }

  render() {
      return (
        <div>:call_me_hand:</div>
      );
  }
}
