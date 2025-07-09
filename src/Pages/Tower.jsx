import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import IconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon, HideIcon, RadiusIcon } from "../Icons";
import { toggleFullScreen, toogleHideOverlays } from "../Utility/function";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter";
import Navigator from "../Components/Molecules/Navigator";
import { useParams, useNavigate } from "react-router-dom";
import Amenities from "../Components/Atoms/Amenities";
import TowerRotateInstruction from "../Components/Atoms/TowerRotateInstruction";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import axiosInstance from "../Utility/axios";
import Tippy from '@tippyjs/react';
import { Modal, Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import MediaLibrary from '../Components/Molecules/MediaLibrary';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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
      const response = await axiosInstance.get(`/app/project/${project}/updates`);
      setUpdates(response.data.updates || []);
    } catch (err) {
      setUpdatesError('Failed to load updates');
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
        const response = await axiosInstance.get(`/app/tower/${project}/${tower}`);                
        // Sort tower plans by order
        const { id, name, floor_count } = response.data;
        setTowerData({
          id,
          name,
          floor_count
        })
        const sortedPlans = response.data.tower_plans;

        const updatedPaths = await Promise.all( // FIX: await all promises
          sortedPlans.map(async (plan) => {
            try {
              const svgResp = await fetch(plan.svg_url);
              const svgText = await svgResp.text();
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
              const paths = Array.from(svgDoc.querySelectorAll('path'));
              
              return {
                ...plan,
                paths: paths,
              };
            } catch (error) {
              console.error(`Error processing plan ID ${plan.id || 'unknown'}:`, error);
              return {
                ...plan,
                paths: [],
              };
            }
          })
        );
        
        setTowerSvg(updatedPaths);

      } catch (err) {
        console.error('Error fetching tower SVG:', err);
        setError('Failed to load tower visualization');
      } finally {
        setLoading(false);
      }
    };

    fetchTowerSvg();
    
  }, [showOverlays, project, tower]);

  const renderFloorDetails = (floor) => {
    if (!floor || !floor.stats) return null;

    const unitTypes = Object.keys(floor.stats.unit_types).join(' and ');
    
    const areas = Object.values(floor.stats.unit_areas).map(area => area).filter(Boolean);
    let areaRange = '';
    if (areas.length > 0) {
      areaRange = areas.join(' - ') + ' Sq.Ft';
    }

    return (
      <div className="floor-details">
        <div className="floor-header">
          <Typography variant="h6" component="h2" className="floor-title">
            <span className="location-icon">📍</span>
            {tower} Tower | {floor.name} 
          </Typography>
        </div>
        <div className="floor-stats">
          <div className="stat-box">
            <Typography variant="body1">
              {floor.stats.total_units} Apartments
            </Typography>
          </div>
          <div className="stat-box">
            <Typography variant="body1">
              {floor.stats.available_units} Available | {floor.stats.booked_units} Booked
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

  const handleFloorHover = async (floorName,event) => {    
    const floorId = floorName.replace(/floor-/i, '');
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
            const response = await axiosInstance.get(`/app/tower/${towerData.id}/floor/${floorName}`);
            setFloorData(prev => ({
            ...prev,
            [floorId]: response.data
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
    setCurrentIndex((prev) => (prev - 1 + sortedPlans.length) % sortedPlans.length);
  };
  const handleRotateRight = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedPlans.length);
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
      <UnitStatusLegend />
      <div className="left-panels">
        <CollapsiblePanel className="filters" title={"Filters"}>
          <UnitTypeFilter
            Tower={tower.toUpperCase()}
          />
        </CollapsiblePanel>
      </div>
      <div className="right-btn-group absolute right top">
        <IconButton
          className="icon-btn"
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => setShowOverlays((old) => !old)}
        />
      </div>
      <TowerRotateInstruction />
      <ProjectVideoBtn />

      <div className="compass-fullscreen-wrapper absolute bottom right flex row overlay-can-fade-out">
        <div>
          <Amenities />
        </div>
        <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center',zIndex:1000 }}>
         <button
           style={{
             background: 'var(--background_panel)',
             color: 'white',
             border: 'none',
             borderRadius: 4,
             padding: '8px 16px',
             cursor: 'pointer',
             fontSize: 16,
             fontWeight: 500,
             boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
           }}
           onClick={handleOpenUpdates}
         >
           Construction Updates
         </button>
        </div>

        <div className="col w-space flex j-end overlay-can-fade-out">
          <IconButton
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
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 400 }}>
            <svg
              preserveAspectRatio="xMidYMid slice"
              width="100%"
              height="100%"
              viewBox="0 0 1086 615"
              fill="none"
              style={{ width: '100%', height: '100%' }}
            >
              <image
                xlinkHref={sortedPlans[currentIndex].image_url}
                width="100%"
                height="100%"
                style={{ objectFit: 'contain', backdropFilter: 'opacity(10%)' }}
              />
              {sortedPlans[currentIndex].paths.map((pathEl, index) => {
                if (pathEl.getAttribute('id') !== tower) {
                  const id = pathEl.getAttribute('id') || `path-${index}`;
                  const d = pathEl.getAttribute('d');
                  const fill = '#5CE459';
                  const fillOpacity = hoveredFloor === id ? '0' : '0.3';
                  const stroke = 'rgba(0, 0, 0, 1)';
                  const strokeWidth = '0.1';
                  const className = pathEl.getAttribute('class') || 'Available';
                  const floor = id.replace(/floor-/i, '');
                  return (
                    <Tippy
                      key={id}
                      content={floorData[id]?.name || 'Loading...'}
                      placement="top"
                      visible={false}
                      appendTo={() => document.body}
                      interactive={true}
                    >
                      <g
                        className="sc-bZkfAO dKrtbD"
                        onMouseEnter={(event) => handleFloorHover(id, event)}
                        onMouseLeave={handleTowerLeave}
                        onClick={() => navigate(`/${project}/tower/${tower}/floor/${floor}`)}
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
                              onMouseEnter={(e) => {
                                e.target.style.fillOpacity = '0';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.fillOpacity = '0.3';
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
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,255,255,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: 8,
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <button
                  onClick={handleRotateRight}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translate(50%, -50%)',
                    background: 'rgba(255,255,255,0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: 8,
                    cursor: 'pointer',
                    zIndex: 10
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
          {hoveredFloor && floorData[hoveredFloor] && renderFloorDetails(floorData[hoveredFloor])}
        </Box>
      </Modal>

      {/* Construction Updates Modal */}
      <Modal
        open={updatesOpen}
        onClose={handleCloseUpdates}
        aria-labelledby="construction-updates-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
          backdropFilter: 'blur(8px) saturate(120%)',
          background: 'rgba(30, 41, 59, 0.45)'
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 5,
            boxShadow: 24,
            p: 0,
            minWidth: 600,
            maxWidth: 1400,
            width: '90vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 4,
            py: 3,
            borderBottom: '1px solid #e0e0e0',
            bgcolor: 'rgba(255,255,255,0.85)',
            position: 'sticky',
            top: 0,
            zIndex: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhotoLibraryIcon sx={{ fontSize: 36, color: '#1976d2' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Construction Updates
              </Typography>
              {/* {towerData?.name && (
                <Typography variant="subtitle1" sx={{ ml: 2, color: '#1976d2', fontWeight: 500 }}>
                  {towerData.name}
                </Typography>
              )} */}
            </Box>
            <IconButton onClick={handleCloseUpdates} sx={{ color: '#333', ml: 2 }}>
              <CloseIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>

          {/* Toolbar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: 4,
            py: 2,
            borderBottom: '1px solid #f0f0f0',
            bgcolor: 'rgba(255,255,255,0.85)',
            zIndex: 1
          }}>
            <FilterListIcon sx={{ color: '#1976d2', mr: 1 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <button
                style={{
                  background: 'linear-gradient(90deg, #1976d2 60%, #21cbf3 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 20,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >All</button>
              <button
                style={{
                  background: '#f5f5f5',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: 20,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >Images</button>
              <button
                style={{
                  background: '#f5f5f5',
                  color: '#1976d2',
                  border: 'none',
                  borderRadius: 20,
                  padding: '6px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >Videos</button>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 4, bgcolor: 'rgba(255,255,255,0.97)' }}>
            {updatesLoading ? (
              <Typography sx={{ fontSize: 18 }}>Loading...</Typography>
            ) : updatesError ? (
              <Typography color="error" sx={{ fontSize: 18 }}>{updatesError}</Typography>
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
