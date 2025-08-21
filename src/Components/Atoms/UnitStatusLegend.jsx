import React from "react";
import styled from "styled-components";

function UnitStatusLegend(props) {
  const legends = [
    {
      color: "var(--clr-available)",
      text: "Available",
    },
    {
      color: "var(--clr-booked)",
      text: "Booked",
    },
    {
      color: "var(--clr-hold)",
      text: "Hold",
    },
    // {
    //   color: "var(--clr-blocked)",
    //   text: "Blocked",
    // },
  ];

  return (
    <Style className="overlay-can-fade-out unit_status_legend">
      <div className="body">
        {legends.map((legend) => (
          <div className="row">
            <div
              className="mark"
              style={{ backgroundColor: legend.color }}
            ></div>
            <div className="text">{legend.text}</div>
          </div>
        ))}
      </div>
    </Style>
  );
}

const Style = styled.div`
  color: var(--color_text);
  background: #726a6a75;
  position: absolute;
  padding: 0.5rem 1rem;
  padding-bottom: 1rem;
  padding-right: 2rem;
  border-radius: 8px;
  bottom: 2rem;
  left: 2rem;
  z-index: 99;
  .title {
    color: var(--color_text);
    font-size: 11px;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
    opacity: 0.9;
  }
  .body {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 0.5rem;
    gap: 0.3rem;
    width: fit-container;
  }
  .row {
    display: flex;
    align-items: center;
    color: var(--color_text);
    .mark {
      width: 10px;
      height: 10px;
      opacity: 0.8;
    }
    .text {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      font-weight: 400;
    }
  }
`;

export default UnitStatusLegend;
