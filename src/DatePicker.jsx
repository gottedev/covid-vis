import React, { useState } from "react";
import "react-dates/initialize";
import moment from "moment";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

function DatePicker({
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  handleDatesChange,
}) {
  const [focusedInput, setFocusedInput] = useState(null);

  const momentFormat = (d) => moment(d);

  const minDate = momentFormat("01/01/2020");
  const maxDate = momentFormat("06/06/2020");

  return (
    <div className="App">
      <DateRangePicker
        minDate={minDate}
        maxDate={maxDate}
        startDate={startDate}
        startDateId="start-date"
        endDate={endDate}
        endDateId="end-date"
        isOutsideRange={() => false}
        onDatesChange={handleDatesChange}
        focusedInput={focusedInput}
        displayFormat={() => "DD/MM/YYYY"}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
        showDefaultInputIcon
        inputIconPosition="after"
      />
    </div>
  );
}

export default DatePicker;
