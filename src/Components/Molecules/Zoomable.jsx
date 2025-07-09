import React, { useEffect, useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";

function Zoomable({ children }) {
  const [mapValue, setMapValue] = useState({
    scale: 1,
    translation: { x: 0, y: 0 },
  });

  useEffect(() => {
    const eles = document.getElementsByClassName("unit-explore-panel");
    for (let i = 0; i < eles.length; i++) {
      const ele = eles[i];
      ele.style.transform = `translate(-50%, -50%) scale(${
        1 / mapValue.scale
      })`;
    }
  }, [mapValue.scale]);

  return (
    <MapInteractionCSS
      key={"map-interaction"}
      minScale={1}
      style={{ cursor: "pointer" }}
      maxScale={6}
      showControls
      value={mapValue}
      controlsClass="zoom-control"
      btnClass="zoom-btn"
      plusBtnClass={`${
        mapValue.scale !== 6 ? "plus-btn" : `plus-btn zoom-btn-disabled`
      } `}
      minusBtnClass={`${
        mapValue.scale !== 1 ? "plus-btn" : `plus-btn zoom-btn-disabled`
      } `}
      onChange={(value) => {
        // if (value.scale !== mapValue.scale) setScale(value.scale);
        let factor = value.scale - 1;
        let x =
          value.translation.x > 0
            ? 0
            : value.translation.x < -window.innerWidth * factor
            ? -window.innerWidth * factor
            : value.translation.x;
        let y =
          value.translation.y > 0
            ? 0
            : value.translation.y < -window.innerHeight * factor
            ? -window.innerHeight * factor
            : value.translation.y;
        if (true)
          setMapValue({
            ...value,
            translation: {
              x: x,
              y: y,
            },
          });
      }}
    >
      {children}
    </MapInteractionCSS>
  );
}

export default Zoomable;
