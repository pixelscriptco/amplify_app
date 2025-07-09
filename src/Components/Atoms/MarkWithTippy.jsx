import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import tippy from "tippy.js";
import "tippy.js/animations/shift-toward.css";

function MarkWithTippy({ children, bgColor = "#ffffffdd" }) {
  const ref = useRef(null);

  useEffect(() => {
    for (let i = 0; i < ref.current.children.length; i++) {
      if (ref.current.children[i]._tippy)
        ref.current.children[i]._tippy.destroy();
    }
    for (let i = 0; i < ref.current.children.length; i++) {
      const ele = ref.current.children[i];
      // const tippyText = ele.dataset.tippyContentText || "mark";
      let className = ele.id.substr(2, ele.id.indexOf(" ") - 1);
      let isHighway = className === "highway ";
      if (className === "highway ") className = ele.id.substr(2);
      const tippyText =
        ele.id
          .replace("__mall", "")
          .replace("__hotel", "")
          .replace("__highway", "")
          .replace("__school", "") || null;

      if (tippyText) {
        const instance = tippy(ele, {
          content: `<div class="${className} tippy-mark">${tippyText}</div>`,
          animation: "shift-toward",
          placement: "left",
          allowHTML: true,
          arrow: false,
          followCursor: true,
          offset: [isHighway ? 0 : 0, isHighway ? -100 : 0],
          role: "tooltip",
          trigger: isHighway ? "click mouseenter" : "mouseenter",
        });

        // if (isHighway) {
        //   instance.show();
        // }
      }
    }
    return () => {
      if (!ref.current) return;
      for (let i = 0; i < ref.current.children.length; i++) {
        if (ref.current.children[i]._tippy)
          ref.current.children[i]._tippy.destroy();
      }
    };
  }, []);

  return <Style ref={ref}>{children}</Style>;
}

export default MarkWithTippy;

const Style = styled.g`
  cursor: pointer;
`;
