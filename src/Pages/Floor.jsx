import React, { useEffect, useRef, useState } from "react";
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
import Zoomable from "../Components/Molecules/Zoomable";
import FloorSelector from "../Components/Molecules/FloorSelector";
import { useParams } from "react-router-dom";
import Navigator from "../Components/Molecules/Navigator";
import { useNavigate, useLocation } from "react-router-dom";
import ReturnToPrev from "../Components/Atoms/ReturnToPrev";
import ProjectVideoBtn from "../Components/Molecules/ProjectVideoBtn";
import { COMPASS_ANGLES } from "../Utility/Constants";
import UnitStatusLegend from "../Components/Atoms/UnitStatusLegend";
import axiosInstance from "../Utility/axios";
import Sidebar from '../Components/Sidebar';

function Floor() {
  const [showOverlays, setShowOverlays] = useState(true);
  const ref = useRef();
  const params = useParams();
  const { project,floor, tower } = params;

  const currentFloor = parseInt(floor);
  const currentTower = tower;
  const [selectedFloor, setSelectedFloor] = useState(currentFloor);
  const [units, setUnits] = useState([]);
  const [selectedTower, setSelectedTower] = useState(currentTower);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [exploreView, setExploreView] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [floorData, setFloorData] = useState(null);
  const [floorSvg, setFloorSvg] = useState({});


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
              title: `Tower ${tower}`,
              path: `/${project}/tower/${tower}`,
            },
          ]}
          currentPage={{
            title: `Floor ${floor}`,
              path: `/${project}/tower/${tower}/floor/${floor}`,
          }}
        />
        <Sidebar />
        <>
          <div className="floor-selector overlay-can-fade-out">
            <FloorSelector
              currentFloor={currentFloor}
              selectedFloor={selectedFloor}
              setSelectedFloor={setSelectedFloor}
              currentTower={currentTower}
              selectedTower={selectedTower}
              setSelectedTower={setSelectedTower}
            />
          </div>

          <div className="unit-type-filter overlay-can-fade-out">
            <CollapsiblePanel title={"Filters"}>
              <UnitTypeFilter firstTower={tower} floor={floor} />
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

      <div className="compass-fullscreen-wrapper absolute bottom right flex row overlay-can-fade-out">
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
            
            {/* <FloorSvg 
              isActive={isUnitActive}
              onMouseEnterUnit={(unit) => {
                setSelectedUnit(unit);
                setExploreView(false);
              }}
              selectedUnit={selectedUnit}
              tower={tower}
              floor={floor}
            /> */}

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

                // onMouseEnterUnit(parseInt(unit));
                // e.stopPropagation();
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
                    onClick={() => navigate(`/${project}/tower/${tower}/floor/${floor}/unit/${unit_str}`)}
                    onMouseEnter={(e) => {
                      e.target.style.fillOpacity = '0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.fillOpacity = '0.6';
                    }}
                  />
                );
              })}
            </g>
          </SvgStyle>
          </div>
        </div>
      </Zoomable>
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
