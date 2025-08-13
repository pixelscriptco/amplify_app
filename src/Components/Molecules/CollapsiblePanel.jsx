import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

function CollapsiblePanel({ className, children, title, SecondaryBody,show }) {
  const [isOpen, setIsOpen] = useState(true);
  const bodyRef = useRef();

  useEffect(() => {
    var body = bodyRef.current;
    // body.style.height = body.scrollHeight + "px";
  }, []);

  return (
    <Style className={className + " overlay-can-fade-out"}>
      <div className="panel MapFilters" style={{ display : (show) ? 'flex' : 'none'}}>
        <div className="title">
          <h2 className="filter-title-mob" slot="title">
            {title}
          </h2>
        </div>
        <div
          className={
            isOpen
              ? "body body--margin collapsible"
              : "body body--margin hidden collapsible"
          }
          ref={bodyRef}
        >
          {children}
        </div>
      </div>

      {/* {SecondaryBody && <SecondaryBody className={isOpen ? "" : "hidden"} />} */}
      {/*<CloseBtn
        isOpen={isOpen}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      />*/}
    </Style>
  );
}

export default CollapsiblePanel;

const CloseBtn = ({ onClick, isOpen }) => (
  <div className="close-btn" onClick={onClick}>
    <button className="hidden__button">
      <svg
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={isOpen ? "" : "rotated"}
      >
        <path
          d="M15 7L8 1L0.999999 7"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </button>
  </div>
);

const Style = styled.div`
  position: absolute;
  top: 0;
  left: 2rem;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  transition: all 800ms linear;
  .body {
    overflow: hidden;
    transition: height 200ms linear;
  }
  .panel {
    display: flex;
    flex-direction: column;
    background: var(--panel_background);
    border-radius: var(--radius);
    padding: var(--panel_paddings);
    width: 100%;
    max-width: var(--panel_max_width);
    min-width: var(--panel_min_width);
    transition: opacity var(--transition);
    pointer-events: all;
    z-index: 13;
    position: relative;
  }
  .panel + .close-btn {
    margin-top: 10px;
  }
  .hidden-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
  }
  .panel .title {
    font-size: 9px;
    text-transform: uppercase;
    text-align: center;
    color: var(--panel_title_color);
  }
  .panel .title .filter-title-mob {
    color: var(--panel_title_color);
  }
  .panel .body--margin {
    padding-top: 10px;
  }
  .panel .body {
    flex-shrink: 0;
  }
  element.style {
    --paddings: 5px 8px;
  }
  .button.button-show_all {
    margin: 0;
  }
  .button-group {
    margin-top: 18px;
    button {
      border-radius: 0;
      margin: 1px;
    }
  }
  .button-group {
    button {
      :first-child {
        border-top-left-radius: var(--radius) !important;
        border-top-right-radius: var(--radius) !important;
      }
      :last-child {
        border-bottom-left-radius: var(--radius) !important;
        border-bottom-right-radius: var(--radius) !important;
      }
    }
  }
  .button.button-icon .icon {
    width: 18px;
    height: 20px;
  }
  .button.button-icon.landmarks.active .icon {
    :before {
      content: " ";
      position: absolute;
      margin: 2px;
      z-index: -1;
      background-color: white;
      border-radius: 50%;
      width: 15px;
      height: 15px;
    }
  }
  .button.active {
    background: var(--button_background_active);
    box-shadow: var(--button_shadow_active);
    color: var(--button_color_active);
    font-weight: 500;
  }
  /* style for each icon */
  .button.button-icon.highway.active svg {
    path {
      fill: #ffffff;
      &:nth-child(1) {
        &:nth-child(1) {
          fill: #ce457e !important;
        }
      }
    }
  }
  .button.button-icon.retail.active svg {
    path {
      fill: #4dbce0;
      &:nth-child(2) {
        fill: white !important;
      }
    }
  }
  .button.button-icon.retail.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.education.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.education.active svg {
    path {
      fill: #95c040;
      &:nth-child(2) {
        fill: white !important;
      }
    }
  }

  .button.button-icon.hotels.active svg circle {
    fill: #ffffff;
  }

  .button.button-icon.hotels.active svg {
    path {
      fill: #fcb270;
      &:nth-child(2) {
        fill: white !important;
      }
      &:nth-child(3) {
        fill: white !important;
      }
    }
  }

  .button.button-icon.cinema.active svg circle {
    fill: #916edc;
  }
  .button.button-icon.cinema.active svg path {
    fill: #fff;
  }
  .button.button-icon.metro.active svg path {
    fill: #636363;
  }
  .button.button-icon.metro.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.mosque.active svg path {
    fill: #b777a6;
  }
  .button.button-icon.mosque.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.garden.active svg circle {
    fill: #ffffff;
  }
  .button.button-icon.garden.active svg path {
    fill: rgba(81, 173, 107, 0.9528);
  }
  .button.button-icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 4px 9px 4px 9px;
  }
  .button-group {
    border-radius: 0;
    margin-bottom: 1px;
  }
  .button.button-icon.landmarks {
    z-index: 1;
  }
  .close-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    z-index: 1;
    .rotated {
      transform: rotate(180deg);
    }
  }
  .hidden__button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 60px;
    padding: 8px 22px;
    margin: 0;
    border: 0;
    border-radius: var(--radius);
    background: var(--hidden_background);
    transition: var(--transition);
    pointer-events: all;
    cursor: pointer;
    overflow: hidden;
  }
  .hidden__button svg {
    width: 16px;
    height: 8px;
    transition: var(--transition);
  }
  .hidden {
    height: 0px !important;
  }
`;
