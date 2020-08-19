import React, { useState } from "react";
import "react-dates/initialize";
import moment from "moment";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

function DatePicker({ startDate, endDate, handleDatesChange, orientation }) {
  const [focusedInput, setFocusedInput] = useState(null);

  const momentFormat = (d) => moment(d);

  const minDate = momentFormat("01/01/2020");
  const maxDate = momentFormat("18/08/2020");

  const renderCalendarInfo = () => (
    <span> please select between 7 days and 30 days</span>
  );

  return (
    <div className="App">
      <DateRangePicker
        renderCalendarInfo={renderCalendarInfo}
        block={true}
        daySize={30}
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
        orientation={orientation}
      />
    </div>
  );
}

export default DatePicker;
