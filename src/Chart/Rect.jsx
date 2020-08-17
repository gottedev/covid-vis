import React, { useState } from "react";

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
  );
}

export default Rect;
