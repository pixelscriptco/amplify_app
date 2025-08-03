import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import tippy from "tippy.js";
import "tippy.js/animations/shift-away.css";

function StaticIconButton({
  icon,
  activeTooltip = "Hide",
  tooltip = "Activate",
  className = "",
  onClick,
}) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current._tippy) ref.current._tippy.destroy();
    tippy(ref.current, {
      content: `<div style='font-family: Roboto, sans-serif;color: var(--panel_title_color);background-color:#333; padding: 6px 10px; border-radius:4px'>${
        isActive ? activeTooltip : tooltip
      }</div>`,
      animation: "shift-away",
      placement: "left",
      allowHTML: true,
      arrow: false,
    });
  }, [isActive]);

  return (
    <Style
      onClick={() => {
        setIsActive((old) => !old);
        onClick();
      }}
      className={className}
    >
      <div className={`iconbutton-button ${isActive ? "active" : ""}`} ref={ref}>
        {icon}
      </div>{" "}
    </Style>
  );
}

export default StaticIconButton;

const Style = styled.div`
  z-index: 1;
  font-family: "Roboto", sans-serif;
  transition: all linear 200ms;
  :hover {
    opacity: 0.9;
  }
  .iconbutton-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--button_panel_width);
    height: var(--button_panel_height);
    border-radius: var(--radius);
    background: var(--button_panel_background);
    box-shadow: var(--button_panel_shadow);
    pointer-events: all;
    transition: var(--transition);
    z-index: 2;
  }

  .iconbutton-button svg {
    width: 19px;
    height: 19px;
  }

  .iconbutton-button svg path {
    transition: 0.3s;
    fill: var(--button_panel_fill);
  }

  .iconbutton-button.active {
    background: var(--button_panel_disabled_background);
    svg {
      path {
        fill: var(--button_panel_disabled_fill);
      }
    }
  }
`;
