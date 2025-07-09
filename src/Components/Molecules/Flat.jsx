import React from "react";
import styled from "styled-components";
import { FullScreenIcon } from "../../Icons";
import Compass from "../Atoms/Compass";
import IconButton from "../Atoms/IconButton";
import { toggleFullScreen, toogleHideOverlays } from "../../Utility/function";
import { FLOORS_IMGS } from "../../Data/flatSvgs";

function Flat({ towerId, flatType }) {
  return (
    <FlatStyle className="no-select">
      <div
        style={{
          width: "100vw",
        }}
        className="img-wrapper"
      >
        {/* <div className="flat-number">{flatNumber}</div> */}
        <img src={`/flats/${FLOORS_IMGS[towerId]}/${flatType}.png`} />
      </div>
    </FlatStyle>
  );
}

export default Flat;

const FlatStyle = styled.section`
  height: 100vh;
  width: 100%;
  /* margin-left: 8rem;
  margin-top: 2rem;
  */
  .flat-number {
    font-family: "Roboto", sans-serif;
    background-color: var(--panel_background);
    color: var(--color_text);
    width: fit-content;
    margin: auto;
    padding: 0.3rem 1rem;
    font-weight: 600;
    border-radius: 10px;
    font-size: 1.2rem;
    position: absolute;
    top: 0;
  }
  .img-wrapper {
    /* padding-top: 2rem; */
    transition: all 500ms;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 6rem;
    padding-left: 20%;

    img {
      border-radius: 10px;
      width: auto;
      height: 85%;
      object-fit: contain;
    }
  }
  @media screen and (max-height: 480px) {
    .flat-number {
      font-size: 1rem;
    }
  }
`;
