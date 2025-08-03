import React, { useEffect, useState } from "react";
import styled from "styled-components";
import StaticIconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon} from "../Icons";
import { toggleFullScreen } from "../Utility/function";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate,useParams } from 'react-router-dom';
import axiosInstance from '../Utility/axios';
import Tippy from '@tippyjs/react';
import { Modal, Box, Typography,Dialog, DialogTitle, DialogContent} from '@mui/material';
import Sidebar from '../Components/Sidebar';

function Building(props) {
  const { project } = useParams();
  const [buildingData, setBuildingData] = useState({
    id: 0,
    name: '',
    imageUrl: '',
    floors: [],
    paths: []
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
        const { id, name, image_url, svg_url, floors} = response.data;
        const svgResp = await fetch(svg_url);
        const svgText = await svgResp.text();
        // Parse the SVG text and extract <path> elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = Array.from(svgDoc.querySelectorAll('path'));
        setBuildingData({
          id,
          name,
          imageUrl: image_url,
          floors,
          paths
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
        const response = await axiosInstance.get(`/app/${buildingData.id}/tower/${towerId}`);
        setTowerData(prev => ({
          ...prev,
          [towerId]: response.data
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

    const unitTypes = Object.keys(tower.stats.unit_types).join(' and ');
    
    const areas = Object.values(tower.stats.unit_areas).map(area => area).filter(Boolean);
    let areaRange = '';
    if (areas.length > 0) {
      areaRange = areas.join(' - ') + ' Sq.Ft';
    }

    return (
      <div className="tower-details">
        <div className="tower-header">
          <Typography variant="h6" component="h2" className="tower-title">
            <span className="location-icon">📍</span>
            {tower.name} Tower
          </Typography>
        </div>
        <div className="tower-stats">
          <div className="stat-box">
            <Typography variant="body1">
              {tower.stats.floor_count} Floors | {tower.stats.total_units} Apartments
            </Typography>
          </div>
          <div className="stat-box">
            <Typography variant="body1">
              {tower.stats.available_units} Available | {tower.stats.booked_units} Booked
            </Typography>
          </div>
          {unitTypes && (
            <div className="stat-box">
              <Typography variant="body1">
                {unitTypes}
              </Typography>
            </div>
          )}
          {areaRange && (
            <div className="stat-box">
              <Typography variant="body1">
                {areaRange}
              </Typography>
            </div>
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
      <Sidebar/>

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
              const id = pathEl.getAttribute('id') || `path-${index}`;
              const d = pathEl.getAttribute('d');
              const fill = pathEl.getAttribute('fill') || '#69F153';
              const fillOpacity = hoveredTower === id ? '1' : '0';
              const stroke = 'rgba(0, 0, 0, 0.4)';
              const strokeWidth = '0.1';
              const className = pathEl.getAttribute('class') || 'Available';

              return (
                <Tippy
                  key={id}
                  content={towerData[id]?.name || 'Loading...'}
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
                    onClick={() => navigate(`/${project}/tower/${towerData[id]?.name}`)}
                  >
                    <g className="sc-hKMtZM NuQqD">
                      <g id={`${id}-tower-svg`} className="overlay-can-hide">
                        <path
                          id={id}
                          d={d || ''}
                          fill={fill}
                          fillOpacity={fillOpacity}
                          stroke={stroke}
                          strokeWidth={strokeWidth}
                          className={className}
                          style={{
                            transition: 'fill-opacity 0.3s ease',
                            cursor: 'pointer'
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
              pointerEvents: 'none',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <Box
              sx={{
                position: 'fixed',
                top: modalPosition.y,
                left: modalPosition.x,
                width: 400,
                bgcolor: 'rgba(35, 35, 35, .85)',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                color: 'white',
                pointerEvents: 'auto',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {hoveredTower && towerData[hoveredTower] && renderTowerDetails(towerData[hoveredTower])}
            </Box>
          </Modal>
        </>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Info</DialogTitle>
        <DialogContent>
          {dialogContent}
        </DialogContent>
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
