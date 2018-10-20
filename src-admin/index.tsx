import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./comp/app";

import { GlitzClient } from '@glitz/core';
import { GlitzProvider } from '@glitz/react';
import transformers from "@glitz/transformers";
const glitz = new GlitzClient({ transformer: transformers() });

ReactDOM.render(
    <GlitzProvider glitz={glitz}>
        <App />
    </GlitzProvider>,
    document.getElementById("root")
);