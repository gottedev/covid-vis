import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import * as d3 from "d3";
import sorter from "lodash.sortby";

export const dateFilter = (startDate, endDate, data) => {
  const momentFormat = (d) => moment(d);
  const dateFilteredData =
    startDate &&
    endDate &&
    data.filter((area) => {
      if (
        momentFormat(area.key).diff(startDate) > 0 &&
        momentFormat(area.key).diff(endDate) < 0
      ) {
        return area;
      }
    });
  if (dateFilteredData) return dateFilteredData;
  return data;
};

export const sortBy = (sortingKey, data) => sorter(data, (d) => d[sortingKey]);

export const formatAPIEndPoint = () => {
  const AreaType = "ltla";
  const AreaName = "*";

  const filters = [`areaType=${AreaType}`];
  const structure = {
    date: "date",
    name: "areaName",
    code: "areaCode",
    cases: {
      daily: "newCasesBySpecimenDate",
      cumulative: "newCasesBySpecimenDate",
    },
  };
  const apiParams = `filters=${filters.join(";")}&structure=${JSON.stringify(
    structure
  )}`;
  const encodedParams = encodeURI(apiParams);
  const endpoint = `https://api.coronavirus.data.gov.uk/v1/data?${encodedParams}`;
  return endpoint;
};

export const areaFilter = (selectedArea, data) => {
  const Areas = selectedArea.map((item) => item.value);
  const optedArea = data.map((area) => {
    return {
      key: area.key,
      values: area.values.filter((d) => {
        if (Areas.includes(d.areaName)) {
          return d;
        }
      }),
    };
  });
  return optedArea;
};

export const getPaginatedData = async (filters, structure) => {
  const endpoint = "https://api.coronavirus.data.gov.uk/v1/data";
  let result = [];
  for (const [i, d] of filters.entries()) {
    const apiParams = {
      filters: d.join(";"),
      structure: JSON.stringify(structure),
    };

    let nextPage = null;
    let currentPage = 1;

    do {
      const { data, status, statusText } = await axios.get(endpoint, {
        params: {
          ...apiParams,
          page: currentPage,
        },
        timeout: 10000,
      });

      if (status >= 400) throw Error(statusText);

      if ("pagination" in data) nextPage = data.pagination.next || null;
      const datalist = await data.data;
      result.push(...datalist);
      currentPage++;
    } while (nextPage);
  }
  return result;
};

export const formatDate = (date) => {
  const format = d3.timeFormat("%d/%m/%y");
  return format(date);
};

export const toolTip = (data) => {
  return `${formatDate(new Date(data.specimenDate))} \n${
    data.dailyLabConfirmedCases
  }`;
};

export const groupDataByKey = (key, data) => {
  const groupedData = d3
    .nest()
    .key((d) => d[key])
    .entries(data);
  return groupedData;
};

export const accessorPropsType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.number,
]);

export const dimensionsPropsType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
});

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

export function useCurrentResolution() {
  let [width, setWidth] = useState(getWidth());
  let [height, setHeight] = useState(getHeight());

  useEffect(() => {
    let timeoutId = null;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(getWidth());
        setHeight(getHeight());
      }, 150);
    };
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return [height, width];
}
