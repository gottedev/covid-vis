import { useRef, useState, useEffect } from "react";
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

export const useAccessor = (accessor, d, i) =>
  typeof accessor == "function" ? accessor(d, i) : accessor;

export const dimensionsPropsType = PropTypes.shape({
  height: PropTypes.number,
  width: PropTypes.number,
  marginTop: PropTypes.number,
  marginRight: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
});

export const combineChartDimensions = (dimensions) => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};

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

export const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);

  const [width, changeWidth] = useState(800);
  const [height, changeHeight] = useState(500);

  if (dimensions.width && dimensions.height) {
    return [ref, dimensions];
  }

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });

  return [ref, newSettings];
};

let lastId = 0;
export const useUniqueId = (prefix = "") => {
  lastId++;
  return [prefix, lastId].join("-");
};
