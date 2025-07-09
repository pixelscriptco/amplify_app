import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import tippy, { createSingleton } from "tippy.js";
import { isMobile } from "react-device-detect";
import {
  TOWERS,
  TOWERS_LIST,
  TOWERS_SVGS,
  TOWERS_SVGS_WITH_FLOORS,
  UNIT_STATUS,
} from "../../Data";
import { hartland_site_waves } from "../../Data/Screen2PageSvgs";
import SVG from "./SVG";
import ReactDOMServer from "react-dom/server";
import { useInventories } from "../../Hooks";
import { LocationIcon } from "../../Data/icons";
import HoverInfo from "../Molecules/HoverInfo";
import { getCombinedTowerName, getSVGID } from "../../Utility/function";

let singleton = false;

const TippyBody = ({ towerData }) => {
  return (
    <Style>
      <div className="explore-panel">
        <div className="title">
          <LocationIcon />
          {towerData.title} Tower
        </div>
        <div className="box">
          <div className="btn"> {towerData.totalFloors + " Floors"}</div>
          <div className="btn">{towerData.totalUnits + " Apartments"}</div>
          <div className="btn available">
            {towerData.availableUnits} Available
          </div>
        </div>
      </div>
    </Style>
  );
};

const Style = styled.div`
  width: 220px;
  height: fit-content;
  .explore-panel {
    transition: all 200ms linear;
    position: relative;
    margin: 1rem;
    padding: 12px;
    background: var(--background_panel);
    /* backdrop-filter: var(--primary_backdrop_filter); */
    color: #eeeeee;
    border-radius: 8px;
    min-width: 150px;
    top: 0;
    /* left: -170px; */
    .title {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 0.5rem;
      text-align: center;
      font-size: 1.2rem;
      color: #dbf3de;
      svg {
        margin-right: 0.5rem;
        width: 20px;
        height: 20x;
        path {
          stroke: #dbf3de;
        }
      }
    }

    .box {
      /* border: 1px solid #aeb4a7; */
      border-radius: 8px;
      /* text-align: ; */
      cursor: pointer;
      color: #e7e7e3;
      padding: 5px;
    }

    .btn {
      padding: 0 8px;
      margin: 10px 0;
      border-left: 3px solid #aeb4a7;
      font-size: 1rem;
      font-weight: normal;
      /* margin-top: 5px; */
    }
    .btn.available {
      /* border: 1px solid #77a641; */
    }
  }
`;

function TowersSvg(props) {
  const {
    getAllFloorsInTower,
    getAllUnitsInTower,
    getAllAvailableUnitsInTower,
    getAllBookedUnitsInTower,
    getMinMaxSBUInTower,
    getAllUnitTypesInTower,
    getAllUnitStatusInFloor,
  } = useInventories();
  const [towersData, setTowersData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const _towersData = {};
    TOWERS_LIST.forEach(
      (tower) =>
        (_towersData[tower] = {
          title: TOWERS[`${tower}`].title || "Tower",
          totalFloors:
            getAllFloorsInTower(TOWERS[`${tower}`].title).length || 0,
          totalUnits: getAllUnitsInTower(TOWERS[`${tower}`].title).length || 0,
          availableUnits:
            getAllAvailableUnitsInTower(TOWERS[`${tower}`].title).length || 0,
          bookedUnits:
            getAllBookedUnitsInTower(TOWERS[`${tower}`].title).length || 0,
          area: getMinMaxSBUInTower(TOWERS[`${tower}`].title, 1),
          typology: getAllUnitTypesInTower(TOWERS[`${tower}`].title),
        })
    );

    setTowersData(_towersData);
  }, []);

  useEffect(() => {
    if (!towersData) return;
    // destroying any prev instance of tippy

    if (singleton) singleton.destroy();

    const TippyInstances = [];

    const elements = [];
    TOWERS_LIST.forEach((tower) => {
      elements.push({
        ref: document.getElementById(`${tower}-tower-svg`),
        tower: tower,
      });
    });

    for (let i = 0; i < elements.length; i++) {
      if (elements[i].ref._tippy) elements[i]._tippy.destroy();
      const towerData = elements[i];
      for (const floor of towerData.ref.children) {
        let floorNo = parseInt(getSVGID(floor.id));

        // skipping floorno 13
        if (floorNo > 12) floorNo += 1;

        const unitStatus = getAllUnitStatusInFloor(towerData.tower, floorNo);
        floor.classList.remove(UNIT_STATUS.AVAILABLE);
        floor.classList.remove(UNIT_STATUS.BLOCKED);
        floor.classList.remove(UNIT_STATUS.HOLD);
        floor.classList.remove(UNIT_STATUS.BOOKED);

        if (
          unitStatus.filter((status) => status === UNIT_STATUS.AVAILABLE)
            .length > 1
        ) {
          floor.classList.add("Available");
        } else if (
          unitStatus.filter((status) => status === UNIT_STATUS.BOOKED).length >
          1
        ) {
          floor.classList.add("Booked");
        } else if (
          unitStatus.filter((status) => status === UNIT_STATUS.HOLD).length > 1
        ) {
          floor.classList.add("Hold");
        } else if (
          unitStatus.filter((status) => status === UNIT_STATUS.BLOCKED).length >
          1
        ) {
          floor.classList.add("Blocked");
        }
      }
    }

    // creating new tippy for each element
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i];
      const data = towersData[ele.tower];
      const instance = tippy(ele.ref, {
        content: ReactDOMServer.renderToStaticMarkup(
          <HoverInfo
            className="towers-hover-info"
            title={`${data.title} Tower`}
            features={[
              `${data.totalFloors} Floors | ${data.totalUnits} Apartments`,
              `${data.availableUnits} Available | ${data.bookedUnits} Booked`,
              `${data.typology.join(" and ")}`,
              `${data.area.join(" - ")} Sq.Ft`,
            ]}
          />
        ),
      });

      TippyInstances.push(instance);
    }

    singleton = createSingleton(TippyInstances, {
      delay: 0,
      arrow: false,
      moveTransition: "transform 0.2s ease-out",
      allowHTML: true,
      appendTo: document.getElementById("building-page"),
      placement: "right",
    });

    return () => {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].ref._tippy) elements[i].ref._tippy.destroy();
      }
    };
  }, [towersData]);

  return towersData ? (
    TOWERS_LIST.map((tower) => (
      <Link
        to={isMobile ? "" : `tower/${getCombinedTowerName(tower)}`}
        onDoubleClick={() => navigate(`tower/${getCombinedTowerName(tower)}`)}
      >
        <TowerStyle>
          <SVG
            renderer={
              <g id={`${tower}-tower-svg`} className="overlay-can-hide">
                {TOWERS_SVGS_WITH_FLOORS[tower]}
                {/* <path d={TOWERS_SVGS[tower]} className="tower-svg" /> */}
              </g>
            }
          />
        </TowerStyle>
      </Link>
    ))
  ) : (
    <></>
  );
}

const TowerStyle = styled.g`
  g {
    transition: all 200ms linear !important;
    opacity: 0 !important;
    path {
      transition: all 200ms linear !important;
      stroke: transparent !important;
      fill-opacity: 0.8 !important;
      stroke: rgba(0, 0, 0, 0.4) !important;
      fill: transparent;
    }

    :hover {
       {
        opacity: 1 !important;
      }
    }
    /* .tower-svg {
      stroke-width: 2px;
      stroke: white;
      :hover {
        fill: #5bf83c67;
      }
    } */

    .Hold {
      fill: var(--clr-hold-faded);
    }

    .Hold {
      fill: var(--clr-hold-faded);
    }

    .Available {
      fill: var(--clr-available-faded);
    }

    .Booked {
      fill: var(--clr-booked-faded);
    }

    .Blocked {
      fill: var(--clr-blocked-faded);
    }
  }
`;

export default TowersSvg;
