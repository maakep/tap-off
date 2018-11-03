import * as React from "react";
import { Game } from "./game";
import { styled } from "@glitz/react";

const Center = styled.div({
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    display: "flex",
    height: "70%",
    width: "100%",
});

const SubmitButton = styled.button({
    height: "70px",
    width: "140px",
    fontSize: "25px",
    alignSelf: "center",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)",
    border: {
        xy: {
            style: "none"
        }
    },
    backgroundColor: "#90d7db",
    borderRadius: "5px",
    color: "white",
});

const InputStyle = styled.input({
    height: "50px",
    width: "90%",
    textAlign: "center",
    fontSize: "35px",
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: "7px",
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
    email: string;
};

export class App extends React.Component<PropType, StateType> {
    constructor(props: PropType) {
        super(props);
        this.state = {
            selectedName: localStorage.getItem("name"),
            nextName: undefined,
            email: undefined,
        };
    }

    setName(): void {
        if (this.state.nextName.length > 2 && this.state.email.indexOf("@")) {
            localStorage.setItem("name", this.state.nextName);
            this.setState({ selectedName: this.state.nextName });
        }
    }

    clearName(): void {
        this.setState({ selectedName: undefined, nextName: undefined });
    }

    handleNameInput(e: React.KeyboardEvent<HTMLInputElement>): void {
        this.setState({ nextName: e.currentTarget.value });

        if (e.keyCode === 13) {
            this.setName();
        }
    }

    handleEmailInput(e: React.KeyboardEvent<HTMLInputElement>): void {
        this.setState({ email: e.currentTarget.value });

        if (e.keyCode === 13) {
            this.setName();
        }
    }

    render(): JSX.Element {
        return (
            (this.state.selectedName != null)
                ? (
                    <Game
                        name={this.state.selectedName}
                        email={this.state.email}
                        clearName={this.clearName.bind(this)}
                    />)
                : (
                    <Center>
                        <img src="https://www.avensia.com/assets/img/avensia-wide.png" width={154} height={29} />
                        <InputStyle placeholder={"Name"}
                            onChange={this.handleNameInput.bind(this)} />
                        <InputStyle placeholder={"Email"}
                            onChange={this.handleEmailInput.bind(this)} />
                        <SubmitButton onClick={this.setName.bind(this)}>
                            Go!
                        </SubmitButton>
                    </Center>
                )
        );
    }
}
