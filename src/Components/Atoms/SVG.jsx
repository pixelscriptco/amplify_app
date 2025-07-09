import React from "react";
import styled from "styled-components";

function SVG({ renderer }) {
  return <Style>{renderer}</Style>;
}

const Style = styled.g`
  g {
    z-index: 2;
  }
`;

export default SVG;
