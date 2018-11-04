import * as React from "React";
import { styled } from "@glitz/react";

const bgClr = "#7fcfd4";
const boxShadow = "0px -2px 22px -2px rgba(0,0,0,0.75)";

export const Footer = styled.div({
  width: "100%",
  height: "70px",
  zIndex: 1,
  display: "flex",
  backgroundColor: bgClr,
  boxShadow: boxShadow,
  justifyContent: "space-between",
  transition: {
    duration: "0.3s",
    property: "all",
    timingFunction: "ease-out",
  },
  position: "relative",
});

export const FooterElement = styled.div({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  textAlign: "center",
  padding: { x: 20 },
  fontSize: 30,
  ":hover": {
    cursor: "pointer",
  }
});

export const FooterArrow = styled.div({
  width: 30,
  height: 30,
  zIndex: -1,
  backgroundColor: bgClr,
  transform: "translateX(-50%) rotate(45deg)",
  position: "absolute",
  left: "50%",
  top: -15,
  // boxShadow: boxShadow,
})