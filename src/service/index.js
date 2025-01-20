/* eslint-disable no-undef */
import axios from "axios";
import storageService from "./storage.service";

export const AXIOS_INSTANCE_WITHOUT_INTERCEPTOR = axios.create({
  baseURL: process.env.NODE_ENV === "production"
    ? "https://rmrental-backend.vercel.app/api"
    : "http://localhost:4000/api",
  withCredentials: true, // for handling cookies or authentication tokens
});

AXIOS_INSTANCE_WITHOUT_INTERCEPTOR.interceptors.request.use(async (config) => {
  if (localStorage.getItem("token")) {
    config.headers.Authorization = `Bearer ` + storageService.get("token");
  }
  return config;
});

AXIOS_INSTANCE_WITHOUT_INTERCEPTOR.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error;
  }
);

export const AXIOS_INSTANCE = AXIOS_INSTANCE_WITHOUT_INTERCEPTOR;