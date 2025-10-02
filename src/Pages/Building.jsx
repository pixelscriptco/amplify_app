import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StaticIconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon } from "../Icons";
import { toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../Utility/axios";
import Tippy from "@tippyjs/react";
import {
  Modal,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Sidebar from "../Components/Sidebar";

function Building(props) {
  const { project } = useParams();
  const [buildingData, setBuildingData] = useState({
    id: 0,
    name: "",
    imageUrl: "",
    floors: [],
    paths: [],
  });
  const [hoveredTower, setHoveredTower] = useState(null);
  const [towerData, setTowerData] = useState({});
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // New state for menu dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);
  const [showMobileInstruction, setShowMobileInstruction] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [lastTapTime, setLastTapTime] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchBuildingData = async () => {
      if (!project) return;
      try {
        const response = await axiosInstance.get(`/app/building/${project}`);
        const { id, name, image_url, svg_url, floors } = response.data;
        const svgResp = await fetch(svg_url);
        const svgText = await svgResp.text();
        
        // Parse the SVG text and extract <path> elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        
        const paths = Array.from(svgDoc.querySelectorAll("path"));
        setBuildingData({
          id,
          name,
          imageUrl: image_url,
          floors,
          paths,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching building data:", err);
      }
    };
    fetchBuildingData();
  }, [project]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide mobile instruction after 5 seconds
  useEffect(() => {
    if (isMobile && showMobileInstruction) {
      const timer = setTimeout(() => {
        setShowMobileInstruction(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, showMobileInstruction]);

  const handleTowerHover = async (towerId, event) => {    
    setHoveredTower(towerId);

    // Calculate modal position based on mouse position
    const x = event.clientX;
    const y = event.clientY;
    const windowWidth = window.innerWidth;

    // Position modal on the right if mouse is on left half of screen, otherwise on left
    const modalX = x < windowWidth / 2 ? x + 20 : x - 420; // 400px modal width + 20px offset

    setModalPosition({ x: modalX, y: y - 100 }); // Offset Y by half modal height

    // Fetch tower data if not already fetched
    if (!towerData[towerId]) {      
      try {
        const response = await axiosInstance.get(
          `/app/${buildingData.id}/tower/${towerId}`
        );
        
        setTowerData((prev) => ({
          ...prev,
          [towerId]: response.data,
        }));
      } catch (err) {
        console.error("Error fetching tower data:", err);
      }
    }
  };

  const handleTowerLeave = () => {
    setHoveredTower(null);
  };

  // Touch event handlers for mobile
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [currentTowerId, setCurrentTowerId] = useState(null);

  const handleTowerTouchStart = async (towerId, event) => {
    const touch = event.touches[0];
    setTouchStartTime(Date.now());
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setCurrentTowerId(towerId);
    
    // Create a synthetic event with clientX and clientY for positioning
    const syntheticEvent = {
      ...event,
      clientX: touch.clientX,
      clientY: touch.clientY,
      currentTarget: event.currentTarget
    };
    
    await handleTowerHover(towerId, syntheticEvent);
  };

  const handleTowerTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    const touchDistance = Math.sqrt(
      Math.pow(touch.clientX - touchStartPos.x, 2) + 
      Math.pow(touch.clientY - touchStartPos.y, 2)
    );

    // If it's a quick tap (less than 200ms) and small movement (less than 10px)
    if (touchDuration < 200 && touchDistance < 10) {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime;
      
      if (timeDiff < 300) {
        // Double tap - navigate to tower
        setHoveredTower(null);
        navigate(`/${project}/tower/${towerData[currentTowerId]?.name}`);
      } else {
        // Single tap - show hover info for 3 seconds
        setLastTapTime(currentTime);
        setTimeout(() => {
          setHoveredTower(null);
        }, 3000);
      }
    } else {
      // It's a touch/hold, show hover info
      setTimeout(() => {
        setHoveredTower(null);
      }, 2000); // Show for 2 seconds on touch
    }
  };

  const renderTowerDetails = (tower) => {
    if (!tower || !tower.stats) return null;
    // console.log(tower);
    const areas = Object.values(tower.stats.unit_areas)
      .map((area) => area)
      .filter(Boolean);

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
          <span className="cap_text">Tower {tower.name}</span>
        </div>

        <div className="main_bfox_wrap">
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
                <path d="M304 70.1C313.1 61.9 326.9 61.9 336 70.1L568 278.1C577.9 286.9 578.7 302.1 569.8 312C560.9 321.9 545.8 322.7 535.9 313.8L527.9 306.6L527.9 511.9C527.9 547.2 499.2 575.9 463.9 575.9L175.9 575.9C140.6 575.9 111.9 547.2 111.9 511.9L111.9 306.6L103.9 313.8C94 322.6 78.9 321.8 70 312C61.1 302.2 62 287 71.8 278.1L304 70.1zM320 120.2L160 263.7L160 512C160 520.8 167.2 528 176 528L224 528L224 424C224 384.2 256.2 352 296 352L344 352C383.8 352 416 384.2 416 424L416 528L464 528C472.8 528 480 520.8 480 512L480 263.7L320 120.3zM272 528L368 528L368 424C368 410.7 357.3 400 344 400L296 400C282.7 400 272 410.7 272 424L272 528z"></path>
              </svg>
            </span>
            {tower.stats.floor_count} Floors
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
                  <path d="M128 176C119.2 176 112 183.2 112 192L112 448C112 456.8 119.2 464 128 464L512 464C520.8 464 528 456.8 528 448L528 192C528 183.2 520.8 176 512 176L128 176zM64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM224 384C224 401.7 209.7 416 192 416C174.3 416 160 401.7 160 384C160 366.3 174.3 352 192 352C209.7 352 224 366.3 224 384zM192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256C224 273.7 209.7 288 192 288zM296 232L456 232C469.3 232 480 242.7 480 256C480 269.3 469.3 280 456 280L296 280C282.7 280 272 269.3 272 256C272 242.7 282.7 232 296 232zM296 360L456 360C469.3 360 480 370.7 480 384C480 397.3 469.3 408 456 408L296 408C282.7 408 272 397.3 272 384C272 370.7 282.7 360 296 360z"></path>
                </svg>
              </span>
              {tower.stats.available_units} Available
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
              {tower.stats.total_units} Apartments
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
                {tower.stats.booked_units} Booked
              </div>
          </div>

          {
            (
              (tower.stats.unit_types && Object.keys(tower.stats.unit_types).length) ||
              (areas && areas.length)
            ) ? (
              <div className="main_tab_block pad_btnwq grid_block">
                {Object.keys(tower.stats.unit_types).length ? (
                  <>
                    {Object.keys(tower.stats.unit_types).map((ut, index, array) => {
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

  return (
    <Style id="building-page">
      <Navigator
        className="navigator"
        currentPage={{
          title: `${project.toUpperCase()}`,
          path: `/${project}`,
        }}
      />
      <Sidebar />

      {/* Mobile instruction */}
      {isMobile && showMobileInstruction && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 1000,
          animation: 'fadeInOut 5s ease-in-out'
        }}>
          Tap to view details • Double-tap to navigate
        </div>
      )}

      <div className="compass-fullscreen-wrapper absolute bottom right flex row">
        <div className="col w-space flex j-end">
          <StaticIconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <svg
            preserveAspectRatio="xMidYMid slice"
            width="1086"
            height="615"
            viewBox="0 0 1086 615"
            fill="none"
          >
            <image
              height="100%"
              style={{ objectFit: "contain", backdropFilter: "opacity(10%)" }}
              xlinkHref={buildingData?.imageUrl}
            />

            {buildingData.paths.map((pathEl, index) => {
              const id = pathEl.getAttribute("id") || `path-${index}`;
              const d = pathEl.getAttribute("d");
              const fill = pathEl.getAttribute("fill") || "#69F153";
              const fillOpacity = hoveredTower === id ? "1" : "0";
              const stroke = "rgba(0, 0, 0, 0.4)";
              const strokeWidth = "0.1";
              const className = pathEl.getAttribute("class") || "Available";

              return (
                <Tippy
                  key={id}
                  content={towerData[id]?.name || "Loading..."}
                  placement="top"
                  visible={false}
                  appendTo="parent"
                  interactive={true}
                  ref={(instance) => instance}
                >
                  <g
                    className="sc-bZkfAO dKrtbD"
                    onMouseEnter={(event) => handleTowerHover(id, event)}
                    onMouseLeave={handleTowerLeave}
                    onTouchStart={(event) => handleTowerTouchStart(id, event)}
                    onTouchEnd={handleTowerTouchEnd}
                    onClick={(event) => {
                      // On mobile, prevent navigation and let touch events handle hover
                      if (isMobile) {
                        event.preventDefault();
                        return;
                      }
                      // On desktop, navigate normally
                      navigate(`/${project}/tower/${towerData[id]?.name}`);
                    }}
                  >
                    <g className="sc-hKMtZM NuQqD">
                      <g id={`${id}-tower-svg`} className="overlay-can-hide">
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
                          }}
                        />
                      </g>
                    </g>
                  </g>
                </Tippy>
              );
            })}
          </svg>

          <Modal
            open={hoveredTower !== null}
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
                width: 300,
                bgcolor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0px 15px 50px 0px rgba(27, 32, 50, 0.1)",
                p: "0px",
                pointerEvents: "auto",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {hoveredTower &&
                towerData[hoveredTower] &&
                renderTowerDetails(towerData[hoveredTower])}
            </Box>
          </Modal>
        </>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Info</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
      </Dialog>
    </Style>
  );
}

export default Building;

const Style = styled.main`
  height: 100vh;
  overflow: hidden;
  width: 100%;
  background-position: center;

  svg {
    height: 100%;
    width: 100%;
    touch-action: manipulation; /* Improve touch responsiveness */
  }

  /* Mobile-specific improvements */
  @media (max-width: 768px) {
    .main_bfox_wrap {
      touch-action: manipulation;
    }
    
    /* Improve touch targets */
    g[class*="sc-bZkfAO"] {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
    width:97%;
  }

  .right-btn-group {
    margin: 1rem;
    .icon-btn {
      margin: 1rem;
    }
  }

  .compass-fullscreen-wrapper {
    padding: 1rem;
    padding-right: 2rem;
  }

  .loading, .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.2rem;
    color: #333;
  }

  .error {
    color: #ff0000;
  }

  .tower-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tower-header {
    margin-bottom: 8px;
  }

  .tower-title {
    display: flex;
    align-items: left;
    margin-bottom: 0;
  }

  .location-icon {
    margin-right: 8px;
  }

  .tower-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-box {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 4px;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
