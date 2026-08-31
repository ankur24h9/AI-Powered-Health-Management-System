import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081/api",
    
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const getAppointments = () =>
    api.get("/appointments");

export const getDoctorAppointments = () =>
    api.get("/appointments/doctor");

export const addAppointment = (appointment) =>
    api.post("/appointments", appointment);

export default api;