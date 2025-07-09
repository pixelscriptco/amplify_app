import React from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { useRef } from "react";
import UnitMark from "../Atoms/UnitMark";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlatNoPlaceholders, FlatSvgs } from "../../Data/flatSvgs";
import { isMobile } from "react-device-detect";

const UNIT_NUMBERS = [1, 2, 3, 4];

function FloorSvg({
  onMouseEnterUnit,
  selectedUnit = 1,
  isActive,
  project,
  units,
  tower,
  floor,
}) {
  const ref = useRef(null);
  const [floorNoPositions, setFloorNoPositions] = useState({});
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!ref) return;
  //   let svgs = ref.current.children[0];

  //   for (let i = 0; i < svgs.children.length; i++) {
  //     if (svgs.children[i]._tippy) svgs.children[i]._tippy.destroy();
  //   }
  //   setTimeout(() => {
  //     if (!ref || !svgs) return;

  //     if (singleton) return;

  //     let tippyInstances = [];
  //     for (let i = 0; i < svgs.children.length; i++) {
  //       const ele = svgs.children[i];

  //       const unitNo = parseInt(ele.dataset.unit) - 1;
  //       if (!unitNo) continue;
  //       const instance = tippy(ele, {
  //         content: ReactDOMServer.renderToStaticMarkup(
  //           <HoverInfo
  //             features={[
  //               `${units[unitNo].Status}`,
  //               `${units[unitNo].SBU} Sq. Ft`,
  //               `${units[unitNo].TotalCost}`,
  //             ]}
  //             title={`${units[unitNo].id}`}
  //           />
  //         ),
  //       });

  //       tippyInstances.push(instance);
  //     }

  //     singleton = createSingleton(tippyInstances, {
  //       delay: 0,
  //       arrow: false,
  //       placement: "right",
  //       moveTransition: "transform 0.1s ease-out",
  //       allowHTML: true,
  //       duration: [0, 1000],
  //       offset: [-40, 30],
  //     });
  //   }, 50);

  //   return () => {
  //     if (singleton) singleton.destroy();
  //     if (!svgs) return;
  //     for (let i = 0; i < svgs.length; i++) {
  //       if (svgs[i]._tippy) svgs[i]._tippy.destroy();
  //     }
  //   };
  // }, [ref, isActive]);

  // place floor no indicators on the map from placeholder data
  const placeFloorNoIndicators = () => {
    const getPathPosition = (id) =>
      document.getElementById(id).getBoundingClientRect();

    const positions = [];
    UNIT_NUMBERS.forEach((unit) => {
      const { x, y } = getPathPosition(`floor_no_place_${unit}`);
      positions[unit] = {
        x: x + 15,
        y: y + 10,
      };
    });
    setFloorNoPositions(positions);
  };

  useEffect(() => {
    placeFloorNoIndicators();

    const onResize = () => {
      // if (exploreView) return;
      placeFloorNoIndicators();
    };
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {floorNoPositions[1] &&
        UNIT_NUMBERS.map((unit) => (
          <UnitMark
            isActive={isActive(units[unit - 1])}
            top={floorNoPositions[unit].y + "px"}
            left={floorNoPositions[unit].x + "px"}
            unit={units[unit - 1].FlatNumber}
            selectedUnit={selectedUnit}
            isSelected={selectedUnit === unit}
            onExploreClick={() => {
              navigate(
                project + "/tower/" +
                  tower +
                  "/floor/" +
                  floor +
                  "/unit/" +
                  units[unit - 1].FlatNumber
              );
            }}
          />
        ))}

      <Style
        width="3408"
        height="2389"
        viewBox="0 0 3408 2389"
        fill="transparent"
        onClick={(e) => {
          if (e.target.tagName !== "path") return;

          const unit = e.target.dataset.unit;
          if (!unit) return;

          // onMouseEnterUnit(parseInt(unit));
          // e.stopPropagation();
        }}
        ref={ref}
      >
        <g id="units-svg">
          {Object.keys(FlatSvgs[tower]).map((unitNo) =>
            isActive(units[unitNo - 1]) ? (
              <path
                d={FlatSvgs[tower][unitNo].d}
                data-unit={`${unitNo}`}
                id={`flat-${unitNo}`}
                className={`${
                  parseInt(selectedUnit) === parseInt(unitNo) && "selected"
                } ${units[unitNo - 1].Status}`}
                onMouseEnter={(e) => {
                  if (isMobile) return;
                  const unit = e.target.dataset.unit;
                  if (!unit) return;
                  onMouseEnterUnit(parseInt(unit));
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  if (!isMobile) return;
                  const unit = e.target.dataset.unit;
                  if (!unit) return;
                  onMouseEnterUnit(parseInt(unit));
                  e.stopPropagation();
                }}
                // onMouseLeave={() => {
                //   onMouseEnterUnit(null);
                // }}
                // onMouseLeave={onMouseLeaveUnit}
              />
            ) : (
              <></>
            )
          )}
        </g>
        {/* place holder for unit number */}
        {FlatNoPlaceholders[tower]}
      </Style>
    </>
  );
}

export default FloorSvg;

const Style = styled.svg`
  height: 100%;
  width: 100%;
  /* display: none; */
  /* background: red; */
  path[data-unit] {
    cursor: pointer;
    transition: all 200ms;
    fill-opacity: 0.6;
    fill: var(--clr-available);
    stroke: #151616d4;
    stroke-width: 2px;
    /* :hover {
      fill: transparent;
    } */
  }

  /* path.Available {
    fill: #53fa53;
  } */

  path[data-placeholder] {
    pointer-events: none;
  }

  path[data-unit].Hold {
    fill: var(--clr-hold-faded) !important;
  }

  path[data-unit].Hold {
    fill: var(--clr-hold-faded);
  }

  path[data-unit].Available {
    fill: var(--clr-available-faded);
  }

  path[data-unit].Booked {
    fill: var(--clr-booked-faded);
  }

  path[data-unit].Blocked {
    fill: var(--clr-blocked-faded);
  }

  path[data-unit].selected {
    fill-opacity: 0;
    stroke: black;
    stroke-width: 4px;
    :hover {
      fill-opacity: 0;
    }
  }
`;
