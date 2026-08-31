import axios from "axios";

const BASE_URL = "http://localhost:8081/api/doctors";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

// Attach token dynamically (IMPORTANT FIX)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;

  }
  
     console.log("Token:", token);
  console.log("Authorization:", config.headers.Authorization);

  return config;
});

// GET all doctors

export const getAllDoctors = async () => {
  const response = await api.get("/doctors");
  return response.data;
};

export const addDoctor = (doctor) =>
  axiosInstance.post("", doctor);

// DELETE doctor
export const deleteDoctor = (id) =>
  axiosInstance.delete(`/${id}`);

// GET by ID
export const getDoctorById = async (id) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

// UPDATE doctor
export const updateDoctor = async (id, doctor) => {
  const response = await axiosInstance.put(`/${id}`, doctor);
  return response.data;
};