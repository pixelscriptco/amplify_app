import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import SwipeListener from "swipe-listener";

let setupCompleted = false;
let prevX = null;

function RotateTower({ currentIndex, setCurrentIndex, towerType }) {
  const totalFrames = 15;
  const ref = useRef(null);

  const handleRotate = (direction) => {
    if (direction === "left") setCurrentIndex((pre) => (pre + 1) % totalFrames);
    else {
      setCurrentIndex((prev) => (prev === 0 ? totalFrames - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (setupCompleted) return;
    new SwipeListener(ref.current);
    setupCompleted = true;
    ref.current.addEventListener("swiping", (event) => {
      const { x } = event.detail;
      const startX = prevX || x[0];
      const endX = x[1];

      const diff = endX - startX;
      if (Math.abs(diff) > 20) {
        prevX = endX;
        if (diff < 0) handleRotate("left");
        else handleRotate("right");
      }
    });
  }, []);

  return (
    <Style>
      {/* to load all the images in the browser all together */}
      {Array.from({ length: totalFrames }).map((_, index) => (
        <image
          xlinkHref={`${process.env.PUBLIC_URL}/towers-rotation/${towerType}/${index}.jpg`}
          hidden
          alt="tower-image-hidden"
          key={index}
        />
      ))}
      <image
        ref={ref}
        draggable="false"
        xlinkHref={`${process.env.PUBLIC_URL}/towers-rotation/${towerType}/${currentIndex}.jpg`}
        alt="rotate tower"
        onMouseUp={() => {
          prevX = null;
        }}
      />
      <foreignObject width={"100%"} height={"100vh"}>
        <div className="triggers">
          <div
            onClick={() => setCurrentIndex((pre) => (pre + 1) % totalFrames)}
            className="left-trigger"
            title="rotate left"
          >
            <img src={`${process.env.PUBLIC_URL}/up_arrow.svg`} />
          </div>
          <div
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? totalFrames - 1 : prev - 1
              )
            }
            className="right-trigger"
            title="rotate right"
          >
            <img src={`${process.env.PUBLIC_URL}/up_arrow.svg`} />
          </div>
        </div>
      </foreignObject>
    </Style>
  );
}

const Style = styled.g`
  height: 100vh;
  width: 100%;
  user-select: none;
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    user-select: none;
  }
  .triggers {
    position: absolute;
    top: 60vh;
    display: flex;
    justify-content: space-between;
    width: 700px;
    left: 32%;
    div {
      padding: 1rem;
      background: rgba(77, 77, 77, 0.42);
      cursor: pointer;
      border-radius: 30%;
      transition: all 100ms linear;
      :hover {
        background: rgba(77, 77, 77, 0.62);
      }
      img {
        width: 20px;
        height: 20px;
      }
    }

    .left-trigger {
      left: 20%;
      transform: rotateZ(-90deg);
    }
    .right-trigger {
      right: 10%;
      transform: rotateZ(90deg);
    }
  }
`;

export default RotateTower;