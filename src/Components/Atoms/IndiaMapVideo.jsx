import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import Loading from "./Loading";

function IndiaMapVideo({ onFinish }) {
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref || !ref.current) return;

    setTimeout(() => {
      ref.current.play();
    }, [100]);
  }, [ref]);

  return (
    <>
      {loading && <Loading />}
      <Style
        ref={ref}
        muted
        preload="auto"
        onCanPlayThrough={() => setLoading(false)}
        onEnded={onFinish}
      >
        <source
          src="https://dlf-models.s3.ap-south-1.amazonaws.com/india-map.mp4"
          type="video/mp4"
        />
      </Style>
    </>
  );
}

const Style = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

export default IndiaMapVideo;
