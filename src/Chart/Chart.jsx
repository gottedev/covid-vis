import React from "react";
import { dimensionsPropsType } from "./utils";

import "./Chart.css";

const Chart = ({ dimensions, children }) => (
  <svg
    className="Chart"
    width={dimensions.width}
    height={dimensions.height}
    viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
  >
    <g
      transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
    >
      {children}
    </g>
  </svg>
);

Chart.propTypes = {
  dimensions: dimensionsPropsType,
};

Chart.defaultProps = {
  dimensions: {},
};

export default Chart;
