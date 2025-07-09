import React from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { useInventories } from "../../Hooks";
import { useMapFilter } from "../../Hooks";
import { unitTypeFilters } from "../../Data";
import { LocationIcon } from "../../Data/icons";
import { isMobile } from "react-device-detect";
import Price from "./Price";

const Title = ({ title }) => (
  <div className="title">
    {/* <div className="icon">
      <LocationIcon />
    </div>
    <div className="text">{title}</div> */}
  </div>
);

const Explore = ({ active, onClick, selectedUnit }) => {
  const param = useParams();
  const { getAllFlatsInFloor } = useInventories();

  const currentFloor = param.floor;
  const currentTower = param.tower;
  const unitDetails = getAllFlatsInFloor(currentTower, currentFloor)[
    parseInt(selectedUnit) - 1
  ];

  return (
    <ExploreStyle active={active}>
      <div class="unit__info info">
        <div className="row-line">
          <Title title={unitDetails.UnitType} />
        </div>

        <div className="row-line">
          <div className="left">{unitDetails.UnitType}</div>
          <div className={`right unit-status ${unitDetails.Status}`}>
            {unitDetails.Status}
          </div>
        </div>
        <div className="row-line">
          <div className="left">Total Area</div>
          <div className={`right`}>
            {unitDetails.SBU} {" Sq. Ft."}
          </div>
        </div>

        <div className="row-line">
          <div className="left">Total Cost</div>
          <div className="right">
            <Price price={unitDetails?.TotalCost} />
          </div>
        </div>

        <div
          class="unit__button unit__button--plan wide"
          onClick={(e) => {
            if (isMobile) return;
            e.stopPropagation();
            onClick();
          }}
          onTouchStart={(e) => {
            if (!isMobile) return;
            e.stopPropagation();
            onClick();
          }}
        >
          Explore Plan
        </div>
      </div>
    </ExploreStyle>
  );
};

const ExploreStyle = styled.div`
  position: absolute;
  transition: all 0.3s ease-in-out;
  z-index: 80;
  top: -1.4rem;

  ${({ active }) =>
    active
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}

  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 220px;

  .unit__button.unit__button--plan {
    background-color: var(--blue-theme);
    color: #ebe6e6;
    width: 100%;
    /* margin: 8px auto; */
    margin-top: 1rem;
    margin-bottom: 4px;
    :hover {
      opacity: 0.9;
    }
  }

  .unit__button {
    background-color: #353535;
    padding: 7px 10px;
    border-radius: 6px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
    color: #fff;
    pointer-events: all;
    transition: background 0.3s, color 0.3s;
  }

  .unit__info {
    width: 100%;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    position: absolute;
    z-index: 100;
    top: 100%;
    margin-top: 9px;
    display: flex;
    flex-direction: column;
    background-color: rgba(35, 35, 35, 0.849);
    border-radius: 6px;
    padding: 15px 18px;
    box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  }
  .title {
    /* padding-left: 0.5rem; */
    height: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
    /* border-left: 3.5px solid var(--clr-orange-light); */
    display: flex;
    align-items: center;
    color: white;

    svg {
      transform: translateY(2px);
      width: 20px !important;
      height: 22px !important;
      path {
        stroke: currentColor;
      }
    }
    .text {
      margin: 0 0.5rem;
    }
  }


  .row-line {
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: #c7c1c1;
    width: 100%;
    padding: 4px 0px;
    font-size: 0.9rem;
    .unit-status{
      opacity: 0.9;
    }


`;

function UnitMark({
  left = "0",
  top,
  isSelected,
  unit,
  onExploreClick,
  selectedUnit,
  isActive,
}) {
  return isActive ? (
    <Style
      style={{
        inset: `${top} auto auto ${left}`,
        transform: `translate(-50%, -50%)`,
      }}
      className="unit-explore-panel"
      /* onMouseEnter={(e) => alert("mouse entered")} */
    >
      <div class={`unit__number ${isSelected ? "active" : ""} `}>{unit}</div>
      {isSelected && (
        <Explore
          active={isSelected}
          onClick={onExploreClick}
          selectedUnit={selectedUnit}
        />
      )}
    </Style>
  ) : (
    <></>
  );
}

export default UnitMark;

const Style = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* pointer-events: none; */
  transition: all 0.1s ease-in-out;

  .unit__number {
    /* display: flex; */
    z-index: 100;
    align-items: center;
    justify-content: center;
    color: rgb(255, 255, 255);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    padding: 5px 10px;
    border-radius: 8px;
    background-color: rgba(35, 35, 35, 0.6);
    pointer-events: none;
    transition: all 0.3s ease 0s;
    position: relative;
    box-shadow: 1px -1px 1px #585757df;
    pointer-events: none;
  }

  .unit__number.active {
    background-color: #dadada;
    color: #000;
    box-shadow: 1px -2px 2px #353434e1;
    transform: scale(1.1);
    border-radius: 5px;
  }
  .hidden {
    display: none;
  }
  .visible {
    display: block;
  }
  /* .unit__bedroom {
    position: absolute;
    top: 100%;
    margin-top: 4px;
    color: rgb(255, 255, 255);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.2;
    text-shadow: rgb(0 0 0 / 25%) 0px 2px 4px;
    white-space: nowrap;
    text-transform: capitalize;
  } */
`;
