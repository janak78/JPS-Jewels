import axios from "axios";
import AxiosInstance from "AxiosInstance";
const baseUrl = process.env.REACT_APP_BASE_API;

const API_URL = `${baseUrl}/superadmin/token_data`; // Your API endpoint

const getToken = () => {
  const tokens = ["authorization"];
  for (const token of tokens) {
    const value = localStorage.getItem(token);
    if (value) return value;
  }
  return null;
};

export const handleAuth = async (navigate) => {
  const token = getToken();

  if (!token) {
    console.error("Token not found in localStorage");
    navigate("/auth/login", { state: { error: "Token not found" } });
    return;
  }

  try {
    const res = await AxiosInstance.post(
      `${baseUrl}/superadmin/token_data`,
      { token }, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Response:",res)

    // Check if response status is not 200
    if (res.status !== 200) {
      localStorage.clear();
      console.log("2")

      navigate("/auth/login", {
        state: { error: "Invalid token or unauthorized access" },
      });
      return;
    }

      const { role, SuperAdminId } = res.data.data;

    // if (role === "Superadmin" && SuperAdminId) {
    //   localStorage.setItem("superAdminId", SuperAdminId);
    // } else {
    //   console.error("Role is not Superadmin or superAdminId is missing");
    //   console.log("1")
    //   localStorage.clear();
    //   navigate("/auth/login");
    //   return;
    // }

    return res.data;
  } catch (error) {
    console.error("Error:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      console.log("3")

      navigate("/auth/login", { state: { error: "Unauthorized access" } });
    } else {
      navigate("/auth/login", {
        state: { error: "An unexpected error occurred" },
      });
    }
  }
};