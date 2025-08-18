import { useEffect, useState } from "react";
import styled from "styled-components";
import { useInventories, useMapFilter } from "../../Hooks";
import "rc-slider/assets/index.css";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import axiosInstance from "../../Utility/axios";

function UnitTypeFilter({ tower, floor }) {    
  const {
    getMinMaxTotalCostInTower,
    getMinMaxSBUInTower,
    getAllUnitTypesInTower,
    getAllUnitsInTower,
    getAllAvailableUnitsInFloor,
  } = useInventories();
  const {
    flatFilterPriceValues,
    flatFilterSizeValues,
    setFlatFilterPriceValues,
    setFlatFilterSizeValues,
  } = useContext(AppContext);

  const isFloor = floor !== undefined;
  const minMaxCost = isFloor
    ? getMinMaxTotalCostInTower(tower, floor)
    : [
        Math.min(
          ...getMinMaxTotalCostInTower(tower),
        ),
        Math.max(
          ...getMinMaxTotalCostInTower(tower),
        ),
      ];
  const minMaxSBU = isFloor
    ? getMinMaxSBUInTower(tower, floor)
    : [
        Math.min(
          ...getMinMaxSBUInTower(tower),
        ),
        Math.max(
          ...getMinMaxSBUInTower(tower),
        ),
      ];
  const [totalUnits, setTotalUnits] = useState(0);

  // const totalUnits = isFloor ? 4 : getAllUnitsInTower(tower).length;
  const unitTypeFilters = [{title: '3bhk',id: '3bhk'},{title: '4bhk',id: '4bhk'}]
  const { activeMapFilterIds, isFilterActive, setActiveMapFilterIds } =
    useMapFilter();

  const isAllFiltersActive = () =>
    activeMapFilterIds.length == unitTypeFilters.length;

  const onShowAllClicked = () => {
    if (isAllFiltersActive()) {
      setActiveMapFilterIds([]);
    } else
      setActiveMapFilterIds([...unitTypeFilters.map((filter) => filter.id)]);
  };

  const handleFilterClick = (id) => {
    if (isFilterActive(id)) {
      // should be deactivated
      if (isAllFiltersActive()) {
        setActiveMapFilterIds([
          ...unitTypeFilters
            .map((filter) => filter.id)
            .filter((_id) => _id !== id),
        ]);
      } else setActiveMapFilterIds((old) => old.filter((_id) => _id !== id));
    } else {
      // if (activeMapFilterIds.length == unitTypeFilters.length - 1)
      setActiveMapFilterIds((old) => [...old, id]);
    }
  };

  // Price handler
  const handlePriceOnSliderChange = (value) => {
    setFlatFilterPriceValues(value);
  };

  //size handler
  const handleSizeOnSliderChange = (value) => {
    setFlatFilterSizeValues(value);
  };

  const [unitDetails, setUnitDetails] = useState([]);

  useEffect(() => {
    setFlatFilterPriceValues(minMaxCost);
    setFlatFilterSizeValues(minMaxSBU);
    setActiveMapFilterIds([...unitTypeFilters.map((filter) => filter.id)]);
  }, [tower, floor]);

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {        
        // Adjust the API endpoint as needed
        const response = await axiosInstance.get(`/app/units?tower=${tower}${floor ? `&floor=${floor}` : ''}`);
        setTotalUnits(response.data.units.length || 0);             
        const data = await response.json();
        setUnitDetails(data.units || []);
      } catch (error) {
        setUnitDetails([]);
      }
    };
    fetchUnitDetails();
  }, [tower, floor]);

  return (
    <Style>
      <div
        className="filters-control align-start"
        style={{ minHeight: "215px", height: "fit-content" }}
      >
        <div className="main-controls">
          {" "}
          <div className="available-title">{totalUnits} Units Total</div>{" "}
          <div className="button-group">
            {unitTypeFilters.map((filter) => (
              <button
                onClick={() => handleFilterClick(filter.id)}
                className={`button green ${
                  isFilterActive(filter.id) ? "active" : ""
                }`}
                value=""
                style={{ "--paddings": "5px 8px" }}
              >
                {filter.title}
              </button>
            ))}
          </div>{" "}
          <div className="slider-group-wrap">
            <div className="slider-group">
              <div className="slider-group__title">Price (INR)</div>
              <div className="slider-group__body--prices">
                <div className="input-minprice">2 cr</div>
                <div className="input-maxprice">3 cr</div>
              </div>
              <input
              className="win10-thumb"
                type="range"
                min='2cr'
                max='3cr'
                value={flatFilterPriceValues[0]}
                onChange={e => setFlatFilterPriceValues([Number(e.target.value), flatFilterPriceValues[1]])}
                style={{ width: "100%" }}
              />
            </div>
            <div className="slider-group">
              <div className="slider-group__title">Size (Sq. Ft)</div>
              <div className="slider-group__body--prices">
                <div className="input-minprice">1400</div>
                <div className="input-maxprice">2500</div>
              </div>
              <input
              className="win10-thumb"
                type="range"
                min='1400'
                max='2500'
                value='1400'
                onChange={e => setFlatFilterSizeValues([Number(e.target.value), flatFilterSizeValues[1]])}
                style={{ width: "100%" }}
              />
            </div>
            </div>
        </div>
      </div>
      <div className="el-showall">
        <button
        onClick={() => setActiveMapFilterIds([])}
         className="button el-showall__button">Reset</button>
        
        <button
          className={`button syubmt_flter ${
            isAllFiltersActive() ? "active" : ""
          }`}
          onClick={onShowAllClicked}
          value=""
          style={{ "--paddings": "5px 8px" }}
        >
          Submit
        </button>
      </div>
    </Style>
  );
}

export default UnitTypeFilter;

const Style = styled.div`
  .button.active.green {
    color: var(--button_color_green);
    background: var(--button_background_blue);
    font-weight: 500;
  }
  .filters-control.align-start {
    align-items: flex-start;
  }
  .filters-control {
    position: relative;
    display: flex;
    overflow: hidden;
    transition: min-height 0.2s ease-out;
  }
  .el-showall {
    margin-top: 10px;
    margin-bottom: 7px;
  }
  .filters-control .main-controls {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
  }
  .available-title {
    font-size: 13px;
    font-weight: 400;
    text-align: center;
    margin-top: 9px;
    color: var(--slide_area_span_color_hover);
  }
  .button-group {
    margin-bottom: 20px;
  }
  .button-group {
    margin-top: 11px;
  }
  .button-group :first-child {
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
  }
  .button-group {
    border-radius: 0;
    margin-bottom: 30px;
  }
  .slider-group {
    margin-bottom: 30px;
    margin-top: 1.2rem;
    padding: 0 10px;
  }
  .slider-group__title {
    font-weight: normal;
    font-size: 12px;
    line-height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9f9f9f;
  }
  .slider-group__title span {
    margin: 0 5px;
    color: #c7c7c7;
  }
  .slider-group__body--prices {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #c7c7c7;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 15px;
    margin: 6px 0;
  }
  .double-range-container {
    width: 100%;
    height: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .slider {
    position: relative;
    width: 100%;
    height: 1px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #737373;
  }
  .body {
    top: -1px;
    position: absolute;
    background-color: #c7c7c7;
    bottom: -1px;
  }
  .body.active {
    background: var(--blue-theme);
  }
  .handle {
    position: absolute;
    top: 50%;
    width: var(--handleWidth);
    height: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #c7c7c7;
    border-radius: 5px;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .handle.active {
    background: var(--blue-theme);
  }
  .dots {
    position: relative;
    width: 6px;
    height: 5px;
    margin-left: -1px;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .dots__dot--1::before {
    right: 0;
  }
  .dots__dot--2::before {
    left: 0;
  }
  .dots__dot--1::before,
  .dots__dot--1::after {
    content: "";
    position: absolute;
    top: 0;
    width: 1px;
    height: 1px;
    display: block;
    background-color: #060606;
  }
  .dots__dot--2::after {
    left: 100%;
  }
  .dots__dot--2::before,
  .dots__dot--2::after {
    content: "";
    position: absolute;
    top: 100%;
    width: 1px;
    height: 1px;
    display: block;
    background-color: #060606;
  }
  .slider-group__title-square {
    cursor: pointer;
  }
  .views {
    margin-bottom: 10px;
    font-size: 12px;
    color: #9f9f9f;
  }
  .views-body {
    display: flex;
    flex-direction: column;
    padding: 7px;
    background: rgba(70, 70, 70, 0.5);
    border-radius: 8px;
  }
  .views-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    color: #bdbdbd;
  }
`;
