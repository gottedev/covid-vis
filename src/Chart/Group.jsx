import React from "react";
import Rect from "./Rect";

function Group({ xAccessorGroup, d, i, ...props }) {
  return (
    <g
      className="Svg__Group"
      key={i}
      transform={`translate(${xAccessorGroup(d)},0)`}
    >
      {d.values.map((d, index) => (
        <Rect d={d} key={index} index={index} {...props} />
      ))}
    </g>
  );
}

export default Group;
