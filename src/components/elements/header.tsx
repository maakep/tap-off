import * as React from "react";
import { styled } from "@glitz/react";

const HeaderWrapper = styled.div({
  width: "100%",
  height: "70px",
  display: "flex",
  backgroundColor: "#e2f4f5",
  boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
});

const NotCart = styled.div({
  flexGrow: 1,
  alignSelf: "center",
  marginLeft: 10,
  display: "flex",
  alignItems: "center",
});

const HeaderLogo = styled.img({
  maxHeight: 20,
  maxWidth: 120,
  paddingRight: 10,
});

const HeaderBrandLogo = styled(HeaderLogo, {
  maxHeight: 55,
});

const MiniCart = styled.div({
  fontSize: 35,
  minWidth: 80,
  padding: {
    xy: 15
  },
  alignSelf: "center",
  display: "flex",
  justifyContent: "flex-end",
});

const ClickText = styled.div({
  marginRight: "0.5em",
});

const CartIcon = styled.i({});


type PropType = {
  clicks?: number,
  brand: string,
};

export const Header:
  (props: PropType) => JSX.Element =
  (props: PropType): JSX.Element => (
    <HeaderWrapper>
      <NotCart>
        <HeaderBrandLogo src={"/logos/" + props.brand + ".png"} />
      </NotCart>
      <MiniCart>
        <ClickText>
          {props.clicks}
        </ClickText>
        <CartIcon className="fa fa-shopping-cart"></CartIcon>
      </MiniCart>
    </HeaderWrapper>
  );