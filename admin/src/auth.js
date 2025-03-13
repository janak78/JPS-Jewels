import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_API;

const API_URL = `${baseUrl}/superadmin/token_data`; // Your API endpoint

const getToken = () => {
  const tokens = ["authToken"];
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
    const res = await axios.post(
      `${baseUrl}/superadmin/token_data`,
      { token }, // Empty body
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Check if response status is not 200
    if (res.data.statusCode !== 200) {
      localStorage.clear();
      navigate("/auth/login", {
        state: { error: "Invalid token or unauthorized access" },
      });
      return;
    }

      const { role, superAdminId } = res.data.data;

    if (role === "Superadmin" && superAdminId) {
      localStorage.setItem("superAdminId", superAdminId);
    } else {
      console.error("Role is not Superadmin or superAdminId is missing");
      localStorage.clear();
      navigate("/auth/login");
      return;
    }

    return res.data;
  } catch (error) {
    console.error("Error:", error);

    if (error.response?.status === 401) {
      localStorage.clear();
      navigate("/auth/login", { state: { error: "Unauthorized access" } });
    } else {
      navigate("/auth/login", {
        state: { error: "An unexpected error occurred" },
      });
    }
  }
};