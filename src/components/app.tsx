import * as React from "react";
import { Game } from "./game";
import { styled } from "@glitz/react";

const Center = styled.div({
    justifyContent: "center",
    flexWrap: "wrap",
    display: "flex",
    height: "100%",
    width: "100%",
});

const SubmitButton = styled.button({
    height: "70px",
    width: "140px",
    fontSize: "25px",
    alignSelf: "center",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    border: { xy: {
        style: "none"
    } },
    backgroundColor: "rgba(0, 0, 0, .1)",
    borderRadius: "5px",
});

const InputStyle = styled.input({
    height: "50px",
    width: "100%",
    textAlign: "center",
    fontSize: "35px",
    alignSelf: "center",
    backgroundColor: "white",
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
            width: "5px",
            color: "black",
        }
    },
    ":focus": {
        "outline": {
            "style": "none",
        },
    },
});

type PropType = {

};

type StateType = {
    nextName: string;
    selectedName: string;
};

export class App extends React.Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
        this.state = {
            selectedName: localStorage.getItem("name"),
            nextName: undefined
        };
    }

    setName(): void {
        if (this.state.nextName.length > 2) {
            localStorage.setItem("name", this.state.nextName);
            this.setState({selectedName: this.state.nextName});
        }
    }

    handleInput(e :React.KeyboardEvent<HTMLInputElement>): void {
        this.setState({ nextName: e.currentTarget.value });

        if (e.keyCode === 13) {
            this.setName();
        }
    }

    render(): JSX.Element {
        return (
            (this.state.selectedName != null)
                ? ( <Game name={this.state.selectedName} /> )
                : (
                <Center>
                    <InputStyle placeholder={"Enter your name"}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.handleInput(e)} />
                    <SubmitButton onClick={ () => this.setName() }>
                        Go!
                    </SubmitButton>
                </Center>
                )
        );
    }
}
