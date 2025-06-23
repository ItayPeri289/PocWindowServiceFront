import axios from "axios";

export const API_URL = "http://localhost:8080"; // Main API
export const WIN_SERVICE_URL = "http://localhost:7277"; // Local Windows Service

const baseMethods = ["post", "put", "delete", "patch"];

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.response.use(
  async (response) => {
    if (
      response.status >= 200 &&
      response.status < 300 &&
      baseMethods.includes((response.config.method ?? "").toLowerCase())
    ) {
      const winUrl = `${WIN_SERVICE_URL}${response.config.url}`;
      if (winUrl) {
        try {
          await axios({
            method: response.config.method,
            url: winUrl,
            data: response.config.data,
            headers: response.config.headers,
          });
        } catch (winErr) {
          console.warn("Windows-service call failed (mirror):", winErr);
        }
      }
    }

    return response;
  },

  async (error) => {
    if (
      error.isAxiosError &&
      error.code === "ERR_NETWORK" &&
      baseMethods
        .concat("get")
        .includes((error.config.method ?? "").toLowerCase())
    ) {
      console.warn(
        "OpenShift API unreachable. Falling back to Windows service..."
      );

      const winUrl = `${WIN_SERVICE_URL}${error.config.url}`;
      if (winUrl) {
        try {
          const winResponse = await axios({
            method: error.config.method,
            url: winUrl,
            data: error.config.data,
            headers: error.config.headers,
          });

          return Promise.resolve(winResponse);
        } catch (winErr) {
          console.error("Fallback to Windows service also failed:", winErr);
        }
      }
    }

    return Promise.reject(error);
  }
);
