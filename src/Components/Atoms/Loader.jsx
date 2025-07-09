import React from "react";
import styled from "styled-components";
import Loading from "./Loading";

function Loader(props) {
  return (
    <Style>
      <Loading />
    </Style>
  );
}

export default Loader;

const Style = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden !important;
  background-image: url(${process.env.PUBLIC_URL}/loading.jpg);
  background-position: center;
  background-size: cover;
`;