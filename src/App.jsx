import React, { useState, useEffect, useLayoutEffect } from "react";
import * as d3 from "d3";
import moment from "moment";
import axios from "axios";
import Histogram from "./Histogram";
import DatePicker from "./DatePicker";
import {
  dateFilter,
  areaFilter,
  groupDataByKey,
  sortBy,
  useCurrentWitdh,
  useCurrentResolution,
} from "./Chart/utils";
import "./App.css";
import CustomSelect from "./Chart/CustomSelect";

function App() {
  const defaultStartDate = moment("05/05/2020");
  const defaultEndDate = moment("05/18/2020");
  const [data, setData] = useState([]);
  const [areaFilteredData, setAreaFilteredData] = useState([]);
  const [dateWiseData, setDateWiseData] = useState([]);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [selectedArea, setselectedArea] = useState([
    { value: "County Durham", label: "County Durham" },
  ]);
  const [areas, setAreas] = useState([]);

  const parseDate = d3.timeFormat("%d/%m/%Y");
  const dateAccessor = (d) => parseDate(d.specimenDate);
  const casesAccessor = (d) => d.dailyLabConfirmedCases;

  const [customHeight, customWidth] = useCurrentResolution();

  const customMarginWidth = customWidth - (20 / 100) * customWidth;

  const customMarginHeight = (65 / 100) * customHeight;

  console.log(customMarginHeight);

  useEffect(() => {
    const covidData = async () => {
      const getData = await axios.get("/covid-08-06-2020.json");
      const areaData = await getData.data.ltlas;
      const groupDataByDate = groupDataByKey("specimenDate", areaData);
      const areaNames = [
        ...new Map(
          areaData.map((name) => [
            name.areaName,
            { value: name.areaName, label: name.areaName },
          ])
        ).values(),
      ];
      const sortedAreas = sortBy("value", areaNames);
      setAreas(sortedAreas);
      setData(groupDataByDate);
      const areaWiseFilteredData = areaFilter(selectedArea, groupDataByDate);
      setAreaFilteredData(areaWiseFilteredData);
      const applyDateFilter = dateFilter(
        startDate,
        endDate,
        areaWiseFilteredData
      );
      setDateWiseData(applyDateFilter);
    };
    covidData();
  }, []);

  const selectStyles = {
    control: (props) => ({
      ...props,
      display: "flex",
      background: "white",
      height: "48px",
      borderRadius: "2px",
      border: "1px solid #dbdbdb",
    }),
    menu: () => ({
      maxHeight: "40px",
      background: "white",
    }),
    menuList: (props) => ({
      ...props,
      background: "white",
      height: "auto",
    }),
  };

  const handleDatesChange = ({ startDate, endDate }) => {
    const momentStart = moment(startDate);
    const momentEnd = moment(endDate);
    if (momentEnd.diff(momentStart, "days") > 30) return null;
    if (momentEnd.diff(momentStart, "days") < 7) return null;
    setStartDate(startDate);
    setEndDate(endDate);
    const dateFilteredData = dateFilter(startDate, endDate, areaFilteredData);
    dateFilteredData && setDateWiseData(dateFilteredData);
  };
  const handleSelect = (selectValue) => {
    if (!selectValue || selectValue.length === 0) {
      setselectedArea(selectValue);
      return;
    }
    if (selectValue.length > 2) {
      alert("only 2 Areas max please");
      return null;
    }
    const areaWiseFilteredData = areaFilter(selectValue, data);
    const applyDateFilter = dateFilter(
      startDate,
      endDate,
      areaWiseFilteredData
    );
    setAreaFilteredData(areaWiseFilteredData);
    setDateWiseData(applyDateFilter);
    setselectedArea(selectValue);
  };

  return (
    <div className="App">
      <h1 className="title">Covid Histogram</h1>
      <div className="chart__controls">
        <div className="date__picker">
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleDatesChange={handleDatesChange}
            orientation={customWidth > 600 ? "horizontal" : "vertical"}
          />
        </div>
        <div className="area__select">
          <CustomSelect
            options={areas}
            styles={selectStyles}
            defaultValue={{ value: "County Durham", label: "County Durham" }}
            onChangeHandler={handleSelect}
            value={selectedArea}
          />
        </div>
      </div>

      <Histogram
        xAccessor={dateAccessor}
        yAccessor={casesAccessor}
        data={dateWiseData}
        selectedValues={selectedArea}
        label="Daily cases"
        customWidth={customWidth}
        customHeight={customHeight}
        customMarginHeight={customMarginHeight}
        customMarginWidth={customMarginWidth}
      />
    </div>
  );
}

export default App;
