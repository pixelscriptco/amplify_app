import React,{ useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Compass from "../Components/Atoms/Compass";
import CollapsiblePanel from "../Components/Molecules/CollapsiblePanel";
import UnitTypeFilter from "../Components/Molecules/UnitTypeFilter"
import StaticIconButton from "../Components/Atoms/IconButton";
import { FullScreenIcon, HideIcon } from "../Icons";
import {
  getCombinedTowerName,
  toggleFullScreen,
  toogleHideOverlays,
} from "../Utility/function";
import { Modal, Box, Typography } from "@mui/material";
import Zoomable from "../Components/Molecules/Zoomable";
import FloorSelector from "../Components/Molecules/FloorSelector";
import { useParams } from "react-router-dom";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate } from "react-router-dom";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import { COMPASS_ANGLES } from "../Utility/Constants";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import axiosInstance from "../Utility/axios";
import Sidebar from '../Components/Sidebar';

function Floor() {
  const [showOverlays, setShowOverlays] = useState(true);
  const ref = useRef();
  const params = useParams();
  const { project,floor, tower } = params;
  const [unitData, setUnitData] = useState({});
  const currentFloor = parseInt(floor);
  const currentTower = tower;
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [units, setUnits] = useState([]);
  const [selectedTower, setSelectedTower] = useState(currentTower);
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [exploreView, setExploreView] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floorData, setFloorData] = useState(null);
  const [floorSvg, setFloorSvg] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState(null);
  const [enableFilter, setEnableFilter] = useState(false);

  useEffect(() => {
    const fetchFloorSvg = async () => {
      try {        
        setLoading(true);
        const response = await axiosInstance.get(`/app/floor/${project}/${tower}/${floor}`);

        const { id, name, floor_count } = response.data;
        
        setFloorData({
          id,
          name,
          floor_count
        })
        setUnits(response.data.units);
        const {image_url, svg_url,unit_count} = response.data.floor_plan;
        
        const svgResp = await fetch(svg_url);
        const svgText = await svgResp.text();
  
        // Parse the SVG text and extract <path> elements
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const paths = Array.from(svgDoc.querySelectorAll('path'));

        const floorNumber = name.split('-')[1];        

        paths.forEach(path => {
          const pathId = path.id; 
          
          response.data.units.forEach(unit => {
            // Assuming unit.name is like "A-102"
            const [towerPart, floorUnitPart] = unit.name.split('-');
            const unitNumberPart = floorUnitPart.slice(floorNumber.length);
            const unitNumber = unitNumberPart.replace(/^0+/, '');
            
            if(unitNumber == pathId){
              if (unit.status === 1){
                path.classList.add('available');
              }

              if (unit.status === 2){
                path.classList.add('booked');
              }

              if (unit.status === 3){
                path.classList.add('hold');
              }
            }
          })
        });
                
        setFloorSvg({
          id : response.data.floor_plan.id,
          name : response.data.floor_plan.name,
          image_url,
          unit_count,
          paths,
        });

        setLoading(false);  
      }catch(err){
        console.error('Error fetching floor SVG:', err);
        setError('Failed to load floor visualization');
      } finally {
        setLoading(false);
      }
    }

    fetchFloorSvg();
  }, [project, tower,floor]);

  useEffect(() => {
    ref.current.parentElement.style.transition = "all linear 0.1s";
    toogleHideOverlays(showOverlays);
  }, [showOverlays]);

  const handleUnitHover = async (unit_str, event) => {            
    setHoveredUnit(unit_str);

    // Calculate modal position based on mouse position
    const x = event.clientX;
    const y = event.clientY;
    const windowWidth = window.innerWidth;

    // Position modal on the right if mouse is on left half of screen, otherwise on left
    const modalX = x < windowWidth / 2 ? x + 20 : x - 420; // 400px modal width + 20px offset

    setModalPosition({ x: modalX, y: y - 100 }); // Offset Y by half modal height
    
    // Fetch tower data if not already fetched
    if (!unitData[unit_str]) {
      try {
        const response = await axiosInstance.get(
          `/app/floor/${floorData.id}/unit/${unit_str}`
        );
        setUnitData((prev) => ({
          ...prev,
          [unit_str]: response.data,
        }));
      } catch (err) {
        console.error("Error fetching floor data:", err);
      }
    }
  };

  const handleFloorLeave = () => {
    setHoveredUnit(null);
  };

  const handleUnitSelection = (unitDetails) => {
    setSelectedUnitFilter(unitDetails);    
    setEnableFilter(true);
  };

  function formatPrice(value) {
    if (!value || isNaN(value)) return "";

    if (value >= 10000000) {
      // 1 Crore = 1,00,00,000
      return (value / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";
    } else if (value >= 100000) {
      // 1 Lakh = 1,00,000
      return (value / 100000).toFixed(2).replace(/\.00$/, "") + " L";
    } else {
      return value.toString();
    }
  }

  const renderUnitDetails = (unit) => {
    if (!unit) return null;

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
            {unit.name}{" "}
          </span>
        </div>


          <div className="main_tab_block grid_block  jusT_spacebtw" style={{ paddingBottom: '15px'}}>
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
              {unit.unit_plans? unit.unit_plans.type:''}
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
              {unit.unit_status.name}
            </div>
            <div className="flors_icons">
              <span className="dd_flex">
              <svg
                fill="currentColor"
                width="19px"
                height="19px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
              >
                <path d="M480 144C488.8 144 496 151.2 496 160L496 480C496 488.8 488.8 496 480 496L160 496C151.2 496 144 488.8 144 480L144 160C144 151.2 151.2 144 160 144L480 144zM160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 160C544 124.7 515.3 96 480 96L160 96z" />
              </svg>
              </span>
              {unit.unit_plans?unit.unit_plans.area:''} Sqft
            </div>
            <div className="flors_icons">
              <span className="dd_flex">
                  <svg
                      fill="currentColor"
                      width="19px"
                      height="19px"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                    >
                      <path d="M160 128C160 110.3 174.3 96 192 96L456 96C469.3 96 480 106.7 480 120C480 133.3 469.3 144 456 144L379.3 144C397 163.8 409.4 188.6 414 216L456 216C469.3 216 480 226.7 480 240C480 253.3 469.3 264 456 264L414 264C403.6 326.2 353.2 374.9 290.2 382.9L434.6 486C449 496.3 452.3 516.3 442 530.6C431.7 544.9 411.7 548.3 397.4 538L173.4 378C162.1 370 157.3 355.5 161.5 342.2C165.7 328.9 178.1 320 192 320L272 320C307.8 320 338.1 296.5 348.3 264L184 264C170.7 264 160 253.3 160 240C160 226.7 170.7 216 184 216L348.3 216C338.1 183.5 307.8 160 272 160L192 160C174.3 160 160 145.7 160 128z" />
                    </svg>
              </span>
              {formatPrice(unit.cost??(unit.unit_plans?unit.unit_plans.cost:''))}
            </div>
          </div>
      </div>
    );
  };


  return (
    <Style
      onClick={() => {
        setSelectedFloor(currentFloor);
        setSelectedTower(currentTower);
        setSelectedUnit(false);
        setExploreView(false);
        // navigate(project + "/tower/" + tower + "/floor/" + floor);
      }}
    >
      {/* <ProjectVideoBtn /> */}

      <ReturnToPrev
        text="Return To Tower"
        to={project + "/tower/" + tower}
      />

        <Navigator
          className="navigator"
          prevPages={[
            {
              title: `${project.toUpperCase()}`,
              path: `/${project}`,
            },
            {
              title: `${tower}`,
              path: `/${project}/tower/${tower}`,
            },
          ]}
          currentPage={{
            title: `Floor ${floor}`,
              path: `/${project}/tower/${tower}/floor/${floor}`,
          }}
        />

        <>
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
          
          <div className="left-panels  unit-type-filter fltrr">
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

              <UnitTypeFilter project={project} tower={tower} floor={floor}  onUnitSelection={handleUnitSelection}/>
            </CollapsiblePanel>
          </div>
        </>
      <div className="right-btn-group absolute right top">
        <StaticIconButton
          className="icon-btn"
          icon={HideIcon}
          tooltip="Hide Overlays"
          activeTooltip="Show Overlay"
          onClick={() => setShowOverlays((old) => !old)}
        />
      </div>
      <UnitStatusLegend />

      <div className="compass-fullscreen-wrapper absolute bottom left flex row overlay-can-fade-out">
        <div className="col flex j-end">
          <Compass
            angle={COMPASS_ANGLES.TOWERS[getCombinedTowerName(tower)] - 25}
          />
        </div>
        <div className="col w-space flex j-end">
          <StaticIconButton
            icon={FullScreenIcon}
            tooltip="Fullscreen"
            activeTooltip="Close Fullscreen"
            onClick={() => toggleFullScreen()}
          />
        </div>
      </div>
      {/* <ApartmentsDetails /> */}
      <Zoomable>
        <div className="zoomable-container" ref={ref}>
          <div className="img-wrapper">
            <img
              src={floorSvg.image_url}
              alt="floor"
            />
          </div>
          <div className="svg-wrapper ">
            {/* placing floor nos */}
            <SvgStyle
              width="1086"
              height="760"
              viewBox="0 0 1086 760"
              fill="transparent"
              onClick={(e) => {
                if (e.target.tagName !== "path") return;

                const unit = e.target.dataset.unit;
                if (!unit) return;
              }}
              ref={ref}
            >
            <g id="units-svg">
              {!loading && floorSvg.paths && floorSvg.paths.map((pathEl, index) => {
                const id = pathEl.getAttribute('id') || `path-${index}`;
                const d = pathEl.getAttribute('d');
                const className = pathEl.getAttribute('class') || 'Available';
                
                const paddedId = id.toString().padStart(2, '0');
                const unit_str = tower+'-'+floor+paddedId;
                
                // Find the unit data to check filter match
                const unitData = units.find(u => u.name === unit_str);
                
                // Check if unit matches the selected filter
                let matchesFilter = true;
                let defaultOpacity = '0.6';
                
                if (selectedUnitFilter && unitData && enableFilter) {
                  matchesFilter = (
                    unitData.unit_plans?.type === selectedUnitFilter.unitType &&
                    unitData.unit_plans?.area === selectedUnitFilter.sbu &&
                    (unitData.cost ?? unitData.unit_plans?.cost) === selectedUnitFilter.totalCost
                  );
                  
                  if (matchesFilter) {
                    defaultOpacity = '0.8'; // Highlight matching units
                  } else {
                    defaultOpacity = '0.2'; // Dim non-matching units
                  }
                }
                
                // Map status values
                const getStatusText = (status) => {
                  switch(status) {
                    case '1': return 'Available';
                    case '2': return 'Booked';
                    case '3': return 'Hold';
                    default: return 'Available';
                  }
                };

                const statusText = getStatusText(pathEl.getAttribute('status'));
                
                return (
                  <path
                    key={id}
                    d={d}
                    className={className}
                    data-unit={id}
                    style={{ fillOpacity: defaultOpacity }}
                    onClick={() => navigate(`/${project}/tower/${tower}/floor/${floor}/unit/${unit_str}`)}
                    onMouseEnter={(e) => {
                      e.target.style.fillOpacity = '0';
                      handleUnitHover(unit_str, e);
                    }}
                    onMouseLeave={(e) => {
                      handleFloorLeave();
                      e.target.style.fillOpacity = defaultOpacity;
                    }}
                  />
                );
              })}
            </g>
          </SvgStyle>
          </div>
        </div>
      </Zoomable>

      <Modal
        open={hoveredUnit !== null}
        onClose={handleFloorLeave}
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
            right : '-70px',
            bottom: '30px',
            width: 400,
            borderRadius: 2,
            color: "white",
            pointerEvents: "auto",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {hoveredUnit &&
            unitData[hoveredUnit] &&
            renderUnitDetails(unitData[hoveredUnit])}
        </Box>
      </Modal>
    </Style>
  );
}

// const SVG = ({ Renderer }) => Renderer;
export default Floor;

const Style = styled.main`
  height: 100vh;
  width: 100%;
  /* background-image: url(${process.env.PUBLIC_URL}/dubai_map.jpg); */
  background-position: center;

  .unit-type-filter {
    position: absolute;
    top: 0;
    left: 0rem;
  }

  .floor-selector {
    position: absolute;
    // left: 14rem;
    left: 3rem;
    top: 8rem;
  }

  .zoomable-container {
    cursor: default;
    width: 100vw;
    height: 100vh;
    transform-origin: center;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 12rem;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .img-wrapper {
    background: rgb(48, 41, 32);
    background: linear-gradient(
      68deg,
      rgba(48, 41, 32, 1) 0%,
      rgba(124, 111, 91, 1) 15%,
      rgba(138, 124, 102, 1) 25%,
      rgba(134, 121, 99, 1) 32%,
      rgba(121, 109, 90, 1) 45%,
      rgba(92, 86, 74, 1) 100%
    );
  }

  .img-wrapper,
  .svg-wrapper {
    padding: 120px;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
  }

  .svg-wrapper {
    z-index: 0;
  }

  .zoom-control {
    position: absolute;
    right: 0px;
    bottom: 50%;
    z-index: 8;
    margin-top: 0px !important;
    display: flex;
    flex-direction: column;
    margin: 2rem;
  }

  .zoom-btn {
    width: 36px;
    height: 36px;
    background: var(--button_background_zoom);
    border-radius: 8px;
    display: inline-block;
    border: none;
    box-shadow: var(--button_shadow);
    border-radius: var(--radius);
    font-size: 22px;
    display: grid;
    place-items: center;
    text-align: center;
    pointer-events: auto;
    line-height: 19px;
    cursor: pointer;
    color: #a09c9c;
    transition: var(--transition);

    :hover {
      background: rgba(35, 35, 35, 0.85);
    }
  }

  .zoom-btn-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .plus-btn {
    margin-bottom: 10px;
  }

  .navigator {
    position: absolute;
    top: 0rem;
    left: 0rem;
    margin: 2rem;
    width:97%;
  }

  .left-interface {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem;
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
    padding-right: 2rem;
  }
`;

const SvgStyle = styled.svg`
  height: 100%;
  width: 100%;
  path[data-unit] {
    cursor: pointer;
    transition: all 200ms;
    fill-opacity: 0.6;
    fill: var(--clr-available);
    stroke: #15161652;
    stroke-width: 2px;
    :hover {
      fill: transparent;
    } 
  }

  path.available {
    fill: #53fa537a;
  } 
  
  path.booked {
    fill: #f8626277;
  }

  path.hold {
    fill: #1cd3eb62;
  }

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
