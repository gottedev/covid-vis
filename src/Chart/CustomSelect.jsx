import React from "react";
import Select from "react-select";

function CustomSelect({
  options,
  width,
  styles,
  onChangeHandler,
  value,
  defaultValue,
}) {
  return (
    <Select
      isMulti
      name="colors"
      value={value}
      aria-label="select one or two Area"
      options={options}
      defaultValue={defaultValue}
      onChange={onChangeHandler}
      width={width}
      styles={styles}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  );
}

export default CustomSelect;
