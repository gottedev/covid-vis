import React from "react";
import PropTypes from "prop-types";
import { accessorPropsType } from "./utils";
import Group from "./Group";

const Bars = (props) => {
  return (
    <React.Fragment>
      {props.data.map((d, i) => {
        return <Group {...props} d={d} i={i} key={i} />;
      })}
    </React.Fragment>
  );
};

Bars.propTypes = {
  data: PropTypes.array,
  keyAccessor: accessorPropsType,
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  widthAccessor: accessorPropsType,
  heightAccessor: accessorPropsType,
};

Bars.defaultProps = {};

export default Bars;
