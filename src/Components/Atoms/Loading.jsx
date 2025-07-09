import React from "react";
import styled from "styled-components";

function Loading(props) {
  return (
    <Style>
      <span className="loader"></span>
    </Style>
  );
}

export default Loading;

const Style = styled.main`
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  background: #1b2227d8;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  .loader {
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
  }
  .loader::after,
  .loader::before {
    content: "";
    box-sizing: border-box;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
    animation: animloader 2s linear infinite;
  }
  .loader::after {
    animation-delay: 1s;
  }

  @keyframes animloader {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
