import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import IndiaMapVideo from "../Components/Atoms/IndiaMapVideo";
import Navigator from "../Components/Molecules/Navigator";
import IntroVideo from "../Components/Atoms/IntroVideo";

function IntroVideoPage(props) {
    console.log('here');
    
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isVideoFinished) {
      navigate("/smart-world");
    }
  }, [isVideoFinished]);

  return (
    <Style>
      <Navigator
        className="navigator"
        nextPages={[
          {
            title: "ONE DXP",
            path: "/smart-world",
          },
        ]}
      />
      <IntroVideo onFinish={() => setIsVideoFinished(true)} />;
      <div onClick={() => navigate("/smart-world")} className="skip-btn">
        Skip
      </div>
    </Style>
  );
}

const Style = styled.div`
  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
  }
  .skip-btn {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    font-size: 1.2rem;
    color: var(--color_text);
    width: fit-content;
    margin: auto;
    position: absolute;
    box-shadow: 0 0 1px #07070756;
    padding: 0.5rem 1rem;
    font-weight: 500;
    border-radius: 5px;
    background: #252525;
    opacity: 0.8;
    transition: all 100ms ease-in-out;
    border: none;
    z-index: 100;
    cursor: pointer;
    :hover {
      opacity: 0.9;
    }
  }
`;

export default IntroVideoPage;
