import * as React from "React";
import { styled } from "@glitz/react";

const HeaderWrapper = styled.div({
  width: '100%',
  height: '70px',
  display: 'flex',
  backgroundColor: 'grey'
});

const NotCart = styled.div({
  flexGrow: 1,
});

const MiniCart = styled.div({
  fontSize: 35,
  minWidth: 80,
  padding: {
    xy: 15
  },
  alignSelf: 'center',
  display: 'flex',
  justifyContent: 'flex-end',
});

const ClickText = styled.div({
  marginRight: '0.5em',
});

const CartIcon = styled.i({ 

})


type PropType = {
  clicks?: number,
}

export const Header = (props: PropType) => (
  <HeaderWrapper>
    <NotCart></NotCart>
    <MiniCart>
      <ClickText>
        { props.clicks }
      </ClickText>
      <CartIcon className="fa fa-shopping-cart"></CartIcon>
    </MiniCart>
  </HeaderWrapper>
)