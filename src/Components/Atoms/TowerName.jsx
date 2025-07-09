import React from "react";
import styled from "styled-components";

const Towers = ["A", "B", "C", "D", "E", "F", "G", "H"];

function TowerName({ towerName, frameIndex }) {
  const index = Towers.indexOf(towerName);
  const isOnLeft = index % 2 === 0;
  const leftTower = isOnLeft ? towerName : Towers[index - 1];
  const rightTower = isOnLeft ? Towers[index + 1] : towerName;
  const leftTowerRender = (towerName, isRight) => (
    <div
      className={
        leftTower == towerName
          ? `tower current ${isRight ? "right" : ""}`
          : `tower current btn ${isRight ? "right" : ""}`
      }
    >{`Tower ${towerName}`}</div>
  );

  const singleTowerRender = (towerName) => (
    <div className={`tower current btn single`}>{`Tower ${towerName}`}</div>
  );

  const reverse = [5, 6, 7, 8, 9, 10].includes(frameIndex);

  const showBoth = ![11, 4].includes(frameIndex);

  return (
    <Style className="overlay-can-fade-out">
      {showBoth ? (
        <>
          {reverse ? (
            <>
              {leftTowerRender(leftTower, true)}
              {leftTowerRender(rightTower, false)}
            </>
          ) : (
            <>
              {leftTowerRender(leftTower, false)}
              {leftTowerRender(rightTower, true)}
            </>
          )}
        </>
      ) : (
        <>{singleTowerRender(frameIndex == 11 ? leftTower : rightTower)}</>
      )}
    </Style>
  );
}

const Style = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  font-weight: 500;
  font-size: 1.2rem;
  pointer-events: none;
  .tower {
    bottom: 2%;
    color: var(--color_text);
    width: fit-content;
    margin: auto;
    position: absolute;
    box-shadow: 0 0 1px #07070756;
    padding: 0.3rem 1rem;
    border-radius: 5px;
    left: 38%;
    background: #595959;
    opacity: 0.5;
    transition: all 100ms ease-in-out;
  }
  .right {
    left: unset;
    right: 38%;
  }
  .single {
    right: 40%;
  }
  .current {
    color: var(--button_color_green);
    background: var(--button_background_blue);
    cursor: default;
    user-select: none;
    opacity: 1;
  }
`;

export default TowerName;
