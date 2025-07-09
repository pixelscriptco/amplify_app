import React from "react";
import { reverse as reversePath } from "svg-path-reverse";

const colors = [
  "#ebe8e8e5",
  "#f88383e4",
  "#83e7f8e3",
  "#f8e883e3",
  "#83f883e3",
  "#f883e7e3",
  "#414141e3",
  "#e99343e3",
];

function CarArrow({ path, dur = "6s", reverse }) {
  const reversedPath = reversePath(path);
  return (
    <g style={{ pointerEvents: "none" }}>
      {/* filling random color */}
      <path
        fill={colors[Math.floor(Math.random() * colors.length)]}
        stroke="white"
        strokeWidth="0.8"
        d={reverse ? "M0,0 L5,-5 -10,0 5,5  Z" : "M-5,-5 L10,0 -5,5 0,0 Z"}
      >
        <use href="#theMotionPath" />
        <animateMotion
          dur={dur}
          repeatCount="indefinite"
          rotate={reverse ? "auto-reverse" : "auto"}
          path={reverse ? reversedPath : path}
        ></animateMotion>
      </path>
    </g>
  );
}

export default CarArrow;

// d="M-5,-5 L10,0 -5,5 0,0 Z"
