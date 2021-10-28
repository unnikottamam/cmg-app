import axios from "axios";
import { WEB_URL } from "../config";

// Define action types
export const GET_USER = "GET_USER";
export const GET_LATEST = "GET_LATEST";

export const getUser = () => {
  try {
    return async (dispatch) => {
      const response = await axios.get(`${WEB_URL}`);
      if (response.data) {
        dispatch({
          type: GET_USER,
          payload: response.data,
        });
      } else {
        console.log("Unable to fetch data from the API BASE URL!");
      }
    };
  } catch (error) {
    console.log(error);
  }
};

export const getLatest = () => {
  try {
    return async (dispatch) => {
      const response = await axios.get(
        `${WEB_URL}/wp-json/wc/v2/products?in_stock=true&page=1&per_page=8&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68`
      );
      if (response.data) {
        dispatch({
          type: GET_LATEST,
          payload: response.data,
        });
      } else {
        console.log("Unable to fetch data from the API BASE URL!");
      }
    };
  } catch (error) {
    console.log(error);
  }
};
