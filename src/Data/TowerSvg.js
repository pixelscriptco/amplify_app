import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { UNIT_STATUS } from ".";
import FloorsWithTippy from "../Components/Atoms/FloorWithTippy";
import { AppContext } from "../Contexts/AppContext";
import { useInventories, useMapFilter } from "../Hooks";
import RotateTower from "../Pages/RotateTower";
import { getSVGID } from "../Utility/function";
import { useNavigate } from "react-router-dom";
import Compass from "../Components/Atoms/Compass";
import { COMPASS_ANGLES } from "../Utility/Constants";
import TowerName from "../Components/Atoms/TowerName";
import { isMobile } from "react-device-detect";
import axiosInstance from "../Utility/axios";
import { useParams } from "react-router-dom";

const getUnitNoFromFigmaRef = (figmaRef) => {
  switch (figmaRef) {
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 4;
    case 4:
      return 1;
    default:
      return 0;
  }
};

export const TowerSvg = ({ towerName }) => {
  const {
    getAllFloorsInTower,
    getAllUnitsInFloor,
    getAllUnitStatusInFloor,
    getMinMaxSBUInFloor,
    getMinMaxTotalCostInFloor,
    getAllUnitTypesInTower,
  } = useInventories();

  const ref = useRef(null);
  const { project,tower } = useParams();
  const navigate = useNavigate();
  const [floorsData, setFloorsData] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [towerSvg, setTowerSvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { flatFilterPriceValues, flatFilterSizeValues } = useContext(AppContext);
  const { activeMapFilterIds } = useMapFilter();

  // Fetch tower SVG data
  useEffect(() => {
    const fetchTowerSvg = async () => {
      try {        
        setLoading(true);
        const response = await axiosInstance.get(`/app/tower/${project}/${tower}`);                
        setTowerSvg(response.data.tower_plans);
      } catch (err) {
        console.error('Error fetching tower SVG:', err);
        setError('Failed to load tower visualization');
      } finally {
        setLoading(false);
      }
    };

    fetchTowerSvg();
  }, [towerName]);

  // Update floors data
  useEffect(() => {
    if (!towerSvg) return;

    setFloorsData((prev) => ({
      ...prev,
      [towerName]: getAllFloorsInTower(towerName).map((floor) => ({
        floorNumber: floor,
        available: getAllUnitStatusInFloor(towerName, floor).filter(
          (status) => status === UNIT_STATUS.AVAILABLE
        ).length,
        blocked: getAllUnitStatusInFloor(towerName, floor).filter(
          (status) => status === UNIT_STATUS.BLOCKED
        ).length,
        booked: getAllUnitStatusInFloor(towerName, floor).filter(
          (status) => status === UNIT_STATUS.BOOKED
        ).length,
        hold: getAllUnitStatusInFloor(towerName, floor).filter(
          (status) => status === UNIT_STATUS.HOLD
        ).length,
        total: getAllUnitsInFloor(towerName, floor),
        sizes: getMinMaxSBUInFloor(towerName, floor),
        cost: getMinMaxTotalCostInFloor(towerName, floor),
        typology: getAllUnitTypesInTower(towerName, floor),
      })),
    }));
  }, [towerName, towerSvg]);

  // Handle SVG rendering and interactions
  useEffect(() => {
    if (!ref.current || !towerSvg) return;

    // Clear existing tippy instances
    for (let i = 0; i < ref.current.children.length; i++) {
      if (ref.current.children[i]._tippy)
        ref.current.children[i]._tippy.destroy();
    }

    // Get frames from SVG
    const frames = ref.current.children[1].children;
    let currentFrame;

    // Show only current frame
    Array.from(frames).forEach((frame) => {
      if (frame.id === `frame-${currentFrameIndex}`) {
        currentFrame = frame;
        frame.style.display = "block";
      } else frame.style.display = "none";
    });

    if (!currentFrame) return;

    // Handle tower frames (left/right)
    const towerFrames = [];
    Array.from(currentFrame.children).forEach((_frame) => {
      if (["left", "right"].includes(_frame.id)) {
        let frame = _frame;
        frame.style.display = "block";
        towerFrames.push(frame);
      } else _frame.style.display = "none";
    });

    // Process each tower frame
    for (const frame of towerFrames) {
      if (!frame) return;

      const currentTower = frame.id === "left" ? towerName[0] : towerName[1];
      const floors = frame.children;

      // Process each floor
      for (let i = 0; i < floors.length; i++) {
        const floor = floors[i];
        if (floor._tippy) floor._tippy.destroy();

        let floorNo = parseInt(getSVGID(floor.id));
        if (floorNo > 12) floorNo += 1;

        // Process units in floor
        const units = floor.children;
        for (let j = 0; j < units.length; j++) {
          const unit = units[j];
          
          // Add click/double-click handlers
          if (isMobile) {
            unit.addEventListener("dblclick", (e) => {
              e.stopPropagation();
              navigate(`/smart-world/tower/${currentTower}/floor/${floorNo}`);
            });
          } else {
            unit.addEventListener("click", (e) => {
              e.stopPropagation();
              navigate(`/smart-world/tower/${currentTower}/floor/${floorNo}`);
            });
          }

          // Update unit status
          const unitRefNo = parseInt(getSVGID(unit.id));
          const unitNo = getUnitNoFromFigmaRef(unitRefNo);
          const unitData = getAllUnitsInFloor(currentTower, floorNo)[unitNo - 1];
          
          unit.classList.add(unitData?.Status);
          if (isUnitActive(unitData, floorNo)) {
            unit.classList.add("active");
          } else {
            unit.classList.remove("active");
          }
        }
      }
    }
  }, [
    flatFilterPriceValues,
    flatFilterSizeValues,
    activeMapFilterIds,
    currentFrameIndex,
    towerName,
    towerSvg
  ]);

  const isUnitActive = (unit, floorNo) => {
    if (floorNo === 0) return true;
    if (!activeMapFilterIds.includes(unit.UnitType)) return false;
    
    const flatTotalCost = unit.TotalCost;
    const flatSBU = unit.SBU;
    
    if (
      !(
        flatTotalCost <= flatFilterPriceValues[1] &&
        flatTotalCost >= flatFilterPriceValues[0]
      ) ||
      !(
        flatSBU <= flatFilterSizeValues[1] && flatSBU >= flatFilterSizeValues[0]
      )
    )
      return false;
    return true;
  };

  const getTowerType = () => {
    if (["a-b", "g-h"].includes(towerName.join("-").toLowerCase()))
      return "type1";
    return "type2";
  };

  if (loading) {
    return <div>Loading tower visualization...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return towerName ? (
    <>
      <TowerName
        towerName={towerName.toUpperCase()}
        frameIndex={currentFrameIndex}
      />
      <Compass
        angle={
          COMPASS_ANGLES.TOWERS[towerName.toLowerCase()] +
          currentFrameIndex * 24
        }
      />
      <Style
        viewBox="0 0 1920 1080"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        ref={ref}
        dangerouslySetInnerHTML={{ __html: towerSvg }}
      >
        <RotateTower
          currentIndex={currentFrameIndex}
          setCurrentIndex={setCurrentFrameIndex}
          towerType={getTowerType()}
        />
        {floorsData && (
          <FloorsWithTippy
            floorsData={floorsData}
            frameIndex={currentFrameIndex}
            towerName={towerName}
          >
            {towerSvg}
          </FloorsWithTippy>
        )}
      </Style>
    </>
  ) : null;
};

const Style = styled.svg`
  height: 100%;
  width: 100%;
  fill: transparent;
  g {
    path {
      transition: all 200ms linear !important;
      stroke: transparent !important;
      opacity: 0 !important;
      fill-opacity: 0.8 !important;
      stroke: rgba(0, 0, 0, 0.4) !important;
      fill: transparent;
      :hover {
        fill: transparent !important;
        stroke: rgba(255, 255, 255, 0.8);
        transform: scale(1.001);
      }
      &.active {
        opacity: 1 !important;
      }
    }

    .active.Hold {
      fill: var(--clr-hold-faded);
    }

    .active.Available {
      fill: var(--clr-available-faded);
    }

    .active.Booked {
      fill: var(--clr-booked-faded);
    }

    .active.Blocked {
      fill: var(--clr-blocked-faded);
    }
  }
`;