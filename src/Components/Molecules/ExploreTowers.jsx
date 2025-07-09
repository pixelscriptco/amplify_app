import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { COMMBINED_TOWERS, TOWERS_LIST } from "../../Data";

function ExploreTowers({ currentTowers }) {
  return (
    <Style className="overlay-can-fade-out">
      <div className="title">Explore Towers</div>
      <div className="towers">
        {COMMBINED_TOWERS.map((tower) => (
          <Link to={`/smart-world/tower/${tower}`} className="no-dec">
            <div
              className={
                tower == currentTowers.join("-") ? "tower active" : "tower"
              }
              key={tower}
            >
              {tower.toUpperCase().split("-").join(" and ")}
            </div>
          </Link>
        ))}
      </div>
    </Style>
  );
}

const Style = styled.div`
  color: var(--color_text);
  background: var(--panel_background);
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  top: 2rem;
  .no-dec {
    text-decoration: none;
  }
  .title {
    color: var(--color_text);
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    padding: 10px 0;
    opacity: 0.9;
  }
  .towers {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: fit-content;
    margin: auto;
    margin-top: 0.7rem;
    flex-wrap: wrap;
    .tower {
      background-color: var(--background_panel);
      color: var(--color_text);
      border: 1px solid #ffb703;
      width: 60px;
      border-radius: 4px;
      text-align: center;
      margin: 0 2px;
      margin-bottom: 10px;
      cursor: pointer;
      padding: 0.3rem;
      font-size: 12px;
      :hover {
        background-color: var(--background_panel_hover);
      }
    }
    .tower.active {
      background-color: var(--blue-theme);
      border-color: var(--blue-theme);
    }
  }
`;

export default ExploreTowers;
