import axios from "axios";

// Action Types
export const SET_HEADER_DATA = "SET_HEADER_DATA";
export const SET_LOADING = "SET_LOADING";
export const SET_ERROR = "SET_ERROR";

// Action Creators
export const setHeaderData = (data) => ({
  type: SET_HEADER_DATA,
  payload: data,
});

export const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});
const baseUrl = process.env.REACT_APP_BASE_API;

// Fetch header data
export const fetchHeaderData = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const storedData = sessionStorage.getItem("headerData");
    if (storedData) {
      dispatch(setHeaderData(JSON.parse(storedData)));
    } else {
      const res = await axios.get(`${baseUrl}/user/countdata`);
      if (res.status === 200) {
        dispatch(setHeaderData(res.data.data));
        sessionStorage.setItem("headerData", JSON.stringify(res.data.data));
      } else {
        dispatch(setError("Failed to fetch data"));
      }
    }
  } catch (error) {
    dispatch(setError(error.message || error));
  } finally {
    dispatch(setLoading(false));
  }
};
