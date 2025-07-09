import React from "react";
import styled from "styled-components";

function Compass({ angle = 0 }) {
  return (
    <Style angle={angle}>
      <div className="compass__wrapper svelte-aa5lhs">
        <div
          className="compass__circle svelte-aa5lhs"
          style={{ transform: "rotate(2deg)" }}
        >
          <div
            className="compass__north svelte-aa5lhs"
            style={{ transform: "rotate(-2deg)" }}
          >
            N
          </div>
          <div className="compass__arrow svelte-aa5lhs"></div>
        </div>
      </div>
    </Style>
  );
}

export default Compass;

const Style = styled.div`
  z-index: 1;
  /* position: relative; */
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  position: absolute;
  bottom: 10vh;
  right: 5vh;
  transition: all linear 200ms;
  transform-origin: center;
  transform: rotate(${(props) => props.angle}deg);
  border-radius: 50%;
  background: #5554546d;

  .compass__wrapper.svelte-aa5lhs {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .compass__circle.svelte-aa5lhs {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .compass__north.svelte-aa5lhs {
    font-size: 10px;
    line-height: 100%;
    font-weight: 400;
    color: #fff;
    text-align: center;
    top: -15px;
    position: absolute;
    transition: var(--transition);
  }

  .compass__arrow.svelte-aa5lhs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 46px;
    height: 46px;
    border-radius: 100%;
    background-color: rgba(35, 35, 35, 0.5);
    transition: var(--transition);
  }
  .compass__arrow.svelte-aa5lhs {
    ::before {
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 4px 24px 4px;
      border-color: transparent transparent #fe191a transparent;
    }
  }

  .compass__arrow.svelte-aa5lhs {
    ::after {
      content: "";
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 24px 4px 0 4px;
      border-color: #fefefe transparent transparent transparent;
    }
  }
`;
