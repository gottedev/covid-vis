import React, { useState, useEffect, useLayoutEffect } from "react";
import * as d3 from "d3";
import moment from "moment";
import axios from "axios";
import Histogram from "./Histogram";
import DatePicker from "./DatePicker";
import { dateFilter, areaFilter, groupDataByKey, sortBy } from "./Chart/utils";
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
    control: () => ({
      width: "400px",
      display: "flex",
    }),
    menu: () => ({
      width: "400px",
      maxHeight: "40px",
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
      <div className="date__picker">
        <DatePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDatesChange={handleDatesChange}
        />
      </div>
      <CustomSelect
        options={areas}
        styles={selectStyles}
        defaultValue={{ value: "County Durham", label: "County Durham" }}
        onChangeHandler={handleSelect}
        value={selectedArea}
      />
      <Histogram
        xAccessor={dateAccessor}
        yAccessor={casesAccessor}
        data={dateWiseData}
        selectedValues={selectedArea}
        label="Daily cases"
      />
    </div>
  );
}

export default App;
