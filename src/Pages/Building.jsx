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
          <span className="cap_text">{tower.name} Tower</span>
        </div>

        <div className="main_bfox_wrap">
          <div className="main_tab_block jusT_spacebtw">
            <div className="flors_icons">
              <span className="text_blk">{tower.stats.floor_count}</span>
              <span className="text_sub"> floors</span>
            </div>
            <div className="flors_icons">
              <span className="text_blk bg_available">
                {tower.stats.available_units}
              </span>
              <span className="text_sub"> Available</span>
            </div>
          </div>

          <div className="main_tab_block jusT_spacebtw">
            <div className="flors_icons">
              <span className="text_blk bg_orange">
                {tower.stats.total_units}
              </span>
              <span className="text_sub"> Apartments</span>
            </div>
            <div className="flors_icons">
              <span className="text_blk bg_dang">
                {tower.stats.booked_units}
              </span>
              <span className="text_sub"> Booked</span>
            </div>
          </div>

          {tower.stats.unit_types &&
          Object.keys(tower.stats.unit_types).length ? (
            <div className="main_tab_block pad_btnwq">
              {Object.keys(tower.stats.unit_types).map((ut, index, array) => {
                const [number, label] = ut.split(" ");
                return (
                  <React.Fragment key={ut}>
                    <div className="flors_icons">
                      <span className="text_blk clr_primary">{number} </span>
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
                    onClick={() =>
                      navigate(`/${project}/tower/${towerData[id]?.name}`)
                    }
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
                top: modalPosition.y,
                left: modalPosition.x,
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


`;
