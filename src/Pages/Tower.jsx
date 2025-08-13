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
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [showFilter, setShowFilter] = useState(false);

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
        const { id, name, floor_count, direction } = response.data;
        setTowerData({
          id,
          name,
          floor_count,
          direction,
        });
        const sortedPlans = response.data.tower_plans;

        const updatedPaths = await Promise.all(
          // FIX: await all promises
          sortedPlans.map(async (plan) => {
            try {
              const svgResp = await fetch(plan.svg_url);
              const svgText = await svgResp.text();
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
              const paths = Array.from(svgDoc.querySelectorAll("path"));

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
            {tower} Tower | {floor.name}{" "}
          </span>
        </div>

        <div className="main_tab_block jusT_spacebtw mrgn_hr">
          <div className="flors_icons">
            <span className="text_blk bg_orange">
              {floor.stats.total_units}
            </span>
            <span className="text_sub"> Apartments</span>
          </div>
        </div>

        <div className="main_bfox_wrap">
          <div className="main_tab_block jusT_spacebtw">
            <div className="flors_icons">
              <span className="text_blk bg_available">
                {floor.stats.available_units}
              </span>
              <span className="text_sub"> Available</span>
            </div>
            <div className="flors_icons">
              <span className="text_blk">{floor.stats.booked_units}</span>
              <span className="text_sub"> Booked</span>
            </div>
          </div>

          {floor.stats.unit_types &&
          Object.keys(floor.stats.unit_types).length ? (
            <div className="main_tab_block pad_btnwq">
              {Object.keys(floor.stats.unit_types).map((ut, index, array) => {
                const [number, label] = ut.split(" ");
                return (
                  <React.Fragment key={ut}>
                    <div className="flors_icons">
                      <span className="text_blk clr_vilt">{number} </span>
                      {label}
                      {index < array.length - 1 && (
                        <span className="text_sub"> and </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            ""
          )}

          {areas && areas.length ? (
            <div className="main_tab_block">
              {areas.map((ut, index, array) => (
                <React.Fragment key={ut}>
                  <div className="flors_icons">
                    <span className="text_blk clr_primary">{ut}</span>
                  </div>
                  {index < array.length - 1 && (
                    <span className="text_sub"> - </span>
                  )}
                </React.Fragment>
              ))}
              <span className="text_sub"> Sqft </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  const handleFloorHover = async (floorName, event) => {
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
      <Sidebar />
      <UnitStatusLegend />
      {/* Compass with direction */}
      {/* {sortedPlans.length && sortedPlans[currentIndex]?.direction && (        
        (() => {
          const currentDirection = sortedPlans[currentIndex].direction;
          const angle = directionToAngle[currentDirection] ?? 0;
          return (
            <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Compass direction={currentDirection} angle={angle} size={60} />
            </div>
          );
        })()
      )} */}

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
      
      <div className="left-panels">
        <CollapsiblePanel className="filters" title={"Filters"} show={showFilter}>
          <UnitTypeFilter Tower={tower.toUpperCase()} />
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

      <TowerRotateInstruction />

      <div className="compass-fullscreen-wrapper absolute bottom right flex row overlay-can-fade-out">
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
                  const fill = "#5CE459";
                  const fillOpacity = hoveredFloor === id ? "0" : "0.3";
                  const stroke = "rgba(0, 0, 0, 1)";
                  const strokeWidth = "0.1";
                  const className = pathEl.getAttribute("class") || "Available";
                  const floor = id.replace(/floor-/i, "");
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
                        onMouseEnter={(event) => handleFloorHover(id, event)}
                        onMouseLeave={handleTowerLeave}
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
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.fillOpacity = "0";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.fillOpacity = "0.3";
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
            {sortedPlans.length > 1 && (
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
                    }}
                  >
                    <ArrowBackIosIcon />
                  </button>
                  <button
                    onClick={handleRotateRight}
                    style={{
                      position: "absolute",
                      right: "25%",
                      top: "50%",
                      transform: "translate(50%, -50%)",
                      background: "rgba(255,255,255,0.7)",
                      border: "none",
                      borderRadius: "50%",
                      padding: 8,
                      cursor: "pointer",
                      zIndex: 10,
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
            top: modalPosition.y,
            left: modalPosition.x,
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
