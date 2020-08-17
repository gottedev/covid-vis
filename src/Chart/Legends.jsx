import React from "react";

function Legends({ data, dimensions, scale }) {
  return data.map((d, i) => {
    return (
      <g
        fill={`${scale(d.value)}`}
        transform={`translate(${dimensions.boundedWidth - 100},${
          i * 25 - 45
        }) `}
      >
        <rect width="20" height="20" />
        <text x="25" y="15" fill={`${scale(d.value)}`}>
          {d.value}
        </text>
      </g>
    );
  });
}

export default Legends;
