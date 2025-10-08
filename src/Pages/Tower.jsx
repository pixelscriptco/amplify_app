import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import StaticIconButton from "../Components/Atoms/IconButton";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import { FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { useParams, useNavigate } from "react-router-dom";
import TowerRotateInstruction from "../Components/Atoms/TowerRotateInstruction";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import axiosInstance from "../Utility/axios";
import Tippy from "@tippyjs/react";
import { Modal, Box, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MediaLibrary from "../Components/Molecules/MediaLibrary";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Sidebar from "../Components/Sidebar";

function Tower(props) {
  const { project, tower } = useParams();
  const navigate = useNavigate();
  const [showOverlays, setShowOverlays] = useState(true);
  const [towerSvg, setTowerSvg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floorData, setFloorData] = useState({});
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [towerData, setTowerData] = useState(null);
  const [units, setUnits] = useState([]);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState(null);

  // Construction Updates Modal State
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [updatesError, setUpdatesError] = useState(null);

  const fetchUpdates = async () => {
    if (!towerData?.id) return;
    setUpdatesLoading(true);
    setUpdatesError(null);
    try {
      const response = await axiosInstance.get(
        `/app/project/${project}/updates`
      );
      setUpdates(response.data.updates || []);
    } catch (err) {
      setUpdatesError("Failed to load updates");
    } finally {
      setUpdatesLoading(false);
    }
  };

  const handleOpenUpdates = () => {
    setUpdatesOpen(true);
    fetchUpdates();
  };
  const handleCloseUpdates = () => setUpdatesOpen(false);

  useEffect(() => {
    toogleHideOverlays(showOverlays);
    const fetchTowerSvg = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/app/tower/${project}/${tower}`
        );
        
        // Sort tower plans by order
        const { id, name, floor_count, direction, units } = response.data;
        setTowerData({
          id,
          name,
          floor_count,
          direction,
        });
        setUnits(units || []);
        const sortedPlans = response.data.tower_plans;

        const updatedPaths = await Promise.all(
          // FIX: await all promises
          sortedPlans.map(async (plan) => {
            try {
              const svgResp = await fetch(plan.svg_url);
              const svgText = await svgResp.text();
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
              const paths = Array.from(svgDoc.querySelectorAll("path")).reverse();
              
              return {
                ...plan,
                paths: paths,
              };
            } catch (error) {
              console.error(
                `Error processing plan ID ${plan.id || "unknown"}:`,
                error
              );
              return {
                ...plan,
                paths: [],
              };
            }
          })
        );

        setTowerSvg(updatedPaths);
      } catch (err) {
        console.error("Error fetching tower SVG:", err);
        setError("Failed to load tower visualization");
      } finally {
        setLoading(false);
      }
    };

    fetchTowerSvg();
  }, [showOverlays, project, tower]);

  const renderFloorDetails = (floor) => {
    if (!floor || !floor.stats) return null;

    const unitTypes = Object.keys(floor.stats.unit_types).join(" and ");

    const areas = Object.values(floor.stats.unit_areas)
      .map((area) => area)
      .filter(Boolean);
    let areaRange = "";
    if (areas.length > 0) {
      areaRange = areas.join(" - ") + " Sq.Ft";
    }

    return (
      <div className="desc_wrap">
        <div className="main_wrap_title pad_btm_15px_brd">
          <span className="dd_flex clr_white">
            <svg
              width="22px"
              height="22px"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              <path d="M192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L272 528L272 448C272 430.3 286.3 416 304 416L336 416C353.7 416 368 430.3 368 448L368 528L448 528C456.8 528 464 520.8 464 512L464 128C464 119.2 456.8 112 448 112L192 112zM128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z" />
            </svg>
          </span>
          <span className="cap_text">
            Tower {tower} | {floor.name}{" "}
          </span>
        </div>


          <div className="main_tab_block grid_block  jusT_spacebtw" style={{ paddingBottom: '3px'}}>
            <div className="flors_icons">
              <span className="dd_flex">
                <svg
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  <path d="M128 176C119.2 176 112 183.2 112 192L112 448C112 456.8 119.2 464 128 464L512 464C520.8 464 528 456.8 528 448L528 192C528 183.2 520.8 176 512 176L128 176zM64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM224 384C224 401.7 209.7 416 192 416C174.3 416 160 401.7 160 384C160 366.3 174.3 352 192 352C209.7 352 224 366.3 224 384zM192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256C224 273.7 209.7 288 192 288zM296 232L456 232C469.3 232 480 242.7 480 256C480 269.3 469.3 280 456 280L296 280C282.7 280 272 269.3 272 256C272 242.7 282.7 232 296 232zM296 360L456 360C469.3 360 480 370.7 480 384C480 397.3 469.3 408 456 408L296 408C282.7 408 272 397.3 272 384C272 370.7 282.7 360 296 360z"></path>
                </svg>
              </span>
              {floor.stats.available_units} Available
            </div>            
            <div className="flors_icons">
              <span className="dd_flex">
                <svg
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                >
                  <path d="M192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L272 528L272 448C272 430.3 286.3 416 304 416L336 416C353.7 416 368 430.3 368 448L368 528L448 528C456.8 528 464 520.8 464 512L464 128C464 119.2 456.8 112 448 112L192 112zM128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z"></path>
                </svg>
              </span>
              {floor.stats.total_units} Apartments
            </div>
              <div className="flors_icons">
                <span className="dd_flex">
                  <svg
                    width="16px"
                    height="16px"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                  >
                    <path d="M320 112C434.9 112 528 205.1 528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM404.4 276.7C411.4 265.5 408 250.7 396.8 243.6C385.6 236.5 370.8 240 363.7 251.2L302.3 349.5L275.3 313.5C267.3 302.9 252.3 300.7 241.7 308.7C231.1 316.7 228.9 331.7 236.9 342.3L284.9 406.3C289.6 412.6 297.2 416.2 305.1 415.9C313 415.6 320.2 411.4 324.4 404.6L404.4 276.6z"></path>
                  </svg>
                </span>
                {floor.stats.booked_units} Booked
              </div>
          </div>


        <div className="main_bfox_wrap">

          {
            (
              (floor.stats.unit_types && Object.keys(floor.stats.unit_types).length) ||
              (areas && areas.length)
            ) ? (
              <div className="main_tab_block pad_btnwq grid_block" style={{ paddingBottom : '0px'}}>
                {Object.keys(floor.stats.unit_types).length ? (
                  <>
                    {Object.keys(floor.stats.unit_types).map((ut, index, array) => {
                      // const [number, label] = ut.split(" ");
                      return (
                        <React.Fragment key={ut}>
                        <div className="flors_icons">
                            <span className="dd_flex">
                              <svg
                                width="16px"
                                height="16px"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                              >
                                <path d="M64 96C81.7 96 96 110.3 96 128L96 352L320 352L320 224C320 206.3 334.3 192 352 192L512 192C565 192 608 235 608 288L608 512C608 529.7 593.7 544 576 544C558.3 544 544 529.7 544 512L544 448L96 448L96 512C96 529.7 81.7 544 64 544C46.3 544 32 529.7 32 512L32 128C32 110.3 46.3 96 64 96zM144 256C144 220.7 172.7 192 208 192C243.3 192 272 220.7 272 256C272 291.3 243.3 320 208 320C172.7 320 144 291.3 144 256z" />
                              </svg>
                            </span>
                            {ut}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </>
                ) : null}

                {areas && areas.length ? (
                  <>
                    {areas.map((ut, index, array) => (
                      <React.Fragment key={ut}>
                      <div className="flors_icons">
                          <span className="dd_flex">
                            <svg
                              width="16px"
                              height="16px"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 640 640"
                            >
                              <path d="M512 112C520.8 112 528 119.2 528 128L528 512C528 520.8 520.8 528 512 528L128 528C119.2 528 112 520.8 112 512L112 128C112 119.2 119.2 112 128 112L512 112zM128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L512 576C547.3 576 576 547.3 576 512L576 128C576 92.7 547.3 64 512 64L128 64z" />
                            </svg>
                          </span>
                          {ut} SqFt
                        </div>
                      </React.Fragment>
                    ))}
                  </>
                ) : null}
              </div>
            ) : null
          }
        </div>
      </div>
    );
  };

  const handleFloorHover = async (floorName, event) => {    
    floorName = /^floor-/i.test(floorName)?floorName: `Floor-${floorName}`;
    const floorId = floorName.replace(/floor-/i, "");
    setHoveredFloor(floorId);

    // Calculate modal position based on mouse position
    const x = event.clientX;
    const y = event.clientY;
    const windowWidth = window.innerWidth;

    // Position modal on the right if mouse is on left half of screen, otherwise on left
    const modalX = x < windowWidth / 2 ? x + 20 : x - 420; // 400px modal width + 20px offset

    setModalPosition({ x: modalX, y: y - 100 }); // Offset Y by half modal height
    
    // Fetch tower data if not already fetched
    if (!floorData[floorId]) {
      try {
        const response = await axiosInstance.get(
          `/app/tower/${towerData.id}/floor/${floorName}`
        );
        setFloorData((prev) => ({
          ...prev,
          [floorId]: response.data,
        }));
      } catch (err) {
        console.error("Error fetching floor data:", err);
      }
    }
  };

  const handleTowerLeave = () => {
    setHoveredFloor(null);
  };

  const handleUnitSelection = (unitDetails) => {
    setSelectedUnitFilter(unitDetails);
  };

  // Sort plans by order
  const sortedPlans = [...towerSvg].sort((a, b) => a.order - b.order);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRotateLeft = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sortedPlans.length) % sortedPlans.length
    );
  };
  const handleRotateRight = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedPlans.length);
  };

  // Direction to angle mapping
  const directionToAngle = {
    North: 0,
    "North-East": 45,
    East: 90,
    "South-East": 135,
    South: 180,
    "South-West": 225,
    West: 270,
    "North-West": 315,
  };

  return (
    <Style>
      <Navigator
        className="navigator"
        prevPages={[
          {
            title: `${project.toUpperCase()}`,
            path: `/${project}`,
          },
        ]}
        currentPage={{
          title: `Tower ${tower.toUpperCase()}`,
          path: `tower/${tower}`,
        }}
      />
      {/*<Sidebar />*/}
      <UnitStatusLegend />
      <div className="svg_block_filter">
        <div className="filter_icon" onClick={() => setShowFilter((showFilter) => !showFilter)}>
          <svg
            width="20px"
            height="20px"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
          >
            <path d="M96 128C83.1 128 71.4 135.8 66.4 147.8C61.4 159.8 64.2 173.5 73.4 182.6L256 365.3L256 480C256 488.5 259.4 496.6 265.4 502.6L329.4 566.6C338.6 575.8 352.3 578.5 364.3 573.5C376.3 568.5 384 556.9 384 544L384 365.3L566.6 182.7C575.8 173.5 578.5 159.8 573.5 147.8C568.5 135.8 556.9 128 544 128L96 128z"></path>
          </svg>
        </div>
        <span style={{ display: !showFilter ? 'block' : 'none'}} class="label_tip"> Filter</span>
      </div>
      
      <div className="left-panels fltrr">
        <CollapsiblePanel className="filters" title={"Filters"} show={showFilter}>
        <div className="cose_btn cose"
         onClick={() => setShowFilter((showFilter) => !showFilter)} 
         style={{ cursor: "pointer" }}>
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                <title>close-refreshed</title>
                <path
                  d="M11.9998 13.4L7.0998 18.3C6.91647 18.4833 6.68314 18.575 6.3998 18.575C6.11647 18.575 5.88314 18.4833 5.6998 18.3C5.51647 18.1167 5.4248 17.8833 5.4248 17.6C5.4248 17.3167 5.51647 17.0833 5.6998 16.9L10.5998 12L5.6998 7.09999C5.51647 6.91665 5.4248 6.68332 5.4248 6.39999C5.4248 6.11665 5.51647 5.88332 5.6998 5.69999C5.88314 5.51665 6.11647 5.42499 6.3998 5.42499C6.68314 5.42499 6.91647 5.51665 7.0998 5.69999L11.9998 10.6L16.8998 5.69999C17.0831 5.51665 17.3165 5.42499 17.5998 5.42499C17.8831 5.42499 18.1165 5.51665 18.2998 5.69999C18.4831 5.88332 18.5748 6.11665 18.5748 6.39999C18.5748 6.68332 18.4831 6.91665 18.2998 7.09999L13.3998 12L18.2998 16.9C18.4831 17.0833 18.5748 17.3167 18.5748 17.6C18.5748 17.8833 18.4831 18.1167 18.2998 18.3C18.1165 18.4833 17.8831 18.575 17.5998 18.575C17.3165 18.575 17.0831 18.4833 16.8998 18.3L11.9998 13.4Z"
                  fill="currentColor"
                />
              </svg>
          </div>

          <UnitTypeFilter 
            project={project}
            tower={tower.toUpperCase()} 
            onUnitSelection={handleUnitSelection}
          />
        </CollapsiblePanel>
      </div>
      <div className="right-btn-group absolute right top">
        <StaticIconButton
          className="icon-btn"
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => setShowOverlays((old) => !old)}
        />
      </div>

      {/* <TowerRotateInstruction /> */}

      <div className="compass-fullscreen-wrapper absolute bottom left flex row overlay-can-fade-out">
        <div className="col flex j-end">
          {sortedPlans.length &&
            sortedPlans[currentIndex]?.direction &&
            (() => {
              const currentDirection = sortedPlans[currentIndex].direction;
              const angle = directionToAngle[currentDirection] ?? 0;
              return <Compass angle={angle} />;
            })()}
        </div>

        <div className="col w-space flex j-end overlay-can-fade-out">
          <StaticIconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>

      <div className="svg-wrapper" id="tower-page-svg-wrapper">
        {loading ? (
          <div className="loading">Loading tower visualization...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              minHeight: 400,
            }}
          >
            <svg
              preserveAspectRatio="xMidYMid slice"
              width="100%"
              height="100%"
              viewBox="0 0 1086 615"
              fill="none"
              style={{ width: "100%", height: "100%" }}
            >
              <image
                xlinkHref={sortedPlans[currentIndex].image_url}
                width="100%"
                height="100%"
                style={{ objectFit: "contain", backdropFilter: "opacity(10%)" }}
              />
              {sortedPlans[currentIndex].paths.map((pathEl, index) => {                
                if (pathEl.getAttribute("id") !== tower) {
                  const id = pathEl.getAttribute("id") || `path-${index}`;                  
                  const d = pathEl.getAttribute("d");
                  
                  // Check if ID starts with "U-" (unit paths)
                  const shouldShowColor = id.startsWith('U-');
                  
                  // Check unit status for color determination
                  let fill = "transparent";
                  let fillOpacity = "0";
                  let stroke = "transparent";
                  let strokeWidth = "0";
                  
                  if (shouldShowColor) {
                    // Extract unit ID from path ID (remove "U-" prefix)
                    const unitId = id.replace('U-', '');
                    const unit = units.find(u => u.unit_id.toString() === unitId);
                    
                    if (unit && unit.status === 2) {
                      // Unit is confirmed/booked - red color
                      fill = "#f86262";
                      fillOpacity = "0.3";
                      stroke = "rgba(248, 98, 98, 1)";
                      strokeWidth = "0.1";
                    } else {
                      // Check if this unit matches the selected filter criteria
                      if (selectedUnitFilter && unit) {
                        const matchesFilter = (
                          unit.unit_type === selectedUnitFilter.unitType &&
                          unit.area === selectedUnitFilter.sbu &&
                          unit.cost === selectedUnitFilter.totalCost
                        );
                        
                        if (matchesFilter) {
                          // Highlight matching units with blue color
                          fill = "#1976d2";
                          fillOpacity = "0.6";
                          stroke = "rgba(25, 118, 210, 1)";
                          strokeWidth = "0.2";
                        } else {
                          // Dim non-matching units
                          fill = "#5CE459";
                          fillOpacity = "0.1";
                          stroke = "rgba(0, 0, 0, 0.3)";
                          strokeWidth = "0.05";
                        }
                      } else {
                        // Default available/pending color when no filter is selected
                        fill = "#5CE459";
                        fillOpacity = "0.3";
                        stroke = "rgba(0, 0, 0, 1)";
                        strokeWidth = "0.1";
                      }
                    }
                  }
                  const className = pathEl.getAttribute("class") || "Available";
                  const floor = /^floor-/i.test(id)?id.replace(/floor-/i, ""):id;
                  return (
                    <Tippy
                      key={id}
                      content={floorData[id]?.name || "Loading..."}
                      placement="top"
                      visible={false}
                      appendTo={() => document.body}
                      interactive={true}
                    >
                      <g
                        className="sc-bZkfAO dKrtbD"
                        onMouseEnter={(event) => {
                          handleFloorHover(id, event);
                          // Also apply no color on hover to the path
                          const pathElement = event.currentTarget.querySelector('path');
                          if (pathElement) {
                            pathElement.style.fillOpacity = "0";
                          }
                        }}
                        onMouseLeave={(event) => {
                          handleTowerLeave();
                          // Restore original color after hover
                          const pathElement = event.currentTarget.querySelector('path');
                          if (pathElement) {
                            if (shouldShowColor) {
                              // Extract unit ID from path ID to find the unit
                              const unitId = id.replace('U-', '');
                              const unit = units.find(u => u.unit_id.toString() === unitId);
                              
                              if (selectedUnitFilter && unit) {
                                const matchesFilter = (
                                  unit.unit_type === selectedUnitFilter.unitType &&
                                  unit.area === selectedUnitFilter.sbu &&
                                  unit.cost === selectedUnitFilter.totalCost
                                );
                                pathElement.style.fillOpacity = matchesFilter ? "0.6" : "0.1";
                              } else {
                                pathElement.style.fillOpacity = "0.3";
                              }
                            } else {
                              pathElement.style.fillOpacity = "0";
                            }
                          }
                        }}
                        onClick={() =>
                          navigate(`/${project}/tower/${tower}/floor/${floor}`)
                        }
                      >
                        <g className="sc-hKMtZM NuQqD">
                          <g
                            id={`${id}-tower-svg`}
                            className="overlay-can-hide"
                          >
                            <path
                              id={id}
                              d={d || ""}
                              fill={fill}
                              fillOpacity={fillOpacity}
                              stroke={stroke}
                              strokeWidth={strokeWidth}
                              className={className}
                              style={{
                                transition: "fill-opacity 0.3s ease",
                                cursor: "pointer",
                                pointerEvents: "auto", // Ensure all paths can receive hover events
                              }}
                               onMouseEnter={(e) => {
                                 e.target.style.fillOpacity = "0";
                               }}
                               onMouseLeave={(e) => {
                                 if (shouldShowColor) {
                                   // Extract unit ID from path ID to find the unit
                                   const unitId = id.replace('U-', '');
                                   const unit = units.find(u => u.unit_id.toString() === unitId);
                                   
                                   if (selectedUnitFilter && unit) {
                                     const matchesFilter = (
                                       unit.unit_type === selectedUnitFilter.unitType &&
                                       unit.area === selectedUnitFilter.sbu &&
                                       unit.cost === selectedUnitFilter.totalCost
                                     );
                                     e.target.style.fillOpacity = matchesFilter ? "0.6" : "0.1";
                                   } else {
                                     e.target.style.fillOpacity = "0.3";
                                   }
                                 } else {
                                   e.target.style.fillOpacity = "0";
                                 }
                               }}
                            />
                          </g>
                        </g>
                      </g>
                    </Tippy>
                  );
                }
                return null;
              })}
            </svg>
            {sortedPlans.length > 0 && (
              <>
                <div className="triggers">
                  <button
                    onClick={handleRotateLeft}
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "rgba(255,255,255,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      padding: 8,
                      cursor: "pointer",
                      zIndex: 10,
                      width: 40,
                      height: 40,
                      paddingLeft : 13
                    }}
                  >
                    <ArrowBackIosIcon />
                  </button>
                  <button
                    onClick={handleRotateRight}
                    style={{
                      position: "absolute",
                      right: "20%",
                      top: "50%",
                      transform: "translate(50%, -50%)",
                      background: "rgba(255,255,255,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      padding: 8,
                      cursor: "pointer",
                      zIndex: 10,
                      width: 40,
                      height: 40,
                      paddingRight : 13
                    }}
                  >
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Modal
        open={hoveredFloor !== null}
        onClose={handleTowerLeave}
        aria-labelledby="tower-modal"
        hideBackdrop
        disableEnforceFocus
        disableAutoFocus
        disablePortal
        sx={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            // top: modalPosition.y,
            // left: modalPosition.x,
            right : '30px',
            bottom: '30px',
            width: 400,
            borderRadius: 2,
            color: "white",
            pointerEvents: "auto",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {hoveredFloor &&
            floorData[hoveredFloor] &&
            renderFloorDetails(floorData[hoveredFloor])}
        </Box>
      </Modal>

      {/* Construction Updates Modal */}
      <Modal
        open={updatesOpen}
        onClose={handleCloseUpdates}
        aria-labelledby="construction-updates-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
          backdropFilter: "blur(8px) saturate(120%)",
          background: "rgba(30, 41, 59, 0.45)",
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.95)",
            borderRadius: 5,
            boxShadow: 24,
            p: 0,
            minWidth: 600,
            maxWidth: 1400,
            width: "90vw",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 4,
              py: 3,
              borderBottom: "1px solid #e0e0e0",
              bgcolor: "rgba(255,255,255,0.85)",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PhotoLibraryIcon sx={{ fontSize: 36, color: "#1976d2" }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, letterSpacing: 1 }}
              >
                Construction Updates
              </Typography>
              {/* {towerData?.name && (
                <Typography variant="subtitle1" sx={{ ml: 2, color: '#1976d2', fontWeight: 500 }}>
                  {towerData.name}
                </Typography>
              )} */}
            </Box>
            <StaticIconButton
              onClick={handleCloseUpdates}
              sx={{ color: "#333", ml: 2 }}
            >
              <CloseIcon sx={{ fontSize: 32 }} />
            </StaticIconButton>
          </Box>

          {/* Toolbar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 4,
              py: 2,
              borderBottom: "1px solid #f0f0f0",
              bgcolor: "rgba(255,255,255,0.85)",
              zIndex: 1,
            }}
          >
            <FilterListIcon sx={{ color: "#1976d2", mr: 1 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <button
                style={{
                  background:
                    "linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                All
              </button>
              <button
                style={{
                  background: "#f5f5f5",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                Images
              </button>
              <button
                style={{
                  background: "#f5f5f5",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: 20,
                  padding: "6px 18px",
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                Videos
              </button>
            </Box>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 4,
              bgcolor: "rgba(255,255,255,0.97)",
            }}
          >
            {updatesLoading ? (
              <Typography sx={{ fontSize: 18 }}>Loading...</Typography>
            ) : updatesError ? (
              <Typography color="error" sx={{ fontSize: 18 }}>
                {updatesError}
              </Typography>
            ) : updates.length === 0 ? (
              <Typography sx={{ fontSize: 18 }}>No updates found.</Typography>
            ) : (
              <MediaLibrary media={updates} />
            )}
          </Box>
        </Box>
      </Modal>
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default Tower;

const Style = styled.div`
  height: 100vh;
  width: 100%;
  overflow: hidden !important;
  /* background-image: url(${process.env.PUBLIC_URL}/dubai_map.jpg); */
  background-position: center;

  .svg-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden !important;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .loading, .error {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      font-size: 1.2rem;
      color: #666;
    }

    .error {
      color: #ff4444;
    }

    .tower-plan {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .tower-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .tower-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .tower-fallback {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
    width:97%;
  }

  .map-filters,
  .location-info {
    position: absolute;
    top: 0;
    left: 2rem;
    margin-top: 8rem;
  }

  .location-info {
    margin-left: 12rem;
  }

  .left-panels {
    position: absolute;
    top: 0;
    left: 2rem;
    display: flex;
    flex-direction: column;
    z-index: 10;

    .filters {
      position: relative !important;
      left: 0;
      top: 0;
    }
  }

  .right-btn-group {
    margin: 1rem;
    z-index: 2;
    .icon-btn {
      margin: 1rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    align-items: center;
    padding-right: 2rem;
  }
`;
