import * as React from "react";
import { Game } from "./game";

type PropType = {

}

type StateType = {
    name: string;
}

export class App extends React.Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
        this.state = {
            name: localStorage.getItem("name"),
        }
    }

    setName(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.keyCode === 13) {
            const newName = e.currentTarget.value;
            if (newName.length > 2) {
                localStorage.setItem("name", newName);
                this.setState({name: newName});
            }
        }
    }


    render() {
        return (
            (this.state.name != null)
                ? <Game name={this.state.name} />
                : <input onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.setName(e)} />
        );

    }
}
