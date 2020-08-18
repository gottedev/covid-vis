import React, { useMemo } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Chart from "./Chart/Chart";
import Bars from "./Chart/Bars";
import Axis from "./Chart/Axis";
import Legends from "./Chart/Legends";
import { accessorPropsType } from "./Chart/utils";

const fillColors = ["#FC766AFF", "#5B84B1FF"];
const Histogram = ({
  data,
  xAccessor,
  yAccessor,
  label,
  selectedValues,
  customWidth,
  customMarginWidth,
  customHeight,
  customMarginHeight,
}) =>
  useMemo(() => {
    // const height = customMarginHeight;
    // const width = customWidth > 1000 ? 800 : customMarginWidth;
    // const marginTop = 100;
    // const marginBottom = 100;
    // const marginLeft = customWidth > 1000 ? 100 : 25;
    // const marginRight = customWidth > 1000 ? 100 : 25;

    const height = 600;
    const width = 800;
    const marginTop = customWidth > 1000 ? 100 : 0;
    const marginBottom = 100;
    const marginLeft = customWidth > 1000 ? 100 : 70;
    const marginRight = customWidth > 1000 ? 100 : 25;

    let dimensions = {
      height,
      width,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      boundedHeight: Math.max(height - marginTop - marginBottom, 0),
      boundedWidth: Math.max(width - marginLeft - marginRight, 0),
    };

    const nullRemovedData = data.filter((area) => {
      if (area.values.length > 0) {
        return area.key;
      }
    });
    const selectedAreas = selectedValues.map((d) => d.value);
    const dateRange = d3.extent(
      nullRemovedData.map((area) => new Date(area.key))
    );
    const allDates = data.map((area) => new Date(area.key));
    const values = data.map((d) => d.values).flat();
    const valuesRange = [
      0,
      d3.max(values.map((d) => d.dailyLabConfirmedCases)),
    ];

    const xScale = d3
      .scaleTime()
      .domain(dateRange)
      .range([0, dimensions.boundedWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(valuesRange)
      .range([dimensions.boundedHeight, 20]);

    const xBand = d3
      .scaleBand()
      .domain(allDates)
      .range([0, dimensions.boundedWidth])
      .padding(0.2);

    const xBand1 = d3
      .scaleBand()
      .domain(selectedAreas)
      .range([0, xBand.bandwidth()]);

    const barBandWidth = xBand.bandwidth();

    const color = d3.scaleOrdinal().domain(selectedAreas).range(fillColors);

    const xAccessorScaled = (d) => xBand1(d.areaName);
    const xAccessorGroupScaled = (d) => xScale(new Date(d.key));
    const yAccessorScaled = (d) => yScale(d.dailyLabConfirmedCases);
    const widthAccessorScaled = () => xBand1.bandwidth();
    const heightAccessorScaled = (d) =>
      dimensions.boundedHeight - yScale(d.dailyLabConfirmedCases);
    const keyAccessor = (d, i) => i;
    const colorAccessorScaled = (d) => color(d.areaName);
    const colorScale = (d) => color(d);

    return (
      <div className="Histogram">
        <Chart dimensions={dimensions}>
          <Legends
            data={selectedValues}
            dimensions={dimensions}
            scale={colorScale}
          />
          <Axis
            dimensions={dimensions}
            dimension="x"
            scale={xScale}
            label={label}
            barBandWidth={barBandWidth}
          />
          <Axis
            dimensions={dimensions}
            dimension="y"
            scale={yScale}
            label="Count"
          />
          <Bars
            data={data}
            keyAccessor={keyAccessor}
            xAccessorGroup={xAccessorGroupScaled}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            widthAccessor={widthAccessorScaled}
            heightAccessor={heightAccessorScaled}
            fill={colorAccessorScaled}
          />
        </Chart>
      </div>
    );
  }, [label, data, customMarginWidth, customWidth]);

Histogram.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
};

Histogram.defaultProps = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};

export default Histogram;
