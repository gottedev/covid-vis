import React, { useState } from "react";
import { toolTip } from "./utils";
import * as d3 from "d3";

function Rect({
  keyAccessor,
  xAccessor,
  yAccessor,
  widthAccessor,
  heightAccessor,
  d,
  index,
  fill,
}) {
  const [isHover, setHover] = useState(false);
  return (
    <g>
      <rect
        className={`${isHover ? "Bars__rect-hover" : "Bars__rect"}`}
        key={keyAccessor(index)}
        x={xAccessor(d)}
        y={yAccessor(d)}
        width={widthAccessor(d)}
        height={heightAccessor(d)}
        fill={fill(d)}
        onMouseOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
      />
      <title>{toolTip(d)}</title>
    </g>
  );
}

export default Rect;
