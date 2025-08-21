import React from "react";
import styled from "styled-components";

function Compass({ angle = 0 }) {
  return (
    <Style angle={angle} className="compass_coys">
      <div className="compass__wrappersss">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnsSvgjs="http://svgjs.com/svgjs"
          version="1.1"
          width="100%"
          height="100%"
          x="0"
          y="0"
          viewBox="0 0 512 512"
          style={{ enableBackground: "new 0 0 512 512", transform: "rotate(2deg)" }}
          xmlSpace="preserve"
          className=""
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <g>
            <g>
              <path
                d="m216.326 143.993c8.284 0 15-6.716 15-15v-65.662l49.591 71.811c4.377 6.327 11.694 9.012 18.635 6.846 7.079-2.21 11.653-8.819 11.653-16.836 0-.048 0-.097-.001-.145l-1.065-110.151c-.079-8.236-6.78-14.856-14.996-14.856-.049 0-.099 0-.148.001-8.283.081-14.934 6.861-14.854 15.145l.648 67.017-52.12-75.473c-3.73-5.401-10.541-7.75-16.807-5.796-6.267 1.954-10.536 7.756-10.536 14.32v113.78c0 8.283 6.715 14.999 15 14.999z"
                fill="#ffffff"
                data-original="#000000"
              />
              <path
                d="m412.565 490.484-143.055-296.62c-2.502-5.187-7.752-8.484-13.511-8.484s-11.009 3.297-13.511 8.484l-143.053 296.62c-2.916 6.047-1.46 13.294 3.566 17.746 5.025 4.45 12.397 5.02 18.046 1.395l134.953-86.603 134.953 86.602c2.482 1.593 5.297 2.376 8.099 2.376 3.575 0 7.131-1.275 9.948-3.771 5.025-4.451 6.481-11.698 3.565-17.745zm-171.565-224.472v130.99l-91.489 58.71zm30 130.99v-130.99l91.489 189.7z"
                fill="#ffffff"
                data-original="#000000"
              />
            </g>
          </g>
        </svg>
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

  .compass__wrapper {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .compass__circle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(0,0,0,0.2);
  }

  .compass__north {
    font-size: 10px;
    line-height: 100%;
    font-weight: 400;
    color: #fff;
    text-align: center;
    top: -15px;
    position: absolute;
    transition: var(--transition);
  }

  .compass__arrow {
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
  .compass__arrow::before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 4px 24px 4px;
    border-color: transparent transparent #fe191a transparent;
    margin: 0 auto;
  }
  .compass__arrow::after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 24px 4px 0 4px;
    border-color: #fefefe transparent transparent transparent;
    margin: 0 auto;
  }
`;
