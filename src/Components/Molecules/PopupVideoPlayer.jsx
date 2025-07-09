import Modal from "react-modal";
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import Loading from "../Atoms/Loading";
import { useRef } from "react";
import IntroVideo from "../Atoms/IntroVideo";
import { CloseButton } from "../../Data/images/EnquireNowPopupSvgs";

function PopupVideoPlayer({ src, title, open, setOpen }) {
  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(32, 32, 32, 0.75)",
      zIndex: 100,
      cursor: "pointer",
    },

    content: {
      left: "50%",
      right: "0",
      bottom: "0",
      top: "50%",
      // transform: "translate(-50%, -50%)",
      zIndex: 101,
      position: "absolute",
      background: "#222222d6",
      color: "rgba(255,255,255,0.9)",
      height: "100vh",
      width: "100vw",
      border: "1px solid #ffffff71",
      borderRadius: "10px",
    },
  };

  return (
    <Style>
      <Modal
        isOpen={open}
        contentLabel="Example Modal"
        style={customStyles}
        overlayClassName="overlay"
      >
        <IntroVideo isPopup src={src} />
        <div className="popup-colose-btn" onClick={() => setOpen(false)}>
          <CloseButton />
        </div>
      </Modal>
    </Style>
  );
}

const Style = styled.div`
  /* .overlay {
    z-index: 30;
    background: rgba(0, 0, 0, 0.4);
  } */
`;

export default PopupVideoPlayer;
