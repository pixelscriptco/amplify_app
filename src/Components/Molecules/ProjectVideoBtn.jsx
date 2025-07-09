import React from "react";
import { useState } from "react";
import styled from "styled-components";
import PopupVideoPlayer from "./PopupVideoPlayer";

function ProjectVideoBtn(props) {
  const [videoOpened, setVideoOpened] = useState(false);

  return (
    <>
      <PopupVideoPlayer
        open={videoOpened}
        setOpen={setVideoOpened}
        src="https://dlf-models.s3.ap-south-1.amazonaws.com/sw-one-dxp-project-overview.mp4"
      />
      <Style onClick={() => setVideoOpened(true)}>Explore Project</Style>
    </>
  );
}

const Style = styled.button`
  top: 2.3rem;
  color: var(--color_text);
  width: fit-content;
  margin: auto;
  position: absolute;
  box-shadow: 0 0 1px #07070756;
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 5px;
  right: 6rem;
  background: #252525;
  opacity: 0.8;
  transition: all 100ms ease-in-out;
  border: none;
  z-index: 100;
  cursor: pointer;
  :hover {
    opacity: 0.9;
  }
`;

export default ProjectVideoBtn;
