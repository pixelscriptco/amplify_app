import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

function ReturnToPrev({ text = "Return To Tower", to = "" }) {  
  return (
    <Link to={`/${to}`} onClick={(e) => e.stopPropagation()}>
      <Style id="return-to-tower">
        <div>{text}</div>
        <div className="back__icon">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.60209 7.94657C6.60209 8.70348 6.59248 9.38368 6.60689 10.0632C6.61307 10.3612 6.52455 10.6023 6.28509 10.7287C6.02435 10.8668 5.754 10.8866 5.50081 10.6469C4.79612 9.9784 4.08046 9.32304 3.3696 8.66184C2.49681 7.85012 1.62402 7.03914 0.752597 6.22597C0.624286 6.10615 0.494602 5.98341 0.383445 5.84605C0.124763 5.52677 0.185831 5.08913 0.531655 4.76474C1.86966 3.50736 3.20973 2.25289 4.54979 0.998427C4.8764 0.693031 5.18792 0.362793 5.54541 0.104886C5.70185 -0.00762815 5.96465 -0.0178567 6.16364 0.0194046C6.44016 0.0712782 6.60552 0.284617 6.60278 0.614124C6.59797 1.22273 6.61101 1.83133 6.5966 2.43993C6.59043 2.69564 6.69609 2.76724 6.91223 2.79208C9.54433 3.09017 12.0282 3.85659 14.2178 5.50047C15.3575 6.35602 16.2673 7.4176 16.6955 8.87664C17.1641 10.4738 16.8272 11.9094 15.9139 13.2121C14.7715 14.8406 13.1782 15.7963 11.4416 16.524C11.3688 16.5547 11.2934 16.5788 11.2213 16.6116C10.9736 16.7256 10.7334 16.7227 10.6141 16.4378C10.494 16.1521 10.6154 15.9417 10.8789 15.7897C11.2652 15.5676 11.6488 15.3331 12.0097 15.0671C12.7123 14.5477 13.2489 13.8879 13.4836 12.9827C13.7285 12.0373 13.4506 11.2409 12.8791 10.5373C11.9891 9.43994 10.7952 8.87518 9.52306 8.50037C8.8026 8.28849 8.05194 8.19278 7.31432 8.05031C7.09544 8.00867 6.87312 7.98529 6.60209 7.94657Z"></path>
          </svg>
        </div>{" "}
      </Style>
    </Link>
  );
}

export default ReturnToPrev;

const Style = styled.div`
  position: absolute;
  z-index: 1;
  opacity: 0.8;
  top: 95%;
  background-color: rgba(35, 35, 35, 0.55);
  transition: all 0.2s ease-in-out;
  border-radius: 5px;
  color: #cccaca;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  padding: 10px;
  margin: auto;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  svg {
    width: 17px;
    height: 22px;
    fill: var(--header_up_icon_color);
    opacity: 0.5;
    margin-left: 1rem;
    transform: translateY(2px);
  }

  :hover {
    background-color: rgba(35, 35, 35, 0.75);
    opacity: 1;
  }
`;