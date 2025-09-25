// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
  withCredentials: true, // important for sending cookies
});

export default api;
