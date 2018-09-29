import * as React from "react";
import { Game } from "./game";
import { GlitzClient } from '@glitz/core';
const glitz = new GlitzClient();

const inputStyling = glitz.injectStyle({
    height: '50px',
    width: '80%',
    backgroundColor: 'white',
    border: {
        left: {
            style: "none"
        },
        right: {
            style: "none"
        },
        top: {
            style: "none"
        },
        bottom: {
            width: '5px',
            color: 'black',
        }
    },
    ":focus": {
        "outline": {
            "style": "none",
        },
    },
});

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
                : <input placeholder={"Enter your name"} 
                className={inputStyling} 
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.setName(e)} />
        );

    }
}
