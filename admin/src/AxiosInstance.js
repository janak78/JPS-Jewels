import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API;

const getToken = () => {
  const adminToken = localStorage.getItem("authorization");
  if (adminToken) {
    return adminToken;
  }
  const userToken = localStorage.getItem("Token");
  if (userToken) {
    return userToken;
  }
  
};

const getId = () => {
  const adminId = localStorage.getItem("id");
  if (adminId) {
    return adminId;
  }
  const userId = localStorage.getItem("UserId");
  if (userId) {
    return userId;
  }
};

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const id = getId();
    if (token && id) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["id"] = `Bearer ${id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
