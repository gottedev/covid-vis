import React, { createContext, useContext } from "react";
import { dimensionsPropsType } from "./utils";

import "./Chart.css";

const ChartContext = createContext();
export const useChartDimensions = () => useContext(ChartContext);

const Chart = ({ dimensions, children }) => {
  return (
    <ChartContext.Provider value={dimensions}>
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
    </ChartContext.Provider>
  );
};

Chart.propTypes = {
  dimensions: dimensionsPropsType,
};

Chart.defaultProps = {
  dimensions: {},
};

export default Chart;
