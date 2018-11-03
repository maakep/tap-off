import * as React from "React";
import { styled } from "@glitz/react";

export const Footer = styled.div({
  width: "100%",
  height: "70px",
  display: "flex",
  backgroundColor: "#e2f4f5",
  boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
  justifyContent: "space-between",
});

export const FooterElement = styled.div({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  textAlign: "center",
  padding: { xy: 20 },
  fontSize: 30,
});