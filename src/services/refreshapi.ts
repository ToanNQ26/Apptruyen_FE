// src/api/refreshApi.ts

import axios from "axios";

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default refreshApi;