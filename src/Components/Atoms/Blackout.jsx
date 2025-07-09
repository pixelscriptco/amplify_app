import React from "react";
import styled, { css } from "styled-components";
import { useBlackout } from "../../Hooks";

function Blackout() {
  const { blackout, setBlackout } = useBlackout();
  return <Style $active={blackout}></Style>;
}

export default Blackout;

const Style = styled.div`
  ${(props) =>
    props.$active
      ? css`
          opacity: 0.5;
        `
      : css`
          pointer-events: none;
          opacity: 0;
        `}
  background-color: rgb(26, 24, 24);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: 0.3s;
`;
