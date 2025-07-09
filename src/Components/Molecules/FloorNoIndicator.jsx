import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LocationIcon } from "../../Data/icons";
import {
  getFormalCurrencyFromNum,
  getFormalNameFromNumber,
} from "../../Utility/function";

const getNearFloors = (floor) => {
  const floors = [
    "G",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
  ];
  const nearFloors = [];
  for (let i = 0; i < floors.length; i++) {
    if (Math.abs(floors.indexOf(floor.toString()) - i) <= 2) {
      nearFloors.push(floors[i]);
    }
  }
  return nearFloors.reverse();
};

const getUnitStatusText = (data) => {
  const { available, hold, booked, total, blocked } = data;
  const total_count = total.length;
  if (available === total_count) return "All Available";
  if (hold === total_count) return "All Hold";
  if (booked === total_count) return "All Booked";
  if (blocked === total_count) return "All Blocked";

  let result = [];

  if (blocked > 0) result.push(`${blocked} Blocked`);

  if (hold > 0) result.push(`${hold} Hold`);

  if (booked > 0) result.push(`${booked} Booked`);

  if (available > 0) result.push(`${available} Available`);

  return result.join(",");
};

export const FloorInfo = ({ exploreTop, floorData, tower }) => (
  <>
    <div className="explore-panel" style={{ top: exploreTop }}>
      <div className="title">
        {" "}
        <LocationIcon />
        {`${tower.toUpperCase()} Tower `}
        {getFormalNameFromNumber(floorData.floorNumber) + " Floor"}
      </div>
      <div className="btn" onclick={() => alert("ok")}>
        {floorData.total.length} Apartments
      </div>
      <div className="btn available" onclick={() => alert("ok")}>
        {getUnitStatusText(floorData)}
      </div>
      {/* <div className="btn" onclick={() => alert("ok")}>
          {`₹ ${getFormalCurrencyFromNum(
            floorData.cost.minTotalCost
          )} - ${getFormalCurrencyFromNum(floorData.cost.maxTotalCost)}`}
        </div> */}

      <div className="btn" onclick={() => alert("ok")}>
        {`${floorData.typology.join(" and ")}`}
      </div>
      <div className="btn" onclick={() => alert("ok")}>
        {`${floorData.sizes.join(" - ")} SQ. FT.`}
      </div>
    </div>
  </>
);

function FloorNoIndicator({ floorData, tower = { tower } }) {
  const floorNo = floorData?.floorNumber || "G";
  const floors = getNearFloors(floorNo);
  const [hoveredFloor, setHoveredFloor] = useState(floorNo);
  const [exploreTop, setExploreTop] = useState(0);
  const single_floor_no_height = 35;

  useEffect(() => {
    setExploreTop(single_floor_no_height * floors.indexOf(hoveredFloor));
  }, [hoveredFloor]);

  return floorData ? (
    <Style id="floor-no-indicator" style={{ pointerEvents: "all" }}>
      <FloorInfo exploreTop={exploreTop} floorData={floorData} tower={tower} />
      <div className="floors">
        {floors.map((floor) => (
          <div
            className={`floor ${floor == hoveredFloor ? "hovered-floor" : ""} ${
              floor == floorNo ? "current-floor" : ""
            }`}
          >
            {floor}
          </div>
        ))}
      </div>
    </Style>
  ) : null;
}

export default FloorNoIndicator;

const Style = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -250px;
  transform: translateY(-50%);
  padding-right: 10px;

  .explore-panel {
    transition: all 200ms linear;
    position: relative;
    margin: 1rem;
    padding: 12px;
    background-color: var(--panel_background) !important;
    color: rgb(224, 219, 219) !important;
    border-radius: 8px;
    min-width: 200px;
    top: 0;
    /* left: -170px; */
    .title {
      display: flex;
      align-items: center;
      /* justify-content: center; */
      margin-bottom: 1rem;
      /* text-align: center; */
      font-size: 1rem;
      color: #cae9f3;
      opacity: 0.8;
      padding-left: 0.3rem;
      svg {
        margin-right: 0.5rem;
        width: 18px;
        height: 18x;
        path {
          stroke: #cae9f3;
        }
      }
    }

    .btn {
      background-color: #5959597a !important;
      margin: 0.3rem 0 !important;
      padding: 0.5rem 1rem !important;
      border-radius: 5px !important;
      width: 100% !important;
      font-size: 14px !important;
    }
    .btn.available {
      /* border: 1px solid #77a641; */
    }
  }

  .floors {
    display: flex;
    flex-direction: column;
    .floor {
      cursor: pointer;
      color: #afb9a4;
      padding: 8px;
      border-radius: 4px;
      background-color: #09090989;
      margin: 0.4rem 0;
      transition: all 200ms linear;
      display: grid;
      place-items: center;
      width: 30px;
    }

    .current-floor {
      :after {
        content: "";
        position: absolute;
        top: 50%;
        left: 100%;
        /* margin-left: -10px; */
        border-width: 7px;
        border-style: solid;
        transform: translateY(-50%);
        border-color: transparent transparent transparent var(--blue-theme);
      }
    }

    .floor.hovered-floor {
      background: var(--blue-theme);
      position: relative;
      color: var(--color_text);
    }
  }
`;
