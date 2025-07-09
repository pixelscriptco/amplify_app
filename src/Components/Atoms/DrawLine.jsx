import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

function DrawLine({ path, duration }) {
  const ref = useRef(null);

  useEffect(() => {
    // acceesing path
    var path = ref.current.children[0];

    var length = path.getTotalLength();
    // Clear any previous transition
    path.style.transition = path.style.WebkitTransition = "none";
    // Set up the starting positions
    path.style.strokeDasharray = length + " " + length;
    path.style.strokeDashoffset = length;
    // Trigger a layout so styles are calculated & the browser
    // picks up the starting position before animating
    path.getBoundingClientRect();
    // Define our transition
    path.style.transition =
      path.style.WebkitTransition = `stroke-dashoffset ${duration}ms ease-in-out`;
    // Go!
    path.style.strokeDashoffset = 0;
  }, [path, duration]);

  return <g ref={ref}>{path}</g>;
}

export default DrawLine;
