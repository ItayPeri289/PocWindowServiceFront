// src/axios-setup.ts
import axios from "axios";

// 1) Your real API endpoint
export const API_URL = "https://localhost:5001";

// 2) Your Windows-service endpoint
export const WIN_SERVICE_URL = "http://localhost:6000";

// 3) Create an axios instance for your API
export const apiClient = axios.create({
  baseURL: API_URL,
});

// 4) Install a response interceptor
apiClient.interceptors.response.use(
  async (response) => {
    // Only for 2xx responses…
    if (response.status >= 200 && response.status < 300) {
      // Mirror the same path/query, swapping base URLs:
      const winUrl = response.config.url
        ? response.config.url.replace(API_URL, WIN_SERVICE_URL)
        : undefined;

      if (winUrl) {
        try {
          await axios({
            method: response.config.method,
            url: winUrl,
            data: response.config.data,
            params: response.config.params,
          });
        } catch (winErr) {
          console.error("Windows-service call failed:", winErr);
        }
      }
    }
    return response;
  },
  (error) => {
    // Forward API errors unchanged
    return Promise.reject(error);
  }
);
