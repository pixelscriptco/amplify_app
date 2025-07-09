import React from "react";
import styled from "styled-components";
import { moveRotateSVG } from "../SVGs/MoveSvg";

function TowerRotateInstruction(props) {
  return <Style className="overlay-can-fade-out">{moveRotateSVG}</Style>;
}

const Style = styled.div`
  z-index: 100;
  position: absolute;
  bottom: 1%;
  left: 50%;
  animation: left-right 3s infinite;

  /* left and right animation */
  @keyframes left-right {
    0% {
      transform: translateX(-60%) scale(0.8);
    }
    50% {
      transform: translateX(-50%) scale(0.8);
    }
    75% {
      transform: translateX(-40%) scale(0.8);
    }
    100% {
      transform: translateX(-60%) scale(0.8);
    }
  }
`;

export default TowerRotateInstruction;
