import { useEffect, useState } from "react";
import styled from "styled-components";
import { useInventories, useMapFilter } from "../../Hooks";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import axiosInstance from "../../Utility/axios";

function UnitTypeFilter({ tower, floor }) {    
  const {
    getAllUnitsInTower,
    getAllAvailableUnitsInFloor,
  } = useInventories();
  
  const isFloor = floor !== undefined;
  const [totalUnits, setTotalUnits] = useState(0);
  const [flatFilterPriceValues, setFlatFilterPriceValues] = useState([]);
  const [flatFilterSizeValues, setFlatFilterSizeValues] = useState([]);
  const [unitTypeFilters,setFlatFilterTypeValues] = useState([]);
  const { activeMapFilterIds, isFilterActive, setActiveMapFilterIds } = useMapFilter();
  const [unitDetails, setUnitDetails] = useState([]);

  const isAllFiltersActive = () => activeMapFilterIds.length == unitTypeFilters.length;

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

  const getMinMaxTotalCostInTower = (units) => {
    const totalCosts = units.map((unit) => unit["TotalCost"]);    
    const minTotalCost = Math.min(...totalCosts);
    const maxTotalCost = Math.max(...totalCosts);
    return [minTotalCost, maxTotalCost];
  };

  const getUniqueTotalCostInTower = (units) => {
    const totalCosts = units.map((unit) => unit["TotalCost"]);    
    const uniqueCosts = [...new Set(totalCosts)].sort((a, b) => a - b);
    return uniqueCosts;
  };

  const getMinMaxSBUInTower = (units) => {
    const sbus = units.map((unit) => unit["SBU"]);        
    const minSBU = Math.min(...sbus);
    const maxSBU = Math.max(...sbus);
    return [minSBU, maxSBU];
  };

  const getUniqueSBUInTower = (units) => {
    const totalCosts = units.map((unit) => unit["SBU"]);    
    const uniqueCosts = [...new Set(totalCosts)].sort((a, b) => a - b);
    return uniqueCosts;
  };

  const getAllUnitTypesInTower = (units) => [
    ...new Set(
      units.map((unit) => unit["UnitType"])
        .sort((a, b) => parseInt(a) - parseInt(b))
    ),
  ];

  // Price handler
  // const handlePriceOnSliderChange = (value) => {
  //   setFlatFilterPriceValues(value);
  // };

  // //size handler
  // const handleSizeOnSliderChange = (value) => {
  //   setFlatFilterSizeValues(value);
  // };

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

   // Price handler
  const handlePriceOnSliderChange = (value) => {
    setFlatFilterPriceValues(value);
  };

  useEffect(() => {
    const fetchUnitDetails = async () => {
      try {        
        // Adjust the API endpoint as needed
        const response = await axiosInstance.get(`/app/units?tower=${tower}${floor ? `&floor=${floor}` : ''}`);
        setFlatFilterPriceValues(getUniqueTotalCostInTower(response.data.units));
        setFlatFilterSizeValues(getUniqueSBUInTower(response.data.units));
        setFlatFilterTypeValues(getAllUnitTypesInTower(response.data.units));
       
        setTotalUnits(response.data.units.length || 0);             
        // const data = await response.json();
        setUnitDetails(response.data.units || []);
                
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
        <div className="main-controls" style={{position: 'relative' }}>
          {" "}
          <div className="d_flex_main_wrap">
            {unitTypeFilters.map((filter) => (
              <div
                onClick={() => handleFilterClick(filter.id)}
                className={`btn_small  ${
                  isFilterActive(filter) ? "active_bread" : ""
                }`}
                value=""
                key={filter.id}
              >
                {filter}
              </div>
            ))}
          </div>{" "}

          <div className="available-title">{totalUnits} Units Available</div>{" "}

          <div className="grid_htyu">
            <div className="list_gopw ">
              <span className="txt_er">2BHK - 1300 Sqft - ₹ 1.2 Cr</span>
            </div>
            <div className="list_gopw">
              <span className="txt_er">3BHK - 1700 Sqft - ₹ 1.7 Cr</span>
            </div>
            <div className="list_gopw">
              <span className="txt_er">2BHK - 1300 Sqft - ₹ 1.2 Cr</span>
            </div>
            <div className="list_gopw">
              <span className="txt_er">3BHK - 2700 Sqft - ₹ 2.7 Cr</span>
            </div>
          </div>

          <div className="pric_ind">Price ₹ 70L Onwards.</div>

          <div className="button-group" style={{display: 'none'}}>
            {flatFilterPriceValues.map((price) => (
              <button
                onClick={() => handleFilterClick(price)}
                className={`button green ${
                  isFilterActive(price) ? "active" : ""
                }`}
                value=""
                key={price}
                style={{ "--paddings": "5px 8px" }}
              >
                {formatPrice(price)}
              </button>
            ))}
          </div>{" "}

          <div className="button-group" style={{ display: 'none' }}>
            {flatFilterSizeValues.map((size) => (
              <button
                onClick={() => handleFilterClick(size)}
                className={`button green ${
                  isFilterActive(size) ? "active" : ""
                }`}
                value=""
                key={size}
                style={{ "--paddings": "5px 8px" }}
              >
                {size}  Sq.Ft   
              </button>
            ))}
          </div>{" "}

          {/* <div className="slider-group-wrap">
            <div className="slider-group">
              <DoubleSlider
                title={"Price"}
                rangeLabel="INR"
                value={flatFilterPriceValues}
                labelValues={[
                  formatPrice(flatFilterPriceValues[0]),
                  formatPrice(flatFilterPriceValues[1]),
                ]}
                start={flatFilterPriceValues[0]}
                end={flatFilterPriceValues[1]}
                handleOnSliderChange={handlePriceOnSliderChange}
              />
            </div>
            <div className="slider-group">
              <DoubleSlider
                title={"Area"}
                rangeLabel="Sq.Ft"
                value={flatFilterSizeValues}
                labelValues={[
                  formatPrice(flatFilterSizeValues[0]),
                  formatPrice(flatFilterSizeValues[1]),
                ]}
                start={flatFilterSizeValues[0]}
                end={flatFilterSizeValues[1]}
                handleOnSliderChange={handlePriceOnSliderChange}
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="el-showall" style={{ display: 'none' }}>
        <button style={{ display: 'none' }}
        onClick={() => setActiveMapFilterIds([])}
         className="button el-showall__button">Reset</button>
        
        <button
          className={`button syubmt_flter active_bread ${
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

export const DoubleSlider = ({
  title,
  rangeLabel,
  start,
  end,
  handleOnSliderChange,
  value,
  labelValues,
}) => {
  return (
    <div class="slider-group">
      <div class="slider-group__title">{title + " " + rangeLabel}</div>{" "}
      <div class="slider-group__body">
        <div class="slider-group__body--prices">
          <div class="input-minprice">{labelValues[0]}</div>{" "}
          <div class="input-maxprice">{labelValues[1]}</div>
        </div>{" "}
        <div style={{ marginTop: "10px" }}>
          <Slider
            min={start}
            max={end}
            allowCross={false}
            value={value}
            onChange={handleOnSliderChange}
            railStyle={{ height: 2 }}
            handleStyle={[
              {
                backgroundColor: "var(--blue-theme)",
                border: "1px solid var(--blue-theme)",
              },
              {
                backgroundColor: "var(--blue-theme)",
                border: "1px solid var(--blue-theme)",
              },
            ]}
            trackStyle={[
              {
                background: "var(--blue-theme)",
              },
            ]}
            dotStyle={{ backgroundColor: "var(--blue-theme)" }}
            activeDotStyle={{ backgroundColor: "var(--blue-theme)" }}
          />

        </div>
      </div>
    </div>
  );
};

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
