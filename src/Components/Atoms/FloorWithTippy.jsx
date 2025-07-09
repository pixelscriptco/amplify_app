import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";

import styled from "styled-components";
import tippy, { createSingleton } from "tippy.js";
import "tippy.js/animations/shift-toward.css";
import FloorNoIndicator from "../Molecules/FloorNoIndicator";
import { useNavigate } from "react-router-dom";
import { getSVGID } from "../../Utility/function";
import TowerName from "./TowerName";

let singleton = false;

function FloorsWithTippy({
  children,
  floorsData,
  frameIndex = 14,
  towerNames,
}) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const getTowerNameFromSide = (side) => {
    if (side === "left") return towerNames[0];
    if (side === "right") return towerNames[1];
  };

  const tippySetup = () => {
    if (!ref.current) return;

    if (!floorsData?.[towerNames[1]]?.length > 0) return;

    if (singleton) singleton.destroy();

    const TippyInstances = [];

    // select all the frames
    const frames = ref.current.children;

    // select current frame
    const currentFrame = Array.from(frames).find(
      (frame) => frame.id === `frame-${frameIndex}`
    );

    if (!currentFrame) return;

    for (const frame of Array.from(currentFrame.children)) {
      // selecting single tower (left or right) from 2
      //   const frame = Array.from(currentFrame.children).find((_frame) =>
      //   _frame.id.includes(getTowerSide())
      // );

      if (!["left", "right"].includes(frame.id)) continue;

      // selecting all the floors
      const floors = frame.children;
      const currentTower = getTowerNameFromSide(frame.id);

      for (let i = 0; i < floors.length; i++) {
        const floor = floors[i];

        if (floor._tippy) floor._tippy.destroy();

        // floor id might contain a '-'
        let floorNo = parseInt(getSVGID(floor.id));

        // skipping floorno 13
        if (floorNo > 12) floorNo += 1;

        const instance = tippy(floor, {
          content: ReactDOMServer.renderToStaticMarkup(
            <FloorNoIndicator
              tower={currentTower}
              floorData={floorsData[currentTower]?.find(
                (flr) => flr.floorNumber === parseInt(floorNo)
              )}
            />
          ),
        });

        TippyInstances.push(instance);
      }
    }

    singleton = createSingleton(TippyInstances, {
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.2s ease-out",
      allowHTML: true,
      placement: "left-start",
      appendTo: document.getElementById("tower-page-svg-wrapper"),
    });
  };

  useEffect(() => {
    setTimeout(() => {
      tippySetup();
    }, 100);

    return () => {
      if (!ref.current) return;
      for (let i = 0; i < ref.current.children.length; i++) {
        if (ref.current.children[i]._tippy)
          ref.current.children[i]._tippy.destroy();
      }
    };
  }, [floorsData, frameIndex, towerNames]);

  return (
    <Style
      ref={ref}
      // onClick={(e) => {
      //   if (e.target.nodeName !== "path") return;
      //   let floorNo = getSVGID(e.target.parentElement.id);
      //   if (parseInt(floorNo) > 12) floorNo = parseInt(floorNo) + 1;
      //   if (!floorNo) return;
      //   navigate(`floor/${floorNo}`);
      // }}
    >
      {children}
    </Style>
  );
}

export default FloorsWithTippy;

const Style = styled.g`
  cursor: pointer;
  user-select: all;
`;
